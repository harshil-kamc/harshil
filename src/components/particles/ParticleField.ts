/**
 * GPU-rendered 3D particle field.
 *
 * Simulation runs on the CPU in flat typed arrays (no per-particle objects), which keeps
 * tens of thousands of particles cheap; drawing is one WebGL draw call of soft point sprites,
 * projected with perspective so depth reads as size and brightness.
 * Steering matches the original 2D engine, so shapes form the same way, just denser.
 * x/y are CSS pixels, z is depth in pixels (positive = toward the viewer).
 */

export interface MorphTarget {
  count: number;
  /** x, y, z per particle */
  xyz: Float32Array;
  /** r, g, b per particle, 0–1 */
  rgb: Float32Array;
  /** Glowing additive blend for words and shapes; normal blend for photos so colours stay true */
  additive: boolean;
  /** Per-particle opacity; lower when particles are packed densely so the glow doesn't clip to white */
  alpha: number;
  /** Shapes turn slowly around their vertical axis; words and photos stay facing the viewer */
  spin: boolean;
  /** Screen point the shape is built around; spin and tilt pivot here */
  center: [number, number];
  size: [number, number];
}

export interface FieldStats {
  active: number;
  settled: number;
  asleep: boolean;
}

const VERTEX_SHADER = `#version 300 es
in vec3 aPos;
in vec4 aColor;
in float aSize;
in float aSpin;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uCenter;
uniform float uSpinAngle;
uniform vec2 uTilt;
uniform float uFocal;
out vec4 vColor;

void main() {
  vec3 p = vec3(aPos.xy - uCenter, aPos.z);

  // Spin around the vertical axis, blended per particle so morphs in and out of a shape stay smooth
  float s = sin(uSpinAngle);
  float c = cos(uSpinAngle);
  p = mix(p, vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z), aSpin);

  // Tilt toward the pointer
  float tx = cos(uTilt.y), sx = sin(uTilt.y);
  p = vec3(p.x, tx * p.y - sx * p.z, sx * p.y + tx * p.z);
  float ty = cos(uTilt.x), sy = sin(uTilt.x);
  p = vec3(ty * p.x + sy * p.z, p.y, -sy * p.x + ty * p.z);

  float scale = uFocal / max(uFocal - p.z, 1.0);
  vec2 screen = uCenter + p.xy * scale;
  vec2 clip = screen / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = aSize * uDpr * scale;
  // Nearer particles brighter, farther ones recede
  float shade = clamp(0.82 + p.z / 420.0, 0.4, 1.25);
  vColor = vec4(aColor.rgb * shade, aColor.a);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec4 vColor;
uniform float uGlow;
out vec4 outColor;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  // Solid core with a soft falloff; uGlow widens the falloff for the additive look
  float core = 1.0 - smoothstep(0.35, 1.0, d);
  float halo = (1.0 - d) * (1.0 - d);
  float a = mix(core, max(core * 0.85, halo), uGlow) * vColor.a;
  outColor = vec4(vColor.rgb * a, a);
}`;

// The fixed simulation step the steering constants were tuned for (the 2D engine ran per frame at 60Hz)
const STEP_MS = 1000 / 60;
const FOCAL = 760;

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed");
  }
  return shader;
};

export class ParticleField {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private posBuffer: WebGLBuffer;
  private colorBuffer: WebGLBuffer;
  private sizeBuffer: WebGLBuffer;
  private spinBuffer: WebGLBuffer;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};

  private capacity = 0;
  /** Slots in use: [0, active) form the current shape, [active, count) are leaving */
  private count = 0;
  private active = 0;

  private pos = new Float32Array(0);
  private vel = new Float32Array(0);
  private target = new Float32Array(0);
  private maxSpeed = new Float32Array(0);
  private maxForce = new Float32Array(0);
  private size = new Float32Array(0);
  private colStart = new Float32Array(0);
  private colTarget = new Float32Array(0);
  private colWeight = new Float32Array(0);
  private colRate = new Float32Array(0);
  private colOut = new Float32Array(0);
  private spin = new Float32Array(0);
  private spinTarget = new Float32Array(0);

  private sizesDirty = true;
  private colorsDirty = true;
  private spinDirty = true;
  private additive = true;
  private alpha = 0.62;
  private spinning = false;
  private spinAngle = 0;
  private center: [number, number] = [0, 0];
  private accumulator = 0;
  private time = 0;

  /** Curved, swirling paths: kicked on every morph and by fast scrolling, then decays */
  private swirl = 0;
  private tilt = { x: 0, y: 0 };
  private tiltTarget = { x: 0, y: 0 };
  private asleep = false;
  private lastStats: FieldStats = { active: 0, settled: 0, asleep: false };
  private needsDraw = true;

  /** Off for reduced-motion users: no tilt, swirl or spin */
  motion = true;

  width = 1;
  height = 1;
  private dpr = 1;

  /** Pointer in CSS pixels. hover = a gentle field around the cursor, pressed = scatter */
  pointer = { x: -9999, y: -9999, hover: false, pressed: false, movedAt: 0 };
  private pendingBursts: { x: number; y: number }[] = [];
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
    }
    this.program = program;
    for (const name of ["uRes", "uDpr", "uGlow", "uCenter", "uSpinAngle", "uTilt", "uFocal"]) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }

    const vao = gl.createVertexArray();
    const buffers = [gl.createBuffer(), gl.createBuffer(), gl.createBuffer(), gl.createBuffer()];
    if (!vao || buffers.some((b) => !b)) throw new Error("Could not create buffers");
    this.vao = vao;
    [this.posBuffer, this.colorBuffer, this.sizeBuffer, this.spinBuffer] = buffers as WebGLBuffer[];

    gl.bindVertexArray(vao);
    const bindAttr = (buffer: WebGLBuffer, name: string, size: number) => {
      const loc = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    bindAttr(this.posBuffer, "aPos", 3);
    bindAttr(this.colorBuffer, "aColor", 4);
    bindAttr(this.sizeBuffer, "aSize", 1);
    bindAttr(this.spinBuffer, "aSpin", 1);
    gl.bindVertexArray(null);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
  }

  resize(width: number, height: number, dpr: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.dpr = dpr;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.wake();
  }

  private grow(min: number) {
    if (min <= this.capacity) return;
    const cap = Math.max(min, Math.ceil(this.capacity * 1.5), 1024);
    const resize = (arr: Float32Array, stride: number) => {
      const next = new Float32Array(cap * stride);
      next.set(arr.subarray(0, this.count * stride));
      return next;
    };
    this.pos = resize(this.pos, 3);
    this.vel = resize(this.vel, 3);
    this.target = resize(this.target, 3);
    this.maxSpeed = resize(this.maxSpeed, 1);
    this.maxForce = resize(this.maxForce, 1);
    this.size = resize(this.size, 1);
    this.colStart = resize(this.colStart, 3);
    this.colTarget = resize(this.colTarget, 3);
    this.colWeight = resize(this.colWeight, 1);
    this.colRate = resize(this.colRate, 1);
    this.colOut = resize(this.colOut, 4);
    this.spin = resize(this.spin, 1);
    this.spinTarget = resize(this.spinTarget, 1);
    this.capacity = cap;
  }

  /** A point on a wide ring around the centre, off screen, for spawning and dismissing particles */
  private farPoint(out: Float32Array, o: number) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const mag = (this.width + this.height) / 2;
    let dx = Math.random() * this.width - cx;
    let dy = Math.random() * this.height - cy;
    const len = Math.hypot(dx, dy) || 1;
    out[o] = cx + (dx / len) * mag;
    out[o + 1] = cy + (dy / len) * mag;
    out[o + 2] = (Math.random() - 0.5) * 400;
  }

  /** Freeze the current blended colour as the start of a new colour transition */
  private rebaseColor(i: number) {
    const w = this.colWeight[i];
    for (let c = 0; c < 3; c++) {
      const k = i * 3 + c;
      this.colStart[k] = this.colStart[k] + (this.colTarget[k] - this.colStart[k]) * w;
    }
    this.colWeight[i] = 0;
  }

  get isAsleep() {
    return this.asleep;
  }

  wake() {
    this.asleep = false;
    this.needsDraw = true;
  }

  /** Stir the field, e.g. from scroll speed (0–1) */
  agitate(amount: number) {
    if (!this.motion || amount <= 0.02) return;
    this.swirl = Math.max(this.swirl, Math.min(0.6, amount));
    this.wake();
  }

  morph(next: MorphTarget) {
    this.grow(next.count);
    this.additive = next.additive;
    this.alpha = next.alpha;
    this.center = next.center;
    if (next.spin && !this.spinning) this.spinAngle = 0;
    this.spinning = next.spin;
    if (this.motion) this.swirl = Math.max(this.swirl, 0.5);

    const donors = this.active;
    const spinTo = next.spin ? 1 : 0;
    for (let i = 0; i < next.count; i++) {
      const i3 = i * 3;
      if (i >= this.count) {
        const speed = Math.random() * 6 + 4;
        this.maxSpeed[i] = speed;
        this.maxForce[i] = speed * 0.05;
        this.colRate[i] = Math.random() * 0.0275 + 0.0025;
        if (donors > 0) {
          // Split off a particle of the current shape, so the next shape grows out of this one
          // instead of every extra particle flying in from far off screen
          const d = Math.floor(Math.random() * donors);
          const a = Math.random() * Math.PI * 2;
          const kick = 1 + Math.random() * 3;
          this.pos[i3] = this.pos[d * 3];
          this.pos[i3 + 1] = this.pos[d * 3 + 1];
          this.pos[i3 + 2] = this.pos[d * 3 + 2];
          this.vel[i3] = Math.cos(a) * kick;
          this.vel[i3 + 1] = Math.sin(a) * kick;
          this.vel[i3 + 2] = (Math.random() - 0.5) * kick;
          this.spin[i] = this.spin[d];
          const w = this.colWeight[d];
          for (let c = 0; c < 3; c++) {
            const blended = this.colStart[d * 3 + c] + (this.colTarget[d * 3 + c] - this.colStart[d * 3 + c]) * w;
            this.colStart[i3 + c] = blended;
            this.colTarget[i3 + c] = blended;
          }
        } else {
          // First shape: condense out of a cloud of dust around it. Close enough to form in about
          // a second and a half, wide enough to read as dust gathering rather than a fade-in.
          const angle = Math.random() * Math.PI * 2;
          const reach = (0.12 + Math.random() * 0.88) * Math.min(this.width, this.height) * 0.42;
          this.pos[i3] = next.xyz[i3] + Math.cos(angle) * reach;
          this.pos[i3 + 1] = next.xyz[i3 + 1] + Math.sin(angle) * reach * 0.75;
          this.pos[i3 + 2] = (Math.random() - 0.5) * 300;
          this.vel[i3] = this.vel[i3 + 1] = this.vel[i3 + 2] = 0;
          this.spin[i] = 0;
          this.colStart[i3] = this.colStart[i3 + 1] = this.colStart[i3 + 2] = 0;
          this.colTarget[i3] = this.colTarget[i3 + 1] = this.colTarget[i3 + 2] = 0;
        }
        this.colWeight[i] = 1;
      }
      this.size[i] = next.size[0] + Math.random() * (next.size[1] - next.size[0]);
      this.spinTarget[i] = spinTo;
      this.rebaseColor(i);
      this.colTarget[i3] = next.rgb[i3];
      this.colTarget[i3 + 1] = next.rgb[i3 + 1];
      this.colTarget[i3 + 2] = next.rgb[i3 + 2];
      this.target[i3] = next.xyz[i3];
      this.target[i3 + 1] = next.xyz[i3 + 1];
      this.target[i3 + 2] = next.xyz[i3 + 2];
    }

    // Particles not needed by the new shape fade to black and fly off screen
    const previousCount = this.count;
    for (let i = next.count; i < previousCount; i++) {
      if (i < this.active) {
        this.farPoint(this.target, i * 3);
        this.rebaseColor(i);
        this.colTarget[i * 3] = this.colTarget[i * 3 + 1] = this.colTarget[i * 3 + 2] = 0;
        this.colRate[i] = 0.01;
        this.spinTarget[i] = 0;
      }
    }

    this.count = Math.max(previousCount, next.count);
    this.active = next.count;
    this.sizesDirty = true;
    this.colorsDirty = true;
    this.spinDirty = true;
    this.wake();
  }

  burst(x: number, y: number) {
    this.pendingBursts.push({ x, y });
    this.wake();
  }

  setTiltFromPointer(x: number, y: number) {
    if (!this.motion) return;
    this.tiltTarget.x = (x / this.width - 0.5) * 0.5;
    this.tiltTarget.y = -(y / this.height - 0.5) * 0.36;
  }

  /** Advance the simulation by real elapsed time, in fixed 60Hz steps */
  update(elapsedMs: number, now: number): FieldStats {
    const pointerActive = this.pointer.pressed || (this.pointer.hover && now - this.pointer.movedAt < 400);
    if (pointerActive || this.pendingBursts.length) this.wake();

    // Particles at rest: skip the physics. Spin and tilt happen in the shader, so a spinning or
    // tilting shape is still redrawn, but a still word costs nothing until something wakes it.
    if (this.asleep) {
      this.accumulator = 0;
      const tiltMoving =
        Math.abs(this.tiltTarget.x - this.tilt.x) > 0.0005 || Math.abs(this.tiltTarget.y - this.tilt.y) > 0.0005;
      if (this.motion && (tiltMoving || this.spinning)) {
        this.animateView(elapsedMs / STEP_MS);
        this.needsDraw = true;
      }
      return this.lastStats;
    }

    this.accumulator = Math.min(this.accumulator + elapsedMs, STEP_MS * 3);
    while (this.accumulator >= STEP_MS) {
      this.lastStats = this.step(pointerActive);
      this.accumulator -= STEP_MS;
    }
    return this.lastStats;
  }

  /** Ease the tilt toward the pointer and turn spinning shapes, by a number of 60Hz steps */
  private animateView(steps: number) {
    if (!this.motion) return;
    const k = 1 - Math.pow(1 - 0.06, steps);
    this.tilt.x += (this.tiltTarget.x - this.tilt.x) * k;
    this.tilt.y += (this.tiltTarget.y - this.tilt.y) * k;
    if (this.spinning) this.spinAngle += 0.012 * steps;
  }

  private step(pointerActive: boolean): FieldStats {
    const { pos, vel, target, maxSpeed, maxForce } = this;
    this.time += STEP_MS / 1000;
    this.animateView(1);
    // Fades in about a second, so shapes still form promptly once scrolling stops
    this.swirl *= 0.95;
    const swirl = this.swirl > 0.02 ? this.swirl : 0;
    const t = this.time;

    const px = this.pointer.x;
    const py = this.pointer.y;
    const pressed = this.pointer.pressed;
    const hover = pointerActive && !pressed;
    const fieldR = pressed ? 140 : 90;
    const fieldR2 = fieldR * fieldR;
    const useField = pressed || hover;
    const bursts = this.pendingBursts;
    this.pendingBursts = [];

    let settled = 0;
    let energy = 0;
    let n = this.count;

    for (let i = 0; i < n; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      // Steering toward target, slowing on approach (same model as the 2D engine, in 3D)
      const dx = target[ix] - pos[ix];
      const dy = target[iy] - pos[iy];
      const dz = target[iz] - pos[iz];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const desired = dist < 100 ? maxSpeed[i] * (dist / 100) : maxSpeed[i];
        const steerX = (dx / dist) * desired - vel[ix];
        const steerY = (dy / dist) * desired - vel[iy];
        const steerZ = (dz / dist) * desired - vel[iz];
        const steerMag = Math.sqrt(steerX * steerX + steerY * steerY + steerZ * steerZ);
        if (steerMag > 0) {
          // Capped at maxForce, but never more than the correction needed, so particles come to rest
          // on their target instead of jittering around it forever (which also lets the field sleep)
          const k = steerMag > maxForce[i] ? maxForce[i] / steerMag : 1;
          vel[ix] += steerX * k;
          vel[iy] += steerY * k;
          vel[iz] += steerZ * k;
        }
      }

      // Swirl: turn each particle's heading by a flowing field, so paths curve into a swarm without
      // gaining speed (adding force instead flung particles far away and delayed the next shape).
      // A tiny drift on top stirs particles that have already settled.
      if (swirl) {
        const angle = Math.sin(pos[iy] * 0.011 + pos[ix] * 0.007 + t * 1.3) * swirl * 0.14;
        const ca = Math.cos(angle);
        const sa = Math.sin(angle);
        const vx = vel[ix];
        const vy = vel[iy];
        vel[ix] = vx * ca - vy * sa + Math.cos(pos[iy] * 0.011 - t) * swirl * 0.05;
        vel[iy] = vx * sa + vy * ca + Math.sin(pos[ix] * 0.011 + t) * swirl * 0.05;
        vel[iz] += Math.sin((pos[ix] + pos[iy]) * 0.007 + t) * swirl * 0.05;
      }

      if (useField && i < this.active) {
        const ox = pos[ix] - px;
        const oy = pos[iy] - py;
        if (ox > -fieldR && ox < fieldR && oy > -fieldR && oy < fieldR) {
          const d2 = ox * ox + oy * oy;
          if (d2 < fieldR2) {
            const d = Math.sqrt(d2) || 0.1;
            const falloff = 1 - d / fieldR;
            const nx = ox / d;
            const ny = oy / d;
            if (pressed) {
              const f = falloff * 6;
              vel[ix] += nx * f;
              vel[iy] += ny * f;
              vel[iz] += f * 0.5;
            } else {
              // Hover: a soft push plus a little swirl, so the shape ripples around the cursor
              const f = falloff * falloff * 1.4;
              vel[ix] += (nx - ny * 0.6) * f;
              vel[iy] += (ny + nx * 0.6) * f;
              vel[iz] += f * 0.8;
            }
          }
        }
      }

      for (let b = 0; b < bursts.length; b++) {
        const ox = pos[ix] - bursts[b].x;
        const oy = pos[iy] - bursts[b].y;
        const d2 = ox * ox + oy * oy;
        if (d2 < 260 * 260) {
          const d = Math.sqrt(d2) || 0.1;
          const f = (1 - d / 260) * 22;
          vel[ix] += (ox / d) * f;
          vel[iy] += (oy / d) * f;
          vel[iz] += f * 0.6;
        }
      }

      pos[ix] += vel[ix];
      pos[iy] += vel[iy];
      pos[iz] += vel[iz];
      energy += Math.abs(vel[ix]) + Math.abs(vel[iy]);

      if (i < this.active) {
        if (distSq <= 16) settled++;
      } else if (pos[ix] < -60 || pos[ix] > this.width + 60 || pos[iy] < -60 || pos[iy] > this.height + 60) {
        // A dismissed particle has left the screen: free its slot by moving the last one into it
        const last = n - 1;
        if (i !== last) this.copySlot(last, i);
        n--;
        i--;
        continue;
      }

      if (this.colWeight[i] < 1) {
        this.colWeight[i] = Math.min(1, this.colWeight[i] + this.colRate[i]);
        this.colorsDirty = true;
      }
      const sw = this.spin[i];
      const st = this.spinTarget[i];
      if (sw !== st) {
        this.spin[i] = sw < st ? Math.min(st, sw + 0.025) : Math.max(st, sw - 0.025);
        this.spinDirty = true;
      }
    }
    this.count = n;
    this.needsDraw = true;

    // Fall asleep once the shape has settled and nothing else is moving it
    const still =
      n === this.active &&
      energy / Math.max(1, n) < 0.015 &&
      swirl === 0 &&
      !this.colorsDirty &&
      !this.spinDirty &&
      !pointerActive;
    if (still) this.asleep = true;

    return { active: this.active, settled, asleep: still };
  }

  private copySlot(from: number, to: number) {
    for (let c = 0; c < 3; c++) {
      this.pos[to * 3 + c] = this.pos[from * 3 + c];
      this.vel[to * 3 + c] = this.vel[from * 3 + c];
      this.target[to * 3 + c] = this.target[from * 3 + c];
      this.colStart[to * 3 + c] = this.colStart[from * 3 + c];
      this.colTarget[to * 3 + c] = this.colTarget[from * 3 + c];
    }
    this.maxSpeed[to] = this.maxSpeed[from];
    this.maxForce[to] = this.maxForce[from];
    this.size[to] = this.size[from];
    this.colWeight[to] = this.colWeight[from];
    this.colRate[to] = this.colRate[from];
    this.spin[to] = this.spin[from];
    this.spinTarget[to] = this.spinTarget[from];
    this.sizesDirty = true;
    this.colorsDirty = true;
    this.spinDirty = true;
  }

  render() {
    if (!this.needsDraw) return;
    this.needsDraw = false;
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const n = this.count;
    if (!n) return;

    const u = this.uniforms;
    gl.useProgram(this.program);
    gl.uniform2f(u.uRes, this.width, this.height);
    gl.uniform1f(u.uDpr, this.dpr);
    gl.uniform1f(u.uGlow, this.additive ? 1 : 0);
    gl.uniform2f(u.uCenter, this.center[0], this.center[1]);
    gl.uniform1f(u.uSpinAngle, this.spinAngle);
    gl.uniform2f(u.uTilt, this.tilt.x, this.tilt.y);
    gl.uniform1f(u.uFocal, FOCAL);
    if (this.additive) gl.blendFunc(gl.ONE, gl.ONE);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.pos.subarray(0, n * 3), gl.DYNAMIC_DRAW);

    if (this.colorsDirty) {
      for (let i = 0; i < n; i++) {
        const w = this.colWeight[i];
        for (let c = 0; c < 3; c++) {
          const k = i * 3 + c;
          this.colOut[i * 4 + c] = this.colStart[k] + (this.colTarget[k] - this.colStart[k]) * w;
        }
        this.colOut[i * 4 + 3] = this.alpha;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.colOut.subarray(0, n * 4), gl.DYNAMIC_DRAW);
      this.colorsDirty = false;
    }
    if (this.sizesDirty) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.size.subarray(0, n), gl.DYNAMIC_DRAW);
      this.sizesDirty = false;
    }
    if (this.spinDirty) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.spinBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.spin.subarray(0, n), gl.DYNAMIC_DRAW);
      this.spinDirty = false;
    }

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    for (const b of [this.posBuffer, this.colorBuffer, this.sizeBuffer, this.spinBuffer]) gl.deleteBuffer(b);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }
}

/**
 * Sample a rendered canvas into particle targets: shuffled, capped at budget, jittered off the pixel grid,
 * with a little depth so words have thickness. Small shapes are oversampled up to 2x for density.
 */
export function sampleTargets(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  budget: number,
  options: { color?: [number, number, number]; additive: boolean; depth: number; center: [number, number]; size: [number, number] }
): MorphTarget {
  // Coarsen the grid only when the shape is far bigger than the budget, to bound memory
  let filled = 0;
  for (let i = 3; i < pixels.length; i += 16) if (pixels[i] > 20) filled++;
  const estimate = filled * 4;
  const step = Math.max(1, Math.floor(Math.sqrt(estimate / (budget * 2.5))));

  const candidates: number[] = [];
  for (let y = 0; y < height; y += step) {
    const row = y * width;
    for (let x = 0; x < width; x += step) {
      if (pixels[(row + x) * 4 + 3] > 20) candidates.push(row + x);
    }
  }

  const oversample = options.additive && candidates.length * 2 <= budget ? 2 : 1;
  const count = Math.min(budget, candidates.length * oversample);
  const jitter = oversample > 1 ? Math.max(step, 1.4) : step;

  // Partial Fisher–Yates over the first pass; the second oversampled pass reuses candidates in order
  const firstPass = Math.min(count, candidates.length);
  for (let i = 0; i < firstPass; i++) {
    const j = i + Math.floor(Math.random() * (candidates.length - i));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
  }

  const xyz = new Float32Array(count * 3);
  const rgb = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const p = candidates[i % candidates.length];
    const x = p % width;
    const y = (p - x) / width;
    xyz[i * 3] = x + (Math.random() - 0.5) * jitter;
    xyz[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
    xyz[i * 3 + 2] = (Math.random() - 0.5) * options.depth;
    if (options.color) {
      rgb[i * 3] = options.color[0];
      rgb[i * 3 + 1] = options.color[1];
      rgb[i * 3 + 2] = options.color[2];
    } else {
      rgb[i * 3] = pixels[p * 4] / 255;
      rgb[i * 3 + 1] = pixels[p * 4 + 1] / 255;
      rgb[i * 3 + 2] = pixels[p * 4 + 2] / 255;
    }
  }
  return {
    count,
    xyz,
    rgb,
    additive: options.additive,
    alpha: options.additive ? (oversample > 1 ? 0.46 : 0.62) : 1,
    spin: false,
    center: options.center,
    size: options.size,
  };
}

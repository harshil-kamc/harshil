import type { MorphTarget } from "./ParticleField";

/**
 * Volumetric particle shapes, sampled from simple geometry.
 * Model space is centred on the origin with y pointing down; points are then placed
 * around the given screen centre. Each shape returns `spin: true` so it turns slowly.
 */

export type ShapeName = "trophy" | "atom";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface Builder {
  xyz: Float32Array;
  rgb: Float32Array;
  i: number;
}

const push = (b: Builder, x: number, y: number, z: number, r: number, g: number, bl: number) => {
  const k = b.i * 3;
  b.xyz[k] = x;
  b.xyz[k + 1] = y;
  b.xyz[k + 2] = z;
  b.rgb[k] = r;
  b.rgb[k + 1] = g;
  b.rgb[k + 2] = bl;
  b.i++;
};

// Brushed gold with occasional bright glints
const gold = (b: Builder, x: number, y: number, z: number, dim = 1) => {
  if (Math.random() < 0.05) return push(b, x, y, z, 1, 0.96, 0.82);
  const s = rand(0.72, 1.08) * dim;
  push(b, x, y, z, 1.0 * s, 0.74 * s, 0.26 * s);
};

function buildTrophy(b: Builder, count: number, H: number) {
  const R = 0.3 * H;
  const cupTop = -0.5 * H;
  const cupBottom = 0.04 * H;
  // Share of particles per part, roughly by visible surface area
  const parts: [number, () => void][] = [
    [0.46, () => {
      // Cup: a bowl that narrows toward the stem
      const t = Math.pow(Math.random(), 0.8);
      const y = cupTop + t * (cupBottom - cupTop);
      const r = R * (1 - 0.82 * Math.pow(t, 2.2));
      const a = Math.random() * Math.PI * 2;
      gold(b, Math.cos(a) * r, y, Math.sin(a) * r);
    }],
    [0.08, () => {
      // Rim: a rolled lip, brighter
      const a = Math.random() * Math.PI * 2;
      const tube = rand(0, Math.PI * 2);
      const rr = R + Math.cos(tube) * 0.018 * H;
      gold(b, Math.cos(a) * rr, cupTop + Math.sin(tube) * 0.018 * H, Math.sin(a) * rr, 1.15);
    }],
    [0.12, () => {
      // Handles: a loop on each side
      const side = Math.random() < 0.5 ? -1 : 1;
      const a = rand(-Math.PI / 2, Math.PI / 2);
      const loop = 0.13 * H;
      const tube = rand(0, Math.PI * 2);
      const tr = 0.016 * H;
      const cx = side * (R * 0.92 + Math.cos(a) * loop + Math.cos(tube) * tr);
      const cy = -0.3 * H + Math.sin(a) * loop * 1.15;
      gold(b, cx, cy, Math.sin(tube) * tr);
    }],
    [0.06, () => {
      // Stem
      const y = rand(cupBottom, 0.27 * H);
      const r = 0.045 * H;
      const a = Math.random() * Math.PI * 2;
      gold(b, Math.cos(a) * r, y, Math.sin(a) * r, 0.95);
    }],
    [0.05, () => {
      // Knot on the stem
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(rand(-1, 1));
      const r = 0.075 * H;
      gold(b, Math.sin(v) * Math.cos(u) * r, 0.14 * H + Math.cos(v) * r * 0.6, Math.sin(v) * Math.sin(u) * r, 1.05);
    }],
    [0.23, () => {
      // Two-tier base: side walls plus the top surface of each tier
      const a = Math.random() * Math.PI * 2;
      const pick = Math.random();
      if (pick < 0.35) {
        const y = rand(0.27, 0.35) * H;
        const r = 0.17 * H;
        gold(b, Math.cos(a) * r, y, Math.sin(a) * r, 0.85);
      } else if (pick < 0.8) {
        const y = rand(0.35, 0.47) * H;
        const r = 0.25 * H;
        gold(b, Math.cos(a) * r, y, Math.sin(a) * r, 0.75);
      } else {
        const r = Math.sqrt(Math.random()) * 0.25 * H;
        gold(b, Math.cos(a) * r, 0.35 * H, Math.sin(a) * r, 0.9);
      }
    }],
  ];

  const total = parts.reduce((s, [w]) => s + w, 0);
  while (b.i < count) {
    let roll = Math.random() * total;
    for (const [w, fn] of parts) {
      roll -= w;
      if (roll <= 0) {
        fn();
        break;
      }
    }
  }
}

function buildAtom(b: Builder, count: number, H: number) {
  const A = 0.5 * H;
  // Orbit colours match the skill groups (Languages, Web, Backend)
  const ringColors: [number, number, number][] = [
    [0, 0.94, 1],
    [0.66, 0.55, 0.98],
    [0.2, 0.83, 0.6],
  ];
  // Tip each orbit only slightly from edge-on, so it reads as a thin ellipse like the atom symbol
  const tiltX = (18 * Math.PI) / 180;
  const ringPoint = (k: number, phi: number, jitter: number) => {
    // A horizontal circle, tipped forward, then turned 60° per orbit around the view axis
    let x = Math.cos(phi) * A + rand(-jitter, jitter);
    let y = rand(-jitter, jitter);
    let z = Math.sin(phi) * A + rand(-jitter, jitter);
    const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    y = y1;
    z = z1;
    const rz = (k * Math.PI) / 3;
    return [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz), z] as const;
  };

  const nucleus = Math.floor(count * 0.16);
  const electrons = Math.floor(count * 0.09);
  const rings = count - nucleus - electrons;

  for (let i = 0; i < nucleus; i++) {
    // Dense core, brighter toward the centre
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(rand(-1, 1));
    const r = Math.cbrt(Math.random()) * 0.17 * A;
    const glow = 1 - r / (0.17 * A);
    push(b, Math.sin(v) * Math.cos(u) * r, Math.cos(v) * r, Math.sin(v) * Math.sin(u) * r, 0.96, 0.45 + glow * 0.5, 0.7 + glow * 0.3);
  }
  for (let i = 0; i < rings; i++) {
    const k = i % 3;
    const [x, y, z] = ringPoint(k, Math.random() * Math.PI * 2, 2.5);
    const [r, g, bl] = ringColors[k];
    const s = rand(0.7, 1.05);
    push(b, x, y, z, r * s, g * s, bl * s);
  }
  for (let i = 0; i < electrons; i++) {
    // One bright electron per orbit
    const k = i % 3;
    const [x, y, z] = ringPoint(k, k * 2.1 + 0.6, 0);
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(rand(-1, 1));
    const r = Math.cbrt(Math.random()) * 0.06 * A;
    const [cr, cg, cb] = ringColors[k];
    push(b, x + Math.sin(v) * Math.cos(u) * r, y + Math.cos(v) * r, z + Math.sin(v) * Math.sin(u) * r, 0.5 + cr * 0.5, 0.5 + cg * 0.5, 0.5 + cb * 0.5);
  }
}

export function buildShape(name: ShapeName, count: number, width: number, height: number): MorphTarget {
  // Sized to sit where the section word sits, without spilling into the content below
  const H = Math.min(height * 0.38, width * 0.62, 340);
  const center: [number, number] = [width / 2, height / 2.3];
  const b: Builder = { xyz: new Float32Array(count * 3), rgb: new Float32Array(count * 3), i: 0 };
  if (name === "trophy") buildTrophy(b, count, H);
  else buildAtom(b, count, H);

  for (let i = 0; i < count; i++) {
    b.xyz[i * 3] += center[0];
    b.xyz[i * 3 + 1] += center[1];
  }
  return {
    count,
    xyz: b.xyz,
    rgb: b.rgb,
    additive: true,
    alpha: 0.5,
    spin: true,
    center,
    size: [1.3, 2.5],
  };
}

export const isShapeItem = (item: string) => item.startsWith("SHAPE:");
export const shapeNameOf = (item: string) => item.slice("SHAPE:".length) as ShapeName;

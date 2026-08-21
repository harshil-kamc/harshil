"use client";

import { useEffect, useRef, useState } from "react";
import { loadSafeCanvasImage, normalizeImageUrl, isLikelyImageUrl } from "../utils/imageUrlResolver";
import { registerParticleInteraction } from "../utils/notificationTracker";

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;

  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;
  colorString = "rgb(0,0,0)";

  move() {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const distSq = dx * dx + dy * dy;

    if (distSq === 0) return;

    const distance = Math.sqrt(distSq);

    let proximityMult = 1;
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const desiredSpeed = this.maxSpeed * proximityMult;
    const invDist = desiredSpeed / distance;
    const towardsTargetX = dx * invDist;
    const towardsTargetY = dy * invDist;

    const steerX = towardsTargetX - this.vel.x;
    const steerY = towardsTargetY - this.vel.y;

    const steerDistSq = steerX * steerX + steerY * steerY;
    if (steerDistSq > 0) {
      const steerMag = Math.sqrt(steerDistSq);
      const invSteerMag = this.maxForce / steerMag;
      this.acc.x += steerX * invSteerMag;
      this.acc.y += steerY * invSteerMag;
    }

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
      const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
      const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
      const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
      this.colorString = `rgb(${r},${g},${b})`;
    }
    ctx.fillStyle = this.colorString;

    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;
      this.colorBlendRate = 0.01;
      this.isKilled = true;
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    let dirX = randomX - x;
    let dirY = randomY - y;

    const distSq = dirX * dirX + dirY * dirY;
    if (distSq > 0) {
      const magnitude = Math.sqrt(distSq);
      dirX = (dirX / magnitude) * mag;
      dirY = (dirY / magnitude) * mag;
    }

    return {
      x: x + dirX,
      y: y + dirY,
    };
  }
}

interface ParticleCanvasManagerProps {
  currentWord: string;
  wordSequence?: string[];
  autoCycle?: boolean;
  cycleInterval?: number;
  intensity?: "soft" | "normal" | "vibrant";
  interactiveMode?: boolean;
  mode?: "text" | "image";
  imageUrl?: string | null;
  onImageError?: (msg: string) => void;
}

export function ParticleCanvasManager({
  currentWord,
  wordSequence,
  autoCycle = false,
  cycleInterval = 280,
  intensity = "normal",
  interactiveMode = true,
  mode = "text",
  imageUrl,
  onImageError,
}: ParticleCanvasManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

  // Load cancellation & debounce refs
  const loadIdRef = useRef(0);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProcessedKeyRef = useRef<string>("");

  // Formation state & timing refs
  const formationStateRef = useRef<"forming" | "holding">("forming");
  const settledTimeRef = useRef<number>(0);
  const formingStartTimeRef = useRef<number>(0);

  // FPS monitoring & performance adaptation refs & state
  const fpsRef = useRef<number>(60);
  const lastFrameTimeRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  const lowFpsDurationRef = useRef<number>(0);
  const perfStepOffsetRef = useRef<number>(0);
  const [fpsDisplay, setFpsDisplay] = useState<number>(60);

  const activeWordRef = useRef(currentWord);
  const wordSequenceRef = useRef(wordSequence);
  wordSequenceRef.current = wordSequence;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const imageUrlRef = useRef(imageUrl);
  imageUrlRef.current = imageUrl;

  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  const [particleCount, setParticleCount] = useState(0);

  const drawAsPoints = true;

  // Calculate dynamic adaptive sampling step based on viewport size & intensity
  // Guarantees high particle density on mobile/small viewports so images/text fully reconstruct without gaps
  const getAdaptiveStep = () => {
    const canvas = canvasRef.current;
    const width = canvas?.width || (typeof window !== "undefined" ? window.innerWidth : 800);
    const height = canvas?.height || (typeof window !== "undefined" ? window.innerHeight : 600);
    const minDim = Math.min(width, height);

    let baseStep = 3;
    if (intensityRef.current === "vibrant") {
      baseStep = 2;
    } else if (intensityRef.current === "soft") {
      baseStep = 4;
    }

    // On mobile & small screens, ensure baseStep is 2 or 3 so fine strokes and image details have solid coverage
    if (minDim <= 480) {
      baseStep = Math.min(baseStep, 2);
    } else if (minDim <= 768) {
      baseStep = Math.min(baseStep, 3);
    }

    // Apply performance offset if sustained low FPS detected
    if (perfStepOffsetRef.current > 0) {
      baseStep += perfStepOffsetRef.current;
    }

    return Math.max(2, baseStep);
  };

  // Helper to generate random initial positions when spawning new particles
  const generateRandomPos = (width: number, height: number, x: number, y: number, mag: number): Vector2D => {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;

    let dirX = randomX - x;
    let dirY = randomY - y;
    const distSq = dirX * dirX + dirY * dirY;
    if (distSq > 0) {
      const magnitude = Math.sqrt(distSq);
      dirX = (dirX / magnitude) * mag;
      dirY = (dirY / magnitude) * mag;
    }

    return { x: x + dirX, y: y + dirY };
  };

  // Image Particle Mode Trigger
  const triggerImageParticles = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;

    const cleanUrl = normalizeImageUrl(url);
    const currentKey = `IMG_${cleanUrl}_${canvas.width}_${canvas.height}_${intensityRef.current}_${perfStepOffsetRef.current}`;
    if (lastProcessedKeyRef.current === currentKey) return;

    const currentLoadId = ++loadIdRef.current;

    loadSafeCanvasImage(cleanUrl)
      .then((img) => {
        if (currentLoadId !== loadIdRef.current) return;
        if (!canvasRef.current) return;
        lastProcessedKeyRef.current = currentKey;

        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext("2d");
        if (!offscreenCtx) return;

        const padding = Math.min(80, Math.floor(Math.min(canvas.width, canvas.height) * 0.1));
        const maxWidth = canvas.width - padding * 2;
        const maxHeight = canvas.height - padding * 2;

        let scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        scale = Math.min(scale, 1.2);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const xOffset = (canvas.width - drawWidth) / 2;
        const yOffset = (canvas.height - drawHeight) / 2;

        offscreenCtx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

        let imageData;
        try {
          imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          if (onImageError) {
            onImageError("CORS security restricted canvas pixel reading. Try a local image upload or a CORS-enabled link.");
          }
          return;
        }

        const pixels = imageData.data;
        const particles = particlesRef.current;
        let particleIndex = 0;

        const step = getAdaptiveStep();
        const width = canvas.width;
        const height = canvas.height;

        // Uniform 2D grid sampling (both X and Y step) for clean, complete image reconstruction
        const visibleIndices: number[] = [];
        for (let y = 0; y < height; y += step) {
          const rowStart = y * width * 4;
          for (let x = 0; x < width; x += step) {
            const pixelIndex = rowStart + x * 4;
            if ((pixels[pixelIndex + 3] ?? 0) > 20) {
              visibleIndices.push(pixelIndex);
            }
          }
        }

        // Fast Fisher-Yates shuffle
        for (let i = visibleIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = visibleIndices[i]!;
          visibleIndices[i] = visibleIndices[j]!;
          visibleIndices[j] = temp;
        }

        for (let idx = 0; idx < visibleIndices.length; idx++) {
          const pixelIndex = visibleIndices[idx]!;
          const r = pixels[pixelIndex] ?? 0;
          const g = pixels[pixelIndex + 1] ?? 0;
          const b = pixels[pixelIndex + 2] ?? 0;

          const x = (pixelIndex / 4) % canvas.width;
          const y = Math.floor(pixelIndex / 4 / canvas.width);

          let particle: Particle;

          if (particleIndex < particles.length) {
            particle = particles[particleIndex]!;
            particle.isKilled = false;
            particleIndex++;
          } else {
            particle = new Particle();
            const randomPos = generateRandomPos(
              canvas.width,
              canvas.height,
              canvas.width / 2,
              canvas.height / 2,
              (canvas.width + canvas.height) / 2
            );
            particle.pos.x = randomPos.x;
            particle.pos.y = randomPos.y;

            particle.maxSpeed = Math.random() * 6 + 4;
            particle.maxForce = particle.maxSpeed * 0.05;
            particle.particleSize = Math.random() * 2 + 2;
            particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

            particles.push(particle);
          }

          particle.startColor = {
            r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
            g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
            b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
          };
          particle.targetColor = { r, g, b };
          particle.colorWeight = 0;
          particle.colorString = `rgb(${r},${g},${b})`;

          particle.target.x = x;
          particle.target.y = y;
        }

        for (let i = particleIndex; i < particles.length; i++) {
          particles[i]!.kill(canvas.width, canvas.height);
        }

        setParticleCount(particleIndex);
        formationStateRef.current = "forming";
        formingStartTimeRef.current = performance.now();
      })
      .catch((err: Error) => {
        if (currentLoadId !== loadIdRef.current) return;
        if (onImageError) {
          onImageError(err.message || "Failed to load image from URL. Please ensure it's a valid public image link or upload an image file directly.");
        }
      });
  };

  // Text Particle Mode Trigger
  const triggerNextWord = (wordToDraw: string) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;

    const currentKey = `TXT_${wordToDraw}_${canvas.width}_${canvas.height}_${intensityRef.current}_${perfStepOffsetRef.current}`;
    if (lastProcessedKeyRef.current === currentKey) return;
    lastProcessedKeyRef.current = currentKey;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    const lengthFactor = Math.max(1, wordToDraw.length / 7);
    const baseFontSize = Math.min(canvas.width, canvas.height) / (5.5 * lengthFactor);
    const fontSize = Math.max(42, Math.min(140, baseFontSize));

    offscreenCtx.fillStyle = "#ffffff";
    offscreenCtx.font = `700 ${fontSize}px 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";
    offscreenCtx.fillText(wordToDraw, canvas.width / 2, canvas.height / 2.3);

    let imageData;
    try {
      imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    } catch {
      return;
    }
    const pixels = imageData.data;

    const colorPalette = [
      { r: 16, g: 185, b: 129 },
      { r: 59, g: 130, b: 246 },
      { r: 139, g: 92, b: 246 },
      { r: 236, g: 72, b: 153 },
      { r: 245, g: 158, b: 11 },
      { r: 6, g: 182, b: 212 },
    ];

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)] || {
      r: 52,
      g: 211,
      b: 153,
    };

    const particles = particlesRef.current;
    let particleIndex = 0;

    const step = getAdaptiveStep();
    const width = canvas.width;
    const height = canvas.height;

    // Uniform 2D grid sampling for complete text letter reconstruction
    const visibleIndices: number[] = [];
    for (let y = 0; y < height; y += step) {
      const rowStart = y * width * 4;
      for (let x = 0; x < width; x += step) {
        const pixelIndex = rowStart + x * 4;
        if ((pixels[pixelIndex + 3] ?? 0) > 20) {
          visibleIndices.push(pixelIndex);
        }
      }
    }

    // Fast Fisher-Yates shuffle
    for (let i = visibleIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = visibleIndices[i]!;
      visibleIndices[i] = visibleIndices[j]!;
      visibleIndices[j] = temp;
    }

    for (let idx = 0; idx < visibleIndices.length; idx++) {
      const pixelIndex = visibleIndices[idx]!;
      const x = (pixelIndex / 4) % canvas.width;
      const y = Math.floor(pixelIndex / 4 / canvas.width);

      let particle: Particle;

      if (particleIndex < particles.length) {
        particle = particles[particleIndex]!;
        particle.isKilled = false;
        particleIndex++;
      } else {
        particle = new Particle();
        const randomPos = generateRandomPos(
          canvas.width,
          canvas.height,
          canvas.width / 2,
          canvas.height / 2,
          (canvas.width + canvas.height) / 2
        );
        particle.pos.x = randomPos.x;
        particle.pos.y = randomPos.y;

        particle.maxSpeed = Math.random() * 6 + 4;
        particle.maxForce = particle.maxSpeed * 0.05;
        particle.particleSize = Math.random() * 2 + 2;
        particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

        particles.push(particle);
      }

      particle.startColor = {
        r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
        g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
        b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
      };
      particle.targetColor = randomColor;
      particle.colorWeight = 0;
      particle.colorString = `rgb(${randomColor.r},${randomColor.g},${randomColor.b})`;

      particle.target.x = x;
      particle.target.y = y;
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i]!.kill(canvas.width, canvas.height);
    }

    setParticleCount(particleIndex);
    formationStateRef.current = "forming";
    formingStartTimeRef.current = performance.now();
  };

  const isImageUrl = (str: string) => {
    return isLikelyImageUrl(str);
  };

  const triggerSequenceItem = (item: string) => {
    if (isImageUrl(item)) {
      const cleanUrl = item.startsWith("IMG:") ? item.slice(4) : item;
      triggerImageParticles(cleanUrl);
    } else {
      activeWordRef.current = item;
      triggerNextWord(item);
    }
  };

  // Re-trigger particle morph when props change
  useEffect(() => {
    activeWordRef.current = currentWord;
    if (canvasRef.current) {
      if (mode === "image" && imageUrl) {
        triggerImageParticles(imageUrl);
      } else {
        triggerSequenceItem(currentWord);
      }
    }
  }, [currentWord, mode, imageUrl, intensity]);

  // Ensure Space Grotesk font is loaded and re-rasterize if font was loaded asynchronously
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (canvasRef.current && modeRef.current === "text") {
          lastProcessedKeyRef.current = "";
          const itemToDraw = wordSequenceRef.current?.[wordIndexRef.current] || activeWordRef.current;
          triggerSequenceItem(itemToDraw);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Debounced resize handler to eliminate CPU spikes during window dragging
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        if (!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        lastProcessedKeyRef.current = ""; // Invalidate cache on dimension change

        if (modeRef.current === "image" && imageUrlRef.current) {
          triggerImageParticles(imageUrlRef.current);
        } else {
          triggerNextWord(activeWordRef.current);
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    const animate = (now: number = performance.now()) => {
      // Real-time smoothed FPS monitoring
      if (lastFrameTimeRef.current > 0) {
        const delta = now - lastFrameTimeRef.current;
        if (delta > 0) {
          const instantFps = 1000 / delta;
          fpsRef.current = fpsRef.current * 0.9 + instantFps * 0.1;
        }
      }
      const prevFrameTime = lastFrameTimeRef.current || now;
      lastFrameTimeRef.current = now;

      // Adaptive performance monitor: check if device experiences sustained low FPS
      if (fpsRef.current < 28) {
        lowFpsDurationRef.current += (now - prevFrameTime);
        if (lowFpsDurationRef.current > 3000 && perfStepOffsetRef.current < 2) {
          perfStepOffsetRef.current += 1;
          lowFpsDurationRef.current = 0;
        }
      } else {
        lowFpsDurationRef.current = 0;
      }

      // Update UI FPS display twice per second (prevents React re-renders during 60fps loop)
      if (now - lastFpsUpdateRef.current > 500) {
        lastFpsUpdateRef.current = now;
        setFpsDisplay(Math.round(fpsRef.current));
      }

      const particles = particlesRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;
      let settledCount = 0;

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]!;
        particle.move();
        particle.draw(ctx, drawAsPoints);

        if (!particle.isKilled) {
          activeCount++;
          const dx = particle.target.x - particle.pos.x;
          const dy = particle.target.y - particle.pos.y;
          // Particle is settled if within 4px of target
          if (dx * dx + dy * dy <= 16) {
            settledCount++;
          }
        } else {
          if (
            particle.pos.x < 0 ||
            particle.pos.x > canvas.width ||
            particle.pos.y < 0 ||
            particle.pos.y > canvas.height
          ) {
            particles.splice(i, 1);
          }
        }
      }

      // Fast mouse interaction without Math.sqrt or object allocations
      if (mouseRef.current.isPressed && interactiveMode) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const radius = 10;
        const radiusSq = radius * radius;

        // Reset formation hold state while mouse is pressed / user is scattering particles
        formationStateRef.current = "forming";
        formingStartTimeRef.current = now;

        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]!;
          if (particle.isKilled) continue;

          const dx = particle.pos.x - mx;
          const dy = particle.pos.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq) || 0.1;
            const normX = dx / dist;
            const normY = dy / dist;
            const force = (1 - dist / radius) * 12;
            particle.vel.x += normX * force;
            particle.vel.y += normY * force;
            particle.pos.x += normX * (force * 0.25);
            particle.pos.y += normY * (force * 0.25);
          }
        }
      }

      // Particle-state-driven auto cycle sequence
      const settledRatio = activeCount > 0 ? settledCount / activeCount : 0;
      const timeForming = now - formingStartTimeRef.current;

      if (formationStateRef.current === "forming") {
        // Transition to holding state when >= 98% settled or safety timeout (7s) reached
        // ONLY if user is not currently pressing/scattering particles!
        if (!mouseRef.current.isPressed && ((activeCount > 0 && settledRatio >= 0.98) || timeForming > 7000)) {
          formationStateRef.current = "holding";
          settledTimeRef.current = now;
        }
      } else if (formationStateRef.current === "holding") {
        // If user presses/scatters while holding, cancel hold and revert to forming
        if (mouseRef.current.isPressed) {
          formationStateRef.current = "forming";
          formingStartTimeRef.current = now;
        } else {
          const holdDuration = Math.max(1800, Math.min(3000, cycleInterval * 8));
          if (
            autoCycle &&
            modeRef.current === "text" &&
            wordSequenceRef.current &&
            wordSequenceRef.current.length > 0
          ) {
            if (now - settledTimeRef.current >= holdDuration) {
              wordIndexRef.current = (wordIndexRef.current + 1) % wordSequenceRef.current.length;
              const nextW = wordSequenceRef.current[wordIndexRef.current] || activeWordRef.current;
              triggerSequenceItem(nextW);
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (modeRef.current === "image" && imageUrlRef.current) {
      triggerImageParticles(imageUrlRef.current);
    } else {
      const initialItem = wordSequenceRef.current?.[0] || activeWordRef.current;
      triggerSequenceItem(initialItem);
    }
    animate();

    const isHeroViewport = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        return rect.bottom > 100 && rect.top <= window.innerHeight * 0.5;
      }
      return window.scrollY < window.innerHeight * 0.85;
    };

    let dragThrottler = 0;
    let pressStartTime = 0;

    const handleWindowMouseDown = (e: MouseEvent) => {
      if (!interactiveMode || !isHeroViewport()) return;

      if (e.button === 0) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        mouseRef.current.isPressed = true;
        mouseRef.current.isRightClick = false;
        mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        pressStartTime = Date.now();
      }
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isPressed) return;

      if (!isHeroViewport()) {
        mouseRef.current.isPressed = false;
        mouseRef.current.isRightClick = false;
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);

      // Throttled tracking for meaningful continuous particle dragging
      const now = Date.now();
      if (now - dragThrottler > 250) {
        dragThrottler = now;
        registerParticleInteraction("drag", 250);
      }
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        if (mouseRef.current.isPressed && Date.now() - pressStartTime > 400) {
          registerParticleInteraction("drag", Date.now() - pressStartTime);
        }
        mouseRef.current.isPressed = false;
        mouseRef.current.isRightClick = false;
      }
    };

    const handleBlur = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    window.addEventListener("mousedown", handleWindowMouseDown, { capture: true });
    window.addEventListener("mousemove", handleWindowMouseMove, { capture: true });
    window.addEventListener("mouseup", handleWindowMouseUp, { capture: true });
    window.addEventListener("blur", handleBlur);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      window.removeEventListener("mousedown", handleWindowMouseDown, { capture: true });
      window.removeEventListener("mousemove", handleWindowMouseMove, { capture: true });
      window.removeEventListener("mouseup", handleWindowMouseUp, { capture: true });
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
    };
  }, [cycleInterval, autoCycle, interactiveMode]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-[#0a0a0f]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      {/* Subtle particle status overlay showing actual real-time FPS */}
      <div className="absolute bottom-3 right-4 text-[10px] text-zinc-500/60 font-mono pointer-events-none select-none">
        {particleCount} PARTICLES | FPS {fpsDisplay}
      </div>
    </div>
  );
}

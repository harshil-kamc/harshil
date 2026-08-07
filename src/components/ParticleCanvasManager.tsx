"use client";

import { useEffect, useRef, useState } from "react";

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

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    );
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

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
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;

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

      this.isKilled = true;
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
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
}

export function ParticleCanvasManager({
  currentWord,
  wordSequence,
  autoCycle = false,
  cycleInterval = 280,
  intensity = "normal",
  interactiveMode = true,
}: ParticleCanvasManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

  const activeWordRef = useRef(currentWord);
  const wordSequenceRef = useRef(wordSequence);
  wordSequenceRef.current = wordSequence;

  const [particleCount, setParticleCount] = useState(0);

  const pixelSteps = intensity === "vibrant" ? 3 : 4;
  const drawAsPoints = true;

  // Whenever currentWord changes from outside (e.g. scroll section change), trigger word morph
  useEffect(() => {
    activeWordRef.current = currentWord;
    if (canvasRef.current) {
      triggerNextWord(currentWord);
    }
  }, [currentWord]);

  const triggerNextWord = (wordToDraw: string) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    // Font size scaling based on word length & view dimensions
    const lengthFactor = Math.max(1, wordToDraw.length / 7);
    const baseFontSize = Math.min(canvas.width, canvas.height) / (6 * lengthFactor);
    const fontSize = Math.max(50, Math.min(140, baseFontSize));

    offscreenCtx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
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

    // Vibrant accent colors matching dark luxury palette
    const colorPalette = [
      { r: 16, g: 185, b: 129 }, // Emerald
      { r: 59, g: 130, b: 246 }, // Blue
      { r: 139, g: 92, b: 246 }, // Purple
      { r: 236, g: 72, b: 153 }, // Pink
      { r: 245, g: 158, b: 11 }, // Amber
      { r: 6, g: 182, b: 212 },  // Cyan
    ];

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)] || {
      r: 52,
      g: 211,
      b: 153,
    };

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes: number[] = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i]!, coordsIndexes[j]!] = [coordsIndexes[j]!, coordsIndexes[i]!];
    }

    const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
      const randomX = Math.random() * canvas.width;
      const randomY = Math.random() * canvas.height;

      const direction = { x: randomX - x, y: randomY - y };
      const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      if (magnitude > 0) {
        direction.x = (direction.x / magnitude) * mag;
        direction.y = (direction.y / magnitude) * mag;
      }

      return { x: x + direction.x, y: y + direction.y };
    };

    for (const pixelIndex of coordsIndexes) {
      const alpha = pixels[pixelIndex + 3] ?? 0;

      if (alpha > 0) {
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

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i]!.kill(canvas.width, canvas.height);
    }

    setParticleCount(particleIndex);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      triggerNextWord(activeWordRef.current);
    };
    window.addEventListener("resize", resize);

    const animate = () => {
      const particles = particlesRef.current;

      // Deep dark canvas background clear with trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#0a0a0f";
ctx.fillRect(0, 0, canvas.width, canvas.height);      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]!;
        particle.move();
        particle.draw(ctx, drawAsPoints);

        if (particle.isKilled) {
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

      // Mouse displacement/scatter interaction on right click or active press
      if (mouseRef.current.isPressed && interactiveMode) {
        particles.forEach((particle) => {
          const distance = Math.sqrt(
            Math.pow(particle.pos.x - mouseRef.current.x, 2) +
              Math.pow(particle.pos.y - mouseRef.current.y, 2)
          );
          if (distance < (mouseRef.current.isRightClick ? 90 : 50)) {
            particle.kill(canvas.width, canvas.height);
          }
        });
      }

      // Auto cycle word sequence if enabled (for hero section)
      if (autoCycle && wordSequenceRef.current && wordSequenceRef.current.length > 0) {
        frameCountRef.current++;
        if (frameCountRef.current % cycleInterval === 0) {
          wordIndexRef.current = (wordIndexRef.current + 1) % wordSequenceRef.current.length;
          const nextW = wordSequenceRef.current[wordIndexRef.current] || activeWordRef.current;
          activeWordRef.current = nextW;
          triggerNextWord(nextW);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    triggerNextWord(activeWordRef.current);
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (interactiveMode) {
        e.preventDefault();
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", resize);
    };
  }, [cycleInterval, autoCycle, interactiveMode]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-[#0a0a0f]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      {/* Subtle particle status overlay */}
      <div className="absolute bottom-3 right-4 text-[10px] text-zinc-500/60 font-mono pointer-events-none select-none">
        {particleCount} PARTICLES | FPS 60
      </div>
    </div>
  );
}

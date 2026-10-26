import { useEffect, useRef, useState } from "react";
import { loadSafeCanvasImage, normalizeImageUrl, isLikelyImageUrl } from "../utils/imageUrlResolver";
import { registerParticleInteraction } from "../utils/notificationTracker";
import { PARTICLE_COLOR_PALETTE, type ParticleCanvasManagerProps } from "./LegacyParticleCanvas";
import { ParticleField, sampleTargets } from "./particles/ParticleField";
import { buildShape, isShapeItem, shapeNameOf } from "./particles/shapes";

interface WebGLParticleCanvasProps extends ParticleCanvasManagerProps {
  /** Called when this device can't run the GPU engine well; the parent falls back to the 2D engine */
  onEngineFailure: (reason: string) => void;
}

// Particle budget per device class, scaled down further if the frame rate drops
const getBaseBudget = () => {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  let budget = minDim <= 768 || coarse ? 16000 : 60000;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory && memory <= 4) budget *= 0.6;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) budget *= 0.75;
  return budget;
};
const PERF_SCALES = [1, 0.6, 0.36];
const LOWEST_PERF = PERF_SCALES.length - 1;

/**
 * Lite mode for devices that can't afford the full effect: fewest particles, 30fps cap,
 * no tilt, spin, swirl or hover, and the shape freezes once formed. Chosen up front for
 * Data Saver and clearly weak hardware; also entered later on low battery or sustained low fps.
 */
const prefersLite = () => {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return Boolean(
    nav.connection?.saveData ||
      (nav.deviceMemory && nav.deviceMemory <= 2) ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)
  );
};
const INTENSITY_SCALE = { soft: 0.6, normal: 1, vibrant: 1.3 } as const;

export function WebGLParticleCanvas({
  currentWord,
  wordSequence,
  autoCycle = false,
  cycleInterval = 280,
  intensity = "normal",
  interactiveMode = true,
  mode = "text",
  imageUrl,
  onImageError,
  showBackdrop = false,
  onEngineFailure,
}: WebGLParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const wordIndexRef = useRef(0);
  const loadIdRef = useRef(0);
  const lastProcessedKeyRef = useRef("");
  const lastColorIndexRef = useRef(-1);
  const perfLevelRef = useRef(0);
  const liteRef = useRef(false);
  // The first shape forms while the page is still loading, so it uses half the particles
  const firstMorphRef = useRef(true);
  const [lite, setLite] = useState(false);
  // True while an image is downloading, so the auto-cycle waits for it instead of skipping ahead
  const imageLoadingRef = useRef(false);
  // Shapes hold longer than words so the spin can be seen
  const showingShapeRef = useRef(false);

  const formationStateRef = useRef<"forming" | "holding">("forming");
  const settledTimeRef = useRef(0);
  const formingStartTimeRef = useRef(0);

  const activeWordRef = useRef(currentWord);
  const wordSequenceRef = useRef(wordSequence);
  wordSequenceRef.current = wordSequence;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const imageUrlRef = useRef(imageUrl);
  imageUrlRef.current = imageUrl;
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  const onImageErrorRef = useRef(onImageError);
  onImageErrorRef.current = onImageError;
  const onEngineFailureRef = useRef(onEngineFailure);
  onEngineFailureRef.current = onEngineFailure;
  // Read through refs so the engine is created once; rebuilding it would throw away every particle
  const autoCycleRef = useRef(autoCycle);
  autoCycleRef.current = autoCycle;
  const cycleIntervalRef = useRef(cycleInterval);
  cycleIntervalRef.current = cycleInterval;
  const interactiveRef = useRef(interactiveMode);
  interactiveRef.current = interactiveMode;

  const [particleCount, setParticleCount] = useState(0);
  const [fpsDisplay, setFpsDisplay] = useState(60);

  const budget = () =>
    Math.round(
      getBaseBudget() * PERF_SCALES[liteRef.current ? LOWEST_PERF : perfLevelRef.current] * INTENSITY_SCALE[intensityRef.current]
    );

  const startForming = () => {
    formationStateRef.current = "forming";
    formingStartTimeRef.current = performance.now();
  };

  const triggerImageParticles = (url: string) => {
    const field = fieldRef.current;
    if (!field) return;
    const cleanUrl = normalizeImageUrl(url);
    const key = `IMG_${cleanUrl}_${field.width}_${field.height}_${intensityRef.current}_${perfLevelRef.current}`;
    if (lastProcessedKeyRef.current === key) return;
    const loadId = ++loadIdRef.current;
    imageLoadingRef.current = true;

    loadSafeCanvasImage(cleanUrl)
      .then((img) => {
        const f = fieldRef.current;
        if (loadId !== loadIdRef.current || !f) return;
        imageLoadingRef.current = false;
        lastProcessedKeyRef.current = key;

        const off = document.createElement("canvas");
        off.width = f.width;
        off.height = f.height;
        const ctx = off.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const padding = Math.min(80, Math.floor(Math.min(f.width, f.height) * 0.1));
        const scale = Math.min((f.width - padding * 2) / img.width, (f.height - padding * 2) / img.height, 1.2);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (f.width - w) / 2, (f.height - h) / 2, w, h);

        let data: ImageData;
        try {
          data = ctx.getImageData(0, 0, f.width, f.height);
        } catch {
          onImageErrorRef.current?.(
            "CORS security restricted canvas pixel reading. Try a local image upload or a CORS-enabled link."
          );
          return;
        }
        const target = sampleTargets(data.data, f.width, f.height, budget(), {
          additive: false,
          depth: 6,
          center: [f.width / 2, f.height / 2],
          size: [1.5, 2.4],
        });
        f.morph(target);
        showingShapeRef.current = false;
        setParticleCount(target.count);
        startForming();
      })
      .catch((err: Error) => {
        if (loadId !== loadIdRef.current) return;
        imageLoadingRef.current = false;
        onImageErrorRef.current?.(
          err.message ||
            "Failed to load image from URL. Please ensure it's a valid public image link or upload an image file directly."
        );
      });
  };

  const triggerNextWord = (word: string) => {
    const field = fieldRef.current;
    if (!field) return;
    const key = `TXT_${word}_${field.width}_${field.height}_${intensityRef.current}_${perfLevelRef.current}`;
    if (lastProcessedKeyRef.current === key) return;
    lastProcessedKeyRef.current = key;
    loadIdRef.current++;
    imageLoadingRef.current = false;

    const off = document.createElement("canvas");
    off.width = field.width;
    off.height = field.height;
    const ctx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Same type size and placement as the 2D engine, so section spacing still lines up
    const lengthFactor = Math.max(1, word.length / 7);
    const fontSize = Math.max(42, Math.min(140, Math.min(field.width, field.height) / (5.5 * lengthFactor)));
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${fontSize}px 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, field.width / 2, field.height / 2.3);

    let data: ImageData;
    try {
      data = ctx.getImageData(0, 0, field.width, field.height);
    } catch {
      return;
    }

    // A different palette colour from the previous word
    const paletteLen = PARTICLE_COLOR_PALETTE.length;
    let colorIndex = Math.floor(Math.random() * paletteLen);
    if (paletteLen > 1 && colorIndex === lastColorIndexRef.current) {
      colorIndex = (colorIndex + 1 + Math.floor(Math.random() * (paletteLen - 1))) % paletteLen;
    }
    lastColorIndexRef.current = colorIndex;
    const c = PARTICLE_COLOR_PALETTE[colorIndex];

    const target = sampleTargets(data.data, field.width, field.height, Math.round(budget() * (firstMorphRef.current ? 0.5 : 1)), {
      color: [c.r / 255, c.g / 255, c.b / 255],
      additive: true,
      depth: 26,
      center: [field.width / 2, field.height / 2.3],
      size: [1.2, 2.2],
    });
    field.morph(target);
    firstMorphRef.current = false;
    showingShapeRef.current = false;
    setParticleCount(target.count);
    startForming();
  };

  const triggerShape = (item: string) => {
    const field = fieldRef.current;
    if (!field) return;
    const key = `SHAPE_${item}_${field.width}_${field.height}_${intensityRef.current}_${perfLevelRef.current}`;
    if (lastProcessedKeyRef.current === key) return;
    lastProcessedKeyRef.current = key;
    loadIdRef.current++;
    imageLoadingRef.current = false;
    const target = buildShape(shapeNameOf(item), Math.round(budget() * 0.55), field.width, field.height);
    field.morph(target);
    showingShapeRef.current = true;
    setParticleCount(target.count);
    startForming();
  };

  const triggerSequenceItem = (item: string) => {
    if (isShapeItem(item)) {
      triggerShape(item);
    } else if (isLikelyImageUrl(item)) {
      triggerImageParticles(item.startsWith("IMG:") ? item.slice(4) : item);
    } else {
      activeWordRef.current = item;
      triggerNextWord(item);
    }
  };

  const retriggerCurrent = () => {
    lastProcessedKeyRef.current = "";
    if (modeRef.current === "image" && imageUrlRef.current) triggerImageParticles(imageUrlRef.current);
    else triggerSequenceItem(activeWordRef.current);
  };

  // Re-trigger particle morph when props change
  useEffect(() => {
    activeWordRef.current = currentWord;
    wordIndexRef.current = 0;
    if (!fieldRef.current) return;
    if (mode === "image" && imageUrl) triggerImageParticles(imageUrl);
    else triggerSequenceItem(currentWord);
  }, [currentWord, mode, imageUrl, intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let field: ParticleField;
    try {
      field = new ParticleField(canvas);
    } catch (err) {
      onEngineFailureRef.current(err instanceof Error ? err.message : "WebGL init failed");
      return;
    }
    fieldRef.current = field;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      field.motion = !reducedMotion?.matches && !liteRef.current;
    };
    const enterLite = (reason: string) => {
      if (liteRef.current) return;
      liteRef.current = true;
      setLite(true);
      if (import.meta.env.DEV) console.info(`[particles] Lite mode: ${reason}`);
      field.pointer.pressed = false;
      field.pointer.hover = false;
      applyMotionPreference();
      retriggerCurrent();
    };
    if (prefersLite()) {
      liteRef.current = true;
      setLite(true);
    }
    applyMotionPreference();
    reducedMotion?.addEventListener?.("change", applyMotionPreference);
    // Low battery and not charging: save power
    (navigator as Navigator & { getBattery?: () => Promise<{ charging: boolean; level: number }> })
      .getBattery?.()
      .then((battery) => {
        if (!battery.charging && battery.level <= 0.2) enterLite("low battery");
      })
      .catch(() => {});
    const sizeToWindow = () => field.resize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2));
    sizeToWindow();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeToWindow();
        retriggerCurrent();
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onEngineFailureRef.current("WebGL context lost");
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    let frame: number | undefined;
    let last = 0;
    let fps = 60;
    let lowFpsMs = 0;
    let lastFpsUpdate = 0;
    let startedAt = 0;

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      // Lite mode runs at 30fps: half the work, still smooth for particles
      if (liteRef.current && last && now - last < 31) return;
      const elapsed = last ? now - last : 16.7;
      last = now;
      if (!startedAt) startedAt = now;
      fps = fps * 0.9 + (1000 / Math.max(elapsed, 1)) * 0.1;

      // Step down the particle count on sustained low frame rate; give up on the GPU engine if even that fails
      if (now - startedAt > 1500 && !field.isAsleep && !liteRef.current) {
        if (fps < 40) {
          lowFpsMs += elapsed;
          if (lowFpsMs > 2000) {
            lowFpsMs = 0;
            if (perfLevelRef.current < LOWEST_PERF) {
              perfLevelRef.current++;
              retriggerCurrent();
            } else if (fps < 24) {
              enterLite("sustained low frame rate");
            }
          }
        } else {
          lowFpsMs = 0;
        }
      }
      if (import.meta.env.DEV && now - lastFpsUpdate > 500) {
        lastFpsUpdate = now;
        setFpsDisplay(Math.round(fps));
      }

      const stats = field.update(elapsed, now);
      field.render();
      if (import.meta.env.DEV) Object.assign(window, { __particleStats: stats, __field: field });

      // Particle-state-driven auto cycle (same rules as the 2D engine)
      const pressed = field.pointer.pressed;
      if (formationStateRef.current === "forming") {
        const settledRatio = stats.active > 0 ? stats.settled / stats.active : 0;
        if (!pressed && ((stats.active > 0 && settledRatio >= 0.98) || now - formingStartTimeRef.current > 7000)) {
          formationStateRef.current = "holding";
          settledTimeRef.current = now;
        }
      } else if (pressed) {
        startForming();
      } else if (!imageLoadingRef.current) {
        const holdDuration = Math.max(1800, Math.min(3000, cycleIntervalRef.current * 8)) * (showingShapeRef.current ? 2.2 : 1);
        const seq = wordSequenceRef.current;
        if (autoCycleRef.current && modeRef.current === "text" && seq && seq.length > 0 && now - settledTimeRef.current >= holdDuration) {
          wordIndexRef.current = (wordIndexRef.current + 1) % seq.length;
          triggerSequenceItem(seq[wordIndexRef.current] || activeWordRef.current);
        }
      }
    };

    // Form the first shape once Space Grotesk has loaded, so it isn't drawn in a fallback font and
    // then re-formed a moment later. Don't wait more than 1.5s; if the font arrives after that, redraw.
    let disposed = false;
    let firstFormed = false;
    const formFirst = () => {
      if (disposed || firstFormed) return;
      firstFormed = true;
      if (modeRef.current === "image" && imageUrlRef.current) triggerImageParticles(imageUrlRef.current);
      else triggerSequenceItem(wordSequenceRef.current?.[0] || activeWordRef.current);
    };
    const fontTimer = setTimeout(formFirst, 1500);
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (disposed) return;
          if (!firstFormed) {
            clearTimeout(fontTimer);
            formFirst();
          } else if (modeRef.current === "text") {
            retriggerCurrent();
          }
        })
        .catch(formFirst);
    } else {
      formFirst();
    }
    frame = requestAnimationFrame(animate);

    // Pause the render loop while the tab is hidden to save battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = undefined;
      } else if (!frame) {
        last = 0;
        frame = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const isHeroViewport = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        return rect.bottom > 100 && rect.top <= window.innerHeight * 0.5;
      }
      return window.scrollY < window.innerHeight * 0.85;
    };

    let pressStart = 0;
    let pressX = 0;
    let pressY = 0;
    let dragThrottle = 0;
    let pressId = -1;
    const canInteract = () => interactiveRef.current && !liteRef.current;

    // Mouse: a hover field anywhere, press-to-scatter and click shockwaves in the hero.
    // Touch (hero only): drag sideways to scatter, tap for a shockwave; vertical swipes still scroll.
    const handleMove = (e: PointerEvent) => {
      if (!canInteract()) return;
      if (e.pointerType !== "mouse") {
        if (field.pointer.pressed && e.pointerId === pressId) {
          field.pointer.x = e.clientX;
          field.pointer.y = e.clientY;
          field.wake();
        }
        return;
      }
      field.pointer.x = e.clientX;
      field.pointer.y = e.clientY;
      field.pointer.hover = true;
      field.pointer.movedAt = performance.now();
      field.setTiltFromPointer(e.clientX, e.clientY);
      if (field.pointer.pressed) {
        if (!isHeroViewport()) {
          field.pointer.pressed = false;
          return;
        }
        const now = Date.now();
        if (now - dragThrottle > 250) {
          dragThrottle = now;
          registerParticleInteraction("drag", 250);
        }
      }
    };
    const handleDown = (e: PointerEvent) => {
      if (e.button !== 0 || !canInteract() || !isHeroViewport()) return;
      pressId = e.pointerId;
      field.pointer.x = e.clientX;
      field.pointer.y = e.clientY;
      field.pointer.pressed = true;
      pressStart = Date.now();
      pressX = e.clientX;
      pressY = e.clientY;
    };
    const handleUp = (e: PointerEvent) => {
      if (e.button !== 0 || !field.pointer.pressed || e.pointerId !== pressId) return;
      const held = Date.now() - pressStart;
      const tapSlop = e.pointerType === "mouse" ? 6 : 12;
      if (held < 250 && Math.hypot(e.clientX - pressX, e.clientY - pressY) < tapSlop) {
        field.burst(e.clientX, e.clientY);
        registerParticleInteraction("burst");
      } else if (held > 400) {
        registerParticleInteraction("drag", held);
      }
      field.pointer.pressed = false;
    };
    const handleLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) field.pointer.hover = false;
    };
    // The browser took over the touch to scroll
    const handleCancel = (e: PointerEvent) => {
      if (e.pointerId === pressId) field.pointer.pressed = false;
    };
    const handleBlur = () => {
      field.pointer.pressed = false;
      field.pointer.hover = false;
    };

    // Fast scrolling stirs the particles into a swarm
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      field.agitate(dy / 140);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("pointermove", handleMove, { capture: true, passive: true });
    window.addEventListener("pointerdown", handleDown, { capture: true });
    window.addEventListener("pointerup", handleUp, { capture: true });
    window.addEventListener("pointercancel", handleCancel, { capture: true });
    document.addEventListener("mouseout", handleLeave);
    window.addEventListener("blur", handleBlur);

    return () => {
      disposed = true;
      clearTimeout(fontTimer);
      if (frame) cancelAnimationFrame(frame);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      reducedMotion?.removeEventListener?.("change", applyMotionPreference);
      window.removeEventListener("pointermove", handleMove, { capture: true });
      window.removeEventListener("pointerdown", handleDown, { capture: true });
      window.removeEventListener("pointerup", handleUp, { capture: true });
      window.removeEventListener("pointercancel", handleCancel, { capture: true });
      document.removeEventListener("mouseout", handleLeave);
      window.removeEventListener("blur", handleBlur);
      field.dispose();
      fieldRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-[#0a0a0f]" style={{ touchAction: "pan-y" }}>
      {/* Portrait backdrop (hero only, fades out on scroll) */}
      <div
        aria-hidden="true"
        className="ascii-hero-backdrop pointer-events-none absolute inset-0"
        style={{ opacity: showBackdrop ? 1 : 0 }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="relative block w-full h-full cursor-crosshair" />
      {import.meta.env.DEV && (
        <div className="absolute bottom-3 right-4 text-[9px] text-zinc-600/70 font-mono tracking-wider pointer-events-none select-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/70 inline-block"></span>
          <span>{lite ? "WEBGL LITE" : "WEBGL"}</span>
          <span className="text-zinc-700">/</span>
          <span>{particleCount} PTS</span>
          <span className="text-zinc-700">/</span>
          <span>{fpsDisplay} FPS</span>
        </div>
      )}
    </div>
  );
}

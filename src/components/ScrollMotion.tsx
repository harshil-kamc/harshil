import React, { useEffect, useRef, useState } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** True when the visitor has asked for reduced motion; follows changes to the setting */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.(REDUCED_MOTION).matches
  );
  useEffect(() => {
    const mql = window.matchMedia?.(REDUCED_MOTION);
    if (!mql) return;
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animate in from below. Off for the hero, which is already on screen at load */
  enter?: boolean;
}

/**
 * Scroll-linked depth transition for a section's content: it rises out of a slight
 * backward tilt as it enters, and recedes upward as it leaves, so sections hand over
 * to each other instead of simply scrolling past.
 * Positions are measured from layout (not the transformed box) to avoid feedback, and the
 * transform is removed entirely at rest, so fixed-position children and hit-testing are unaffected.
 */
export function Reveal({ children, className, enter = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) {
      el.style.opacity = "";
      el.style.transform = "";
      return;
    }

    let docTop = 0;
    let height = 0;
    const measure = () => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      docTop = top;
      height = el.offsetHeight;
    };

    let frame = 0;
    const apply = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = docTop - window.scrollY;
      // Entering: element top travels from the viewport bottom to 55% of the viewport
      const inT = enter ? easeOut((vh - top) / (vh * 0.45)) : 1;
      // Leaving: element bottom travels from 45% of the viewport to the top
      const outT = easeOut((vh * 0.45 - (top + height)) / (vh * 0.45));

      if (inT >= 1 && outT <= 0) {
        el.style.opacity = "";
        el.style.transform = "";
        return;
      }
      const opacity = Math.min(0.15 + 0.85 * inT, 1 - 0.8 * outT);
      const y = (1 - inT) * 110 - outT * 80;
      const scale = (0.92 + 0.08 * inT) * (1 - 0.06 * outT);
      const rotateX = (1 - inT) * 16 - outT * 8;
      el.style.opacity = String(opacity);
      el.style.transform = `perspective(1600px) translateY(${y}px) scale(${scale}) rotateX(${rotateX}deg)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.style.transformOrigin = "50% 0%";
    measure();
    apply();
    const resizeObserver = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resizeObserver.observe(el);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enter, reduceMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Page progress bar across the top of the screen */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp01(window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-40 origin-left bg-gradient-to-r from-[#00F0FF] to-[#A78BFA] pointer-events-none transition-transform duration-150 ease-out"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

import { useEffect, useRef, useState } from "react";

interface IntroOverlayProps {
  /** How long the particles get to condense into the name before the hero is revealed */
  duration: number;
  onDone: () => void;
}

/**
 * Controls for the opening sequence. The particle engine draws the intro itself
 * (dust condensing into the name); this only adds a progress line and a way out.
 * The clock starts once the display font is ready (or after 1.5s), which is when the
 * particles start forming. Any scroll, Skip, Esc, Enter or Space ends it early.
 */
export function IntroOverlay({ duration, onDone }: IntroOverlayProps) {
  const [started, setStarted] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const start = () => {
      if (cancelled || timer) return;
      setStarted(true);
      timer = setTimeout(finish, duration);
    };
    const fallback = setTimeout(start, 1500);
    document.fonts?.ready.then(start, start);

    const handleKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) finish();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("touchmove", finish, { passive: true });
    window.addEventListener("scroll", finish, { passive: true });
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      if (timer) clearTimeout(timer);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchmove", finish);
      window.removeEventListener("scroll", finish);
    };
  }, [duration]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none flex items-end justify-between gap-4 px-5 sm:px-8 pb-6 sm:pb-8">
      <div className="flex items-center gap-3">
        <div className="relative h-px w-24 sm:w-32 bg-white/10 overflow-hidden" aria-hidden="true">
          {started && (
            <div
              className="absolute inset-y-0 left-0 bg-[#00F0FF]"
              style={{ animation: `intro-progress ${duration}ms linear forwards` }}
            />
          )}
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400">Portfolio</span>
      </div>
      <button
        type="button"
        onClick={finish}
        className="pointer-events-auto text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors px-2 py-1.5 cursor-pointer"
      >
        Skip intro
      </button>
      <style>{`@keyframes intro-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}

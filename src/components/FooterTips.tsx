import { useState, useEffect } from "react";

interface FooterTipsProps {
  onOpenPlayground?: () => void;
}

const TIPS: { text: string; action?: "hero" | "lab" }[] = [
  {
    text: "💥 Tip: Click or tap the particles at the top of the page to send a shockwave",
    action: "hero"
  },
  {
    text: "✨ Tip: You can create your own particle formations in Particle Lab",
    action: "lab"
  },
  {
    text: "🖱️ Tip: Move your cursor over any particle word to ripple it, and watch it tilt toward you",
  },
  {
    text: "🖼️ Tip: You can upload and render your own custom images in Particle Lab",
    action: "lab"
  },
  {
    text: "🔤 Tip: You can display any custom text on screen with particles via Particle Lab",
    action: "lab"
  },
  {
    text: "🏆 Tip: Wait a moment in Competitions and Skills to see the particles form 3D shapes",
  }
];

export function FooterTips({ onOpenPlayground }: FooterTipsProps) {
  const [index, setIndex] = useState<number>(0);
  const [phase, setPhase] = useState<"active" | "exit" | "enter">("active");

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Slide out to left
      setPhase("exit");

      setTimeout(() => {
        // 2. Change tip index and position offscreen right
        setIndex((prev) => (prev + 1) % TIPS.length);
        setPhase("enter");

        // 3. Slide in from right to center
        setTimeout(() => {
          setPhase("active");
        }, 50);
      }, 400);
    }, 10000); // 10 seconds per tip

    return () => clearInterval(interval);
  }, []);

  const currentTip = TIPS[index];
  const TipTag = currentTip.action ? "button" : "div";

  const handleClick = () => {
    if (currentTip.action === "hero") {
      const hero = document.getElementById("hero");
      if (hero) hero.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentTip.action === "lab" && onOpenPlayground) {
      onOpenPlayground();
    }
  };

  return (
    <div className="w-full overflow-hidden py-2 flex items-center justify-center select-none">
      <TipTag
        {...(currentTip.action ? { type: "button" as const, onClick: handleClick } : {})}
        className={`transition-all ${
          phase === "enter" ? "duration-0" : "duration-500"
        } ease-out transform ${
          phase === "active"
            ? "translate-x-0 opacity-100"
            : phase === "exit"
            ? "-translate-x-10 opacity-0"
            : "translate-x-10 opacity-0"
        } ${
          currentTip.action ? "cursor-pointer hover:text-[#00F0FF]" : ""
        } text-xs sm:text-sm text-zinc-400/90 text-center font-normal tracking-wide max-w-xl px-4`}
      >
        <span>{currentTip.text}</span>
      </TipTag>
    </div>
  );
}

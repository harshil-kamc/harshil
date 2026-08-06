import { HARSHIL_BIO } from "../data/portfolioData";
import { ArrowDown, Sparkles, Code, Terminal, Send } from "lucide-react";

interface HeroSectionProps {
  onOpenPlayground: () => void;
}

export function HeroSection({ onOpenPlayground }: HeroSectionProps) {
  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 pt-32 pb-12 z-10 pointer-events-none"
    >
      <div className="my-auto max-w-4xl mx-auto space-y-6 pointer-events-auto">
        {/* Top Floating Badge */}
        
<div className="h-180" />
        {/* Hero Title Overlay */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
            HARSHIL
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-emerald-400/90 tracking-wide font-mono">
            {HARSHIL_BIO.role}
          </p>
        </div>

        {/* Tagline Box */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300/90 leading-relaxed bg-zinc-950/60 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
          {HARSHIL_BIO.tagline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={scrollToAbout}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
          >
            <Terminal className="w-4 h-4" />
            Explore Portfolio
          </button>

          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-white font-medium text-sm backdrop-blur-xl transition-all shadow-xl hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Launch Particle Lab
          </button>
        </div>
      </div>

      {/* Scroll Down Hint Indicator */}
      <div className="pointer-events-auto flex flex-col items-center gap-2 text-zinc-400 text-xs font-mono animate-bounce">
        <span>SCROLL DOWN</span>
        <button
          onClick={scrollToAbout}
          className="p-2 rounded-full bg-zinc-900/80 border border-white/10 text-emerald-400 hover:text-white transition-colors"
          aria-label="Scroll to About Section"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

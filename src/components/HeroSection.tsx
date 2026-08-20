import { HARSHIL_BIO } from "../data/portfolioData";
import { ArrowDown, Sparkles } from "lucide-react";

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
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 pt-28 pb-12 z-10 pointer-events-none"
    >
      <div className="my-auto max-w-4xl mx-auto space-y-6 pointer-events-auto">
        <div className="h-140" />

        {/* Hero Title Overlay */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
            {HARSHIL_BIO.fullName}
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-emerald-400/90 tracking-wide font-mono">
            {HARSHIL_BIO.role}
          </p>
        </div>

        {/* Tagline Box */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300/90 leading-relaxed bg-zinc-950/40 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
          {HARSHIL_BIO.tagline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950/40 hover:bg-white/10 border border-white/15 text-white font-medium text-sm backdrop-blur-sm transition-all shadow-xl hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Launch Particle Lab
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-xs text-zinc-400 font-mono animate-bounce pb-2">
       <br/><br/> <span>Scroll down for more details</span>
        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
      </div>
    </section>
  );
}

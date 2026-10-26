import { HARSHIL_BIO } from "../data/portfolioData";
import { ArrowDown, FileText, Sparkles } from "lucide-react";
import { Reveal } from "./ScrollMotion";

interface HeroSectionProps {
  onOpenPlayground: () => void;
  onOpenResume: () => void;
  /** False during the opening intro, while the particles form the name */
  revealed?: boolean;
}

export function HeroSection({ onOpenPlayground, onOpenResume, revealed = true }: HeroSectionProps) {
  return (
    <section
      id="hero"
      inert={!revealed}
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 pt-28 pb-12 z-10 pointer-events-none touch-pan-y"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(18px)",
        transition: "opacity 900ms ease, transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Reveal enter={false} className="my-auto max-w-4xl mx-auto space-y-6 pointer-events-auto">
        <div className="h-140" />

        {/* Hero Title Overlay */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#F5F5F5] leading-none">
            {HARSHIL_BIO.fullName}
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-[#00F0FF] tracking-wide font-mono drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            {HARSHIL_BIO.role}
          </p>
        </div>

        {/* Tagline Box */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300/90 leading-relaxed p-4 sm:p-6 rounded-3xl">
          {HARSHIL_BIO.tagline}
        </p>

        {/* Social Media Logos as Buttons (No pills, no borders, logos react directly) */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2 flex-wrap">
          {/* GitHub Original Icon */}
          <a
            href={HARSHIL_BIO.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="social-glow [--glow:rgba(255,255,255,0.45)] w-9 h-9 sm:w-10 sm:h-10 text-zinc-100 hover:text-white cursor-pointer inline-flex items-center justify-center"
          >
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 fill-current"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* LinkedIn Original Icon */}
          <a
            href={HARSHIL_BIO.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
            className="social-glow [--glow:rgba(56,140,230,0.75)] w-9 h-9 sm:w-10 sm:h-10 text-[#1D7FE0] hover:text-[#38BDF8] cursor-pointer inline-flex items-center justify-center"
          >
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>

          {/* WhatsApp Original Icon */}
          <a
            href={`https://wa.me/${HARSHIL_BIO.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Message"
            title="WhatsApp"
            className="social-glow [--glow:rgba(37,211,102,0.7)] w-9 h-9 sm:w-10 sm:h-10 text-[#25D366] hover:text-[#4ADE80] cursor-pointer inline-flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
              viewBox="0 0 16 16"
            >
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </a>

          {/* Email Original Icon */}
          <a
            href={`mailto:${HARSHIL_BIO.email}`}
            aria-label="Direct Email"
            title="Gmail / Email"
            className="social-glow [--glow:rgba(234,67,53,0.65)] w-9 h-9 sm:w-10 sm:h-10 cursor-pointer inline-flex items-center justify-center"
          >
            <svg
              className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5"
              viewBox="0 0 32 32"
            >
              <path d="M16.58,19.1068l-12.69-8.0757A3,3,0,0,1,7.1109,5.97l9.31,5.9243L24.78,6.0428A3,3,0,0,1,28.22,10.9579Z" fill="#ea4435"/>
              <path d="M25.5,5.5h4a0,0,0,0,1,0,0v18a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V7.5a2,2,0,0,1,2-2Z" fill="#00ac47" transform="translate(53.0001 32.0007) rotate(180)"/>
              <path d="M29.4562,8.0656c-.0088-.06-.0081-.1213-.0206-.1812-.0192-.0918-.0549-.1766-.0823-.2652a2.9312,2.9312,0,0,0-.0958-.2993c-.02-.0475-.0508-.0892-.0735-.1354A2.9838,2.9838,0,0,0,28.9686,6.8c-.04-.0581-.09-.1076-.1342-.1626a3.0282,3.0282,0,0,0-.2455-.2849c-.0665-.0647-.1423-.1188-.2146-.1771a3.02,3.02,0,0,0-.24-.1857c-.0793-.0518-.1661-.0917-.25-.1359-.0884-.0461-.175-.0963-.267-.1331-.0889-.0358-.1837-.0586-.2766-.0859s-.1853-.06-.2807-.0777a3.0543,3.0543,0,0,0-.357-.036c-.0759-.0053-.1511-.0186-.2273-.018a2.9778,2.9778,0,0,0-.4219.0425c-.0563.0084-.113.0077-.1689.0193a33.211,33.211,0,0,0-.5645.178c-.0515.022-.0966.0547-.1465.0795A2.901,2.901,0,0,0,23.5,8.5v5.762l4.72-3.3043a2.8878,2.8878,0,0,0,1.2359-2.8923Z" fill="#ffba00"/>
              <path d="M5.5,5.5h0a3,3,0,0,1,3,3v18a0,0,0,0,1,0,0h-4a2,2,0,0,1-2-2V8.5a3,3,0,0,1,3-3Z" fill="#4285f4"/>
              <path d="M2.5439,8.0656c.0088-.06.0081-.1213.0206-.1812.0192-.0918.0549-.1766.0823-.2652A2.9312,2.9312,0,0,1,2.7426,7.32c.02-.0475.0508-.0892.0736-.1354A2.9719,2.9719,0,0,1,3.0316,6.8c.04-.0581.09-.1076.1342-.1626a3.0272,3.0272,0,0,1,.2454-.2849c.0665-.0647.1423-.1188.2147-.1771a3.0005,3.0005,0,0,1,.24-.1857c.0793-.0518.1661-.0917.25-.1359A2.9747,2.9747,0,0,1,4.3829,5.72c.089-.0358.1838-.0586.2766-.0859s.1853-.06.2807-.0777a3.0565,3.0565,0,0,1,.357-.036c.076-.0053.1511-.0186.2273-.018a2.9763,2.9763,0,0,1,.4219.0425c.0563.0084.113.0077.169.0193a2.9056,2.9056,0,0,1,.286.0888,2.9157,2.9157,0,0,1,.2785.0892c.0514.022.0965.0547.1465.0795a2.9745,2.9745,0,0,1,.3742.21A2.9943,2.9943,0,0,1,8.5,8.5v5.762L3.78,10.9579A2.8891,2.8891,0,0,1,2.5439,8.0656Z" fill="#c52528"/>
            </svg>
          </a>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenPlayground}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950/60 hover:bg-[#0891B2]/20 border border-[#00F0FF]/30 hover:border-[#00F0FF] text-white font-medium text-sm backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:scale-105 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-magic text-[#00F0FF]" viewBox="0 0 16 16">
              <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z"/>
            </svg>
            Launch Particle Lab
          </button>

          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950/60 hover:bg-white/10 border border-white/20 hover:border-white/60 text-white font-medium text-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#00F0FF]" />
            View Résumé
          </button>
        </div>
      </Reveal>

      <div className="flex flex-col items-center gap-1 text-xs text-zinc-400 font-mono animate-bounce pb-2 mt-8">
        <span>Scroll down for more details</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#00F0FF]" />
      </div>
    </section>
  );
}


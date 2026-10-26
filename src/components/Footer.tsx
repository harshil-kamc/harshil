import { Heart, ArrowUp, Mail } from "lucide-react";
import { FooterTips } from "./FooterTips";
import { HARSHIL_BIO } from "../data/portfolioData";

interface FooterProps {
  onOpenPlayground?: () => void;
}

export function Footer({ onOpenPlayground }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="relative z-10 border-t border-white/10 pt-10 pb-12 px-4 mt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Closing call to action: the page should end with a way to get in touch */}
        <div className="text-center space-y-4">
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">Have an idea or an opportunity? Let's talk.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${HARSHIL_BIO.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00F0FF] text-zinc-950 text-sm font-semibold transition-colors hover:bg-[#38BDF8]"
            >
              <Mail className="w-4 h-4" />
              Email me
            </a>
            <a
              href={HARSHIL_BIO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold transition-colors hover:border-white/40"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Animated Sliding Interactive Tips */}
        <div className="flex items-center justify-center">
          <FooterTips onOpenPlayground={onOpenPlayground} />
        </div>

        {/* Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-mono pt-4 border-t border-white/5">
          <p>© {new Date().getFullYear()} Harshil Kamchetty. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-[#00F0FF] fill-current inline" />
              <span>& TypeScript Particle Physics</span>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to Top"
              title="Back to Top"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#00F0FF]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


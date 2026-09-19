import { Heart, ArrowUp } from "lucide-react";
import { FooterTips } from "./FooterTips";

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
        {/* Animated Sliding Interactive Tips */}
        <div className="flex items-center justify-center">
          <FooterTips onOpenPlayground={onOpenPlayground} />
        </div>

        {/* Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono pt-4 border-t border-white/5">
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


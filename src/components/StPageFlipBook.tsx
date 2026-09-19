import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import HTMLFlipBook from "react-pageflip";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Trophy,
  ExternalLink,
  MapPin,
  Eye,
  ShieldCheck,
  FolderOpen,
  Binary,
  Cpu,
  Award,
  CheckCircle2,
  Terminal,
  Layers,
} from "lucide-react";
import { Competition } from "../types/portfolio";
import {
  COMPETITIONS_LIST,
  COMPETITION_CERTIFICATES_DRIVE_URL,
  HARSHIL_BIO,
} from "../data/portfolioData";

export interface StPageFlipBookProps {
  onCompetitionSelect?: (comp: Competition) => void;
  className?: string;
}

export interface StPageFlipBookHandle {
  next: () => void;
  prev: () => void;
  goTo: (page: number) => void;
  reset: () => void;
}

// 4 Verified Live Event Photos for IEEE TKR Hackconquest 2.0
export const TKR_SLIDESHOW_IMAGES = [
  {
    url: "https://i.ibb.co/RTB7MpXD/1788708407972-1.jpg",
    caption: "TKR Hackconquest 2.0 Event",
  },
  {
    url: "https://i.ibb.co/DHmDMh3F/1788708414500.jpg",
    caption: "DeepSafe Live Prototype Demonstration",
  },
  {
    url: "https://i.ibb.co/N6Mbmb6x/1788708412392.jpg",
    caption: "Architecture & Verification Defense",
  },
  {
    url: "https://i.ibb.co/Rpn1zjRV/1000023362.jpg",
    caption: "24-Hour Intensive Onsite Sprint",
  },
];

// Clean Auto-advancing Slideshow for TKR Hackconquest 2.0 (No buttons, tags, or overlays)
export function TkrSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TKR_SLIDESHOW_IMAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 select-none shadow-sm shrink-0"
      style={{ borderRadius: 0 }}
    >
      {/* Clean Full-Bleed Slides */}
      {TKR_SLIDESHOW_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
          }`}
        >
          <img
            src={img.url}
            alt={img.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * RedClothSpine - Simulates authentic textured red bookbinder cloth tape
 * pasted along the edge of cardboard books to bind all papers together.
 */
interface RedClothSpineProps {
  position?: "left" | "right";
}

export function RedClothSpine({ position = "left" }: RedClothSpineProps) {
  return (
    <div
      className={`absolute inset-y-0 ${
        position === "left" ? "left-0" : "right-0"
      } w-4 sm:w-5 z-30 pointer-events-none select-none flex flex-col justify-between overflow-hidden`}
      style={{
        backgroundColor: "#8B1818",
        backgroundImage: `linear-gradient(${
          position === "left" ? "90deg" : "270deg"
        }, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 20%, rgba(255,255,255,0.12) 50%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.65) 100%)`,
        boxShadow:
          position === "left"
            ? "2px 0 6px rgba(0,0,0,0.4), inset -1px 0 1px rgba(255,255,255,0.15)"
            : "-2px 0 6px rgba(0,0,0,0.4), inset 1px 0 1px rgba(255,255,255,0.15)",
      }}
    >
      {/* Top cloth folded edge reinforcement */}
      <div className="w-full h-3 border-b border-black/35 bg-black/20" />

      {/* Vertical cloth hinge groove / crease where the cardboard cover flexes */}
      <div
        className={`absolute inset-y-0 ${
          position === "left" ? "left-1 sm:left-1.5" : "right-1 sm:right-1.5"
        } w-[1.5px] bg-black/50 shadow-[1px_0_1px_rgba(255,255,255,0.15)]`}
      />

      {/* Bookbinding needle stitch line (dashed ivory thread) */}
      <div
        className={`absolute inset-y-0 ${
          position === "left" ? "right-1 sm:right-1.5" : "left-1 sm:left-1.5"
        } border-r-2 border-dashed border-amber-100/50 w-0`}
      />

      {/* Bottom cloth folded edge reinforcement */}
      <div className="w-full h-3 border-t border-black/35 bg-black/20" />
    </div>
  );
}

// Reusable individual book page component with forwardRef
interface PageProps {
  number: number;
  density?: "hard" | "soft";
  isLeftPage?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const BookPage = forwardRef<HTMLDivElement, PageProps>(
  ({ number, density = "soft", isLeftPage = false, className = "", style = {}, children }, ref) => {
    return (
      <div
        ref={ref}
        data-density={density}
        className={`relative w-full h-full overflow-hidden select-none bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between ${className}`}
        style={{
          boxSizing: "border-box",
          borderRadius: 0,
          ...style,
        }}
      >
        {/* Spine crease shadow for realistic book depth */}
        {density === "soft" && (
          <div
            className={`absolute inset-y-0 w-8 pointer-events-none z-20 ${
              isLeftPage
                ? "right-0 bg-gradient-to-l from-black/20 via-black/08 to-transparent"
                : "left-0 bg-gradient-to-r from-black/20 via-black/08 to-transparent"
            }`}
          />
        )}

        {/* Crisp guillotine-cut border without white smoky glaze */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        />

        {children}
      </div>
    );
  }
);

BookPage.displayName = "BookPage";

export const StPageFlipBook = forwardRef<StPageFlipBookHandle, StPageFlipBookProps>(
  ({ onCompetitionSelect, className = "" }, ref) => {
    const bookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(12);
    const [bookState, setBookState] = useState<string>("read");
    const [orientation, setOrientation] = useState<string>("landscape");
    const [bookDimensions, setBookDimensions] = useState<{ width: number; height: number }>({
      width: 375,
      height: 560,
    });

    // Responsive dimensions handler - optimizes height and width to utilize screen space
    useEffect(() => {
      const updateDimensions = () => {
        if (typeof window === "undefined") return;
        const w = window.innerWidth;
        if (w < 480) {
          setBookDimensions({ width: 310, height: 490 });
        } else if (w < 768) {
          setBookDimensions({ width: 335, height: 520 });
        } else if (w < 1200) {
          setBookDimensions({ width: 360, height: 545 });
        } else {
          setBookDimensions({ width: 375, height: 560 });
        }
      };
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const flipNext = useCallback(() => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipNext();
      }
    }, []);

    const flipPrev = useCallback(() => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipPrev();
      }
    }, []);

    const goToPage = useCallback((index: number) => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().turnToPage(index);
      }
    }, []);

    const resetBook = useCallback(() => {
      if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().turnToPage(0);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      next: flipNext,
      prev: flipPrev,
      goTo: goToPage,
      reset: resetBook,
    }));

    const handleFlip = useCallback((e: any) => {
      const idx = typeof e?.data === "number" ? e.data : 0;
      setCurrentPage(idx);
    }, []);

    const handleChangeState = useCallback((e: any) => {
      const state = typeof e?.data === "string" ? e.data : "read";
      setBookState(state);
    }, []);

    const handleChangeOrientation = useCallback((e: any) => {
      const orient = typeof e?.data === "string" ? e.data : "landscape";
      setOrientation(orient);
    }, []);

    const handleInit = useCallback((e: any) => {
      if (bookRef.current?.pageFlip) {
        setPageCount(bookRef.current.pageFlip().getPageCount() || 12);
        setCurrentPage(bookRef.current.pageFlip().getCurrentPageIndex() || 0);
      }
    }, []);

    // Keyboard Arrow navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") flipNext();
        if (e.key === "ArrowLeft") flipPrev();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [flipNext, flipPrev]);

    const FlipBookComponent = HTMLFlipBook as any;

    return (
      <div
        ref={containerRef}
        className={`w-full flex flex-col items-center justify-center py-4 select-none ${className}`}
      >
        {/* Global style override enforcing zero border radius across StPageFlip canvases and wrappers */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .stpageflip-book-shadow,
            .stpageflip-book-shadow div,
            .stpageflip-book-shadow canvas,
            .stpageflip-book-shadow .st-page-wrapper,
            .stpageflip-book-shadow .page,
            .stpageflip-book-shadow .page-wrapper {
              border-radius: 0px !important;
            }
          `
        }} />

        {/* Book Viewport Container */}
        <div className="relative flex items-center justify-center min-h-[580px] w-full max-w-[880px] mx-auto py-2">
          {/* Cyberpunk Ambient Underglow matching portfolio #00F0FF */}
          <div
            className="absolute -bottom-8 w-4/5 h-14 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{
              opacity: currentPage > 0 && currentPage < pageCount - 1 ? 0.85 : 0.4,
            }}
          />

          <FlipBookComponent
            ref={bookRef}
            width={bookDimensions.width}
            height={bookDimensions.height}
            size="fixed"
            minWidth={290}
            maxWidth={440}
            minHeight={450}
            maxHeight={640}
            drawShadow={true}
            maxShadowOpacity={0.7}
            showCover={true}
            flippingTime={900}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            showPageCorners={true}
            disableFlipByClick={false}
            mobileScrollSupport={true}
            clickEventForward={true}
            useMouseEvents={true}
            className="stpageflip-book-shadow cursor-grab active:cursor-grabbing mx-auto shadow-2xl"
            style={{ margin: "0 auto", borderRadius: 0 }}
            onFlip={handleFlip}
            onChangeState={handleChangeState}
            onChangeOrientation={handleChangeOrientation}
            onInit={handleInit}
          >
            {/* ========================================================================= */}
            {/* PAGE 1: HARD FRONT COVER - CARDBOARD COVER WITH RED CLOTH BINDING SPINE  */}
            {/* ========================================================================= */}
            <BookPage
              number={1}
              density="hard"
              className="border-2 border-stone-900 text-stone-950 flex flex-col justify-between shadow-2xl relative overflow-hidden pl-12 sm:pl-16 pr-5 sm:pr-6 py-5 sm:py-6"
              style={{ backgroundColor: "#D4BE9E" }}
            >
              {/* Authentic Red Cloth Binding Spine pasted down the left edge */}
              <RedClothSpine position="left" />

              {/* Natural Kraft Paperboard / Pressed Cardboard Fibers */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
                style={{
                  backgroundImage: `
                    radial-gradient(#4a3520 0.85px, transparent 0.85px),
                    radial-gradient(#2d1e10 0.65px, transparent 0.65px)
                  `,
                  backgroundSize: "9px 9px, 17px 17px",
                  backgroundPosition: "0 0, 5px 8px",
                }}
              />

              {/* Subtle background tech grid watermark */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Top Header: System Classification & Barcode */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#00F0FF] border border-black shadow-[0_0_8px_#00F0FF] animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                </div>
              </div>

              {/* Central Geometric Cyber-Crest & High-Impact Typography - Fills space effectively */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-4 text-center space-y-3.5">
                {/* Bespoke Holographic Cybernetic Emblem */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  {/* Concentric Rotating Reticle Ring */}
                  <div className="absolute inset-0 border border-dashed border-zinc-900/60 rounded-full animate-[spin_24s_linear_infinite]" />
                  <div className="absolute inset-2 border border-zinc-950" />
                  <div className="absolute inset-3.5 bg-zinc-950 text-[#00F0FF] flex items-center justify-center shadow-lg border border-[#00F0FF]/40">
                    <Trophy className="w-9 h-9 text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
                  </div>
                  {/* Hologram Corner Brackets */}
                  <span className="absolute -top-1 -left-1 text-[11px] font-mono text-black font-bold">┌</span>
                  <span className="absolute -top-1 -right-1 text-[11px] font-mono text-black font-bold">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-[11px] font-mono text-black font-bold">└</span>
                  <span className="absolute -bottom-1 -right-1 text-[11px] font-mono text-black font-bold">┘</span>
                  {/* Tech Pips */}
                  <span className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-1.5 h-1.5 bg-[#00F0FF] border border-black" />
                  <span className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-1.5 h-1.5 bg-[#00F0FF] border border-black" />
                </div>

                {/* Cyberpunk Title */}
                <div>
                  <div className="inline-block px-2 py-0.5 bg-stone-900/10 border border-stone-800 text-[9px] font-mono font-black text-stone-900 tracking-widest uppercase mb-1">
                    CLASSIFIED HACKATHON MONOGRAPH
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950 font-sans uppercase leading-none">
                    HACKATHON
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-stone-950 via-stone-800 to-[#0891B2]">
                      CHRONICLES
                    </span>
                  </h1>
                  <p className="text-[11px] text-stone-800 font-mono mt-1.5 font-bold tracking-tight px-1">
                    RAPID ENGINEERING SPRINT ARCHIVES & PODIUM VICTORIES
                  </p>
                </div>

                {/* Author Badge matching Harshil Kamchetty */}
                <div className="inline-flex flex-col items-center bg-stone-900/10 border border-stone-800/40 p-2 text-stone-950 shadow-sm w-full max-w-[270px] mx-auto">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-black tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-[#0891B2]" />
                    <span>{HARSHIL_BIO.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-stone-700 mt-0.5">
                    <span>CSIT • MVSR ENGG</span>
                    <span className="text-[#0891B2]">■</span>
                    <span>GPA 9.39</span>
                  </div>
                </div>
              </div>

              {/* Bottom Cover Footer with Barcode & Interactive Turn Prompt */}
              <div className="relative z-10 border-t-2 border-stone-900 pt-3 space-y-2.5">
                {/* 4 Stat Telemetry Pillars */}
                <div className="grid grid-cols-4 gap-1 text-center font-mono">
                  <div className="bg-stone-900/10 border border-stone-800/40 py-1.5">
                    <div className="text-xs font-black text-stone-950">9</div>
                    <div className="text-[8px] text-stone-700 font-bold">SPRINTS</div>
                  </div>
                  <div className="bg-stone-900/10 border border-stone-800/40 py-1.5">
                    <div className="text-xs font-black text-[#0891B2]">3</div>
                    <div className="text-[8px] text-stone-700 font-bold">WINS</div>
                  </div>
                  <div className="bg-stone-900/10 border border-stone-800/40 py-1.5">
                    <div className="text-xs font-black text-stone-950">1.2M+</div>
                    <div className="text-[8px] text-stone-700 font-bold">CIRCUIT</div>
                  </div>
                  <div className="bg-stone-900/10 border border-stone-800/40 py-1.5">
                    <div className="text-xs font-black text-emerald-800">9.39</div>
                    <div className="text-[8px] text-stone-700 font-bold">GPA</div>
                  </div>
                </div>

                {/* Simulated Barcode & Serial */}
                <div className="flex items-center justify-between text-[9px] font-mono text-stone-800 pt-0.5 font-bold">
                  <span className="tracking-widest">||||| | |||| || ||||||</span>
                  <span>SERIAL: HK-8E38-2026</span>
                </div>

                {/* Action Prompt */}
                <div className="flex items-center justify-center gap-1.5 text-center text-[10px] font-mono font-black text-stone-950 bg-[#00F0FF]/25 py-2 px-3 border border-stone-900 shadow-sm animate-pulse cursor-pointer">
                  <span>DRAG CORNER OR CLICK TO OPEN DOSSIER</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-950" />
                </div>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 2: COMP 1 - IEEE Cyber Ektha CTF (Left Page)                         */}
            {/* ========================================================================= */}
            <BookPage number={2} isLeftPage={true} className="p-4 sm:p-5 flex flex-col justify-between border-r border-zinc-200">
              {/* Clean Header without redundant top page number */}
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 01
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  CYBERSECURITY • CTF SPRINT
                </span>
              </div>

              {/* Content Body - Fills available page space evenly */}
              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                {/* Image Plate with Increased Height */}
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                    alt="IEEE Cyber Ektha CTF"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Title & Metadata */}
                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    IEEE Cyber Ektha CTF Hackathon
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>MVSR Engineering College & IEEE</span>
                  </p>
                </div>

                {/* Telemetry Spec Readout */}
                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-zinc-950 font-bold">Reverse Eng & Forensics</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">VECTORS:</span>
                    <span className="text-[#0891B2] font-bold truncate max-w-[170px]">Reverse Eng, Web Pwn, Crypto</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">DEPLOYMENT:</span>
                    <span>24h Offline Hackathon</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  24-hour intense CTF tackling reverse engineering, web exploitation, network forensics, and cryptography challenges, securing 1st place.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Left */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 02</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 3: COMP 3 - CodeSangram Hackathon (Right Page)                       */}
            {/* ========================================================================= */}
            <BookPage number={3} isLeftPage={false} className="p-4 sm:p-5 flex flex-col justify-between border-l border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 02
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  CIVIC TECH • LOCALOOP
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                    alt="CodeSangram Hackathon"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    CodeSangram Hackathon
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>Quizcred & Unstop Platform</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">PROJECT:</span>
                    <span className="text-zinc-950 font-bold">Localoop</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-[#0891B2] font-bold">Team Representation</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">DOMAIN:</span>
                    <span>Civic Engagement Platform</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  Engineered Localoop — a civic engagement platform connecting residents with local governance initiatives and community tracking.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Right */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[2]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 03</span>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 4: COMP 4 - National AI/ML Hackathon (Left Page)                     */}
            {/* ========================================================================= */}
            <BookPage number={4} isLeftPage={true} className="p-4 sm:p-5 flex flex-col justify-between border-r border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 03
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  FINTECH AI • NEURAL PIPELINE
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                    alt="National AI/ML Hackathon"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    National AI/ML Hackathon
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>Vivriti Capital & Yuvaan</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">VECTOR:</span>
                    <span className="text-zinc-950 font-bold">Credit Risk Assessment AI</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">SCALE:</span>
                    <span className="text-[#0891B2] font-bold">Nationwide Circuit</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">STACK:</span>
                    <span>Python, ML Pipelines</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  Built predictive Machine Learning models for evaluating enterprise credit risk and borrower default probability.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Left */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 04</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[3]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 5: COMP 2 - IEEE TKR Hackconquest 2.0 (Right Page WITH SLIDESHOW)   */}
            {/* ========================================================================= */}
            <BookPage number={5} isLeftPage={false} className="p-4 sm:p-5 flex flex-col justify-between border-l border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-[#00F0FF] text-zinc-950 text-[9px] font-mono font-black border border-black">
                  PLATE // 04
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  LIVE PROOF-OF-WORK // TKR 2.0
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                {/* 4-Image Interactive Slideshow with Viewfinder Framing */}
                <TkrSlideshow />

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug flex items-center justify-between">
                    <span>IEEE TKR Hackconquest 2.0</span>
                    <span className="text-[9px] font-mono font-black text-[#0891B2] bg-cyan-50 px-2 py-0.5 border border-[#0891B2]/30">
                      4 LIVE PHOTOS
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>TKR Engineering College & IEEE</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-[#00F0FF] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">PROJECT:</span>
                    <span className="text-zinc-950 font-bold">DeepSafe</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-[#0891B2] font-bold">Full-Stack & Architecture</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">MISSION:</span>
                    <span>24h Deepfake Auth Scanner</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  24-hour sprint prototyping DeepSafe — deepfake audio/video integrity verification and metadata authenticity scanner.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Right */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[1]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Gallery & Report</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 05</span>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 6: COMP 5 - GFG Hackfest 1st Prize (Left Page)                       */}
            {/* ========================================================================= */}
            <BookPage number={6} isLeftPage={true} className="p-4 sm:p-5 flex flex-col justify-between border-r border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 05
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  GFG HACKFEST 2026 • CHAMPION
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
                    alt="GFG Hackfest"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    GeeksforGeeks Hackfest 2026
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>GeeksforGeeks Classroom, Madhapur</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-amber-500 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">HONOR:</span>
                    <span className="text-amber-700 font-black">1st Prize Winner 🏆</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">PROJECT:</span>
                    <span className="text-zinc-950 font-bold">TruthNova</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-[#0891B2] font-bold">AI Multi-Modal Debunker</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  Won 1st prize building TruthNova — an AI multi-modal disinformation and fake news debunking engine with source cross-referencing.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Left */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 06</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[4]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 7: COMP 6 - Forge Inspira 2026, IIT Hyderabad (Right Page)          */}
            {/* ========================================================================= */}
            <BookPage number={7} isLeftPage={false} className="p-4 sm:p-5 flex flex-col justify-between border-l border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 06
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  IIT HYDERABAD • ORBITHIRE
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Forge Inspira IIT Hyderabad"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    Forge Inspira 2026 (IIT Hyderabad)
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>IIT Hyderabad Campus</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">PROJECT:</span>
                    <span className="text-zinc-950 font-bold">OrbitHire</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-[#0891B2] font-bold">Frontend Developer</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">STACK:</span>
                    <span>React, Tailwind, AI Matching</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  Competed at IIT Hyderabad developing OrbitHire — an AI candidate matching and skill verification hiring ecosystem.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Right */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[5]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 07</span>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 8: COMP 7 - MYBHARAT Budget Quest State Winner (Left Page)           */}
            {/* ========================================================================= */}
            <BookPage number={8} isLeftPage={true} className="p-4 sm:p-5 flex flex-col justify-between border-r border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 07
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  NATIONAL SUMMIT • STATE WINNER
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
                    alt="MYBHARAT Budget Quest"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    MYBHARAT Budget Quest 2026
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>Ministry of Youth Affairs • Kanha Shanti Vanam</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-amber-500 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">CIRCUIT SCALE:</span>
                    <span className="text-amber-800 font-black">12+ Lakh (1.2M) Participants</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">RANKING:</span>
                    <span className="text-zinc-950 font-bold">Top 500 State Winner</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROUNDS:</span>
                    <span>Budget Quiz & Policy Essay</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  Nationwide summit with 1.2M+ participants. Won both rounds and attended the national Budget Quest summit at Kanha Shanti Vanam.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Left */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 08</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[6]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 9: COMP 8 - Aethronix Hackathon (Samavarthan 2k26) (Right Page)      */}
            {/* ========================================================================= */}
            <BookPage number={9} isLeftPage={false} className="p-4 sm:p-5 flex flex-col justify-between border-l border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 08
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  CAREER AI • SAMAVARTHAN 2K26
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                    alt="Aethronix Hackathon"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    Aethronix Hackathon (Samavarthan)
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>MVSR Engineering College</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">PROJECT:</span>
                    <span className="text-zinc-950 font-bold">PathPilot AI</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">ROLE:</span>
                    <span className="text-[#0891B2] font-bold">Backend Developer</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">STACK:</span>
                    <span>Python, FastAPI, Career Graph</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  24-hour sprint developing PathPilot AI — an intelligent career roadmap and skill gap analyzer engine with automated curriculum matching.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Right */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[7]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 09</span>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 10: COMP 9 - Secleaf Q2 CTF 2026 (Left Page)                         */}
            {/* ========================================================================= */}
            <BookPage number={10} isLeftPage={true} className="p-4 sm:p-5 flex flex-col justify-between border-r border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 09
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  INTERNATIONAL CTF • SECLEAF
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div className="relative w-full h-44 sm:h-48 overflow-hidden border-2 border-zinc-950 bg-zinc-950 shadow-sm shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80"
                    alt="Secleaf Q2 CTF"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight leading-snug">
                    Secleaf Q2 CTF 2026
                  </h3>
                  <p className="text-[11px] text-[#0891B2] font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#0891B2]" />
                    <span>Secleaf International • Online</span>
                  </p>
                </div>

                <div className="bg-zinc-100 p-2.5 border-l-2 border-zinc-950 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">TASK FORCE:</span>
                    <span className="text-zinc-950 font-bold">Ctrl Alt Del</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">TRACKS:</span>
                    <span className="text-[#0891B2] font-bold">Crypto, Pwn & Web Sec</span>
                  </div>
                  <div className="flex justify-between text-zinc-800">
                    <span className="text-zinc-500 font-semibold">SCOPE:</span>
                    <span>International Competition</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed font-sans">
                  24-hour global cybersecurity CTF solving cryptographic ciphers, memory buffer vulnerabilities, and network packet forensics.
                </p>
              </div>

              {/* Single Clean Page Number at Bottom Left */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 10</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompetitionSelect?.(COMPETITIONS_LIST[8]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#00F0FF] text-white hover:text-black text-xs font-mono font-bold transition-all shadow-sm cursor-pointer border border-zinc-950"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Report</span>
                </button>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 11: SCORECARD & TELEMETRY DASHBOARD (Right Page)                      */}
            {/* ========================================================================= */}
            <BookPage number={11} isLeftPage={false} className="p-4 sm:p-5 flex flex-col justify-between border-l border-zinc-200">
              <div className="flex items-center gap-2 border-b-2 border-zinc-950 pb-2">
                <span className="px-1.5 py-0.5 bg-zinc-950 text-[#00F0FF] text-[9px] font-mono font-black">
                  PLATE // 10
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-800 tracking-wide uppercase">
                  EXECUTIVE TELEMETRY SCORECARD
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between py-2.5 space-y-2">
                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight flex items-center justify-between">
                    <span>Hackathon Track Record</span>
                    <span className="text-[9px] font-mono font-bold text-zinc-500">
                      DEC 2025 – MAY 2026
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                    Rapid Engineering Circuit Performance Indices
                  </p>
                </div>

                {/* Scorecard Matrix */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-zinc-100 border border-zinc-300 p-2.5">
                    <div className="text-xl font-black text-zinc-950">09</div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">Hackathons</div>
                  </div>
                  <div className="bg-zinc-100 border border-zinc-300 p-2.5">
                    <div className="text-xl font-black text-[#0891B2]">03</div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">Podium Wins</div>
                  </div>
                  <div className="bg-zinc-100 border border-zinc-300 p-2.5">
                    <div className="text-xl font-black text-zinc-950">1.2M+</div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">Circuit Scale</div>
                  </div>
                  <div className="bg-zinc-100 border border-zinc-300 p-2.5">
                    <div className="text-xl font-black text-emerald-700">9.39</div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">College GPA</div>
                  </div>
                </div>

                {/* Podium Case Box */}
                <div className="bg-cyan-50/60 border border-[#0891B2]/30 p-2.5 space-y-1.5 text-[11px] font-mono">
                  <div className="text-zinc-950 font-black flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>VERIFIED PODIUM TRIUMPHS</span>
                  </div>
                  <ul className="text-zinc-800 space-y-1 text-[10px] list-disc list-inside font-medium">
                    <li>1st Place: IEEE Cyber Ektha 24h CTF</li>
                    <li>1st Prize: GFG Hackfest (TruthNova AI Debunker)</li>
                    <li>Telangana State Winner: MYBHARAT National Quest</li>
                  </ul>
                </div>

                {/* Domain Mastery Breakdown - Uses page space efficiently */}
                <div className="bg-zinc-100 border border-zinc-300 p-2.5 space-y-1.5 font-mono text-[10px]">
                  <div className="text-zinc-900 font-black uppercase text-[10px] tracking-wide">
                    ENGINEERING DOMAIN MASTERY
                  </div>
                  <div className="space-y-1 text-zinc-700">
                    <div className="flex justify-between">
                      <span>Cybersecurity & Forensics</span>
                      <span className="font-bold text-zinc-950">100%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-200">
                      <div className="h-full bg-[#0891B2] w-full" />
                    </div>
                    <div className="flex justify-between">
                      <span>Full-Stack & Systems Architecture</span>
                      <span className="font-bold text-zinc-950">96%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-200">
                      <div className="h-full bg-zinc-950 w-[96%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Clean Page Number at Bottom Right */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 font-semibold">TURN FOR CERTIFICATE VAULT →</span>
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">PAGE 11</span>
              </div>
            </BookPage>

            {/* ========================================================================= */}
            {/* PAGE 12: HARD BACK COVER - CARDBOARD COVER WITH RED CLOTH BINDING SPINE  */}
            {/* ========================================================================= */}
            <BookPage
              number={12}
              density="hard"
              className="border-2 border-stone-900 text-stone-950 flex flex-col justify-between shadow-2xl relative overflow-hidden pl-12 sm:pl-16 pr-5 sm:pr-6 py-5 sm:py-6"
              style={{ backgroundColor: "#D4BE9E" }}
            >
              {/* Authentic Red Cloth Binding Spine pasted down the left edge */}
              <RedClothSpine position="right" />

              {/* Natural Kraft Paperboard / Pressed Cardboard Fibers */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
                style={{
                  backgroundImage: `
                    radial-gradient(#4a3520 0.85px, transparent 0.85px),
                    radial-gradient(#2d1e10 0.65px, transparent 0.65px)
                  `,
                  backgroundSize: "9px 9px, 17px 17px",
                  backgroundPosition: "0 0, 5px 8px",
                }}
              />

              {/* Subtle background tech grid watermark */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Back Cover Header */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0891B2]" />
                    <span className="text-[10px] font-mono font-black tracking-widest uppercase text-stone-950">
                      CERTIFICATE CIPHER VAULT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-stone-950 text-amber-100 px-2 py-0.5">
                    ENDPLATE // 12
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-stone-700 font-bold">
                  
                  <span className="text-emerald-800 font-black">● VERIFIED PROOF</span>
                </div>
              </div>

              {/* Simulated Microchip / Smart Keycard Archive Box - Fills vertical space */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-4 text-center space-y-4">
                {/* Cyber Smartcard Contact Chip Graphic */}
                <div className="relative mx-auto w-20 h-16 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-2 border-amber-600 shadow-md p-1 flex flex-col justify-between">
                  <div className="flex justify-between border-b border-amber-600/40 pb-1">
                    <span className="w-3 h-2 border border-amber-600/60" />
                    <span className="w-5 h-2 border border-amber-600/60" />
                    <span className="w-3 h-2 border border-amber-600/60" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-amber-900" />
                  </div>
                  <div className="flex justify-between border-t border-amber-600/40 pt-1">
                    <span className="w-3 h-2 border border-amber-600/60" />
                    <span className="w-5 h-2 border border-amber-600/60" />
                    <span className="w-3 h-2 border border-amber-600/60" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-950 tracking-tight uppercase">
                    Official Drive Archive
                  </h3>
                  <p className="text-xs text-stone-800 font-mono mt-1 px-1 leading-relaxed font-semibold">
                    Direct access repository containing authenticated certificates of merit, winner awards, and verification records.
                  </p>
                </div>

                {/* Drive Link Button matching Portfolio Cyan Tone */}
                <div className="pt-1">
                  <a
                    href={COMPETITION_CERTIFICATES_DRIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-950 hover:bg-[#00F0FF] text-amber-50 hover:text-black text-xs font-mono font-black transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer border border-stone-950"
                  >
                    <FolderOpen className="w-4 h-4 text-[#00F0FF] group-hover:text-black" />
                    <span>LAUNCH DRIVE CERTIFICATE VAULT</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Back Cover Footer with Sign-off & Return Control */}
              <div className="relative z-10 border-t-2 border-stone-900 pt-2.5 flex items-center justify-between text-[10px] font-mono">
                <div className="text-left">
                  <div className="font-bold text-stone-950">{HARSHIL_BIO.fullName}</div>
                  <div className="text-stone-600 text-[9px] font-semibold">DEPT OF CSIT • MVSR</div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetBook();
                  }}
                  className="px-2.5 py-1 bg-stone-900/10 hover:bg-stone-950 hover:text-[#00F0FF] text-stone-950 font-bold border border-stone-800/40 transition-colors cursor-pointer"
                >
                  RETURN TO COVER ↺
                </button>
              </div>
            </BookPage>
          </FlipBookComponent>
        </div>

        {/* ========================================================================= */}
        {/* ENHANCED BOTTOM TOOLBAR CONTROLS                                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center gap-3 mt-6 select-none z-20">
          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={resetBook}
              disabled={currentPage === 0}
              aria-label="Return to Cover"
              className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono font-bold bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#00F0FF]" />
              <span className="hidden sm:inline">Cover</span>
            </button>

            <button
              type="button"
              onClick={flipPrev}
              disabled={currentPage === 0}
              aria-label="Previous Page"
              className="px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-mono font-bold bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-200 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Prev</span>
            </button>

            {/* Page Count Counter Indicator */}
            <div className="px-3.5 py-1.5 bg-zinc-900/95 border border-[#00F0FF]/30 text-xs font-mono text-zinc-300 shadow-sm flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-[#00F0FF]" />
              <span className="font-bold text-[#00F0FF]">
                {currentPage === 0
                  ? "Cover"
                  : currentPage >= pageCount - 1
                  ? "Back Cover"
                  : `Pages ${currentPage}–${Math.min(currentPage + 1, pageCount - 1)}`}
              </span>
              <span className="opacity-40">/</span>
              <span className="text-zinc-400">12 pages</span>
            </div>

            <button
              type="button"
              onClick={flipNext}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next Page"
              className="px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-mono font-bold bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-200 hover:text-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF]" />
            </button>
          </div>

          {/* Quick Page Jump Selector Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl">
            <button
              type="button"
              onClick={() => goToPage(0)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 0
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Cover
            </button>

            <button
              type="button"
              onClick={() => goToPage(1)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 1 || currentPage === 2
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Plates 1–2
            </button>

            <button
              type="button"
              onClick={() => goToPage(3)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 3 || currentPage === 4
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Plates 3–4 (TKR)
            </button>

            <button
              type="button"
              onClick={() => goToPage(5)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 5 || currentPage === 6
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Plates 5–6 (GFG)
            </button>

            <button
              type="button"
              onClick={() => goToPage(7)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 7 || currentPage === 8
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Plates 7–8
            </button>

            <button
              type="button"
              onClick={() => goToPage(9)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage === 9 || currentPage === 10
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Plate 9 & Scorecard
            </button>

            <button
              type="button"
              onClick={() => goToPage(11)}
              className={`px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                currentPage >= 11
                  ? "bg-[#00F0FF] text-black font-black shadow-sm"
                  : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              Vault (Back)
            </button>
          </div>
        </div>
      </div>
    );
  }
);

StPageFlipBook.displayName = "StPageFlipBook";

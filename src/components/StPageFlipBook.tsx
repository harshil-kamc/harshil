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
  Trophy,
  ExternalLink,
  MapPin,
  FolderOpen,
  ArrowUpRight,
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

// Front cover + one page per competition + season record + back cover
const PAGE_COUNT = COMPETITIONS_LIST.length + 3;
const RECORD_PAGE_INDEX = COMPETITIONS_LIST.length + 1;

const isPodium = (comp: Competition) => comp.isWinner || comp.awardRank === "1st";
const PODIUM_COUNT = COMPETITIONS_LIST.filter(isPodium).length;

const stripEmoji = (text: string) => text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s{2,}/g, " ").trim();

const shortResult = (comp: Competition) => {
  if (comp.awardRank === "1st") return "1st Place";
  if (comp.awardRank === "Winner") return "State Winner";
  return "Participant";
};

const pad2 = (n: number) => String(n).padStart(2, "0");

// Page size per viewport. The book is remounted when the bucket changes,
// because react-pageflip only reads its dimensions on mount.
const getBookSize = (viewportWidth: number) => {
  if (viewportWidth >= 1280) return { width: 460, height: 640 };
  if (viewportWidth >= 1024) return { width: 420, height: 590 };
  if (viewportWidth >= 768) return { width: 350, height: 510 };
  if (viewportWidth >= 480) return { width: 335, height: 520 };
  return { width: 310, height: 500 };
};

// Cross-fading photo plate for competitions with several event photos
export function PhotoSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((url, idx) => (
        <img
          key={url}
          src={url}
          alt={`${alt} photo ${idx + 1}`}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-2 left-2 flex gap-1">
        {images.map((url, idx) => (
          <span
            key={url}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </>
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
      } w-5 z-30 pointer-events-none select-none flex flex-col justify-between overflow-hidden`}
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
      <div className="w-full h-3 border-b border-black/35 bg-black/20" />
      <div
        className={`absolute inset-y-0 ${
          position === "left" ? "left-1.5" : "right-1.5"
        } w-[1.5px] bg-black/50 shadow-[1px_0_1px_rgba(255,255,255,0.15)]`}
      />
      <div
        className={`absolute inset-y-0 ${
          position === "left" ? "right-1.5" : "left-1.5"
        } border-r-2 border-dashed border-amber-100/50 w-0`}
      />
      <div className="w-full h-3 border-t border-black/35 bg-black/20" />
    </div>
  );
}

// Kraft paperboard colour and texture shared by both hard covers.
// Painted as layers because page-flip rewrites each page element's inline style.
function KraftTexture() {
  return (
    <>
    <div className="absolute inset-0 pointer-events-none bg-[#D4BE9E]" />
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
    </>
  );
}

// Reusable individual book page component with forwardRef
interface PageProps {
  density?: "hard" | "soft";
  isLeftPage?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const BookPage = forwardRef<HTMLDivElement, PageProps>(
  ({ density = "soft", isLeftPage = false, className = "", style = {}, children }, ref) => {
    return (
      <div
        ref={ref}
        data-density={density}
        className="relative w-full h-full overflow-hidden select-none bg-[#FAFAF7] text-zinc-900"
        style={{ boxSizing: "border-box", borderRadius: 0, ...style }}
      >
        {/* Spine crease shadow for realistic book depth */}
        {density === "soft" && (
          <div
            className={`absolute inset-y-0 w-10 pointer-events-none z-20 ${
              isLeftPage
                ? "right-0 bg-gradient-to-l from-black/20 via-black/[0.06] to-transparent"
                : "left-0 bg-gradient-to-r from-black/20 via-black/[0.06] to-transparent"
            }`}
          />
        )}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
        {/* page-flip forces display:block on the page element, so layout lives on this inner box */}
        <div className={`absolute inset-0 flex flex-col ${className}`}>{children}</div>
      </div>
    );
  }
);

BookPage.displayName = "BookPage";

// Page number on the outer edge of each page
function PageFooter({
  pageIndex,
  isLeftPage,
  children,
}: {
  pageIndex: number;
  isLeftPage: boolean;
  children?: React.ReactNode;
}) {
  const number = <span className="text-[11px] font-mono text-zinc-400 tabular-nums">p. {pad2(pageIndex + 1)}</span>;
  return (
    <div className="mt-auto shrink-0 pt-3 border-t border-zinc-300 flex items-center justify-between gap-3">
      {isLeftPage ? number : children ?? <span />}
      {isLeftPage ? children ?? <span /> : number}
    </div>
  );
}

interface CompetitionPageProps {
  comp: Competition;
  pageIndex: number;
  compact: boolean;
  onOpen?: (comp: Competition) => void;
}

const CompetitionPage = forwardRef<HTMLDivElement, CompetitionPageProps>(
  ({ comp, pageIndex, compact, onOpen }, ref) => {
    const isLeftPage = pageIndex % 2 === 1;
    const photos = comp.images && comp.images.length > 1 ? comp.images : null;
    const photo = comp.coverImage || comp.images?.[0];
    const winner = isPodium(comp);

    const facts: [string, string][] = [
      ["Result", winner && !/1st|winner/i.test(comp.result) ? shortResult(comp) : stripEmoji(comp.result)],
      comp.projectName ? ["Project", comp.projectName] : ["Focus", comp.projectOrFocus || comp.type],
      ...(comp.projectRole ? [["Role", comp.projectRole] as [string, string]] : []),
      ...(comp.teamName && !comp.teamName.startsWith("Individual") ? [["Team", comp.teamName] as [string, string]] : []),
      ...(comp.duration ? [["Format", comp.duration] as [string, string]] : []),
    ];

    return (
      <BookPage ref={ref} isLeftPage={isLeftPage} className={compact ? "p-5" : "p-7"}>
        {/* Running head */}
        <div className="flex items-baseline justify-between gap-3 pb-2.5 border-b-2 border-zinc-950">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-zinc-900">{comp.type}</span>
          <span className="text-[11px] font-mono text-zinc-500 text-right truncate">{comp.date}</span>
        </div>

        {/* Photo plate with ink stamp for podium finishes */}
        <div className={`relative w-full ${compact ? "mt-3.5" : "mt-5"} aspect-[2/1] shrink-0 overflow-hidden bg-zinc-900 border-2 border-zinc-950`}>
          {photos ? (
            <PhotoSlideshow images={photos} alt={comp.title} />
          ) : photo ? (
            <img src={photo} alt={comp.title} referrerPolicy="no-referrer" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          ) : null}
        </div>
        {winner && (
          <div className="relative h-0 z-30">
            <span
              className="absolute right-3 -top-7 px-2.5 py-1 border-[3px] border-double border-[#B4231F] text-[#B4231F] bg-[#FAFAF7]/90 text-[12px] font-black uppercase tracking-[0.14em] -rotate-6 shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
              aria-label={shortResult(comp)}
            >
              {shortResult(comp)}
            </span>
          </div>
        )}

        {/* Title block */}
        <div className={compact ? "mt-3.5" : "mt-5"}>
          <h3 className={`${compact ? "text-lg" : "text-[22px]"} font-black text-zinc-950 tracking-tight leading-[1.15] text-balance`}>
            {comp.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-[#0E7490] font-semibold flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 mt-[3px] shrink-0" />
            <span className="line-clamp-1">{comp.venue || comp.organizer}</span>
          </p>
        </div>

        {/* Facts ledger */}
        <dl className={`${compact ? "mt-3" : "mt-4"} text-[13px] shrink-0`}>
          {facts.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-dotted border-zinc-300">
              <dt className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 shrink-0">{label}</dt>
              <dd className="font-semibold text-zinc-900 text-right truncate">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex-1 min-h-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
          <p className="text-[13px] leading-relaxed text-zinc-700 line-clamp-3">{comp.description}</p>
        </div>

        <PageFooter pageIndex={pageIndex} isLeftPage={isLeftPage}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(comp);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 text-white text-[13px] font-semibold transition-colors hover:bg-[#00F0FF] hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490] cursor-pointer"
          >
            Full report
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </PageFooter>
      </BookPage>
    );
  }
);

CompetitionPage.displayName = "CompetitionPage";

export const StPageFlipBook = forwardRef<StPageFlipBookHandle, StPageFlipBookProps>(
  ({ onCompetitionSelect, className = "" }, ref) => {
    const bookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInViewRef = useRef(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [orientation, setOrientation] = useState<string>("landscape");
    const [bookSize, setBookSize] = useState(() =>
      getBookSize(typeof window !== "undefined" ? window.innerWidth : 1280)
    );
    const compact = bookSize.width < 440;

    // Remount the book with new dimensions only when the size bucket changes
    useEffect(() => {
      const handleResize = () => {
        const next = getBookSize(window.innerWidth);
        setBookSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const flipNext = useCallback(() => bookRef.current?.pageFlip?.()?.flipNext(), []);
    const flipPrev = useCallback(() => bookRef.current?.pageFlip?.()?.flipPrev(), []);
    const goToPage = useCallback((index: number) => bookRef.current?.pageFlip?.()?.flip(index), []);
    const resetBook = useCallback(() => bookRef.current?.pageFlip?.()?.turnToPage(0), []);

    useImperativeHandle(ref, () => ({
      next: flipNext,
      prev: flipPrev,
      goTo: goToPage,
      reset: () => {
        resetBook();
        setCurrentPage(0);
      },
    }));

    const handleFlip = useCallback((e: any) => {
      setCurrentPage(typeof e?.data === "number" ? e.data : 0);
    }, []);

    const handleChangeOrientation = useCallback((e: any) => {
      setOrientation(typeof e?.data === "string" ? e.data : "landscape");
    }, []);

    const handleInit = useCallback(() => {
      const flip = bookRef.current?.pageFlip?.();
      if (!flip) return;
      setCurrentPage(flip.getCurrentPageIndex() || 0);
      setOrientation(flip.getOrientation?.() || "landscape");
    }, []);

    // Arrow keys turn pages only while the book is on screen and nothing else is focused
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isInViewRef.current = entry.isIntersecting;
        },
        { threshold: 0.5 }
      );
      observer.observe(el);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInViewRef.current) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
        if (document.querySelector("[role='dialog'], #competition-detail-modal")) return;
        if (e.key === "ArrowRight") flipNext();
        if (e.key === "ArrowLeft") flipPrev();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        observer.disconnect();
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [flipNext, flipPrev]);

    const isFirst = currentPage === 0;
    const isLast = currentPage >= PAGE_COUNT - 1;

    // A closed book sits on one half of the spread; slide it to the centre
    const bookShift =
      orientation === "landscape" ? (isFirst ? -bookSize.width / 2 : isLast ? bookSize.width / 2 : 0) : 0;

    // Spread stops for the progress rail: cover, each two-page spread, back cover
    const stops: { index: number; label: string }[] = [{ index: 0, label: "Cover" }];
    if (orientation === "landscape") {
      for (let i = 1; i < PAGE_COUNT - 1; i += 2) {
        const names = [COMPETITIONS_LIST[i - 1]?.title, COMPETITIONS_LIST[i]?.title ?? "Season record"].filter(Boolean);
        stops.push({ index: i, label: names.join(" / ") });
      }
    } else {
      for (let i = 1; i < PAGE_COUNT - 1; i++) {
        stops.push({ index: i, label: COMPETITIONS_LIST[i - 1]?.title ?? "Season record" });
      }
    }
    stops.push({ index: PAGE_COUNT - 1, label: "Certificate archive" });
    const activeStop = stops.reduce((active, stop, i) => (currentPage >= stop.index ? i : active), 0);

    const pageLabel = isFirst
      ? "Cover"
      : isLast
      ? "Back cover"
      : orientation === "landscape"
      ? `Pages ${currentPage + 1}–${Math.min(currentPage + 2, PAGE_COUNT - 1)}`
      : `Page ${currentPage + 1}`;

    const FlipBookComponent = HTMLFlipBook as any;

    return (
      <div ref={containerRef} className={`w-full flex flex-col items-center justify-center py-4 select-none ${className}`}>
        {/* Zero border radius across StPageFlip canvases and wrappers */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .stpageflip-book-shadow,
              .stpageflip-book-shadow div,
              .stpageflip-book-shadow canvas {
                border-radius: 0px !important;
              }
            `,
          }}
        />

        {/* Book stage */}
        <div className="relative flex items-center justify-center w-full mx-auto" style={{ minHeight: bookSize.height + 24 }}>
          {/* Soft floor shadow and cyan underglow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl pointer-events-none transition-all duration-700"
            style={{
              bottom: -6,
              height: 40,
              width: isFirst || isLast ? bookSize.width * 0.9 : bookSize.width * 1.8,
            }}
          />
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-16 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"
            style={{
              width: isFirst || isLast ? bookSize.width : bookSize.width * 1.7,
              opacity: isFirst || isLast ? 0.35 : 0.8,
            }}
          />

          <div
            className="relative motion-safe:transition-transform motion-safe:duration-700"
            style={{
              // page-flip picks landscape/portrait from this width, so it must be the full spread
              width: `min(${bookSize.width * 2}px, 100%)`,
              transform: `translateX(${bookShift}px)`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <FlipBookComponent
              key={`${bookSize.width}x${bookSize.height}`}
              ref={bookRef}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
              minWidth={290}
              maxWidth={480}
              minHeight={450}
              maxHeight={680}
              drawShadow={true}
              maxShadowOpacity={0.6}
              showCover={true}
              flippingTime={850}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              showPageCorners={true}
              disableFlipByClick={false}
              mobileScrollSupport={true}
              clickEventForward={true}
              useMouseEvents={true}
              className="stpageflip-book-shadow cursor-grab active:cursor-grabbing mx-auto"
              style={{ margin: "0 auto", borderRadius: 0 }}
              onFlip={handleFlip}
              onChangeOrientation={handleChangeOrientation}
              onInit={handleInit}
            >
              {/* FRONT COVER: kraft cardboard with red cloth binding */}
              <BookPage
                density="hard"
                className={`border-2 border-stone-900 text-stone-950 ${compact ? "pl-12 pr-6 py-6" : "pl-16 pr-9 py-9"}`}
              >
                <RedClothSpine position="left" />
                <KraftTexture />

                <div className="relative z-10 flex items-baseline justify-between pb-3 border-b-2 border-stone-900">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]">Competition record</span>
                  <span className="text-[11px] font-mono font-bold text-stone-700 tabular-nums">2025–26</span>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                  <div className={`${compact ? "w-16 h-16" : "w-20 h-20"} bg-stone-950 flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.35)]`}>
                    <Trophy className={`${compact ? "w-8 h-8" : "w-10 h-10"} text-[#00F0FF]`} strokeWidth={1.75} />
                  </div>

                  <h2 className={`${compact ? "mt-6 text-[34px]" : "mt-8 text-[44px]"} font-black uppercase leading-[0.92] tracking-[-0.03em] text-stone-950`}>
                    Hackathon
                    <span className="block">Chronicles</span>
                  </h2>
                  <p className="mt-3 text-[13px] font-medium text-stone-800 max-w-[34ch] text-balance">
                    Sprint archives and podium finishes, December 2025 to May 2026.
                  </p>

                  <div className={`${compact ? "mt-6" : "mt-8"} w-full max-w-[280px] border border-stone-900/50 bg-stone-900/[0.07] px-4 py-2.5`}>
                    <div className="text-[13px] font-black tracking-[0.08em]">{HARSHIL_BIO.fullName}</div>
                    <div className="text-[11px] font-mono text-stone-700 mt-0.5">CSIT · MVSR Engineering College</div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t-2 border-stone-900 space-y-3">
                  <div className="grid grid-cols-3 text-center divide-x divide-stone-900/30 border border-stone-900/30 bg-stone-900/[0.06]">
                    {[
                      [String(COMPETITIONS_LIST.length), "Events"],
                      [String(PODIUM_COUNT), "Podiums"],
                      ["12L+", "Largest field"],
                    ].map(([value, label]) => (
                      <div key={label} className="py-2">
                        <div className={`${compact ? "text-lg" : "text-xl"} font-black tabular-nums leading-none`}>{value}</div>
                        <div className="mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-700">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 py-2 bg-stone-950 text-[#F5EBDD] text-[12px] font-semibold">
                    Turn the cover to open
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </BookPage>

              {/* ONE PAGE PER COMPETITION, in chronological order */}
              {COMPETITIONS_LIST.map((comp, i) => (
                <CompetitionPage
                  key={comp.id}
                  comp={comp}
                  pageIndex={i + 1}
                  compact={compact}
                  onOpen={onCompetitionSelect}
                />
              ))}

              {/* SEASON RECORD: every entry at a glance, each row jumps to its page */}
              <BookPage isLeftPage={RECORD_PAGE_INDEX % 2 === 1} className={compact ? "p-5" : "p-7"}>
                <div className="flex items-baseline justify-between gap-3 pb-2.5 border-b-2 border-zinc-950">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-zinc-900">Season record</span>
                  <span className="text-[11px] font-mono text-zinc-500">Dec 2025 – May 2026</span>
                </div>

                <h3 className={`${compact ? "mt-4 text-lg" : "mt-5 text-[22px]"} font-black tracking-tight leading-tight text-zinc-950`}>
                  {COMPETITIONS_LIST.length} events, {PODIUM_COUNT} podium finishes
                </h3>

                <ol className={`${compact ? "mt-3" : "mt-4"} text-[13px]`}>
                  {COMPETITIONS_LIST.map((comp, i) => (
                    <li key={comp.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPage(i + 1);
                        }}
                        className={`group w-full flex items-center gap-3 ${compact ? "py-1" : "py-1.5"} border-b border-dotted border-zinc-300 text-left cursor-pointer`}
                      >
                        <span className="w-5 text-[11px] font-mono text-zinc-400 tabular-nums shrink-0">{pad2(i + 1)}</span>
                        <span className="flex-1 min-w-0 truncate font-medium text-zinc-800 group-hover:text-[#0E7490] transition-colors">
                          {comp.title}
                        </span>
                        {isPodium(comp) ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#B4231F] shrink-0">
                            <Trophy className="w-3 h-3" />
                            {shortResult(comp)}
                          </span>
                        ) : (
                          <span className="text-[12px] text-zinc-400 shrink-0">Participant</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ol>

                <PageFooter pageIndex={RECORD_PAGE_INDEX} isLeftPage={RECORD_PAGE_INDEX % 2 === 1}>
                  <span className="text-[12px] text-zinc-500">Certificates on the back cover</span>
                </PageFooter>
              </BookPage>

              {/* BACK COVER: certificate archive */}
              <BookPage
                density="hard"
                className={`border-2 border-stone-900 text-stone-950 ${compact ? "pr-12 pl-6 py-6" : "pr-16 pl-9 py-9"}`}
              >
                <RedClothSpine position="right" />
                <KraftTexture />

                <div className="relative z-10 flex items-baseline justify-between pb-3 border-b-2 border-stone-900">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.16em]">Certificate archive</span>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                  <div className={`${compact ? "w-16 h-16" : "w-20 h-20"} bg-stone-950 flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.35)]`}>
                    <FolderOpen className={`${compact ? "w-8 h-8" : "w-10 h-10"} text-[#00F0FF]`} strokeWidth={1.75} />
                  </div>
                  <h3 className={`${compact ? "mt-6 text-2xl" : "mt-8 text-[28px]"} font-black uppercase tracking-[-0.02em] leading-none`}>
                    Every certificate
                  </h3>
                  <p className="mt-3 text-[13px] font-medium text-stone-800 max-w-[32ch] leading-relaxed text-balance">
                    Participation and winner certificates for each event, kept in one Google Drive folder.
                  </p>
                  <a
                    href={COMPETITION_CERTIFICATES_DRIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-stone-950 text-[#F5EBDD] text-[13px] font-semibold transition-colors hover:bg-[#00F0FF] hover:text-stone-950 cursor-pointer"
                  >
                    Open certificates
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative z-10 pt-3 border-t-2 border-stone-900 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-black">{HARSHIL_BIO.fullName}</div>
                    <div className="text-[11px] font-mono text-stone-700">CSIT · MVSR</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetBook();
                      setCurrentPage(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-900/50 text-[12px] font-semibold transition-colors hover:bg-stone-950 hover:text-[#F5EBDD] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Back to cover
                  </button>
                </div>
              </BookPage>
            </FlipBookComponent>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={flipPrev}
              disabled={isFirst}
              aria-label="Previous page"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 bg-zinc-950/70 text-zinc-200 transition-all hover:border-[#00F0FF]/60 hover:text-white active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="min-w-[9.5rem] text-center text-[13px] font-mono text-zinc-300 tabular-nums" aria-live="polite">
              {pageLabel}
            </span>

            <button
              type="button"
              onClick={flipNext}
              disabled={isLast}
              aria-label="Next page"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 bg-zinc-950/70 text-zinc-200 transition-all hover:border-[#00F0FF]/60 hover:text-white active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress rail: one stop per spread */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump to page">
            {stops.map((stop, i) => (
              <button
                key={stop.index}
                type="button"
                onClick={() => goToPage(stop.index)}
                title={stop.label}
                aria-label={stop.label}
                aria-current={i === activeStop ? "page" : undefined}
                className="group py-2 cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === activeStop ? "w-8 bg-[#00F0FF]" : "w-1.5 bg-zinc-600 group-hover:bg-zinc-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="hidden sm:block text-[12px] text-zinc-500">
            Drag a page corner, click a page, or use the arrow keys
          </p>
        </div>
      </div>
    );
  }
);

StPageFlipBook.displayName = "StPageFlipBook";

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
  Award,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Competition } from "../types/portfolio";
import {
  COMPETITIONS_LIST,
  COMPETITION_CERTIFICATES_DRIVE_URL,
  HARSHIL_BIO,
  PROJECTS_DATA,
} from "../data/portfolioData";
import { fallbackToOriginal, optimizedImage } from "../utils/optimizedImage";

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

// Front cover, contents, one page per competition, back cover (an even count, so the back cover closes the book)
const CONTENTS_PAGE_INDEX = 1;
const FIRST_ENTRY_PAGE_INDEX = 2;
const PAGE_COUNT = COMPETITIONS_LIST.length + 3;

const isPodium = (comp: Competition) => comp.awardRank === "1st" || comp.awardRank === "Winner";
const PODIUM_COUNT = COMPETITIONS_LIST.filter(isPodium).length;
const HACKATHON_PROJECT_COUNT = PROJECTS_DATA.filter((p) => p.hackathonId).length;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthOf = (comp: Competition) => MONTHS[Number(comp.startDate.slice(5, 7)) - 1];
const yearOf = (comp: Competition) => comp.startDate.slice(0, 4);
const FIRST_YEAR = yearOf(COMPETITIONS_LIST[0]);
const LAST_YEAR = yearOf(COMPETITIONS_LIST[COMPETITIONS_LIST.length - 1]);
const SPAN_LABEL = `${monthOf(COMPETITIONS_LIST[0])} ${FIRST_YEAR} – ${monthOf(
  COMPETITIONS_LIST[COMPETITIONS_LIST.length - 1]
)} ${LAST_YEAR}`;

const awardLabel = (comp: Competition) => (comp.awardRank === "1st" ? "1st Prize" : "State Winner");

const pad2 = (n: number) => String(n).padStart(2, "0");

const SERIF: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

// Brushed brass foil, used for every stamped element on the covers and the award seals
const FOIL_GRADIENT =
  "linear-gradient(105deg, #8E6B2E 0%, #E8CB86 28%, #B38A3E 46%, #F3DFA8 64%, #A57D35 82%, #D9B86E 100%)";
const foilText: React.CSSProperties = {
  backgroundImage: FOIL_GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

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

// Midnight book cloth for both hard covers, with the hinge groove on the spine side.
// Painted as layers because page-flip rewrites each page element's inline style.
function ClothCover({ spine }: { spine: "left" | "right" }) {
  const toSpine = spine === "left" ? "to right" : "to left";
  return (
    <>
      <div className="absolute inset-0 pointer-events-none bg-[#14202E]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 3px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px),
            radial-gradient(120% 90% at 50% 40%, rgba(255,255,255,0.06), transparent 60%),
            radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.45))
          `,
        }}
      />
      {/* Hinge: the board bends here, so it catches a highlight and a groove */}
      <div
        className={`absolute inset-y-0 ${spine === "left" ? "left-0" : "right-0"} w-6 pointer-events-none`}
        style={{
          backgroundImage: `linear-gradient(${toSpine === "to right" ? "90deg" : "270deg"}, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.07) 45%, rgba(0,0,0,0.35) 70%, transparent 100%)`,
        }}
      />
      {/* Blind-debossed frame */}
      <div
        className="absolute pointer-events-none border border-black/40"
        style={{ inset: 14, boxShadow: "0 1px 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)", [spine === "left" ? "left" : "right"]: 30 } as React.CSSProperties}
      />
    </>
  );
}

// Reusable individual book page component with forwardRef
interface PageProps {
  density?: "hard" | "soft";
  isLeftPage?: boolean;
  className?: string;
  children: React.ReactNode;
}

const BookPage = forwardRef<HTMLDivElement, PageProps>(
  ({ density = "soft", isLeftPage = false, className = "", children }, ref) => {
    return (
      <div
        ref={ref}
        data-density={density}
        className="relative w-full h-full overflow-hidden select-none bg-[#F7F4EC] text-[#1C1B19]"
        style={{ boxSizing: "border-box", borderRadius: 0 }}
      >
        {/* Gutter shadow where the paper curves into the binding */}
        {density === "soft" && (
          <div
            className={`absolute inset-y-0 w-12 pointer-events-none z-20 ${
              isLeftPage
                ? "right-0 bg-gradient-to-l from-black/[0.16] via-black/[0.04] to-transparent"
                : "left-0 bg-gradient-to-r from-black/[0.16] via-black/[0.04] to-transparent"
            }`}
          />
        )}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.07)" }} />
        {/* page-flip forces display:block on the page element, so layout lives on this inner box */}
        <div className={`absolute inset-0 flex flex-col ${className}`}>{children}</div>
      </div>
    );
  }
);

BookPage.displayName = "BookPage";

// Running head at the top of every paper page
function RunningHead({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 pb-2 border-b border-[#1C1B19]/80 shrink-0">
      <span className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[#1C1B19] whitespace-nowrap shrink-0">{left}</span>
      <span className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#6B665C] text-right truncate">{right}</span>
    </div>
  );
}

// Folio (page number) on the outer edge of each page
function PageFooter({
  pageIndex,
  isLeftPage,
  children,
}: {
  pageIndex: number;
  isLeftPage: boolean;
  children?: React.ReactNode;
}) {
  const folio = (
    <span className="text-[12px] text-[#8A8478] tabular-nums italic" style={SERIF}>
      {pageIndex}
    </span>
  );
  return (
    <div className="mt-auto shrink-0 pt-3 border-t border-[#1C1B19]/15 flex items-center justify-between gap-3">
      {isLeftPage ? folio : children ?? <span />}
      {isLeftPage ? children ?? <span /> : folio}
    </div>
  );
}

// Brass award seal pressed onto the page for a 1st prize or state win
function AwardSeal({ comp, compact }: { comp: Competition; compact: boolean }) {
  const size = compact ? 72 : 88;
  const Icon = comp.awardRank === "1st" ? Trophy : Award;
  return (
    <div
      data-round
      className="absolute z-30 rounded-full flex items-center justify-center -rotate-[8deg]"
      style={{
        width: size,
        height: size,
        right: compact ? 10 : 14,
        // Mostly below the plate, beside the title, so it never covers plate text
        bottom: -size * 0.72,
        backgroundImage: FOIL_GRADIENT,
        boxShadow: "0 6px 16px rgba(60,40,10,0.35), inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(80,55,15,0.45)",
      }}
      aria-label={awardLabel(comp)}
    >
      <div
        data-round
        className="absolute rounded-full border border-dashed border-[#5A4115]/60"
        style={{ inset: compact ? 5 : 6 }}
      />
      <div className="relative flex flex-col items-center text-[#3A2A0C] leading-none">
        <Icon className={compact ? "w-4 h-4" : "w-5 h-5"} strokeWidth={2} />
        <span className={`${compact ? "mt-1 text-[9px]" : "mt-1.5 text-[10.5px]"} font-black uppercase tracking-[0.1em] text-center`}>
          {comp.awardRank === "1st" ? "1st" : "State"}
        </span>
        <span className={`${compact ? "text-[9px]" : "text-[10.5px]"} font-black uppercase tracking-[0.1em]`}>
          {comp.awardRank === "1st" ? "Prize" : "Winner"}
        </span>
      </div>
    </div>
  );
}

// Plate shown on pages that have no event photo yet: real event facts set as type, not a stock image
function FactPlate({ comp, compact }: { comp: Competition; compact: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#16181D] text-[#EDE7DA]">
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "-1px -1px",
        }}
      />
      <div className={`relative h-full flex ${compact ? "p-3.5" : "p-5"}`}>
        <div className="flex flex-col justify-end">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#00F0FF]/80">{comp.type}</span>
          <span className={`${compact ? "text-[46px]" : "text-[64px]"} leading-[0.85] font-light tracking-[-0.03em] mt-2`} style={SERIF}>
            {monthOf(comp)}
          </span>
          <span className="mt-1.5 text-[12px] font-mono tracking-[0.2em] text-[#EDE7DA]/60">{yearOf(comp)}</span>
        </div>
        <dl className={`ml-auto self-start text-right ${compact ? "max-w-[55%] space-y-2" : "max-w-[52%] space-y-3"}`}>
          {comp.duration && !compact && (
            <div>
              <dt className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-[#EDE7DA]/45">Format</dt>
              <dd className={`${compact ? "text-[12px]" : "text-[13px]"} mt-0.5 leading-snug`}>{comp.duration}</dd>
            </div>
          )}
          {comp.venue && (
            <div>
              <dt className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-[#EDE7DA]/45">Venue</dt>
              <dd className={`${compact ? "text-[12px]" : "text-[13px]"} mt-0.5 leading-snug line-clamp-2`}>{comp.venue}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

// Plate for pages with a certificate but no event photo: the certificate, mounted on the dark plate
function CertificatePlate({ comp, compact }: { comp: Competition; compact: boolean }) {
  const src = comp.certificateImage!;
  return (
    <div className="absolute inset-0 bg-[#16181D]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className={`absolute inset-0 flex items-center justify-center ${compact ? "p-3 pb-6" : "p-4 pb-7"}`}>
        <img
          src={optimizedImage(src, 900)}
          onError={fallbackToOriginal(src)}
          alt={`${comp.title} certificate`}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="max-w-full max-h-full object-contain shadow-[0_10px_28px_rgba(0,0,0,0.6)]"
        />
      </div>
      <span className="absolute left-3 bottom-2 text-[9.5px] font-mono uppercase tracking-[0.18em] text-[#EDE7DA]/60">
        Certificate
      </span>
    </div>
  );
}

interface CompetitionPageProps {
  comp: Competition;
  entryNumber: number;
  pageIndex: number;
  compact: boolean;
  onOpen?: (comp: Competition) => void;
}

const CompetitionPage = forwardRef<HTMLDivElement, CompetitionPageProps>(
  ({ comp, entryNumber, pageIndex, compact, onOpen }, ref) => {
    const isLeftPage = pageIndex % 2 === 1;
    const photos = comp.images && comp.images.length > 1 ? comp.images : null;
    const photo = comp.coverImage || comp.images?.[0];
    const showsFactPlate = !photo && !comp.certificateImage;
    const winner = isPodium(comp);

    const facts: [string, string][] = [
      ["Result", comp.result],
      comp.projectName ? ["Project", comp.projectName] : ["Focus", comp.projectOrFocus || comp.type],
      ...(comp.projectRole ? [["Role", comp.projectRole] as [string, string]] : []),
      ...(comp.teamName && !comp.teamName.startsWith("Individual") ? [["Team", comp.teamName] as [string, string]] : []),
      // The full-size fact plate already shows the format
      ...((!showsFactPlate || compact) && comp.duration ? [["Format", comp.duration] as [string, string]] : []),
    ];
    // Lines of summary that fit under the facts: full pages fit 3 lines with 3 facts, 2 with 4, none with 5+
    const descriptionLines = compact ? (facts.length <= 4 ? 2 : 0) : facts.length <= 3 ? 3 : facts.length === 4 ? 2 : 0;

    return (
      <BookPage ref={ref} isLeftPage={isLeftPage} className={compact ? "px-5 pt-5 pb-4" : "px-8 pt-7 pb-6"}>
        <RunningHead
          left={`No. ${pad2(entryNumber)} / ${pad2(COMPETITIONS_LIST.length)}`}
          right={comp.date}
        />

        <div className={`relative w-full ${compact ? "mt-3.5 aspect-[2/1]" : "mt-5 aspect-[16/9]"} shrink-0`}>
          <div className="absolute inset-0 overflow-hidden bg-[#16181D]">
            {photos ? (
              <PhotoSlideshow images={photos} alt={comp.title} />
            ) : photo ? (
              <img src={photo} alt={comp.title} referrerPolicy="no-referrer" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            ) : comp.certificateImage ? (
              <CertificatePlate comp={comp} compact={compact} />
            ) : (
              <FactPlate comp={comp} compact={compact} />
            )}
          </div>
          {winner && <AwardSeal comp={comp} compact={compact} />}
        </div>

        <div className={`${compact ? "mt-3.5" : "mt-5"} shrink-0 ${winner ? (compact ? "pr-20" : "pr-24") : ""}`}>
          <h3
            className={`${compact ? "text-[19px]" : "text-[25px]"} font-semibold text-[#141311] tracking-[-0.015em] leading-[1.12] text-balance`}
            style={SERIF}
          >
            {comp.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] text-[#6B665C] line-clamp-1">{comp.organizer}</p>
        </div>

        <dl className={`${compact ? "mt-2.5" : "mt-4"} text-[13px] shrink-0`}>
          {facts.map(([label, value]) => (
            <div key={label} className={`flex items-baseline justify-between gap-4 ${compact ? "py-1" : "py-[7px]"} border-b border-[#1C1B19]/12`}>
              <dt className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8A8478] shrink-0">{label}</dt>
              <dd
                className={`text-right truncate ${
                  label === "Result" && winner ? "font-semibold text-[#8A5A12]" : "font-medium text-[#1C1B19]"
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Fit the summary to the room the facts leave, rather than slicing a line in half;
            the full text is one click away in Details */}
        {descriptionLines > 0 && (
          <div className={`${compact ? "mt-2.5" : "mt-3.5"} flex-1 min-h-0 overflow-hidden`}>
            <p className={`text-[13px] leading-[1.6] text-[#4A463F] ${descriptionLines === 2 ? "line-clamp-2" : "line-clamp-3"}`}>
              {comp.description}
            </p>
          </div>
        )}

        <PageFooter pageIndex={pageIndex} isLeftPage={isLeftPage}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(comp);
            }}
            className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1C1B19] border-b border-[#1C1B19]/40 pb-0.5 transition-colors hover:text-[#0E7490] hover:border-[#0E7490] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E7490] cursor-pointer"
          >
            Details{comp.certificateUrl && comp.certificateUrl !== COMPETITION_CERTIFICATES_DRIVE_URL ? " & certificate" : ""}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
    const isLandscape = orientation === "landscape";

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
    const isClosed = isFirst || isLast;

    // A closed book sits on one half of the spread; slide it to the centre
    const bookShift = isLandscape ? (isFirst ? -bookSize.width / 2 : isLast ? bookSize.width / 2 : 0) : 0;
    // Shadow and glow follow what is actually on screen: one page in portrait or when closed, two when open.
    // Sizing them to a spread on a phone made them wider than the screen and zoomed the page out.
    const visibleWidth = isLandscape && !isClosed ? bookSize.width * 2 : bookSize.width;

    const pageNames = [
      "Cover",
      "Contents",
      ...COMPETITIONS_LIST.map((comp) => comp.title),
      "Certificates",
    ];

    // Spread stops for the progress rail: cover, each two-page spread, back cover
    const stops: { index: number; label: string }[] = [{ index: 0, label: "Cover" }];
    for (let i = 1; i < PAGE_COUNT - 1; i += isLandscape ? 2 : 1) {
      const names = isLandscape ? [pageNames[i], pageNames[i + 1]] : [pageNames[i]];
      stops.push({ index: i, label: names.filter((n) => n && n !== "Certificates").join(" / ") });
    }
    stops.push({ index: PAGE_COUNT - 1, label: "Back cover: certificates" });
    const activeStop = stops.reduce((active, stop, i) => (currentPage >= stop.index ? i : active), 0);

    const pageLabel = isFirst
      ? "Cover"
      : isLast
      ? "Back cover"
      : isLandscape
      ? `Pages ${currentPage}–${Math.min(currentPage + 1, PAGE_COUNT - 2)} of ${PAGE_COUNT - 2}`
      : `Page ${currentPage} of ${PAGE_COUNT - 2}`;

    const FlipBookComponent = HTMLFlipBook as any;

    return (
      <div ref={containerRef} className={`w-full flex flex-col items-center justify-center py-4 select-none ${className}`}>
        {/* Zero border radius across StPageFlip canvases and wrappers */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .stpageflip-book-shadow,
              .stpageflip-book-shadow div:not([data-round]),
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
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl pointer-events-none transition-all duration-700 max-w-full"
            style={{ bottom: -6, height: 40, width: visibleWidth * 0.92 }}
          />
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-16 bg-[#00F0FF]/15 rounded-full blur-3xl pointer-events-none transition-all duration-700 max-w-full"
            style={{ width: visibleWidth * 0.85, opacity: isClosed ? 0.35 : 0.8 }}
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
              maxShadowOpacity={0.5}
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
              {/* FRONT COVER: midnight cloth, brass foil */}
              <BookPage density="hard" className={compact ? "pl-11 pr-7 py-7" : "pl-14 pr-10 py-10"}>
                <ClothCover spine="left" />

                <div className="relative z-10 flex items-baseline justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.28em]" style={foilText}>
                    Competition Record
                  </span>
                  <span className="text-[10px] font-mono font-semibold tracking-[0.2em] tabular-nums" style={foilText}>
                    {FIRST_YEAR}–{LAST_YEAR.slice(2)}
                  </span>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                  {/* Monogram medallion */}
                  <div
                    className={`${compact ? "w-[68px] h-[68px]" : "w-[84px] h-[84px]"} p-[2px]`}
                    style={{ backgroundImage: FOIL_GRADIENT }}
                  >
                    <div className="w-full h-full bg-[#14202E] flex items-center justify-center">
                      <div className="w-[86%] h-[86%] border border-[#C9A55E]/50 flex items-center justify-center">
                        <span className={`${compact ? "text-[24px]" : "text-[30px]"} font-medium tracking-[0.04em]`} style={{ ...SERIF, ...foilText }}>
                          HK
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className={`${compact ? "mt-6 text-[34px]" : "mt-8 text-[46px]"} font-medium leading-[0.98] tracking-[-0.02em]`}
                    style={{ ...SERIF, ...foilText }}
                  >
                    Competitions
                    <span className="block italic font-light">&amp; Hackathons</span>
                  </p>

                  <div className={`${compact ? "mt-4 w-14" : "mt-6 w-20"} h-px`} style={{ backgroundImage: FOIL_GRADIENT }} />

                  <p className={`${compact ? "mt-4" : "mt-5"} text-[12.5px] leading-relaxed text-[#C9C2B2]/80 max-w-[30ch] text-balance`}>
                    {COMPETITIONS_LIST.length} events, {SPAN_LABEL}
                  </p>
                </div>

                <div className="relative z-10 space-y-5">
                  <div className="grid grid-cols-3 text-center">
                    {[
                      [String(COMPETITIONS_LIST.length), "Events"],
                      [String(PODIUM_COUNT), "Podiums"],
                      [String(HACKATHON_PROJECT_COUNT), "Projects built"],
                    ].map(([value, label], i) => (
                      <div key={label} className={i > 0 ? "border-l border-[#C9A55E]/25" : ""}>
                        <div className={`${compact ? "text-[24px]" : "text-[30px]"} font-medium leading-none tabular-nums`} style={{ ...SERIF, ...foilText }}>
                          {value}
                        </div>
                        <div className="mt-1.5 text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#C9C2B2]/60">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end justify-between gap-3 pt-4 border-t border-[#C9A55E]/25">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={foilText}>
                        {HARSHIL_BIO.fullName}
                      </div>
                      <div className="mt-1 text-[10.5px] text-[#C9C2B2]/60">B.E. CSIT · MVSR Engineering College</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C9C2B2]/70 shrink-0">
                      Open
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </BookPage>

              {/* CONTENTS: every entry at a glance, each row jumps to its page */}
              <BookPage isLeftPage className={compact ? "px-5 pt-5 pb-4" : "px-8 pt-7 pb-6"}>
                <RunningHead left="Contents" right={SPAN_LABEL} />

                <h3 className={`${compact ? "mt-4 text-[22px]" : "mt-6 text-[30px]"} font-medium tracking-[-0.02em] leading-[1.05] text-[#141311]`} style={SERIF}>
                  {COMPETITIONS_LIST.length} events,{" "}
                  <span className="italic font-light">{PODIUM_COUNT} on the podium</span>
                </h3>

                <ol className={`${compact ? "mt-3" : "mt-5"} flex-1 min-h-0`}>
                  {COMPETITIONS_LIST.map((comp, i) => (
                    <li key={comp.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPage(FIRST_ENTRY_PAGE_INDEX + i);
                        }}
                        className={`group w-full flex items-baseline gap-3 ${compact ? "py-[5px]" : "py-[7px]"} border-b border-[#1C1B19]/10 text-left cursor-pointer`}
                      >
                        <span className="w-9 shrink-0 text-[10px] font-mono uppercase tracking-[0.08em] text-[#8A8478]">{monthOf(comp)} {yearOf(comp).slice(2)}</span>
                        <span className="flex-1 min-w-0 truncate text-[13px] font-medium text-[#1C1B19] group-hover:text-[#0E7490] transition-colors">
                          {comp.title}
                        </span>
                        {isPodium(comp) &&
                          (compact ? (
                            <Trophy className="w-3.5 h-3.5 shrink-0 self-center text-[#8A5A12]" aria-label={awardLabel(comp)} />
                          ) : (
                            <span className="shrink-0 text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8A5A12]">
                              {awardLabel(comp)}
                            </span>
                          ))}
                        <span className="w-5 shrink-0 text-right text-[12px] italic text-[#8A8478] tabular-nums" style={SERIF}>
                          {FIRST_ENTRY_PAGE_INDEX + i}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>

                <PageFooter pageIndex={CONTENTS_PAGE_INDEX} isLeftPage>
                  <span className="text-[11.5px] text-[#8A8478]">Tap an entry to turn to it</span>
                </PageFooter>
              </BookPage>

              {/* ONE PAGE PER COMPETITION, oldest first */}
              {COMPETITIONS_LIST.map((comp, i) => (
                <CompetitionPage
                  key={comp.id}
                  comp={comp}
                  entryNumber={i + 1}
                  pageIndex={FIRST_ENTRY_PAGE_INDEX + i}
                  compact={compact}
                  onOpen={onCompetitionSelect}
                />
              ))}

              {/* BACK COVER: certificate archive */}
              <BookPage density="hard" className={compact ? "pr-11 pl-7 py-7" : "pr-14 pl-10 py-10"}>
                <ClothCover spine="right" />

                <div className="relative z-10 flex items-baseline justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.28em]" style={foilText}>
                    Certificates
                  </span>
                  <span className="text-[10px] font-mono font-semibold tracking-[0.2em]" style={foilText}>
                    HK
                  </span>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                  <h3
                    className={`${compact ? "text-[30px]" : "text-[38px]"} font-medium leading-[1.02] tracking-[-0.02em]`}
                    style={{ ...SERIF, ...foilText }}
                  >
                    Every certificate,
                    <span className="block italic font-light">in one place</span>
                  </h3>
                  <div className={`${compact ? "mt-4 w-14" : "mt-6 w-20"} h-px`} style={{ backgroundImage: FOIL_GRADIENT }} />
                  <p className="mt-5 text-[12.5px] leading-relaxed text-[#C9C2B2]/80 max-w-[30ch] text-balance">
                    Participation and award certificates for all {COMPETITIONS_LIST.length} events, kept in a Google Drive folder.
                  </p>
                  <a
                    href={COMPETITION_CERTIFICATES_DRIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 text-[12.5px] font-semibold text-[#1F1606] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                    style={{ backgroundImage: FOIL_GRADIENT, boxShadow: "0 4px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" }}
                  >
                    View certificates
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="relative z-10 flex items-end justify-between gap-3 pt-4 border-t border-[#C9A55E]/25">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={foilText}>
                      {HARSHIL_BIO.fullName}
                    </div>
                    <div className="mt-1 text-[10.5px] text-[#C9C2B2]/60">{SPAN_LABEL}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetBook();
                      setCurrentPage(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#C9A55E]/40 text-[11.5px] font-medium text-[#E6D3A3] transition-colors hover:bg-[#C9A55E]/15 cursor-pointer shrink-0"
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

            <span className="min-w-[10.5rem] text-center text-[13px] font-mono text-zinc-300 tabular-nums" aria-live="polite">
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
          <div className="flex flex-wrap justify-center items-center gap-1.5 max-w-full px-2" role="group" aria-label="Jump to page">
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

          <p className="hidden sm:block text-[12px] text-zinc-400">
            Drag a page corner, click a page, or use the arrow keys
          </p>
        </div>
      </div>
    );
  }
);

StPageFlipBook.displayName = "StPageFlipBook";

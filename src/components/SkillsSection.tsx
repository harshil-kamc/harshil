import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { RotateCcw, Cpu, Server, Database, Terminal, Move } from "lucide-react";
import { TECHNICAL_SKILLS } from "../data/portfolioData";
import { cn } from "../lib/utils";

interface SkillCardConfig {
  id: string;
  name: string;
  tagline: string;
  level: number;
  highlight: string;
  /** Card centre as a fraction of the stage (0–1) */
  cx: number;
  cy: number;
  rotate: number;
  accentColor: string;
  bgClass: string;
  icon: React.ReactNode;
}

const getSkillIconAndColors = (name: string, size = "w-8 h-8 sm:w-10 sm:h-10") => {
  const key = name.toUpperCase().trim();

  if (key === "C") {
    return {
      accentColor: "#5C6BC0",
      bgClass: "from-[#0c1236]/90 via-[#1a237e]/70 to-[#283593]/60",
      icon: (
        <svg viewBox="0 0 48 48" className={`${size} shrink-0 drop-shadow`} xmlns="http://www.w3.org/2000/svg">
          <path fill="#283593" fillRule="evenodd" clipRule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z"/>
          <path fill="#5c6bc0" fillRule="evenodd" clipRule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z"/>
          <path fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z"/>
          <path fill="#3949ab" fillRule="evenodd" clipRule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z"/>
        </svg>
      ),
    };
  }

  if (key === "PYTHON") {
    return {
      accentColor: "#FFD43B",
      bgClass: "from-[#0c243b]/90 via-[#153e63]/70 to-[#423903]/60",
      icon: (
        <svg viewBox="0 0 32 32" className={`${size} shrink-0 drop-shadow`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M13.0164 2C10.8193 2 9.03825 3.72453 9.03825 5.85185V8.51852H15.9235V9.25926H5.97814C3.78107 9.25926 2 10.9838 2 13.1111L2 18.8889C2 21.0162 3.78107 22.7407 5.97814 22.7407H8.27322V19.4815C8.27322 17.3542 10.0543 15.6296 12.2514 15.6296H19.5956C21.4547 15.6296 22.9617 14.1704 22.9617 12.3704V5.85185C22.9617 3.72453 21.1807 2 18.9836 2H13.0164ZM12.0984 6.74074C12.8589 6.74074 13.4754 6.14378 13.4754 5.40741C13.4754 4.67103 12.8589 4.07407 12.0984 4.07407C11.3378 4.07407 10.7213 4.67103 10.7213 5.40741C10.7213 6.14378 11.3378 6.74074 12.0984 6.74074Z" fill="#3776AB"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M18.9834 30C21.1805 30 22.9616 28.2755 22.9616 26.1482V23.4815L16.0763 23.4815L16.0763 22.7408L26.0217 22.7408C28.2188 22.7408 29.9998 21.0162 29.9998 18.8889V13.1111C29.9998 10.9838 28.2188 9.25928 26.0217 9.25928L23.7266 9.25928V12.5185C23.7266 14.6459 21.9455 16.3704 19.7485 16.3704L12.4042 16.3704C10.5451 16.3704 9.03809 17.8296 9.03809 19.6296L9.03809 26.1482C9.03809 28.2755 10.8192 30 13.0162 30H18.9834ZM19.9015 25.2593C19.1409 25.2593 18.5244 25.8562 18.5244 26.5926C18.5244 27.329 19.1409 27.9259 19.9015 27.9259C20.662 27.9259 21.2785 27.329 21.2785 26.5926C21.2785 25.8562 20.662 25.2593 19.9015 25.2593Z" fill="#FFD43B"/>
        </svg>
      ),
    };
  }

  if (key === "DSA" || key.includes("DATA STRUCTURE")) {
    return {
      accentColor: "#00F0FF",
      bgClass: "from-[#031d24]/90 via-[#083344]/70 to-[#0e7490]/60",
      icon: (
        <div className={`${size} rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#00F0FF] shadow`}>
          <Cpu className="w-3/4 h-3/4" />
        </div>
      ),
    };
  }

  if (key === "JAVA") {
    return {
      accentColor: "#E76F00",
      bgClass: "from-[#2a1102]/90 via-[#5c2406]/70 to-[#1e344e]/60",
      icon: (
        <svg viewBox="0 0 32 32" className={`${size} shrink-0 drop-shadow`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0497 8.44062C22.6378 3.32607 19.2566 0 19.2566 0C19.7598 5.28738 13.813 6.53583 12.2189 10.1692C11.1312 12.6485 12.9638 14.8193 16.0475 17.5554C15.7749 16.9494 15.3544 16.3606 14.9288 15.7645C13.4769 13.7313 11.9645 11.6132 16.0497 8.44062Z" fill="#E76F00"/>
          <path d="M17.1015 18.677C17.1015 18.677 19.0835 17.0779 17.5139 15.3008C12.1931 9.27186 23.3333 6.53583 23.3333 6.53583C16.5317 9.8125 17.5471 11.7574 19.2567 14.1202C21.0871 16.6538 17.1015 18.677 17.1015 18.677Z" fill="#E76F00"/>
          <path d="M22.937 23.4456C29.0423 20.3258 26.2195 17.3278 24.2492 17.7317C23.7662 17.8305 23.5509 17.9162 23.5509 17.9162C23.5509 17.9162 23.7302 17.64 24.0726 17.5204C27.9705 16.1729 30.9682 21.4949 22.8143 23.6028C22.8143 23.6029 22.9088 23.5198 22.937 23.4456Z" fill="#5382A1"/>
          <path d="M10.233 19.4969C6.41312 18.9953 12.3275 17.6139 12.3275 17.6139C12.3275 17.6139 10.0307 17.4616 7.20592 18.8043C3.86577 20.3932 15.4681 21.1158 21.474 19.5625C22.0984 19.1432 22.9614 18.7798 22.9614 18.7798C22.9614 18.7798 20.5037 19.2114 18.0561 19.4145C15.0612 19.6612 11.8459 19.7093 10.233 19.4969Z" fill="#5382A1"/>
          <path d="M11.6864 22.4758C9.55624 22.2592 10.951 21.2439 10.951 21.2439C5.43898 23.0429 14.0178 25.083 21.7199 22.8682C20.9012 22.5844 20.3806 22.0653 20.3806 22.0653C16.6163 22.7781 14.441 22.7553 11.6864 22.4758Z" fill="#5382A1"/>
        </svg>
      ),
    };
  }

  if (key === "HTML" || key.includes("HTML")) {
    return {
      accentColor: "#E4460E",
      bgClass: "from-[#2e0e05]/90 via-[#6e220a]/70 to-[#c2410c]/60",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={`${size} shrink-0 drop-shadow`}>
          <path fill="#E4460E" d="M128 96L162.9 491.8L319.5 544L477.1 491.8L512 96L128 96zM436.2 223.9L252.4 223.9L256.5 273.3L432.1 273.3L418.5 421.7L320.6 448.7L320.6 449L319.5 449L220.8 421.7L214.8 345.9L262.5 345.9L266 384L319.5 398.5L373.2 384L379.2 321.8L212.3 321.8L199.5 176.2L440.6 176.2L436.2 223.9z"/>
        </svg>
      ),
    };
  }

  if (key === "CSS" || key.includes("CSS")) {
    return {
      accentColor: "#264DE4",
      bgClass: "from-[#081b36]/90 via-[#143775]/70 to-[#1d4ed8]/60",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={`${size} shrink-0 drop-shadow`}>
          <path fill="#264DE4" d="M128 96L162.9 491.8L320 544L477.1 491.8L512 96L128 96zM441.1 176L436.3 223.3L321 272.6L320.7 272.7L432.2 272.7L419.4 419.3L321.2 448L222.4 418.8L216 344.9L264.9 344.9L268.1 383.2L320.7 396.5L375.4 381.1L379.1 319.5L212.8 319L212.8 318.9L212.6 319L209 272.7L321.1 226L327.6 223.3L204.7 223.3L198.9 176L441.1 176z"/>
        </svg>
      ),
    };
  }

  if (key === "RDBMS") {
    return {
      accentColor: "#14B8A6",
      bgClass: "from-[#021f18]/90 via-[#064e3b]/70 to-[#0f766e]/60",
      icon: (
        <div className={`${size} rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-[#14B8A6] shadow`}>
          <Server className="w-3/4 h-3/4" />
        </div>
      ),
    };
  }

  if (key === "SQL") {
    return {
      accentColor: "#0284C7",
      bgClass: "from-[#071c30]/90 via-[#034d7a]/70 to-[#0284c7]/60",
      icon: (
        <div className={`${size} rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-[#38BDF8] shadow`}>
          <Database className="w-3/4 h-3/4" />
        </div>
      ),
    };
  }

  return {
    accentColor: "#00F0FF",
    bgClass: "from-zinc-900 via-zinc-950 to-black",
    icon: <Terminal className={`${size} text-[#00F0FF]`} />,
  };
};

// Card centres form a ring around the middle of the stage, where the particle
// engine draws "SKILLS". Order matches TECHNICAL_SKILLS.
const RING_LAYOUT: { cx: number; cy: number; rotate: number }[] = [
  { cx: 0.13, cy: 0.18, rotate: -4 }, // C
  { cx: 0.12, cy: 0.52, rotate: 3 }, // Python
  { cx: 0.38, cy: 0.1, rotate: 2 }, // DSA
  { cx: 0.62, cy: 0.1, rotate: -3 }, // Java
  { cx: 0.87, cy: 0.18, rotate: 4 }, // HTML
  { cx: 0.88, cy: 0.52, rotate: -2 }, // CSS
  { cx: 0.24, cy: 0.84, rotate: -3 }, // RDBMS
  { cx: 0.76, cy: 0.84, rotate: 3 }, // SQL
];

const useIsDesktop = () => {
  const query = "(min-width: 1024px)";
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : true
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
};

export function SkillsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState<number>(0);
  const [stageSize, setStageSize] = useState({ width: 1280, height: 800 });
  const isDesktop = useIsDesktop();
  const isInView = useInView(stageRef, { once: true, amount: 0.35 });

  const skillsList: SkillCardConfig[] = useMemo(() => {
    return TECHNICAL_SKILLS.map((skill, idx) => {
      const meta = getSkillIconAndColors(skill.name);
      const layout = RING_LAYOUT[idx % RING_LAYOUT.length];
      return {
        id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
        name: skill.name,
        tagline: skill.tagline,
        level: skill.level,
        highlight: skill.highlight,
        accentColor: meta.accentColor,
        bgClass: meta.bgClass,
        icon: meta.icon,
        ...layout,
      };
    });
  }, []);

  // Track stage size so the entrance can start every card from the centre
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setStageSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section id="skills" className="relative w-full py-10 px-4 select-none font-sans">
      {isDesktop ? (
        <div
          ref={stageRef}
          key={resetKey}
          className="relative w-full h-[50rem] max-w-7xl mx-auto"
        >
          {skillsList.map((skill, idx) => (
            <DraggableCard
              key={skill.id}
              stageRef={stageRef}
              skill={skill}
              order={idx}
              isInView={isInView}
              stageSize={stageSize}
            />
          ))}

          {/* Control bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]">
            <span className="flex items-center gap-2 text-[13px] text-zinc-400">
              <Move className="w-3.5 h-3.5 text-[#00F0FF]" />
              Drag the cards around
            </span>
            <button
              type="button"
              onClick={() => setResetKey((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[13px] text-[#00F0FF] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div ref={stageRef}>
          {/* Leave room for the particle word, then a simple grid on smaller screens */}
          <div className="h-56 sm:h-72 pointer-events-none" aria-hidden="true" />
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsList.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const SkillCard: React.FC<{ skill: SkillCardConfig; className?: string; style?: React.CSSProperties }> = ({ skill, className, style }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 backdrop-blur-xl bg-gradient-to-br transition-[border-color,box-shadow] duration-300",
        skill.bgClass,
        className
      )}
      style={{
        borderColor: `${skill.accentColor}44`,
        boxShadow: `0 18px 40px -16px ${skill.accentColor}55, 0 8px 20px -12px rgba(0,0,0,0.8)`,
        ...style,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-black/45 border border-white/10 text-zinc-200">
          {skill.highlight}
        </span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.accentColor }} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl bg-black/45 border flex items-center justify-center p-2 shrink-0"
          style={{ borderColor: `${skill.accentColor}40` }}
        >
          {skill.icon}
        </div>
        <h3 className="text-xl font-black text-white tracking-tight truncate">{skill.name}</h3>
      </div>

      <p className="text-[13px] text-zinc-200/85 line-clamp-2 leading-relaxed">{skill.tagline}</p>
    </div>
  );
};

interface DraggableCardProps {
  stageRef: React.RefObject<HTMLDivElement | null>;
  skill: SkillCardConfig;
  order: number;
  isInView: boolean;
  stageSize: { width: number; height: number };
}

let topZIndex = 10;

const DraggableCard: React.FC<DraggableCardProps> = ({ stageRef, skill, order, isInView, stageSize }) => {
  const [zIndex, setZIndex] = useState<number>(10);
  const reduceMotion = useReducedMotion();

  // Offset from this card's resting place back to the centre of the stage
  const fromCentre = {
    x: stageSize.width * (0.5 - skill.cx),
    y: stageSize.height * (0.5 - skill.cy),
  };

  const resting = { x: 0, y: 0, scale: 1, opacity: 1, rotate: skill.rotate };
  const gathered = { x: fromCentre.x, y: fromCentre.y, scale: 0.55, opacity: 0, rotate: 0 };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${skill.cx * 100}%`, top: `${skill.cy * 100}%`, zIndex }}
    >
      <motion.div
        onPointerDown={() => setZIndex(++topZIndex)}
        drag
        dragConstraints={stageRef}
        dragElastic={0.6}
        initial={reduceMotion ? resting : gathered}
        animate={isInView || reduceMotion ? resting : gathered}
        transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9, delay: reduceMotion ? 0 : order * 0.06 }}
        whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        whileDrag={{ scale: 1.06, rotate: 0, cursor: "grabbing" }}
        className="w-60 xl:w-64 cursor-grab touch-none"
      >
        <SkillCard skill={skill} />
      </motion.div>
    </div>
  );
};

export default SkillsSection;

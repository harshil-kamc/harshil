import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, FolderGit2, Globe2, Move, Trophy, X } from "lucide-react";
import {
  COMPETITIONS_LIST,
  PROJECTS_DATA,
  SKILLS,
  SKILL_GROUP_COLORS,
  Skill,
  SkillEvidence,
  SkillGroup,
} from "../data/portfolioData";
import { Reveal, useReducedMotion } from "./ScrollMotion";

const GROUPS = Object.keys(SKILL_GROUP_COLORS) as SkillGroup[];

interface ResolvedEvidence {
  key: string;
  kind: SkillEvidence["kind"];
  title: string;
  detail: string;
  href?: string;
}

interface SkillNode extends Skill {
  index: number;
  color: string;
  evidence: ResolvedEvidence[];
  /** Resting position on the unit sphere */
  base: { x: number; y: number; z: number };
}

const resolveEvidence = (item: SkillEvidence): ResolvedEvidence | null => {
  if (item.kind === "site") {
    return { key: "site", kind: "site", title: item.label, detail: "Live on this page" };
  }
  if (item.kind === "project") {
    const project = PROJECTS_DATA.find((p) => p.id === item.id);
    if (!project) return null;
    return {
      key: `project:${project.id}`,
      kind: "project",
      title: project.title,
      detail: [project.role, project.hackathonName].filter(Boolean).join(" · "),
      href: "#projects",
    };
  }
  const comp = COMPETITIONS_LIST.find((c) => c.id === item.id);
  if (!comp) return null;
  return {
    key: `event:${comp.id}`,
    kind: "event",
    title: comp.title,
    detail: `${comp.result} · ${comp.date}`,
    href: "#competitions",
  };
};

// Fibonacci lattice: evenly spread points, so tiles never bunch up at the poles.
// SKILLS is ordered by group, so each group settles into its own band of the globe.
const buildNodes = (): SkillNode[] => {
  const n = SKILLS.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return SKILLS.map((skill, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return {
      ...skill,
      index: i + 1,
      color: SKILL_GROUP_COLORS[skill.group],
      evidence: skill.usedIn.map(resolveEvidence).filter((e): e is ResolvedEvidence => e !== null),
      base: { x: Math.cos(theta) * r, y: y * 0.92, z: Math.sin(theta) * r },
    };
  });
};

// Skills that share a project, event or this site
const relatedTo = (nodes: SkillNode[], i: number) => {
  const keys = new Set(nodes[i].evidence.map((e) => e.key));
  if (!keys.size) return [];
  return nodes.filter((n, j) => j !== i && n.evidence.some((e) => keys.has(e.key))).map((n) => n.index - 1);
};

// Shortest signed angle from a to b
const angleDelta = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

const PERSPECTIVE = 3.2;
const AUTO_SPIN = 0.0032;

const project = (p: { x: number; y: number; z: number }, rx: number, ry: number) => {
  const x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
  const z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
  const y2 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);
  const s = PERSPECTIVE / (PERSPECTIVE - z2);
  return { x: x1 * s, y: y2 * s, z: z2, s };
};

interface SkillGlobeProps {
  nodes: SkillNode[];
  selected: number | null;
  related: number[];
  highlightGroup: SkillGroup | null;
  onSelect: (index: number) => void;
}

function SkillGlobe({ nodes, selected, related, highlightGroup, onSelect }: SkillGlobeProps) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Animation state lives in refs so the 60fps loop never re-renders React
  const rot = useRef({ x: -0.32, y: 0.4 });
  const vel = useRef({ x: 0, y: AUTO_SPIN });
  const target = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef({ active: false, moved: false, lastX: 0, lastY: 0, startX: 0, startY: 0 });
  const suppressClick = useRef(false);
  const size = useRef(560);
  const inView = useRef(false);

  // Live copies of props for the loop
  const live = useRef({ selected, related, highlightGroup, reduceMotion });
  live.current = { selected, related, highlightGroup, reduceMotion };

  // Turn the globe so the selected tile faces the viewer
  useEffect(() => {
    if (selected === null) {
      target.current = null;
      return;
    }
    const p = nodes[selected].base;
    const ty = Math.atan2(-p.x, p.z);
    const zAfterY = -p.x * Math.sin(ty) + p.z * Math.cos(ty);
    const tx = Math.atan2(p.y, zAfterY);
    target.current = {
      x: rot.current.x + angleDelta(rot.current.x, tx),
      y: rot.current.y + angleDelta(rot.current.y, ty),
    };
    if (reduceMotion) rot.current = { ...target.current };
  }, [selected, nodes, reduceMotion]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const width = stage.offsetWidth;
      size.current = width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = width * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    const viewObserver = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    });
    viewObserver.observe(stage);

    // Wireframe rings on the unit sphere, sampled once
    const SEGMENTS = 72;
    const rings: { x: number; y: number; z: number }[][] = [];
    for (const lat of [-0.66, -0.33, 0, 0.33, 0.66]) {
      const r = Math.sqrt(1 - lat * lat);
      rings.push(Array.from({ length: SEGMENTS + 1 }, (_, k) => {
        const a = (k / SEGMENTS) * Math.PI * 2;
        return { x: Math.cos(a) * r, y: lat, z: Math.sin(a) * r };
      }));
    }
    for (let m = 0; m < 6; m++) {
      const lon = (m / 6) * Math.PI;
      rings.push(Array.from({ length: SEGMENTS + 1 }, (_, k) => {
        const a = (k / SEGMENTS) * Math.PI * 2;
        return { x: Math.cos(a) * Math.cos(lon), y: Math.sin(a), z: Math.cos(a) * Math.sin(lon) };
      }));
    }

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!inView.current) return;
      const { selected: sel, related: rel, highlightGroup: group, reduceMotion: still } = live.current;

      if (!drag.current.active) {
        if (target.current) {
          rot.current.x += (target.current.x - rot.current.x) * 0.09;
          rot.current.y += (target.current.y - rot.current.y) * 0.09;
        } else {
          const spin = still ? 0 : AUTO_SPIN;
          vel.current.y += (spin - vel.current.y) * 0.025;
          vel.current.x *= 0.94;
          rot.current.y += vel.current.y;
          rot.current.x = Math.max(-1.1, Math.min(1.1, rot.current.x + vel.current.x));
        }
      }

      const W = size.current;
      const R = W * 0.34;
      const cx = W / 2;
      const { x: rx, y: ry } = rot.current;

      // Wireframe: back half faint, front half brighter
      ctx.clearRect(0, 0, W, W);
      const glow = ctx.createRadialGradient(cx, cx, R * 0.1, cx, cx, R * 1.45);
      glow.addColorStop(0, "rgba(0, 240, 255, 0.07)");
      glow.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, W);

      for (const front of [false, true]) {
        ctx.beginPath();
        for (const ring of rings) {
          let prev = project(ring[0], rx, ry);
          for (let k = 1; k < ring.length; k++) {
            const cur = project(ring[k], rx, ry);
            if ((prev.z + cur.z >= 0) === front) {
              ctx.moveTo(cx + prev.x * R, cx + prev.y * R);
              ctx.lineTo(cx + cur.x * R, cx + cur.y * R);
            }
            prev = cur;
          }
        }
        ctx.strokeStyle = front ? "rgba(148, 230, 255, 0.16)" : "rgba(148, 230, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const projected = nodes.map((n) => project(n.base, rx, ry));

      // Links from the selected skill to the skills it is used with
      if (sel !== null) {
        const a = projected[sel];
        for (const j of rel) {
          const b = projected[j];
          const mx = cx + ((a.x + b.x) / 2) * R * 1.25;
          const my = cx + ((a.y + b.y) / 2) * R * 1.25;
          const alpha = 0.25 + 0.45 * ((b.z + 1) / 2);
          ctx.beginPath();
          ctx.moveTo(cx + a.x * R, cx + a.y * R);
          ctx.quadraticCurveTo(mx, my, cx + b.x * R, cx + b.y * R);
          ctx.strokeStyle = `${nodes[sel].color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
      }

      // Tiles
      projected.forEach((p, i) => {
        const el = tileRefs.current[i];
        if (!el) return;
        const depth = (p.z + 1) / 2;
        const isActive = sel === i;
        const dimmed =
          (group !== null && nodes[i].group !== group) || (sel !== null && !isActive && !rel.includes(i));
        const opacity = (0.28 + 0.72 * depth) * (dimmed ? 0.35 : 1);
        el.style.transform = `translate3d(${cx + p.x * R}px, ${cx + p.y * R}px, 0) translate(-50%, -50%) scale(${(0.62 + 0.38 * depth) * p.s * (isActive ? 1.12 : 1)})`;
        el.style.opacity = String(isActive ? 1 : opacity);
        el.style.zIndex = String(isActive ? 200 : Math.round(depth * 100));
        // Tiles on the far side should not steal clicks from those in front
        el.style.pointerEvents = p.z < -0.35 ? "none" : "auto";
      });
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [nodes]);

  // Drag to spin. Pointer capture starts only after real movement, so plain taps still reach the tiles.
  const handlePointerDown = (e: React.PointerEvent) => {
    drag.current = { active: false, moved: false, lastX: e.clientX, lastY: e.clientY, startX: e.clientX, startY: e.clientY };
    const onMove = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d.moved && Math.hypot(ev.clientX - d.startX, ev.clientY - d.startY) < 6) return;
      if (!d.moved) {
        d.moved = true;
        d.active = true;
        target.current = null;
      }
      const dx = ev.clientX - d.lastX;
      const dy = ev.clientY - d.lastY;
      d.lastX = ev.clientX;
      d.lastY = ev.clientY;
      rot.current.y += dx * 0.0065;
      rot.current.x = Math.max(-1.1, Math.min(1.1, rot.current.x - dy * 0.0065));
      vel.current = { x: -dy * 0.0065, y: dx * 0.0065 };
    };
    const onUp = () => {
      if (drag.current.moved) {
        suppressClick.current = true;
        setTimeout(() => (suppressClick.current = false), 0);
      }
      drag.current.active = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* Solid core so the fixed particle word behind the section doesn't show through the globe */}
        <div
          className="absolute inset-[6%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #0A0B10 0%, #0A0B10 58%, rgba(10,11,16,0.85) 66%, rgba(10,11,16,0) 74%)" }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
        {nodes.map((node, i) => (
          <button
            key={node.name}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            type="button"
            onClick={() => {
              if (!suppressClick.current) onSelect(i);
            }}
            aria-pressed={selected === i}
            aria-label={`${node.name}, ${node.group}`}
            className="group absolute left-0 top-0 will-change-transform rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00F0FF] cursor-pointer"
          >
            <ElementTile node={node} active={selected === i} />
          </button>
        ))}
      </div>
      <p className="mt-2 flex items-center justify-center gap-2 text-[12px] text-zinc-400">
        <Move className="w-3.5 h-3.5 text-[#00F0FF]" />
        Drag to spin, tap a tile to see where it's used
      </p>
    </div>
  );
}

// Periodic-table style tile: atomic number, symbol, name
function ElementTile({ node, active, large = false }: { node: SkillNode; active?: boolean; large?: boolean }) {
  return (
    <span
      className={`relative block rounded-xl border transition-transform duration-300 ease-out ${
        large ? "w-[88px] h-[88px] sm:w-24 sm:h-24" : "w-10 h-10 sm:w-[62px] sm:h-[62px] group-hover:scale-110"
      }`}
      style={{
        borderColor: active ? node.color : `${node.color}55`,
        background: `linear-gradient(150deg, ${node.color}2E 0%, #0B0D12 72%)`,
        boxShadow: active
          ? `0 0 0 1px ${node.color}, 0 0 28px ${node.color}66`
          : `0 10px 20px -10px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <span className={`absolute font-mono text-white/45 tabular-nums ${large ? "top-1.5 left-2 text-[10px]" : "top-0.5 left-1 sm:top-1 sm:left-1.5 text-[7px] sm:text-[8px]"}`}>
        {node.index}
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center font-semibold tracking-tight ${
          large ? "text-[34px] sm:text-[38px] -mt-1" : "text-[15px] sm:text-[22px] -mt-0.5"
        }`}
        style={{ color: node.color }}
      >
        {node.symbol}
      </span>
      <span
        className={`absolute inset-x-1 text-center uppercase tracking-[0.06em] text-white/60 truncate ${
          large ? "bottom-2 text-[9.5px]" : "hidden sm:block bottom-1 text-[7.5px]"
        }`}
      >
        {node.name}
      </span>
    </span>
  );
}

const EVIDENCE_ICON = { project: FolderGit2, event: Trophy, site: Globe2 } as const;
const EVIDENCE_LABEL = { project: "Project", event: "Competition", site: "This site" } as const;

export function SkillsSection() {
  const nodes = useMemo(buildNodes, []);
  const [selected, setSelected] = useState<number | null>(null);
  const [highlightGroup, setHighlightGroup] = useState<SkillGroup | null>(null);
  const related = useMemo(() => (selected === null ? [] : relatedTo(nodes, selected)), [nodes, selected]);
  const backedCount = nodes.filter((n) => n.evidence.length > 0).length;

  const select = useCallback((i: number) => {
    setHighlightGroup(null);
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  const node = selected === null ? null : nodes[selected];

  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative w-full py-24 px-4 sm:px-6 font-sans z-10 overflow-x-clip">
      <h2 id="skills-heading" className="sr-only">Skills</h2>
      <div className="pt-8" />
      {/* Particle Canvas Viewing Window for "SKILLS" */}
      <div className="h-80 min-h-[17.5rem] w-full pointer-events-none" aria-hidden="true" />

      <Reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 lg:gap-12 items-center">
        <SkillGlobe nodes={nodes} selected={selected} related={related} highlightGroup={highlightGroup} onSelect={select} />

        <div className="relative z-10 rounded-3xl border border-white/10 bg-[#0B0C11]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl min-h-[26rem] flex flex-col" aria-live="polite">
          {node ? (
            <>
              <div className="flex items-start gap-5">
                <ElementTile node={node} active large />
                <div className="min-w-0 flex-1 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: node.color }}>
                    {node.group}
                  </span>
                  <h3 className="mt-1 text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-tight">{node.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Back to all skills"
                  className="shrink-0 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-zinc-300">{node.summary}</p>

              <h4 className="mt-7 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400">Where it shows up</h4>
              {node.evidence.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {node.evidence.map((item) => {
                    const Icon = EVIDENCE_ICON[item.kind];
                    const body = (
                      <>
                        <span
                          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
                          style={{ borderColor: `${node.color}44`, backgroundColor: `${node.color}14`, color: node.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-semibold text-white truncate">{item.title}</span>
                          <span className="block text-[12px] text-zinc-400 truncate">
                            {EVIDENCE_LABEL[item.kind]} · {item.detail}
                          </span>
                        </span>
                        {item.href && (
                          <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </>
                    );
                    return (
                      <li key={`${item.key}-${item.title}`}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                          >
                            {body}
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-2.5 -mx-2.5">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-[13px] text-zinc-400">Practised through coursework and problem solving. No public project linked yet.</p>
              )}

              {related.length > 0 && (
                <>
                  <h4 className="mt-7 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400">Used alongside</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {related.map((j) => (
                      <button
                        key={nodes[j].name}
                        type="button"
                        onClick={() => select(j)}
                        className="inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[12.5px] text-zinc-300 hover:text-white hover:border-white/25 transition-colors cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-semibold" style={{ color: nodes[j].color, backgroundColor: `${nodes[j].color}1F` }}>
                          {nodes[j].symbol}
                        </span>
                        {nodes[j].name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#00F0FF]">Skills</span>
              <h3 className="mt-2 text-[28px] sm:text-[34px] font-bold text-white tracking-tight leading-[1.1] text-balance">
                My stack, as a periodic table
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                Each tile is a skill. Pick one to see the projects and competitions where I used it, and what I used it with.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  [String(nodes.length), "Skills"],
                  [String(GROUPS.length), "Groups"],
                  [String(backedCount), "Backed by work"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                    <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-400">{label}</div>
                  </div>
                ))}
              </div>

              <h4 className="mt-7 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400">Groups</h4>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {GROUPS.map((group) => {
                  const members = nodes.filter((n) => n.group === group);
                  return (
                    <li key={group}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlightGroup(group)}
                        onMouseLeave={() => setHighlightGroup(null)}
                        onFocus={() => setHighlightGroup(group)}
                        onBlur={() => setHighlightGroup(null)}
                        onClick={() => select(members[0].index - 1)}
                        className="w-full flex items-center gap-2.5 py-1.5 text-left text-[13.5px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: SKILL_GROUP_COLORS[group] }} />
                        <span className="flex-1">{group}</span>
                        <span className="text-[12px] font-mono text-zinc-400 tabular-nums">{members.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export default SkillsSection;

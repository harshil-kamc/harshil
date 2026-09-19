"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const DESKTOP_WIDTH = 1200;
const TABLET_MIN_WIDTH = 768;

const DEPTH_MIN = -1;
const DEPTH_MAX = 1;
const Z_INDEX_MIN = 1;

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
];

const defaultItems: CircularSplitRollItem[] = [
  { id: 0, title: "Aperture", image: IMAGES[0], alt: "Aperture" },
  { id: 1, title: "Lumen", image: IMAGES[1], alt: "Lumen" },
  { id: 2, title: "Halcyon", image: IMAGES[2], alt: "Halcyon" },
  { id: 3, title: "Meridian", image: IMAGES[3], alt: "Meridian" },
  { id: 4, title: "Cascade", image: IMAGES[4], alt: "Cascade" },
  { id: 5, title: "Vertex", image: IMAGES[5], alt: "Vertex" },
  { id: 6, title: "Solace", image: IMAGES[6], alt: "Solace" },
  { id: 7, title: "Quill", image: IMAGES[7], alt: "Quill" },
  { id: 8, title: "Ember", image: IMAGES[8], alt: "Ember" },
  { id: 9, title: "Drift", image: IMAGES[9], alt: "Drift" },
];

function wrapProgress(value: number) {
  let wrappedValue = value % 1;

  if (wrappedValue < 0) {
    wrappedValue += 1;
  }

  return wrappedValue;
}

function getCircularPosition(
  progress: number,
  radiusX: number,
  radiusY: number,
  angleOffset = 0
) {
  const angle = progress * Math.PI * 2 + angleOffset;

  return {
    angle,
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
    verticalDepth: Math.cos(angle),
    horizontalDepth: Math.sin(angle),
  };
}

function signedWrap(val: number) {
  let v = (val + 0.5) % 1;
  if (v < 0) v += 1;
  return v - 0.5;
}

function getStrength(value: number) {
  return gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, 0, 1, value)
  );
}

function shapeFocus(strength: number, start = 0.42, power = 2.8) {
  const normalized = gsap.utils.clamp(0, 1, (strength - start) / (1 - start));
  return Math.pow(normalized, power);
}

export interface CircularSplitRollItem {
  id?: string | number;
  title?: string;
  image?: string;
  alt?: string;
  subtitle?: string;
  tag?: string;
  data?: any;
}

export interface CircularSplitRollCompProps {
  items?: CircularSplitRollItem[];
  className?: string;
  /** Optional background override. Falls back to the theme `bg-background`. */
  background?: string;
  /** Optional title color override. Falls back to the theme `text-foreground`. */
  titleColor?: string;
  sectionHeight?: number;
  leftRadiusX?: number;
  leftRadiusY?: number;
  rightRadiusX?: number;
  rightRadiusY?: number;
  imageCardWidth?: number;
  imageCardHeight?: number;
  titleSize?: string;
  pinSpacing?: boolean;
  scrub?: number;
  textCenterScale?: number;
  textSideScale?: number;
  textCenterOpacity?: number;
  textSideOpacity?: number;
  imageCenterScale?: number;
  imageSideScale?: number;
  imageCenterOpacity?: number;
  imageSideOpacity?: number;
  textFocusStart?: number;
  textFocusPower?: number;
  imageFocusStart?: number;
  imageFocusPower?: number;
  /** Angle (radians) on the circle where a title comes into focus. */
  leftAngleOffset?: number;
  /** Angle (radians) on the circle where an image comes into focus. */
  rightAngleOffset?: number;
  /** Which item sits on the focus arc, in item-fractions. 0.5 = between two, 0 = on one. */
  focusPhase?: number;
  /** Max z-index applied to the focused title / image (depth stacking). */
  leftDepthMax?: number;
  rightDepthMax?: number;
  /** Column horizontal offset: translateX(calc(<columnSpreadVw>vw - <columnOffsetPx>px)). */
  columnSpreadVw?: number;
  columnOffsetPx?: number;
  gridImageClassName?: string;
  gridCardClassName?: string;
  gridTitleClassName?: string;
  onItemClick?: (item: CircularSplitRollItem) => void;
}

export function CircularSplitRollComp({
  items = defaultItems,
  className = "",
  background,
  titleColor,
  sectionHeight = 260,

  leftRadiusX = 420,
  leftRadiusY = 440,
  rightRadiusX = 420,
  rightRadiusY = 440,

  imageCardWidth = 240,
  imageCardHeight = 250,
  titleSize = "clamp(28px, 3.2vw, 54px)",

  pinSpacing = true,
  scrub = 1.0,

  textCenterScale = 1,
  textSideScale = 0.65,
  textCenterOpacity = 1,
  textSideOpacity = 0.15,

  imageCenterScale = 1,
  imageSideScale = 0.65,
  imageCenterOpacity = 1,
  imageSideOpacity = 0.15,

  textFocusStart = 0.40,
  textFocusPower = 2.4,
  imageFocusStart = 0.40,
  imageFocusPower = 2.4,

  leftAngleOffset = Math.PI,
  rightAngleOffset = 0,
  focusPhase = 0.5,
  leftDepthMax = 30,
  rightDepthMax = 40,
  columnSpreadVw = 5,
  columnOffsetPx = 420,

  gridImageClassName = "",
  gridCardClassName = "",
  gridTitleClassName = "",
  onItemClick,
}: CircularSplitRollCompProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const safeItems = useMemo(() => {
    return items.map((item, index) => ({
      id: item.id ?? index,
      title: item.title ?? `Item ${index + 1}`,
      image: item.image ?? "",
      alt: item.alt ?? item.title ?? `Item ${index + 1}`,
      subtitle: item.subtitle,
      tag: item.tag,
      data: item.data,
    }));
  }, [items]);

  useEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const leftNodes = gsap.utils.toArray(
          ".circular-scroll-showcase__left-item"
        ) as HTMLElement[];
        const rightNodes = gsap.utils.toArray(
          ".circular-scroll-showcase__right-item"
        ) as HTMLElement[];

        const total = safeItems.length;

        if (!total) return;

        gsap.set([...leftNodes, ...rightNodes], { opacity: 1 });

        const render = (scrollProgress: number) => {
          progressRef.current = scrollProgress;

          const width =
            typeof window !== "undefined" ? window.innerWidth : DESKTOP_WIDTH;

          let factor = 1;

          if (width < DESKTOP_WIDTH && width >= TABLET_MIN_WIDTH) {
            factor = width / DESKTOP_WIDTH;
          }

          const leftRadiusScaledX = leftRadiusX * factor;
          const leftRadiusScaledY = leftRadiusY * factor;
          const rightRadiusScaledX = rightRadiusX * factor;
          const rightRadiusScaledY = rightRadiusY * factor;

          if (rootRef.current) {
            rootRef.current.style.setProperty(
              "--css-card-width",
              `${imageCardWidth * factor}px`
            );

            rootRef.current.style.setProperty(
              "--css-card-height",
              `${imageCardHeight * factor}px`
            );
          }

          leftNodes.forEach((node, index) => {
            const signedProgress = signedWrap(index / total - scrollProgress);
            const angle = -signedProgress * 2 * Math.PI + 0.5 * Math.PI;

            const x = Math.sin(angle) * leftRadiusScaledX;
            const y = Math.cos(angle) * leftRadiusScaledY;
            const horizontalDepth = Math.sin(angle);

            const rawStrength = getStrength(horizontalDepth);
            const focusStrength = shapeFocus(
              rawStrength,
              textFocusStart,
              textFocusPower
            );

            const scale = gsap.utils.interpolate(
              textSideScale,
              textCenterScale,
              focusStrength
            );

            const opacity = gsap.utils.interpolate(
              textSideOpacity,
              textCenterOpacity,
              focusStrength
            );

            const zIndex = Math.round(
              gsap.utils.interpolate(Z_INDEX_MIN, leftDepthMax, focusStrength)
            );

            const isClickable = focusStrength > 0.38;

            gsap.set(node, {
              x,
              y,
              scale,
              opacity,
              zIndex,
              pointerEvents: isClickable ? "auto" : "none",
              cursor: isClickable ? "pointer" : "default",
              transformOrigin: "50% 50%",
            });
          });

          rightNodes.forEach((node, index) => {
            const signedProgress = signedWrap(index / total - scrollProgress);
            const angle = -signedProgress * 2 * Math.PI + 0.5 * Math.PI;

            // Perfectly synchronized horizontal & vertical position
            const x = -Math.sin(angle) * rightRadiusScaledX;
            const y = Math.cos(angle) * rightRadiusScaledY;
            const horizontalDepth = Math.sin(angle);

            const rawStrength = getStrength(horizontalDepth);
            const focusStrength = shapeFocus(
              rawStrength,
              imageFocusStart,
              imageFocusPower
            );

            const scale = gsap.utils.interpolate(
              imageSideScale,
              imageCenterScale,
              focusStrength
            );

            const opacity = gsap.utils.interpolate(
              imageSideOpacity,
              imageCenterOpacity,
              focusStrength
            );

            const zIndex = Math.round(
              gsap.utils.interpolate(Z_INDEX_MIN, rightDepthMax, focusStrength)
            );

            const isClickable = focusStrength > 0.38;

            gsap.set(node, {
              x,
              y,
              scale,
              opacity,
              zIndex,
              pointerEvents: isClickable ? "auto" : "none",
              cursor: isClickable ? "pointer" : "default",
              transformOrigin: "50% 50%",
            });
          });
        };

        render(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: `+=${sectionHeight * safeItems.length}%`,
          pin: stickyRef.current,
          scrub,
          pinSpacing,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            render(self.progress);
          },
        });

        const onResize = () => {
          render(progressRef.current);
          scrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          scrollTrigger.kill();
        };
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [
    safeItems,
    scrub,
    pinSpacing,
    sectionHeight,
    leftRadiusX,
    leftRadiusY,
    rightRadiusX,
    rightRadiusY,
    imageCardWidth,
    imageCardHeight,
    textCenterScale,
    textSideScale,
    textCenterOpacity,
    textSideOpacity,
    imageCenterScale,
    imageSideScale,
    imageCenterOpacity,
    imageSideOpacity,
    textFocusStart,
    textFocusPower,
    imageFocusStart,
    imageFocusPower,
    leftAngleOffset,
    rightAngleOffset,
    focusPhase,
    leftDepthMax,
    rightDepthMax,
  ]);

  return (
    <section
      ref={rootRef}
      className={`relative min-h-screen w-full overflow-clip ${background ? "" : "bg-background"} ${titleColor ? "" : "text-foreground"} ${className}`}
      style={{
        "--css-title-size": titleSize,
        "--css-card-width": `${imageCardWidth}px`,
        "--css-card-height": `${imageCardHeight}px`,
        ...(background ? { background } : null),
        ...(titleColor ? { color: titleColor } : null),
      } as React.CSSProperties & Record<string, string | number>}
    >
      <div
        ref={stickyRef}
        aria-hidden="false"
        className={`relative h-screen w-full overflow-hidden ${reducedMotion ? "hidden" : "max-[1025px]:hidden"}`}
      >
        <div className="relative mx-auto flex h-full w-full">
          {/* Left Arc: Titles */}
          <div
            className="relative flex h-full w-[50vw] items-center justify-center"
            style={{ transform: `translateX(calc(${columnSpreadVw}vw - ${columnOffsetPx}px))` }}
          >
            <div className="relative h-[78vh]">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick?.(item);
                  }}
                  style={{ fontSize: "var(--css-title-size, clamp(28px, 3.2vw, 54px))" }}
                  className="circular-scroll-showcase__left-item absolute left-1/2 top-1/2 w-[460px] -ml-[230px] -mt-[45px] origin-center whitespace-nowrap text-center font-medium leading-none tracking-[-0.04em] opacity-0 will-change-[transform,opacity]"
                >
                  <div className="group cursor-pointer inline-flex flex-col items-center">
                    <span className="drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] text-white group-hover:text-[#00F0FF] transition-colors duration-200">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <div className="text-xs font-mono font-semibold tracking-wider text-cyan-400/90 mt-2 uppercase">
                        {item.subtitle}
                      </div>
                    )}
                    {item.tag && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono text-cyan-300">
                        <span>🏆 {item.tag}</span>
                      </div>
                    )}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        <span>Open Project Info</span>
                        <span>↗</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arc: Image Cards */}
          <div
            className="relative flex h-full w-[50vw] items-center justify-center"
            style={{ transform: `translateX(calc(${columnOffsetPx}px - ${columnSpreadVw}vw))` }}
          >
            <div className="relative h-[78vh]">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick?.(item);
                  }}
                  style={{
                    width: "var(--css-card-width, 240px)",
                    height: "var(--css-card-height, 250px)",
                    marginLeft: "calc(var(--css-card-width, 240px) * -0.5)",
                    marginTop: "calc(var(--css-card-height, 250px) * -0.5)",
                  }}
                  className="circular-scroll-showcase__right-item absolute left-1/2 top-1/2 origin-center opacity-0 will-change-[transform,opacity] group cursor-pointer"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-zinc-900/90 border border-white/15 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,240,255,0.2)] group-hover:border-[#00F0FF] group-hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="pointer-events-none block h-full w-full select-none object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                    {item.tag && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300 shadow-md">
                          {item.tag}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00F0FF] text-zinc-950 font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.8)]">
                        <span>View Project</span>
                        <span>↗</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Grid View for Mobile / Reduced Motion */}
      <div className={`w-full px-5 py-10 max-md:px-4 max-md:py-8 ${reducedMotion ? "block" : "sr-only max-[1025px]:not-sr-only max-[1025px]:block"}`}>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-5 max-md:grid-cols-2 max-md:gap-4">
          {safeItems.map((item) => (
            <article
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={`w-full ${onItemClick ? "cursor-pointer group" : ""} ${gridCardClassName}`}
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-[18px] bg-zinc-900 border border-white/10 shadow-[0_18px_38px_rgba(0,0,0,0.5)] max-md:rounded-[14px] group-hover:border-[#00F0FF]/50 transition-all ${gridImageClassName}`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="block h-full w-full object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                {item.tag && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[9px] font-mono text-cyan-300">
                    {item.tag}
                  </span>
                )}
              </div>

              <h3
                className={`mt-3 text-center text-[clamp(18px,4vw,30px)] font-medium leading-none tracking-[-0.04em] text-white group-hover:text-[#00F0FF] transition-colors max-md:mt-2 max-md:text-[clamp(16px,5vw,24px)] ${gridTitleClassName}`}
              >
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface CircularSplitRollProps
  extends Omit<
    CircularSplitRollCompProps,
    "leftRadiusX" | "leftRadiusY" | "rightRadiusX" | "rightRadiusY" | "imageCardWidth" | "imageCardHeight"
  > {
  /** Sets all four arc radii at once (leftRadiusX/Y, rightRadiusX/Y). */
  radius?: number;
  /** Sets both card dimensions at once (imageCardWidth/Height). */
  cardSize?: number;
  leftRadiusX?: number;
  leftRadiusY?: number;
  rightRadiusX?: number;
  rightRadiusY?: number;
  imageCardWidth?: number;
  imageCardHeight?: number;
}

export default function CircularSplitRoll({
  items = defaultItems,
  radius = 500,
  cardSize = 205,
  sectionHeight = 100,
  leftRadiusX,
  leftRadiusY,
  rightRadiusX,
  rightRadiusY,
  imageCardWidth,
  imageCardHeight,
  ...rest
}: CircularSplitRollProps) {
  return (
    <CircularSplitRollComp
      items={items}
      sectionHeight={sectionHeight}
      leftRadiusX={leftRadiusX ?? radius}
      leftRadiusY={leftRadiusY ?? radius}
      rightRadiusX={rightRadiusX ?? radius}
      rightRadiusY={rightRadiusY ?? radius}
      imageCardWidth={imageCardWidth ?? cardSize}
      imageCardHeight={imageCardHeight ?? cardSize}
      {...rest}
    />
  );
}

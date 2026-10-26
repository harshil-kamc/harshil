import { useState, useMemo, useEffect } from "react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { Project } from "../types/portfolio";
import { CoverflowCarousel, CoverflowSlide } from "@/components/ui/coverflow-carousel";
import {
  ExternalLink,
  Code2,
  X,
  Trophy,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { Reveal } from "./ScrollMotion";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState(0);

  const handleOpenProject = (proj: Project) => {
    setSelectedProject(proj);
    setActiveScreenshotIndex(0);
  };

  // Close modal on Escape key and prevent background body scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Convert PROJECTS_DATA to CoverflowSlide items
  const coverflowSlides: CoverflowSlide[] = useMemo(() => {
    return PROJECTS_DATA.map((proj) => ({
      src:
        proj.imageUrl ||
        "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=800&q=80",
      alt: proj.title,
      title: proj.title,
      subtitle: proj.role ? `${proj.role} • ${proj.category}` : proj.category,
      meta: [
        { label: "Category", value: proj.category },
        ...(proj.role ? [{ label: "Role", value: proj.role }] : []),
        ...(proj.hackathonName ? [{ label: "Hackathon", value: proj.hackathonName }] : []),
        ...(proj.metrics ? [{ label: "Award / Recognition", value: proj.metrics }] : []),
      ],
      data: proj,
    }));
  }, []);

  const activeProject = PROJECTS_DATA[activeProjectIndex] || PROJECTS_DATA[0];

  const handleSlideClick = (_slide: CoverflowSlide, index: number) => {
    const proj = PROJECTS_DATA[index];
    if (proj) {
      handleOpenProject(proj);
    }
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" className="pt-24 pb-8 px-4 sm:px-6 max-w-7xl mx-auto relative font-sans z-10">
      <h2 id="projects-heading" className="sr-only">Projects</h2>
      {/* Top Section Header */}
      <div className="h-80 min-h-[17.5rem] w-full pointer-events-none" aria-hidden="true" />

      <Reveal>
      {/* 3D Coverflow Carousel Showcase */}
      <div className="relative w-full max-w-5xl mx-auto py-2">
        <CoverflowCarousel
          slides={coverflowSlides}
          cardWidth="clamp(240px, 30vw, 360px)"
          rotate={42}
          depth={0.7}
          perspective={3}
          falloff={0.6}
          fade={0.15}
          gap={0.06}
          loop={true}
          showCaption={false}
          showNavigation={true}
          showPagination={false}
          onSlideClick={handleSlideClick}
          onActiveChange={(idx) => setActiveProjectIndex(idx)}
        />
      </div>

      {/* Active Project Highlight Banner & Action Bar */}
      {activeProject && (
        <div className="max-w-2xl mx-auto mt-6 p-6 rounded-3xl bg-zinc-950/70 border border-white/15 backdrop-blur-md text-center space-y-4 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#0891B2]/20 border border-[#0891B2]/30 text-[#00F0FF]">
              {activeProject.category}
            </span>
            {activeProject.role && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                {activeProject.role}
              </span>
            )}
            {activeProject.hackathonName && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#0891B2]/25 border border-[#00F0FF]/30 text-[#38BDF8] flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#00F0FF]" />
                {activeProject.hackathonName}
              </span>
            )}
            {activeProject.metrics && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                {activeProject.metrics}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeProject.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto line-clamp-2">
              {activeProject.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleOpenProject(activeProject)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00F0FF] hover:bg-[#38BDF8] text-zinc-950 font-bold text-xs font-mono transition-all shadow-lg shadow-[#00F0FF]/25 hover:scale-105 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Inspect Project Details</span>
            </button>

            {activeProject.demoUrl && activeProject.demoUrl !== "#" && (
              <a
                href={activeProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs font-mono transition-all hover:scale-105"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Live Site</span>
              </a>
            )}

            {activeProject.githubUrl && activeProject.githubUrl !== "#" && (
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white font-semibold text-xs font-mono transition-all hover:scale-105"
              >
                <Code2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>GitHub Repo</span>
              </a>
            )}
          </div>
        </div>
      )}

      </Reveal>

      {/* Project Detail Modal (Original faithful design) */}
      {selectedProject && (
        <div
          id="project-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-zinc-950/95 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-project-modal-btn"
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Image Banner / Gallery */}
            {selectedProject.imageUrl && (
              <div className="space-y-3">
                <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/60 group">
                  <img
                    src={
                      selectedProject.screenshots && selectedProject.screenshots.length > 0
                        ? selectedProject.screenshots[activeScreenshotIndex]
                        : selectedProject.imageUrl
                    }
                    alt={selectedProject.title}
                    className="w-full h-full object-contain bg-zinc-950/80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-12 flex items-center justify-between pointer-events-none">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/75 border border-white/20 text-[#00F0FF] backdrop-blur-md">
                      {selectedProject.category}
                    </span>
                    {selectedProject.screenshots && selectedProject.screenshots.length > 1 && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/80 border border-[#00F0FF]/30 text-[#00F0FF] backdrop-blur-md flex items-center gap-1.5">
                        <Images className="w-3.5 h-3.5" />
                        {activeScreenshotIndex + 1} / {selectedProject.screenshots.length}
                      </span>
                    )}
                  </div>

                  {/* Previous / Next Arrow Controls */}
                  {selectedProject.screenshots && selectedProject.screenshots.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveScreenshotIndex((prev) =>
                            prev === 0 ? selectedProject.screenshots!.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer hover:scale-110"
                        aria-label="Previous screenshot"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveScreenshotIndex((prev) =>
                            prev === selectedProject.screenshots!.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/65 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer hover:scale-110"
                        aria-label="Next screenshot"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {selectedProject.role && (
                    <div className="absolute bottom-3 left-4 pointer-events-none">
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/75 border border-white/20 text-zinc-300 backdrop-blur-md">
                        Role: {selectedProject.role}
                      </span>
                    </div>
                  )}
                </div>

                {/* Screenshot Thumbnails Strip */}
                {selectedProject.screenshots && selectedProject.screenshots.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedProject.screenshots.map((shot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveScreenshotIndex(idx)}
                        className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          idx === activeScreenshotIndex
                            ? "border-[#00F0FF] ring-2 ring-[#00F0FF]/40 scale-105"
                            : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={shot}
                          alt={`${selectedProject.title} screenshot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedProject.hackathonName && (
                  <span className="text-xs font-mono text-[#38BDF8] bg-[#0891B2]/20 border border-[#0891B2]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#00F0FF]" />
                    {selectedProject.hackathonName}
                  </span>
                )}
                {selectedProject.metrics && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                    {selectedProject.metrics}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedProject.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {selectedProject.longDescription || selectedProject.description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Technology Stack & Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#0891B2]/20 border border-[#0891B2]/30 text-[#38BDF8] text-xs font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: GitHub Code Files & Live Site */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {selectedProject.githubUrl && selectedProject.githubUrl !== "#" && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition-all hover:scale-105"
                  >
                    <Code2 className="w-4 h-4 text-[#00F0FF]" />
                    GitHub Repository
                  </a>
                )}

                {selectedProject.demoUrl && selectedProject.demoUrl !== "#" && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-[#00F0FF]/25 hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live Site
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;

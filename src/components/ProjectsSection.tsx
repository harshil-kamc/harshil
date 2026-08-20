import { useState } from "react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { Project } from "../types/portfolio";
import { ExternalLink, Code2, Sparkles, ChevronRight, X, Github, Trophy, Layers } from "lucide-react";

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["All", "Hackathons", "Full Stack", "AI & Tools"];

  const mainProjects = PROJECTS_DATA.filter((p) => !p.isOther);
  const otherProjects = PROJECTS_DATA.filter((p) => p.isOther);

  const filteredMainProjects = activeCategory === "All" 
    ? mainProjects
    : activeCategory === "Hackathons"
    ? mainProjects.filter((p) => Boolean(p.hackathonName))
    : mainProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-28 px-4 z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="h-80" />

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-emerald-500 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20 scale-105"
                  : "bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMainProjects.map((proj) => {
            const hasGithub = proj.githubUrl && proj.githubUrl !== "#";
            const hasDemo = proj.demoUrl && proj.demoUrl !== "#";

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group cursor-pointer bg-zinc-950/40 border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full shadow-2xl hover:border-emerald-500/40 hover:bg-white/[0.04] hover:scale-[1.01] transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
              >
                <div>
                  {/* Top Header: Title & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {proj.title}
                    </h4>
                    {proj.hackathonName && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                        <Trophy className="w-2.5 h-2.5 text-amber-400" />
                        Hackathon
                      </span>
                    )}
                  </div>

                  {/* Role Badge */}
                  {proj.role && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full font-mono">
                        Role: {proj.role}
                      </span>
                    </div>
                  )}

                  {/* Linked Hackathon Info Pill */}
                  {proj.hackathonName && (
                    <div className="mb-3">
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                        <span className="text-emerald-400">⚡</span>
                        <span>{proj.hackathonName}</span>
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed flex-grow">
                    {proj.description}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-row gap-3 mt-6 pt-5 border-t border-white/10 w-full" onClick={(e) => e.stopPropagation()}>
                  {hasGithub ? (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/15 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md"
                    >
                      <svg className="w-4 h-4 transform group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 border border-white/10 text-zinc-400 text-xs sm:text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  )}

                  {hasDemo ? (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span>View Site</span>
                      <ExternalLink className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium rounded-xl hover:bg-indigo-600/30 transition-all"
                    >
                      <span>Overview</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Projects Subsection */}
        {(activeCategory === "All" || activeCategory === "All Projects") && otherProjects.length > 0 && (
          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-lg md:text-xl text-indigo-300 font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Other Projects</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="cursor-pointer bg-zinc-950/40 border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-2xl hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-sm"
                >
                  <div className="space-y-2">
                    <h4 className="text-lg md:text-xl font-bold text-white">
                      {p.title}
                    </h4>
                    {p.role && (
                      <span className="inline-block px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full font-mono">
                        {p.role}
                      </span>
                    )}
                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed pt-1">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-emerald-400 text-xs flex items-center gap-1 hover:underline">
                      Inspect details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            id="project-detail-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-zinc-950/85 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="close-project-modal-btn"
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                  {selectedProject.role && (
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
                      Role: {selectedProject.role}
                    </span>
                  )}
                  {selectedProject.hackathonName && (
                    <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      {selectedProject.hackathonName}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-400">TECHNOLOGY STACK & TAGS</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: GitHub Code Files & Live Page */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {selectedProject.githubUrl && selectedProject.githubUrl !== "#" ? (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs transition-all hover:scale-105"
                    >
                      <Github className="w-4 h-4 text-emerald-400" />
                      GitHub Repository
                    </a>
                  ) : null}

                  {selectedProject.demoUrl && selectedProject.demoUrl !== "#" ? (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/25 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Site
                    </a>
                  ) : null}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

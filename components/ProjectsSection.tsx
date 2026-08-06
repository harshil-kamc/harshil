import { useState } from "react";
import { PROJECTS_DATA } from "../data/portfolioData";
import { Project } from "../types/portfolio";
import { FolderGit2, ExternalLink, Code2, Sparkles, Filter, ChevronRight, X } from "lucide-react";

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["All", "Web & Interactive", "AI & Tools", "Full Stack"];

  const filteredProjects = activeCategory === "All"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeCategory);

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
                  ? "bg-emerald-500 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20"
                  : "bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="group cursor-pointer bg-transparent border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                    {proj.category}
                  </span>
                  {proj.metrics && (
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      <Sparkles className="w-3 h-3" />
                      {proj.metrics}
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                    {proj.title}
                    <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              {/* Tag Badges & Footer */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400 text-[10px] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span className="group-hover:underline flex items-center gap-1">
                    View Project Details
                  </span>
                  <Code2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-in fade-in duration-200">
            <div className="bg-transparent border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-transparent border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-transparent border border-zinc-800/80 space-y-3">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-400">TECHNOLOGY STACK</span>
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
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

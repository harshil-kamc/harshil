import { useState } from "react";
import { COMPETITIONS_LIST, COMPETITION_CERTIFICATES_DRIVE_URL } from "../data/portfolioData";
import { Competition } from "../types/portfolio";
import {
  Trophy,
  Award,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
  FileCheck,
  FolderOpen,
  Zap,
  Target
} from "lucide-react";

export function CompetitionsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const filterTabs = [
    { label: "All Competitions", count: COMPETITIONS_LIST.length },
    { label: "Wins & Honors", count: COMPETITIONS_LIST.filter(c => c.isWinner).length },
    { label: "Offline Hackathons", count: COMPETITIONS_LIST.filter(c => c.type === "Offline Hackathon").length },
    { label: "Online Hackathons", count: COMPETITIONS_LIST.filter(c => c.type === "Online Hackathon").length },
    { label: "CTF & Security", count: COMPETITIONS_LIST.filter(c => c.type === "CTF Hackathon").length },
  ];

  const filteredCompetitions = COMPETITIONS_LIST.filter((comp) => {
    if (activeFilter === "All Competitions" || activeFilter === "All") return true;
    if (activeFilter === "Wins & Honors") return comp.isWinner;
    if (activeFilter === "Offline Hackathons") return comp.type === "Offline Hackathon";
    if (activeFilter === "Online Hackathons") return comp.type === "Online Hackathon";
    if (activeFilter === "CTF & Security") return comp.type === "CTF Hackathon";
    return true;
  });

  return (
    <section id="competitions" className="relative py-28 px-4 z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Particle Canvas Spacing */}
        <div className="h-80" />

        {/* Master Google Drive Folder Hero Callout */}
        <div className="relative overflow-hidden bg-zinc-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Competitive Track Record & Achievements</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>All Certificates Verified</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hackathons, CTFs & National Competitions
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Chronological record of 24-hour engineering sprints, offline hackathons, international CTF tournaments, and state-level policy honors with verified credentials.
              </p>
            </div>

            <a
              id="view-all-certificates-btn"
              href={COMPETITION_CERTIFICATES_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn shrink-0 inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <FolderOpen className="w-4 h-4 text-zinc-950" />
              <span>Open All Certificates (Drive)</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.label || (activeFilter === "All" && tab.label === "All Competitions");
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-emerald-500 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/25 scale-105"
                    : "bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-zinc-950/20 text-zinc-950 font-bold" : "bg-white/10 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp, index) => {
            const isFirstPlace = comp.awardRank === "1st";
            const isWinner = comp.isWinner;

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetition(comp)}
                className={`group cursor-pointer bg-zinc-950/40 backdrop-blur-sm border rounded-3xl p-6 space-y-5 shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] ${
                  isFirstPlace
                    ? "border-amber-500/40 hover:border-amber-400 shadow-amber-500/5 hover:bg-amber-500/[0.04]"
                    : isWinner
                    ? "border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/[0.04]"
                    : "border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.04]"
                }`}
              >
                {/* Background Glow For Winners */}
                {isWinner && (
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
                )}

                <div className="space-y-4 relative z-10">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Award Result Badge */}
                    {isFirstPlace ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        {comp.result}
                      </span>
                    ) : isWinner ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        {comp.result}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        {comp.result}
                      </span>
                    )}

                    {/* Timeline Sequence Index */}
                    <span className="text-[10px] font-mono text-zinc-500">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {comp.title}
                    </h4>
                    <p className="text-emerald-400 font-medium text-xs mt-1 flex items-center gap-1.5">
                      <Target className="w-3 h-3 shrink-0" />
                      <span>{comp.organizer}</span>
                    </p>
                  </div>

                  {/* Linked Project Banner if applicable */}
                  {comp.projectName && (
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-indigo-300 font-mono block uppercase tracking-wider">Built Project</span>
                        <span className="text-xs font-bold text-white truncate block">{comp.projectName}</span>
                      </div>
                      {comp.projectRole && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono shrink-0">
                          {comp.projectRole}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Details Pills */}
                  <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{comp.date}</span>
                    </div>

                    {comp.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{comp.venue}</span>
                      </div>
                    )}

                    {comp.teamName && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="text-zinc-300">{comp.teamName}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                {/* Card Footer & Certificate CTA */}
                <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {comp.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                    {comp.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 text-[10px] font-mono">
                        +{comp.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Details & Certificate Action */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-emerald-400 font-medium group-hover:underline flex items-center gap-1">
                      Details & Certificate
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      Certificate
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Modal */}
        {selectedCompetition && (
          <div
            id="competition-detail-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedCompetition(null)}
          >
            <div
              className="bg-zinc-950/85 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="close-competition-modal-btn"
                onClick={() => setSelectedCompetition(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-3 pr-10">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCompetition.isWinner ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      {selectedCompetition.result}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      {selectedCompetition.result}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">
                    {selectedCompetition.type}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {selectedCompetition.title}
                </h3>
                <p className="text-emerald-400 font-semibold text-sm">
                  {selectedCompetition.organizer}
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="block text-zinc-500 text-[10px]">DATE & DURATION</span>
                    <span className="text-zinc-200">{selectedCompetition.date} ({selectedCompetition.duration})</span>
                  </div>
                </div>

                {selectedCompetition.venue && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="block text-zinc-500 text-[10px]">VENUE / LOCATION</span>
                      <span className="text-zinc-200">{selectedCompetition.venue}</span>
                    </div>
                  </div>
                )}

                {selectedCompetition.teamName && (
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-zinc-500 text-[10px]">TEAM NAME</span>
                      <span className="text-zinc-200 font-semibold">{selectedCompetition.teamName}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="block text-zinc-500 text-[10px]">FOCUS AREA</span>
                    <span className="text-zinc-200">{selectedCompetition.projectOrFocus || "Software & Technology"}</span>
                  </div>
                </div>
              </div>

              {/* Description & Overview */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Competition Summary & Accomplishment
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {selectedCompetition.description}
                </p>
              </div>

              {/* Linked Project Card if applicable */}
              {selectedCompetition.projectName && (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wide">
                        Linked Project Built During Hackathon
                      </span>
                      {selectedCompetition.projectRole && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                          Role: {selectedCompetition.projectRole}
                        </span>
                      )}
                    </div>
                    <h5 className="text-base font-bold text-white">
                      {selectedCompetition.projectName}
                    </h5>
                    <p className="text-xs text-zinc-400">
                      View full source code, architecture, and live deployment in the Projects tab.
                    </p>
                  </div>

                  <a
                    href="#projects"
                    onClick={() => setSelectedCompetition(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shrink-0 shadow-lg shadow-indigo-600/30"
                  >
                    <span>View in Projects</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Certificate Verification Action Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white text-sm">Verified Participation / Winner Certificate</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Access the original certificate document in the verified Google Drive archive.
                  </p>
                </div>

                <a
                  id="modal-view-certificate-btn"
                  href={selectedCompetition.certificateUrl || COMPETITION_CERTIFICATES_DRIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>View in Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetition.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-xs font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

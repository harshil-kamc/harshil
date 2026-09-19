import { useState } from "react";
import {
  Trophy,
  Award,
  ExternalLink,
  Calendar,
  ChevronRight,
  Sparkles,
  Users,
  Zap,
  X,
  FileCheck,
  FolderOpen,
  MapPin,
  Target,
  BookOpen,
  LayoutGrid,
  Search,
  Maximize2,
  Info,
} from "lucide-react";
import {
  COMPETITIONS_LIST,
  COMPETITION_CERTIFICATES_DRIVE_URL,
  COMPETITION_FLIPBOOK_PAGES,
} from "../data/portfolioData";
import { Competition } from "../types/portfolio";
import { StPageFlipBook } from "./StPageFlipBook";

export function CompetitionsSection() {
  const [viewMode, setViewMode] = useState<"flipbook" | "grid">("flipbook");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  const filteredCompetitions = COMPETITIONS_LIST.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <section id="competitions" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative font-sans z-10">
      <div className="pt-8" />
      {/* Particle Canvas Viewing Window for "COMPETITIONS" */}
      <div className="h-84 min-h-[17.5rem] w-full pointer-events-none" aria-hidden="true" />

      {/* View Switcher & Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 bg-zinc-950/70 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode("flipbook")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === "flipbook"
                ? "bg-[#00F0FF] text-zinc-950 shadow-md shadow-[#00F0FF]/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3D Flipbook Magazine</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#00F0FF] text-zinc-950 shadow-md shadow-[#00F0FF]/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Cards Grid ({COMPETITIONS_LIST.length})</span>
          </button>
        </div>

        <a
          href={COMPETITION_CERTIFICATES_DRIVE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#00F0FF] text-xs font-mono transition-all hover:scale-105"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Google Drive Certificate Vault</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* View Mode 1: Interactive StPageFlip 3D Book */}
      {viewMode === "flipbook" && (
        <div className="animate-in fade-in duration-300">
          <div className="relative w-full overflow-visible p-0 sm:p-2 flex flex-col items-center justify-center bg-transparent border-0 shadow-none backdrop-blur-none">
            {/* Gallery Stage Banner */}
            <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-sm shadow-[#00F0FF]/60 animate-pulse" />
              </div>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                Drag corners to turn
              </span>
            </div>

            <StPageFlipBook
              onCompetitionSelect={(compData) => {
                if (compData) setSelectedCompetition(compData);
              }}
            />
          </div>
        </div>
      )}

      {/* View Mode 2: Competitions Grid */}
      {viewMode === "grid" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, organizers, or topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-zinc-950/70 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#00F0FF]/50 transition-colors backdrop-blur-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp, index) => {
              const isWinner = comp.isWinner;
              const isFirstPlace = comp.awardRank === "1st";

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompetition(comp)}
                  className={`group cursor-pointer bg-zinc-950/40 backdrop-blur-sm border rounded-3xl p-6 space-y-5 shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] ${
                    isFirstPlace
                      ? "border-[#00F0FF]/40 hover:border-[#00F0FF] shadow-[#00F0FF]/10 hover:bg-[#0891B2]/[0.08]"
                      : isWinner
                      ? "border-[#0891B2]/40 hover:border-[#38BDF8] hover:bg-[#0891B2]/[0.05]"
                      : "border-white/10 hover:border-[#00F0FF]/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Background Glow */}
                  {isWinner && (
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#0891B2]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00F0FF]/20 transition-all" />
                  )}

                  <div className="space-y-4 relative z-10">
                    {/* Top Badges Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {isFirstPlace ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold font-mono">
                          <Trophy className="w-3.5 h-3.5 text-[#00F0FF]" />
                          {comp.result}
                        </span>
                      ) : isWinner ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/20 border border-[#0891B2]/40 text-[#38BDF8] text-xs font-bold font-mono">
                          <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
                          {comp.result}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono">
                          <Zap className="w-3 h-3 text-[#00F0FF]" />
                          {comp.result}
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-zinc-500">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Title & Organizer */}
                    <div>
                      <h4 className="text-lg font-bold text-[#F5F5F5] group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                        {comp.title}
                      </h4>
                      <p className="text-[#00F0FF] font-medium text-xs mt-1 flex items-center gap-1.5">
                        <Target className="w-3 h-3 shrink-0" />
                        <span>{comp.organizer}</span>
                      </p>
                    </div>

                    {/* Linked Project Banner */}
                    {comp.projectName && (
                      <div className="p-3 rounded-2xl bg-[#0891B2]/15 border border-[#0891B2]/30 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#38BDF8] font-mono block uppercase tracking-wider">Built Project</span>
                          <span className="text-xs font-bold text-white truncate block">{comp.projectName}</span>
                        </div>
                        {comp.projectRole && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0891B2]/25 text-[#00F0FF] text-[10px] font-mono shrink-0">
                            {comp.projectRole}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Details */}
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
                    <div className="flex flex-wrap gap-1.5">
                      {comp.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-400 text-[10px] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#00F0FF] font-medium group-hover:underline flex items-center gap-1">
                        Details & Certificate
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                        <FileCheck className="w-3 h-3 text-[#00F0FF]" />
                        Certificate
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Modal for Competition */}
      {selectedCompetition && (
        <div
          id="competition-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedCompetition(null)}
        >
          <div
            className="bg-zinc-950/90 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-competition-modal-btn"
              onClick={() => setSelectedCompetition(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCompetition.isWinner ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold font-mono">
                    <Trophy className="w-4 h-4 text-[#00F0FF]" />
                    {selectedCompetition.result}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0891B2]/20 border border-[#0891B2]/40 text-[#38BDF8] text-xs font-bold font-mono">
                    <Zap className="w-4 h-4 text-[#38BDF8]" />
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
              <p className="text-[#00F0FF] font-semibold text-sm">
                {selectedCompetition.organizer}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <div>
                  <span className="block text-zinc-500 text-[10px]">DATE & DURATION</span>
                  <span className="text-zinc-200">{selectedCompetition.date} ({selectedCompetition.duration})</span>
                </div>
              </div>

              {selectedCompetition.venue && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <div>
                    <span className="block text-zinc-500 text-[10px]">VENUE / LOCATION</span>
                    <span className="text-zinc-200">{selectedCompetition.venue}</span>
                  </div>
                </div>
              )}

              {selectedCompetition.teamName && (
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <div>
                    <span className="block text-zinc-500 text-[10px]">TEAM NAME</span>
                    <span className="text-zinc-200 font-semibold">{selectedCompetition.teamName}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <div>
                  <span className="block text-zinc-500 text-[10px]">FOCUS AREA</span>
                  <span className="text-zinc-200">{selectedCompetition.projectOrFocus || "Software & Technology"}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Summary & Accomplishment
              </h4>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {selectedCompetition.description}
              </p>
            </div>

            {/* Event Photo Gallery if Available (e.g. TKR Hackconquest 2.0) */}
            {selectedCompetition.images && selectedCompetition.images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Hackathon Photo Archive ({selectedCompetition.images.length} Photos)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">Verified Onsite Documentation</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedCompetition.images.map((imgUrl, i) => (
                    <a
                      key={i}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-4/3 rounded-xl overflow-hidden border border-white/10 hover:border-[#00F0FF]/50 bg-black/40 transition-all hover:scale-[1.02]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${selectedCompetition.title} Photo ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[9px] font-mono text-white flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5 text-[#00F0FF]" />
                          Photo #{i + 1}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Project Card */}
            {selectedCompetition.projectName && (
              <div className="p-4 rounded-2xl bg-[#0891B2]/15 border border-[#0891B2]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wide">
                      Linked Project Built During Hackathon
                    </span>
                    {selectedCompetition.projectRole && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0891B2]/25 text-[#00F0FF] text-[10px] font-mono">
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00F0FF] hover:bg-[#38BDF8] text-zinc-950 font-bold text-xs transition-all shrink-0 shadow-lg shadow-[#00F0FF]/25 cursor-pointer"
                >
                  <span>View in Projects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Certificate Verification Action Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-[#00F0FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#00F0FF]" />
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#00F0FF] hover:bg-[#38BDF8] text-zinc-950 font-bold text-xs shadow-lg shadow-[#00F0FF]/25 transition-all shrink-0 cursor-pointer"
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
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-zinc-300 text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CompetitionsSection;

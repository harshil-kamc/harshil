import { EXPERIENCE_DATA } from "../data/portfolioData";
import { Briefcase, Calendar, MapPin, ChevronRight, Sparkles } from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-28 px-4 z-10">
      <div className="max-w-4xl mx-auto space-y-12">
       
<div className="h-120" />

        {/* Vertical Timeline */}
        <div className="relative border-l border-zinc-800 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-10">
          {EXPERIENCE_DATA.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Glowing Timeline Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-emerald-500/60 group-hover:border-emerald-400 group-hover:scale-125 transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Experience Card */}
              <div className="bg- transparent border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all duration-300">
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-emerald-400 font-medium text-sm">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {exp.description.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

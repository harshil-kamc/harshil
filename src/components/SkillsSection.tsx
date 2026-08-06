import { SKILL_CATEGORIES } from "../data/portfolioData";
import { Cpu, Terminal, Sparkles, CheckCircle } from "lucide-react";

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-28 px-4 z-10">
      <div className="max-w-5xl mx-auto space-y-12">
       <div className="h-80" />


        {/* Skill Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat, catIdx) => (
            <div
              key={catIdx}
              className="bg-transparent  border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    {cat.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-zinc-200">{skill.name}</span>
                        <span className="text-emerald-400 font-mono text-[11px]">{skill.level}%</span>
                      </div>

                      {/* Glowing Bar */}
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Continuously expanding stack</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

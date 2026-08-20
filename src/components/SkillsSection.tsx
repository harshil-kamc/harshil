import { TECHNICAL_SKILLS } from "../data/portfolioData";
import { Terminal, Code, Cpu, Layers, Layout, Palette, Server, Database, Sparkles, CheckCircle2 } from "lucide-react";

export function SkillsSection() {
  const getSkillIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case "C":
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case "PYTHON":
        return <Code className="w-5 h-5 text-cyan-400" />;
      case "DSA":
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case "JAVA":
        return <Layers className="w-5 h-5 text-amber-400" />;
      case "HTML":
        return <Layout className="w-5 h-5 text-orange-400" />;
      case "CSS":
        return <Palette className="w-5 h-5 text-sky-400" />;
      case "RDBMS":
        return <Server className="w-5 h-5 text-emerald-400" />;
      case "SQL":
        return <Database className="w-5 h-5 text-cyan-400" />;
      default:
        return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="skills" className="relative py-28 px-4 z-10">
      <div className="max-w-6xl mx-auto space-y-12">
      

      

        {/* Unified Direct Skills Grid (No Categories Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECHNICAL_SKILLS.map((skill, idx) => (
            <div
              key={idx}
              className="group bg-zinc-950/40 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top Row: Icon + Name + Highlight Tag */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/30 transition-transform">
                    {getSkillIcon(skill.name)}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5 group-hover:border-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                    {skill.highlight}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {skill.tagline}
                  </p>
                </div>
              </div>

              {/* Bottom Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Proficiency</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{skill.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-500/50"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

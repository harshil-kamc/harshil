import { TECHNICAL_SKILLS } from "../data/portfolioData";
import { Terminal, Code, Cpu, Layers, Layout, Palette, Server, Database, CheckCircle2, Wrench } from "lucide-react";

export function SkillsSection() {
  const getSkillIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case "C":
        return <Terminal className="w-5 h-5 text-[#FF304F]" />;
      case "PYTHON":
        return <Code className="w-5 h-5 text-[#FF5370]" />;
      case "DSA":
        return <Cpu className="w-5 h-5 text-[#FF304F]" />;
      case "JAVA":
        return <Layers className="w-5 h-5 text-[#FF5370]" />;
      case "HTML":
        return <Layout className="w-5 h-5 text-[#FF304F]" />;
      case "CSS":
        return <Palette className="w-5 h-5 text-[#FF5370]" />;
      case "RDBMS":
        return <Server className="w-5 h-5 text-[#FF304F]" />;
      case "SQL":
        return <Database className="w-5 h-5 text-[#FF5370]" />;
      default:
        return <Terminal className="w-5 h-5 text-[#FF304F]" />;
    }
  };

  return (
    <section id="skills" className="relative py-28 px-4 z-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
      

        {/* Unified Direct Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECHNICAL_SKILLS.map((skill, idx) => {
            const isAltShade = idx % 2 === 1;

            return (
              <div
                key={idx}
                className="group bg-zinc-950/40 backdrop-blur-sm border border-white/10 hover:border-[#FF304F]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Row: Icon + Name + Highlight Tag */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF304F]/30 transition-transform">
                      {getSkillIcon(skill.name)}
                    </div>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 border transition-colors ${
                      isAltShade
                        ? "text-[#FF5370] border-white/5 group-hover:border-[#B5122D]/40 group-hover:text-white"
                        : "text-[#FF304F] border-white/5 group-hover:border-[#FF304F]/30 group-hover:text-white"
                    }`}>
                      {skill.highlight}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] group-hover:text-[#FF5370] transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-[#9A9AA3] mt-1 line-clamp-2 leading-relaxed">
                      {skill.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Progress Bar: crimson to dark cardinal gradient */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#FF304F]" />
                      <span>Proficiency</span>
                    </span>
                    <span className={isAltShade ? "text-[#FF5370] font-semibold" : "text-[#FF304F] font-semibold"}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF304F] to-[#B5122D] rounded-full transition-all duration-1000 shadow-sm shadow-[#FF304F]/30"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;

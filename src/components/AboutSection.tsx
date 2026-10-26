import { HARSHIL_BIO } from "../data/portfolioData";
import { Code, GraduationCap, MapPin, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative pt-4 pb-28 px-4 z-10">
      {/* Spacing above About Section for particle word "ABOUT" to form in clear view */}
      <div className="h-80 min-h-[17.5rem] w-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto space-y-12">
       

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bio Overview Card */}
          <div className="md:col-span-7 bg-zinc-950/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0891B2]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00F0FF]/15 transition-all duration-500" />
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
                <Code className="w-5 h-5 text-[#00F0FF]" />
                Crafting Software with Purpose
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {HARSHIL_BIO.aboutText}
              </p>
              <p className="text-[#9A9AA3] text-sm leading-relaxed">
                Whether it's building responsive React frontends, engineering Node.js microservices, or developing interactive HTML5 canvas particle engines, I focus on clean code, mathematical precision, and memorable user experiences.
              </p>
            </div>

            {/* Key Facts / Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-full bg-white/5 backdrop-blur-xs border border-white/5 text-xs text-zinc-300">
                <GraduationCap className="w-4 h-4 text-[#00F0FF] shrink-0 ml-1" />
                <div>
                  <span className="block text-zinc-500 font-mono text-[10px]">EDUCATION</span>
                  <span className="font-semibold text-white">{HARSHIL_BIO.education}</span>
                </div>
              </div>

                        </div>

            {/* Bullet points */}
            <div className="space-y-2 pt-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>Focused on Frontend Performance, WebGL/Canvas & Algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <span>Experienced in Full-Stack TypeScript & AI Integration</span>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="md:col-span-5 flex flex-col justify-center">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 h-full">
              {HARSHIL_BIO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2 shadow-xl hover:border-[#00F0FF]/40 transition-all duration-300"
                >
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] bg-clip-text font-mono">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-medium text-zinc-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

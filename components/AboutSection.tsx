import { HARSHIL_BIO } from "../data/portfolioData";
import { User, Code, GraduationCap, MapPin, Mail, Download, Sparkles, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 px-4 z-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        
<div className="h-80" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bio Overview Card */}
          <div className="md:col-span-7 bg-transparent border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Crafting Software with Purpose
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {HARSHIL_BIO.aboutText}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Whether it's building responsive React frontends, engineering Node.js microservices, or developing interactive HTML5 canvas particle engines, I focus on clean code, mathematical precision, and memorable user experiences.
              </p>
            </div>

            {/* Key Facts / Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="block text-zinc-500 font-mono text-[10px]">EDUCATION</span>
                  <span className="font-semibold text-white">{HARSHIL_BIO.education}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="block text-zinc-500 font-mono text-[10px]">LOCATION</span>
                  <span className="font-semibold text-white">{HARSHIL_BIO.location}</span>
                </div>
              </div>
            </div>

            {/* Bullet points */}
            <div className="space-y-2 pt-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Focused on Frontend Performance, WebGL/Canvas & Algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Experienced in Full-Stack TypeScript & AI Integration</span>
              </div>
            </div>
          </div>

          {/* Stats & Quick Actions Sidebar */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {HARSHIL_BIO.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-transparent border border-white/10 rounded-2xl p-5 text-center space-y-1 shadow-xl hover:border-emerald-500/40 transition-all duration-300"
                >
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text font-mono">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-medium text-zinc-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Box */}
            <div className="bg-transparent border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Open for Collaborations</span>
              </div>
              <p className="text-xs text-zinc-400">
                Interested in working on innovative projects, internships, or open-source initiatives together.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`mailto:${HARSHIL_BIO.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Harshil
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

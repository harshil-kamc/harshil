import { useState } from "react";
import { HangingIdCard } from "./lightswind/hanging-id-card";
import { HARSHIL_BIO } from "../data/portfolioData";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Github,
  Linkedin,
  GraduationCap,
} from "lucide-react";

export function ContactSection() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(HARSHIL_BIO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 font-sans">
      {/* Visual stage clearance for background 3D particle word "CONTACT" */}
      <div className="h-64 sm:h-72 w-full pointer-events-none" aria-hidden="true" />

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[#00F0FF] text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connect & Inquire</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Get In <span className="text-[#00F0FF]">Touch</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
          Have an exciting project, hackathon collaboration, or internship opportunity? Let's connect.
        </p>
      </div>

      {/* Dual Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* =========================================================================
            LEFT COLUMN: LIGHTSWIND HANGING ID CARD (Pendulum physics)
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 sm:p-8 rounded-3xl bg-zinc-950/40 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle ambient spotlight */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              DIGITAL PASSPORT
            </span>
            <span className="text-zinc-500">INTERACTIVE SWING</span>
          </div>

          {/* Lightswind Hanging ID Card Component */}
          <div className="w-full flex justify-center py-4">
            <HangingIdCard
              name={HARSHIL_BIO.fullName}
              role="Student Coder & CSIT @ MVSR"
              badgeId="HK-CSIT-2028"
              accentColor="#00F0FF"
              ropeLength={95}
              ropeColor="#18181b"
              className="mt-2"
            />
          </div>

          {/* Bottom Card Footer Info */}
          <div className="w-full pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
            <span className="text-zinc-500">HYDERABAD, IN</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Open to Opportunities
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DIRECT REACH CARDS (Clean, direct, zero redundant form)
            ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Email Direct Access Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00F0FF] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Direct Email</p>
                <a
                  href={`mailto:${HARSHIL_BIO.email}`}
                  className="text-base sm:text-lg font-bold text-white hover:text-[#00F0FF] transition-colors"
                >
                  {HARSHIL_BIO.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <a
                href={`mailto:${HARSHIL_BIO.email}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Write</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* WhatsApp & Mobile Direct Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-md hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Phone & WhatsApp</p>
                <a
                  href={`tel:${HARSHIL_BIO.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {HARSHIL_BIO.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/${HARSHIL_BIO.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Professional Socials Grid (GitHub & LinkedIn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub Card */}
            <a
              href={HARSHIL_BIO.github}
              target="_blank"
              rel="noreferrer"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-md hover:border-white/30 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">GitHub Profile</p>
                  <p className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                    harshil-kamc
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </a>

            {/* LinkedIn Card */}
            <a
              href={HARSHIL_BIO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-md hover:border-[#0A66C2]/40 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-[#38BDF8] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">LinkedIn Profile</p>
                  <p className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    harshil-kamchetty
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Location & Academic Meta Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>{HARSHIL_BIO.education}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{HARSHIL_BIO.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;

import { Github, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { HARSHIL_BIO } from "../data/portfolioData";

export function ContactSection() {
  const whatsappUrl = `https://wa.me/${HARSHIL_BIO.phone.replace(/[^0-9]/g, "")}`;

  return (
    <section
      id="contact"
      className="relative pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 font-sans"
    >
      <div className="h-64 sm:h-72 w-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Get in <span className="text-[#00F0FF]">Touch</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
          Have a project, collaboration, or opportunity in mind? I’d be happy to hear from you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`mailto:${HARSHIL_BIO.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00F0FF] px-5 py-3 font-semibold text-zinc-950 transition-colors hover:bg-[#38BDF8]"
          >
            <Mail className="h-4 w-4" />
            Email me
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-zinc-400 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href={`mailto:${HARSHIL_BIO.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {HARSHIL_BIO.email}
          </a>
          <a
            href={`tel:${HARSHIL_BIO.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4" />
            {HARSHIL_BIO.phone}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={HARSHIL_BIO.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={HARSHIL_BIO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#0A66C2]/50 hover:text-white"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;

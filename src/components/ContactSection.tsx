import { Mail, MessageCircle } from "lucide-react";
import { HARSHIL_BIO } from "../data/portfolioData";

export function ContactSection() {
  const whatsappUrl = `https://wa.me/${HARSHIL_BIO.whatsapp}`;

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

        {/* Plain address so it can be copied without opening a mail client */}
        <p className="mt-6 text-sm text-zinc-400 font-mono select-all">
          {HARSHIL_BIO.email}
        </p>
      </div>
    </section>
  );
}

export default ContactSection;

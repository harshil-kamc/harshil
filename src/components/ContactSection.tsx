import { useState, FormEvent } from "react";
import { HARSHIL_BIO } from "../data/portfolioData";
import { Send, CheckCircle2, Github, Linkedin, MessageCircle } from "lucide-react";
import { FooterTips } from "./FooterTips";

interface ContactSectionProps {
  onOpenPlayground?: () => void;
}

export function ContactSection({ onOpenPlayground }: ContactSectionProps) {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 z-10 pb-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
<div className="h-120" />

        {/* Contact Form Card */}
        <div className="bg-zinc-950/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                Thank you for reaching out, {formState.name}. Harshil will get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: "", email: "", message: "" });
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 bg-zinc-950/40 backdrop-blur-xs border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-zinc-300">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 bg-zinc-950/40 backdrop-blur-xs border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Hey Harshil, I liked your particle portfolio..."
                  className="w-full px-4 py-3 bg-zinc-950/40 backdrop-blur-xs border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}

          {/* Social Quick Links */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/harshil-kamc"
                target="blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://in.linkedin.com/in/harshil-kamchetty-170a473bb"
                target="blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a
  href="https://wa.me/916304654185"
  target="_blank"
  rel="noreferrer"
  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
>
  <MessageCircle className="w-4 h-4" /> WhatsApp
</a>
            </div>
          </div>
        </div>

        {/* Footer Bar with Sliding Tips */}
        <div className="pt-8 space-y-4">
          <FooterTips onOpenPlayground={onOpenPlayground} />

          <div className="text-center text-xs text-zinc-500 font-mono">
            © {new Date().getFullYear()} <span className="font-semibold text-zinc-300">{HARSHIL_BIO.name}</span> — All Rights Reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
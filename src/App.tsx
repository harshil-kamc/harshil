import { useState, useEffect } from "react";
import { ParticleCanvasManager } from "./components/ParticleCanvasManager";

import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { ContactSection } from "./components/ContactSection";
import { PlaygroundModal } from "./components/PlaygroundModal";

const HERO_SEQUENCE = ["HI", "I'm", "Harshil", "a student"];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState<boolean>(false);
  const [customSequence, setCustomSequence] = useState<string[] | null>(null);
  const [currentWord, setCurrentWord] = useState<string>("HI");

  // Scroll Section Intersection Observer
  useEffect(() => {
    const sectionIds = ["hero", "about", "experience", "projects", "skills", "contact"];

    const handleScroll = () => {
      if (customSequence) return; // If custom sequence active, don't override with scroll

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            if (activeSection !== id) {
              setActiveSection(id);

              // Update particle canvas word based on section
              switch (id) {
                case "hero":
                  setCurrentWord("HI");
                  break;
                case "about":
                  setCurrentWord("ABOUT");
                  break;
                case "experience":
                  setCurrentWord("EXPERIENCE");
                  break;
                case "projects":
                  setCurrentWord("PROJECTS");
                  break;
                case "skills":
                  setCurrentWord("SKILLS");
                  break;
                case "contact":
                  setCurrentWord("CONTACT");
                  break;
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, customSequence]);

  const handleApplyCustomWord = (words: string[]) => {
    setCustomSequence(words);
    if (words.length > 0) {
      setCurrentWord(words[0] || "HARSHIL");
    }
  };

  const handleResetCustom = () => {
    setCustomSequence(null);
    setActiveSection("hero");
    setCurrentWord("HI");
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      {/* Background Interactive Particle Canvas */}
      <ParticleCanvasManager
        currentWord={currentWord}
        wordSequence={customSequence || (activeSection === "hero" ? HERO_SEQUENCE : undefined)}
        autoCycle={activeSection === "hero" || !!customSequence}
        cycleInterval={260}
      />

      
      

      {/* Override Notice if Custom Playground Words Active */}
      {customSequence && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-mono text-emerald-300 flex items-center gap-3 shadow-2xl">
          <span>Custom Sequence Active: [{customSequence.join(", ")}]</span>
          <button
            onClick={handleResetCustom}
            className="underline hover:text-white font-bold"
          >
            Reset Scroll Mode
          </button>
        </div>
      )}

      {/* Main Content Sections (Overlays over the particle canvas) */}
      <main className="relative z-10">
        <HeroSection onOpenPlayground={() => setIsPlaygroundOpen(true)} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      {/* Particle Lab Playground Modal */}
      <PlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        onApplyCustomWord={handleApplyCustomWord}
        currentWordSequence={customSequence || HERO_SEQUENCE}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { ParticleCanvasManager } from "./components/ParticleCanvasManager";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { CompetitionsSection } from "./components/CompetitionsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { ContactSection } from "./components/ContactSection";
import { PlaygroundModal } from "./components/PlaygroundModal";
import { DEFAULT_PARTICLE_IMAGES } from "./data/portfolioData";
import { trackNewVisitor, trackParticleLabOpened } from "./utils/notificationTracker";

const HERO_SEQUENCE = [
  "Hi",
  "I'm",
  "Harshil",
  "a student",
  ...DEFAULT_PARTICLE_IMAGES,
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState<boolean>(false);
  const [customSequence, setCustomSequence] = useState<string[] | null>(null);
  const [currentWord, setCurrentWord] = useState<string>("HI");
  const [particleMode, setParticleMode] = useState<"text" | "image">("text");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);

  // Track initial visitor session (once per session, no PII, no referrer)
  useEffect(() => {
    trackNewVisitor();
  }, []);

  // Track Particle Lab opening
  const handleOpenPlayground = () => {
    trackParticleLabOpened();
    setIsPlaygroundOpen(true);
  };

  // Scroll Section Intersection Observer
  useEffect(() => {
    const sectionIds = ["hero", "about", "competitions", "projects", "skills", "contact"];

    const handleScroll = () => {
      if (customSequence || particleMode === "image") return; // Don't override if custom sequence or image mode active

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
                case "competitions":
                  setCurrentWord("AWARDS");
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
  }, [activeSection, customSequence, particleMode]);

  const handleApplyCustomWord = (words: string[]) => {
    setParticleMode("text");
    setImageUrl(null);
    setImageErrorMessage(null);
    setCustomSequence(words);
    if (words.length > 0) {
      setCurrentWord(words[0] || "HARSHIL");
    }
  };

  const handleApplyImage = (url: string) => {
    setParticleMode("image");
    setImageUrl(url);
    setImageErrorMessage(null);
  };

  const handleSwitchToTextMode = () => {
    setParticleMode("text");
    setImageUrl(null);
    setImageErrorMessage(null);
  };

  const handleResetCustom = () => {
    setCustomSequence(null);
    setParticleMode("text");
    setImageUrl(null);
    setImageErrorMessage(null);
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
        mode={particleMode}
        imageUrl={imageUrl}
        onImageError={(err) => setImageErrorMessage(err)}
      />

     
      {/* Override Banner if Custom Text Sequence or Image Mode Active */}
      {(customSequence || particleMode === "image") && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-mono text-emerald-300 flex items-center gap-3 shadow-2xl">
          {particleMode === "image" ? (
            <span>Image Particle Mode Active</span>
          ) : (
            <span>Custom Sequence Active: [{customSequence?.join(", ")}]</span>
          )}
          <button
            onClick={handleResetCustom}
            className="underline hover:text-white font-bold"
          >
            Reset Scroll Mode
          </button>
        </div>
      )}

      {/* Error notification if image load or CORS fails */}
      {imageErrorMessage && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-rose-500/20 backdrop-blur-md border border-rose-500/40 px-4 py-2 rounded-2xl text-xs text-rose-200 shadow-2xl flex items-center gap-3 max-w-md">
          <span>{imageErrorMessage}</span>
          <button
            onClick={() => setImageErrorMessage(null)}
            className="font-bold underline text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Sections (Overlays over the particle canvas) */}
      <main className="relative z-10">
        <HeroSection
          onOpenPlayground={handleOpenPlayground}
        />
        <AboutSection />
        <CompetitionsSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection onOpenPlayground={handleOpenPlayground} />
      </main>

      {/* Particle Lab Playground Modal */}
      <PlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        onApplyCustomWord={handleApplyCustomWord}
        onApplyImage={handleApplyImage}
        onSwitchToTextMode={handleSwitchToTextMode}
        currentWordSequence={customSequence || HERO_SEQUENCE}
        activeMode={particleMode}
        currentImageUrl={imageUrl}
      />
    </div>
  );
}


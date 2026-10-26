import { useState, useEffect, useCallback } from "react";
import { ParticleCanvasManager } from "./components/ParticleCanvasManager";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { CompetitionsSection } from "./components/CompetitionsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { Footer } from "./components/Footer";
import { PlaygroundModal } from "./components/PlaygroundModal";
import { ResumeModal } from "./components/ResumeModal";
import { ScrollProgress } from "./components/ScrollMotion";
import { IntroOverlay } from "./components/IntroOverlay";
import { DEFAULT_PARTICLE_IMAGES } from "./data/portfolioData";
import { trackNewVisitor, trackParticleLabOpened } from "./utils/notificationTracker";

const HERO_SEQUENCE = [
  "Hi",
  "I'm",
  "Harshil",
  "a student",
  ...DEFAULT_PARTICLE_IMAGES,
];

// Sections whose particle word alternates with a 3D shape (GPU engine only; the 2D engine shows the word)
const SECTION_SEQUENCES: Record<string, string[]> = {
  hero: HERO_SEQUENCE,
  competitions: ["COMPETITIONS", "SHAPE:trophy"],
  skills: ["SKILLS", "SHAPE:atom"],
};

// Opening sequence: dust condenses into the name before the hero appears.
// Full length on a first visit, short for returning visitors, skipped for reduced motion.
const INTRO_WORD = "HARSHIL";
const INTRO_SEEN_KEY = "hk_intro_seen";
const getIntroDuration = () => {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return 0;
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) ? 1200 : 3000;
  } catch {
    return 3000;
  }
};

export default function App() {
  const [introDuration] = useState(getIntroDuration);
  const [introDone, setIntroDone] = useState(introDuration === 0);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [customSequence, setCustomSequence] = useState<string[] | null>(null);
  const [currentWord, setCurrentWord] = useState<string>(() => (introDuration === 0 ? "HI" : INTRO_WORD));
  const [particleMode, setParticleMode] = useState<"text" | "image">("text");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);

  // Track initial visitor session (once per session, no PII, no referrer)
  useEffect(() => {
    trackNewVisitor();
  }, []);

  const finishIntro = useCallback(() => {
    setIntroDone(true);
    setCurrentWord("HI");
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Storage blocked: the full intro simply plays again next time
    }
  }, []);

  // Track Particle Lab opening
  const handleOpenPlayground = () => {
    trackParticleLabOpened();
    setIsPlaygroundOpen(true);
  };

  // Scroll Section Intersection Observer
  useEffect(() => {
    const sectionIds = ["hero", "about", "competitions", "projects", "skills"];

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
                  setCurrentWord("COMPETITIONS");
                  break;
                case "projects":
                  setCurrentWord("PROJECTS");
                  break;
                case "skills":
                  setCurrentWord("SKILLS");
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

  const closeResume = useCallback(() => setIsResumeOpen(false), []);

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
    <div className="relative min-h-screen bg-[#08090D] text-[#F5F5F5] selection:bg-[#00F0FF] selection:text-zinc-950 font-sans">
      {/* Background Interactive Particle Canvas */}
      <ParticleCanvasManager
        currentWord={currentWord}
        wordSequence={introDone ? customSequence || SECTION_SEQUENCES[activeSection] : undefined}
        autoCycle={introDone && !!(customSequence || SECTION_SEQUENCES[activeSection])}
        cycleInterval={260}
        mode={particleMode}
        showBackdrop={introDone && activeSection === "hero" && currentWord !== "ABOUT" && particleMode === "text"}
        imageUrl={imageUrl}
        onImageError={(err) => setImageErrorMessage(err)}
      />

     
      {/* Override Banner if Custom Text Sequence or Image Mode Active */}
      {(customSequence || particleMode === "image") && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0891B2]/25 backdrop-blur-md border border-[#00F0FF]/40 px-4 py-1.5 rounded-full text-xs font-mono text-[#38BDF8] flex items-center gap-3 shadow-2xl">
          {particleMode === "image" ? (
            <span>Image Particle Mode Active</span>
          ) : (
            <span>Custom Sequence Active: [{customSequence?.join(", ")}]</span>
          )}
          <button
            onClick={handleResetCustom}
            className="underline hover:text-white font-bold cursor-pointer"
          >
            Reset Scroll Mode
          </button>
        </div>
      )}

      {/* Error notification if image load or CORS fails */}
      {imageErrorMessage && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-rose-950/40 backdrop-blur-md border border-rose-500/40 px-4 py-2 rounded-2xl text-xs text-rose-300 shadow-2xl flex items-center gap-3 max-w-md">
          <span>{imageErrorMessage}</span>
          <button
            onClick={() => setImageErrorMessage(null)}
            className="font-bold underline text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <ScrollProgress />
      {!introDone && <IntroOverlay duration={introDuration} onDone={finishIntro} />}

      {/* Main Content Sections (Overlays over the particle canvas) */}
      <main className="relative z-10">
        <HeroSection
          revealed={introDone}
          onOpenPlayground={handleOpenPlayground}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <AboutSection />
        <CompetitionsSection />
        <ProjectsSection />
        <SkillsSection />
        <Footer onOpenPlayground={handleOpenPlayground} />
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

      {/* Read-only Résumé Viewer */}
      <ResumeModal isOpen={isResumeOpen} onClose={closeResume} />
    </div>
  );
}

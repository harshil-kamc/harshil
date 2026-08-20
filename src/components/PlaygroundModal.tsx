import { useState, FormEvent, ChangeEvent } from "react";
import { Sparkles, X, Play, Image as ImageIcon, Type, Upload, Link, Check, AlertCircle, Globe } from "lucide-react";
import { DEFAULT_PARTICLE_IMAGES } from "../data/portfolioData";
import { normalizeImageUrl, isLikelyImageUrl } from "../utils/imageUrlResolver";

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomWord: (words: string[]) => void;
  onApplyImage: (imageUrl: string) => void;
  onSwitchToTextMode: () => void;
  currentWordSequence: string[];
  activeMode: "text" | "image";
  currentImageUrl: string | null;
}

const SAMPLE_IMAGE_PRESETS = [
  {
    name: "Cosmic Galaxy",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
    desc: "Vibrant blues & purple star dust",
  },
  {
    name: "Neon Fluid Art",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop",
    desc: "Rich magenta & cyan liquid wave",
  },
  {
    name: "Cyberpunk Glow",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop",
    desc: "High contrast tech lighting",
  },
  {
    name: "Abstract Energy",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop",
    desc: "Golden particle burst",
  },
];

export function PlaygroundModal({
  isOpen,
  onClose,
  onApplyCustomWord,
  onApplyImage,
  onSwitchToTextMode,
  currentWordSequence,
  activeMode,
  currentImageUrl,
}: PlaygroundModalProps) {
  const [activeTab, setActiveTab] = useState<"text" | "image">(activeMode);
  const [inputText, setInputText] = useState(currentWordSequence.join(", "));
  const [imageUrlInput, setImageUrlInput] = useState(currentImageUrl || "");
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = inputText
      .split(",")
      .map((w) => {
        const item = w.trim();
        return isLikelyImageUrl(item) ? normalizeImageUrl(item) : item;
      })
      .filter((w) => w.length > 0);

    if (parsed.length > 0) {
      onApplyCustomWord(parsed);
      onSwitchToTextMode();
      onClose();
    }
  };

  const handleImageSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = imageUrlInput.trim();
    if (trimmed) {
      setUploadError(null);
      const resolved = normalizeImageUrl(trimmed);
      onApplyImage(resolved);
      onClose();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file (PNG, JPG, WEBP, SVG).");
        return;
      }
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImageUrlInput(result);
          onApplyImage(result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPreset = (presetWords: string[]) => {
    setInputText(presetWords.join(", "));
    onApplyCustomWord(presetWords);
    onSwitchToTextMode();
    onClose();
  };

  const handleImagePresetClick = (presetUrl: string) => {
    setImageUrlInput(presetUrl);
    onApplyImage(presetUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950/85 border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Particle Canvas Lab</h3>
            <p className="text-xs text-zinc-400">
              Transform background particles into morphing text words or high-definition image pixel art.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === "text"
                ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Text Particles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              activeTab === "image"
                ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Particles</span>
          </button>
        </div>

        {activeTab === "text" ? (
          <form onSubmit={handleTextSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Comma-Separated Word Sequence:
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. HARSHIL, CREATIVE, DEVELOPER, INNOVATE"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400">QUICK PRESETS</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset(["HI", "I'm", "Harshil", "a student", ...DEFAULT_PARTICLE_IMAGES])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-emerald-500/50 flex items-center gap-1.5 font-semibold text-emerald-400"
                >
                  <Sparkles className="w-3 h-3" />
                  Text + Image Hybrid Loop
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(["HARSHIL", "FULLSTACK", "CREATIVE", "CODE"])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-emerald-500/50"
                >
                  Developer Mindset
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(["WELCOME", "TO", "MY", "PORTFOLIO"])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-emerald-500/50"
                >
                  Welcome Greeting
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Apply Text Sequence
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Image URL Input Form */}
            <form onSubmit={handleImageSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Image Link / Web URL:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Any image address, Google Images</span>
                </label>
                <div className="relative">
                  <Link className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste image address here.."
                    className="w-full pl-10 pr-24 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px] transition-colors"
                  >
                    Render
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-zinc-500">
                  <p className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">1. Google Search images</p><br/>
                  <p className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">2. Choose an image</p><br/>
                  <p className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">3. Copy image address</p><br/>
                  <p className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">4. Paste it here & See the magic</p><br/>
                </div>
              </div>
            </form>

            {/* Direct File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-300">
                Or Upload Image File from device:
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 hover:border-emerald-500 cursor-pointer text-xs text-zinc-300 hover:text-white transition-all">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Choose PNG / JPG / WEBP File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Image Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono text-zinc-400">SAMPLE IMAGE PRESETS</span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleImagePresetClick(preset.url)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 text-left transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                        {preset.name}
                      </span>
                      {currentImageUrl === preset.url && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Return to text mode button */}
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onSwitchToTextMode();
                  onClose();
                }}
                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors underline underline-offset-4"
              >
                Reset to Text Mode
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-xs text-zinc-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


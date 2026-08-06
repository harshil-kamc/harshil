import { useState, FormEvent } from "react";
import { Sparkles, X, Play, RefreshCw, Layers, ShieldAlert } from "lucide-react";

interface PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomWord: (words: string[]) => void;
  currentWordSequence: string[];
}

export function PlaygroundModal({
  isOpen,
  onClose,
  onApplyCustomWord,
  currentWordSequence,
}: PlaygroundModalProps) {
  const [inputText, setInputText] = useState(currentWordSequence.join(", "));

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = inputText
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (parsed.length > 0) {
      onApplyCustomWord(parsed);
      onClose();
    }
  };

  const handleQuickPreset = (presetWords: string[]) => {
    setInputText(presetWords.join(", "));
    onApplyCustomWord(presetWords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Particle Text Lab</h3>
            <p className="text-xs text-zinc-400">
              Type custom words or choose presets to morph background canvas particles in real-time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Comma-Separated Word Sequence:
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. HARSHIL, CREATIVE, DEVELOPER, INNOVATE"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-zinc-400">QUICK PRESETS</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(["HI", "I'm", "Harshil", "a student"])}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-emerald-500/50"
              >
                Default Intro
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

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Mouse Interactivity:
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Right-click & drag anywhere on the screen to explode particles around your cursor!
            </p>
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
              <Play className="w-3.5 h-3.5 fill-current" /> Apply Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

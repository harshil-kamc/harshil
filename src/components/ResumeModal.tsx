import { useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2, X } from "lucide-react";

// Export the latest PDF from the résumé editor and save it as public/resume.pdf
const RESUME_URL = "/resume.pdf";
const DOWNLOAD_NAME = "Harshil_Kamchetty_Resume.pdf";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewerStatus = "loading" | "ready" | "missing" | "error";

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const pagesRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ViewerStatus>("loading");

  // Close on Escape and lock background scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Render the PDF pages as canvases (read-only, identical on mobile and desktop)
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let destroyDocument: (() => void) | null = null;
    setStatus("loading");

    (async () => {
      try {
        const res = await fetch(RESUME_URL, { cache: "no-cache" });
        const isPdf = (res.headers.get("content-type") || "").includes("pdf");
        if (!res.ok || !isPdf) {
          if (!cancelled) setStatus("missing");
          return;
        }
        const data = await res.arrayBuffer();

        // pdf.js (~1 MB) is loaded only when the viewer is opened
        const pdfjs = await import("pdfjs-dist");
        const { default: workerUrl } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        const loadingTask = pdfjs.getDocument({ data });
        destroyDocument = () => void loadingTask.destroy();
        const pdf = await loadingTask.promise;

        const container = pagesRef.current;
        if (cancelled || !container) return;
        container.replaceChildren();

        const targetWidth = container.clientWidth;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (targetWidth / baseViewport.width) * pixelRatio });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "block w-full h-auto rounded-lg bg-white shadow-2xl";
          canvas.setAttribute("aria-label", `Résumé page ${pageNumber} of ${pdf.numPages}`);
          canvas.addEventListener("contextmenu", (e) => e.preventDefault());
          container.appendChild(canvas);

          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas 2D context unavailable");
          await page.render({ canvasContext: context, viewport }).promise;

          // Show the first page as soon as it is drawn
          if (pageNumber === 1 && !cancelled) setStatus("ready");
        }
      } catch (err) {
        console.error("[Resume Viewer] Failed to render résumé:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      destroyDocument?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Résumé viewer"
    >
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[92vh] bg-zinc-950/90 border border-white/10 rounded-3xl shadow-2xl text-white backdrop-blur-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-[#0891B2]/20 text-[#00F0FF] border border-[#00F0FF]/30 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold truncate">Résumé</h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {status === "ready" && (
              <a
                href={RESUME_URL}
                download={DOWNLOAD_NAME}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F0FF] text-zinc-950 text-sm font-semibold hover:bg-[#38BDF8] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close résumé"
              className="p-2 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pages */}
        <div className="relative flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 bg-zinc-900/60">
          <div ref={pagesRef} className="flex flex-col gap-4 select-none" />

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-[#00F0FF]" />
              Loading résumé…
            </div>
          )}

          {(status === "missing" || status === "error") && (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-sm text-zinc-400">
              <FileText className="w-8 h-8 text-zinc-400" />
              <p className="text-zinc-300 font-medium">
                {status === "missing" ? "Résumé is being updated." : "The résumé couldn't be displayed."}
              </p>
              <p>Please check back soon, or reach out via email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

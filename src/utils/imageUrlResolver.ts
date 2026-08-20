/**
 * Universal Image URL Resolver & Loader
 * Normalizes any link (Google Search images, Google Drive, Imgur, Unsplash, Dropbox, Github, extension-less URLs)
 * and safely loads it onto an HTML5 canvas with CORS bypass proxies so getImageData never fails.
 */

export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return "";

  let url = rawUrl.trim();

  // Strip enclosing quotes, brackets or markdown if any
  url = url.replace(/^[<"'(]+|[>"')]+$/g, "").trim();

  // If already data URL or blob URL, return as-is
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // Handle protocol-relative URL
  if (url.startsWith("//")) {
    url = "https:" + url;
  }

  // If missing protocol, add https:// if it looks like a domain
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // If it contains domain-like structure or slashes
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(url) || url.includes("google.") || url.includes("unsplash.") || url.includes("imgur.")) {
      url = "https://" + url;
    }
  }

  try {
    const parsed = new URL(url);

    // 1. Google Image Search URL (google.com/imgres?imgurl=... or google.co.*/imgres?imgurl=...)
    if (parsed.hostname.includes("google.") && parsed.pathname.includes("/imgres")) {
      const imgurlParam = parsed.searchParams.get("imgurl");
      if (imgurlParam) {
        try {
          const decoded = decodeURIComponent(imgurlParam);
          return normalizeImageUrl(decoded);
        } catch {
          return imgurlParam;
        }
      }
    }

    // 2. Google Redirect/URL wrapper (google.com/url?q=... or google.com/url?url=...)
    if (parsed.hostname.includes("google.") && parsed.pathname.includes("/url")) {
      const targetParam = parsed.searchParams.get("q") || parsed.searchParams.get("url");
      if (targetParam) {
        try {
          const decoded = decodeURIComponent(targetParam);
          return normalizeImageUrl(decoded);
        } catch {
          return targetParam;
        }
      }
    }

    // 3. Google Drive file links
    // Formats:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    if (parsed.hostname === "drive.google.com") {
      let fileId: string | null = null;

      const fileMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch && fileMatch[1]) {
        fileId = fileMatch[1];
      } else {
        fileId = parsed.searchParams.get("id");
      }

      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
      }
    }

    // 4. Imgur page links (e.g., https://imgur.com/abc1234 or https://imgur.com/gallery/abc1234)
    if (parsed.hostname === "imgur.com" || parsed.hostname === "m.imgur.com") {
      const match = parsed.pathname.match(/\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        return `https://i.imgur.com/${match[1]}.png`;
      }
    }

    // 5. GitHub blob URLs (e.g., https://github.com/user/repo/blob/main/img.png)
    if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
      const rawPath = parsed.pathname.replace("/blob/", "/");
      return `https://raw.githubusercontent.com${rawPath}`;
    }

    // 6. Dropbox share links (change dl=0 to raw=1)
    if (parsed.hostname.includes("dropbox.com")) {
      parsed.searchParams.set("raw", "1");
      parsed.searchParams.delete("dl");
      return parsed.toString();
    }

    // 7. Unsplash photo page links (e.g., https://unsplash.com/photos/abc1234)
    if (parsed.hostname === "unsplash.com" && parsed.pathname.startsWith("/photos/")) {
      const photoId = parsed.pathname.replace("/photos/", "").split("/")[0]?.split("-").pop();
      if (photoId) {
        return `https://images.unsplash.com/photo-${photoId}?w=1000&auto=format&fit=crop`;
      }
    }

    return parsed.toString();
  } catch {
    // If URL parsing fails, return the trimmed raw url
    return url;
  }
}

/**
 * Checks if a string is likely an image link or image reference
 */
export function isLikelyImageUrl(str: string): boolean {
  if (!str) return false;
  const s = str.trim();

  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("//") || s.startsWith("data:image/") || s.startsWith("blob:") || s.startsWith("IMG:")) {
    return true;
  }

  // Common image file extensions (even if with query params)
  if (/\.(png|jpe?g|webp|gif|svg|avif|bmp|ico|tiff)(\?.*)?$/i.test(s)) {
    return true;
  }

  // Known image hosting domains or image query params
  if (
    /^(https?:\/\/)?(www\.)?(images\.unsplash\.com|i\.imgur\.com|imgur\.com|i\.ibb\.co|images\.pexels\.com|cdn\.pixabay\.com|pbs\.twimg\.com|lh3\.googleusercontent\.com|encrypted-tbn[0-9]\.gstatic\.com|drive\.google\.com|picsum\.photos|api\.dicebear\.com|robohash\.org)/i.test(s) ||
    s.includes("google.com/imgres") ||
    s.includes("imgurl=")
  ) {
    return true;
  }

  return false;
}

/**
 * Generates fallback CORS proxy candidate URLs for any web image link
 * so that HTML5 canvas getImageData will not be blocked by cross-origin policies.
 */
export function getCandidateImageUrls(rawUrl: string): string[] {
  const cleanUrl = normalizeImageUrl(rawUrl);
  if (!cleanUrl) return [];

  // Data URLs and blob URLs cannot and should not be proxied
  if (cleanUrl.startsWith("data:") || cleanUrl.startsWith("blob:")) {
    return [cleanUrl];
  }

  const candidates: string[] = [];

  // 1. First candidate: The normalized direct URL
  candidates.push(cleanUrl);

  // 2. High-speed Cloudflare-backed open image proxy (wsrv.nl / images.weserv.nl)
  // Handles extensionless images, WebP/SVG/PNG formats, strips CORS restrictions and returns clean PNG
  const encoded = encodeURIComponent(cleanUrl);
  candidates.push(`https://wsrv.nl/?url=${encoded}&output=png`);
  candidates.push(`https://images.weserv.nl/?url=${encoded}&output=png`);

  // 3. General CORS Proxies
  candidates.push(`https://corsproxy.io/?url=${encoded}`);
  candidates.push(`https://api.allorigins.win/raw?url=${encoded}`);

  return candidates;
}

/**
 * Tests if an image element can have its pixel data read on a 1x1 test canvas
 * without throwing a SecurityError (tainted canvas).
 */
function isImageCanvasSafe(img: HTMLImageElement): boolean {
  try {
    const testCanvas = document.createElement("canvas");
    testCanvas.width = 1;
    testCanvas.height = 1;
    const testCtx = testCanvas.getContext("2d");
    if (!testCtx) return true;
    testCtx.drawImage(img, 0, 0, 1, 1);
    testCtx.getImageData(0, 0, 1, 1);
    return true;
  } catch {
    return false;
  }
}

/**
 * Robust asynchronous image loader that tries candidate URLs and proxies
 * until it finds one that can be safely read on a canvas.
 */
export function loadSafeCanvasImage(
  rawUrl: string,
  onProgressCandidate?: (candidateUrl: string) => void
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const candidates = getCandidateImageUrls(rawUrl);
    if (candidates.length === 0) {
      reject(new Error("Empty image URL provided."));
      return;
    }

    let candidateIndex = 0;

    const tryNext = () => {
      if (candidateIndex >= candidates.length) {
        reject(
          new Error(
            "Could not load or read image pixels. The link might be private, broken, or blocked by the host. Try uploading a local file instead."
          )
        );
        return;
      }

      const currentCandidate = candidates[candidateIndex++]!;
      if (onProgressCandidate) {
        onProgressCandidate(currentCandidate);
      }

      const img = new Image();
      // Set crossOrigin anonymous for CORS
      if (!currentCandidate.startsWith("data:") && !currentCandidate.startsWith("blob:")) {
        img.crossOrigin = "anonymous";
      }

      let hasTimedOut = false;
      const timeoutId = setTimeout(() => {
        hasTimedOut = true;
        img.onload = null;
        img.onerror = null;
        tryNext();
      }, 7000);

      img.onload = () => {
        if (hasTimedOut) return;
        clearTimeout(timeoutId);

        // Check if image is canvas-safe (not tainted)
        if (isImageCanvasSafe(img)) {
          resolve(img);
        } else {
          // Tainted by cross-origin, try proxy candidate
          tryNext();
        }
      };

      img.onerror = () => {
        if (hasTimedOut) return;
        clearTimeout(timeoutId);
        tryNext();
      };

      img.src = currentCandidate;
    };

    tryNext();
  });
}

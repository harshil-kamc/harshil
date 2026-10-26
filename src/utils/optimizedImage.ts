import type { SyntheticEvent } from "react";

/**
 * A resized WebP copy of a remote image, served by wsrv.nl (a free, Cloudflare-backed image CDN).
 * Certificates are uploaded as full-size scans (one is 5MB), far more than a book page or a
 * preview needs. Pair with `fallbackToOriginal` so the original still loads if the CDN fails.
 */
export const optimizedImage = (url: string, width: number) =>
  `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;

/** onError handler: swap to the original image once */
export const fallbackToOriginal = (original: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = original;
};

export const DEFAULT_PARTICLE_IMAGES = [
  "/favicon.png",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80",
];

export interface SamplePresetImage {
  name: string;
  desc: string;
  url: string;
}

export const SAMPLE_PRESET_IMAGES: SamplePresetImage[] = [
  { name: "H Monogram", desc: "Signature brand icon", url: "/favicon.png" },
  { name: "Fluid Sphere", desc: "3D neon particle art", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80" },
  { name: "Digital Flora", desc: "Botanical artwork", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80" },
];

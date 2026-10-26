import { useState } from "react";
import { LegacyParticleCanvas, type ParticleCanvasManagerProps } from "./LegacyParticleCanvas";
import { WebGLParticleCanvas } from "./WebGLParticleCanvas";
import { isShapeItem } from "./particles/shapes";

export { PARTICLE_COLOR_PALETTE } from "./LegacyParticleCanvas";

const supportsWebGL2 = () => {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
};

// ?engine=2d forces the original 2D engine, for comparison and debugging
const forces2D = () => new URLSearchParams(window.location.search).get("engine") === "2d";

/** Uses the GPU particle engine where supported, and falls back to the 2D engine otherwise */
export function ParticleCanvasManager(props: ParticleCanvasManagerProps) {
  const [useWebGL, setUseWebGL] = useState(() => typeof window !== "undefined" && !forces2D() && supportsWebGL2());

  if (useWebGL) {
    return (
      <WebGLParticleCanvas
        {...props}
        onEngineFailure={(reason) => {
          console.warn(`[particles] Falling back to the 2D engine: ${reason}`);
          setUseWebGL(false);
        }}
      />
    );
  }
  // The 2D engine can't draw 3D shapes, so it only cycles through the words
  const sequence = props.wordSequence?.filter((item) => !isShapeItem(item));
  return <LegacyParticleCanvas {...props} wordSequence={sequence} autoCycle={props.autoCycle && (sequence?.length ?? 0) > 1} />;
}

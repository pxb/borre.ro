// The mark: three orthogonal 3x3 beams fused into one solid.
// A cross that is also a cube. Generated, never shipped as geometry.
export const ARM = 3;

export type Axis = "context" | "agents" | "revenue" | "core";

/* Each beam is one of the three. Where all three meet is the core:
   the point of the mark is that they only matter multiplied together. */
export function axisOf(x: number, y: number, z: number): Axis {
  const inX = Math.abs(y) <= 1 && Math.abs(z) <= 1;
  const inY = Math.abs(x) <= 1 && Math.abs(z) <= 1;
  const inZ = Math.abs(x) <= 1 && Math.abs(y) <= 1;
  if (inX && inY && inZ) return "core";
  if (inX) return "context";
  if (inY) return "agents";
  return "revenue";
}

export function crossVoxels(arm = ARM): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let x = -arm; x <= arm; x++) {
    for (let y = -arm; y <= arm; y++) {
      for (let z = -arm; z <= arm; z++) {
        const inBeam =
          (Math.abs(x) <= 1 && Math.abs(y) <= 1) ||
          (Math.abs(y) <= 1 && Math.abs(z) <= 1) ||
          (Math.abs(x) <= 1 && Math.abs(z) <= 1);
        if (inBeam) out.push([x, y, z]);
      }
    }
  }
  return out;
}

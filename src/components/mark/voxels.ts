/*
 * The voxel mark. It was the homepage hero's right-hand element until Vanta NET
 * took that slot (2026-09-21, Pedro: "remove the sphere for now but don't lose
 * the code"). It was then deleted by mistake in eb6b9ba and restored from git
 * on 2026-09-23 to stand in for a photo on /about. Do not delete.
 */
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

/* Alternative mark: a voxel sphere. Same generated-not-shipped principle
   as the cross; swap which one mark-scene calls. */
export function sphereVoxels(radius = 4): [number, number, number][] {
  const out: [number, number, number][] = [];
  const r2 = (radius + 0.35) * (radius + 0.35);
  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        if (x * x + y * y + z * z <= r2) out.push([x, y, z]);
      }
    }
  }
  return out;
}

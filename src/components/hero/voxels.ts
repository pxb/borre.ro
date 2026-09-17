// The mark: three orthogonal 3x3 beams fused into one solid.
// A cross that is also a cube. Generated, never shipped as geometry.
export const ARM = 3;

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

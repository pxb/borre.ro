// Vanta ships minified UMD builds with no types.
declare module "vanta/dist/vanta.net.min" {
  const NET: (opts: Record<string, unknown>) => { destroy: () => void; resize?: () => void };
  export default NET;
}

declare module "vanta/dist/vanta.waves.min" {
  const WAVES: (opts: Record<string, unknown>) => { destroy: () => void; resize?: () => void };
  export default WAVES;
}

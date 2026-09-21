"use client";

import dynamic from "next/dynamic";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);

/* Light wash in the accent family, so dark ink stays readable on top of it. */
const url =
  "https://www.shadergradient.co/customize?animate=on&axesHelper=off" +
  "&bgColor1=%23f2ede4&bgColor2=%23f2ede4&brightness=1.1&cAzimuthAngle=180" +
  "&cDistance=3.9&cPolarAngle=115&cameraZoom=1" +
  // Sage into muted teal into clay. Cool through to warm. The vermillion
  // accent is deliberately absent here so it never competes with itself.
  "&color1=%234a6b52&color2=%237d9b7a&color3=%23bcc9b4" +
  "&destination=onCanvas&embedMode=off&envPreset=city&format=gif" +
  "&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1" +
  "&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0" +
  "&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane" +
  "&uAmplitude=0&uDensity=0.9&uFrequency=3.5&uSpeed=0.1&uStrength=1.5&uTime=0&wireframe=false";

/* A single radial falloff. Two separate linear fades, one to the left and one
   to the bottom, crossed at the lower left corner and the seam was visible. */
const FALLOFF =
  "radial-gradient(115% 100% at 78% 42%, black 0%, black 34%, transparent 78%)";

/* Spans the whole hero band, bleeding past the content column. */
export function HeroGradient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[34%] right-[-18vw] -z-10 overflow-hidden opacity-85"
      style={{ maskImage: FALLOFF, WebkitMaskImage: FALLOFF }}
    >
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        pointerEvents="none"
      >
        <ShaderGradient control="query" urlString={url} />
      </ShaderGradientCanvas>
    </div>
  );
}

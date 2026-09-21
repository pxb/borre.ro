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
  "&bgColor1=%23f2ede4&bgColor2=%23f2ede4&brightness=1.0&cAzimuthAngle=180" +
  "&cDistance=3.9&cPolarAngle=115&cameraZoom=1" +
  // Sage into muted teal into clay. Cool through to warm. The vermillion
  // accent is deliberately absent here so it never competes with itself.
  "&color1=%235f7551&color2=%23b9b2a4&color3=%23b07a55" +
  "&destination=onCanvas&embedMode=off&envPreset=city&format=gif" +
  "&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1" +
  "&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0" +
  "&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane" +
  "&uAmplitude=0&uDensity=0.9&uFrequency=3.5&uSpeed=0.1&uStrength=1.5&uTime=0&wireframe=false";

/* Spans the whole hero band, bleeding past the content column. */
export function HeroGradient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-50vw] inset-y-0 -z-10 overflow-hidden opacity-80"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 34%, rgba(0,0,0,0.55) 52%, black 68%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 34%, rgba(0,0,0,0.55) 52%, black 68%)",
      }}
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

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
  "&bgColor1=%23232a31&bgColor2=%23232a31&brightness=1.1&cAzimuthAngle=180" +
  "&cDistance=3.9&cPolarAngle=115&cameraZoom=1&color1=%23d8452a&color2=%23ffb38a" +
  "&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif" +
  "&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1" +
  "&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0" +
  "&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane" +
  "&uAmplitude=0&uDensity=0.9&uFrequency=3.5&uSpeed=0.1&uStrength=1.5&uTime=0&wireframe=false";

/* Spans the whole hero band, bleeding past the content column. */
export function HeroGradient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-70"
      style={{
        maskImage: "radial-gradient(ellipse 70% 85% at 70% 50%, black 15%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 85% at 70% 50%, black 15%, transparent 95%)",
      }}
    >
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        pointerEvents="none"
        lazyLoad
      >
        <ShaderGradient control="query" urlString={url} />
      </ShaderGradientCanvas>
    </div>
  );
}

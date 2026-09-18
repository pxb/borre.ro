"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);

/* Deep plum through to vermillion, so the accent-coloured mark reads against it. */
const url =
  "https://www.shadergradient.co/customize?animate=on&axesHelper=off" +
  "&bgColor1=%23000000&bgColor2=%23000000&brightness=1.1&cAzimuthAngle=180" +
  "&cDistance=3.2&cPolarAngle=90&cameraZoom=1&color1=%23d8452a&color2=%232a1526" +
  "&color3=%23f08a3c&destination=onCanvas&embedMode=off&envPreset=city&format=gif" +
  "&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1" +
  "&positionX=-1.2&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0" +
  "&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=waterPlane" +
  "&uAmplitude=0&uDensity=1.4&uFrequency=5.5&uSpeed=0.3&uStrength=3.6&uTime=0&wireframe=false";

export function GradientPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate aspect-square w-full max-w-[34rem] overflow-hidden rounded-3xl bg-[#2a1526]">
      <ShaderGradientCanvas
        className="absolute inset-0 -z-10"
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        pointerEvents="none"
        lazyLoad
      >
        <ShaderGradient control="query" urlString={url} />
      </ShaderGradientCanvas>
      {/* The margin the content needs, so the mark never touches the panel edge. */}
      <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
        {children}
      </div>
    </div>
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { isFigure } from "@/lib/is-figure";

// Share images (#578) in the site's own language: paper ground, the wordmark
// with the accent .ro, a 2px ink block rule, the title in the expanded display
// cut, and at most one figure in the figure form (bar, figure, label; mono and
// accent only for numbers, as on the site). Every
// string comes from existing site content; nothing is written for the card.
// Fonts are static instances of the site faces (the renderer cannot read
// variable axes), under the SIL OFL in ./fonts.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const PAPER = "#F2EDE4";
const INK = "#1F1C19";
const INK_SOFT = "#5C554D";
const ACCENT = "#A8402C";
const RULE = "#D9D1C4";

export async function ogCard({
  title,
  figure,
  line,
}: {
  title: string;
  figure?: { value: string; label: string };
  line?: string;
}) {
  // Module-relative URLs, so the bundler emits the files with the code and the
  // card renders whatever the working directory.
  const [display, medium, regular, mono] = await Promise.all([
    readFile(new URL("./fonts/Archivo-Display-500.ttf", import.meta.url)),
    readFile(new URL("./fonts/Archivo-500.ttf", import.meta.url)),
    readFile(new URL("./fonts/Archivo-400.ttf", import.meta.url)),
    readFile(new URL("./fonts/MartianMono-500.ttf", import.meta.url)),
  ]);
  const long = title.length > 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "64px 80px 72px",
          fontFamily: "Archivo",
          color: INK,
        }}
      >
        <div style={{ display: "flex", fontFamily: "ArchivoMedium", fontSize: 34, letterSpacing: "-0.01em" }}>
          <span>borre</span>
          <span style={{ color: ACCENT }}>.ro</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: `2px solid ${INK}`, paddingTop: 36 }}>
          <div
            style={{
              fontFamily: "ArchivoDisplay",
              fontSize: long ? 60 : 72,
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {figure ? (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginTop: 44,
                borderLeft: `2px solid ${RULE}`,
                paddingLeft: 20,
              }}
            >
              <span
                style={
                  isFigure(figure.value)
                    ? { fontFamily: "Mono", fontSize: 40, color: ACCENT, whiteSpace: "nowrap" }
                    : { fontFamily: "ArchivoMedium", fontSize: 40, color: INK, whiteSpace: "nowrap" }
                }
              >
                {figure.value}
              </span>
              <span style={{ marginLeft: 22, fontSize: 26, lineHeight: 1.3, color: INK_SOFT, maxWidth: 760 }}>
                {figure.label}
              </span>
            </div>
          ) : line ? (
            <div style={{ marginTop: 36, fontSize: 28, lineHeight: 1.35, color: INK_SOFT, maxWidth: 940 }}>{line}</div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "ArchivoDisplay", data: display, weight: 500, style: "normal" },
        { name: "ArchivoMedium", data: medium, weight: 500, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

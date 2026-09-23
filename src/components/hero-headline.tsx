import { CyclingWord } from "@/components/cycling-word";
import { site } from "@/content/site";

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

// A different headline each visit. All variants are in the HTML; an inline
// script sets data-hv on <html> before first paint, and CSS shows only that
// one, so there is no flash and no-JS readers get the first. Hidden variants
// are display:none, so assistive tech only ever meets the one on screen.
// The choice is kept for the session, so it does not change between pages.
const pick = `try{var k="hv",n=${site.headlines.length},v=sessionStorage.getItem(k);if(v===null){v=String(Math.floor(Math.random()*n));sessionStorage.setItem(k,v)}document.documentElement.dataset.hv=v}catch(e){}`;

export function HeroHeadline() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <h1 className="text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
        {site.headlines.map((h, i) => {
          const capital = h.startsWith("{N}");
          const [before, after] = h.replace("{N}", "{n}").split("{n}");
          const words = capital ? site.headlineCounts.map(cap) : site.headlineCounts;
          return (
            <span key={h} data-hv-variant={i} className="hv-variant">
              <span className="sr-only">{before + words[0] + after}</span>
              <span aria-hidden="true">
                {before}
                <CyclingWord words={words} />
                {after}
              </span>
            </span>
          );
        })}
      </h1>
    </>
  );
}

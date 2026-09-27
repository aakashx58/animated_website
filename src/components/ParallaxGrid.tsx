import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../constants/galleryItems";
import { GalleryModel } from "../models/GalleryModel";
import { MoveRight, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxGridProps {
  onSelectItem: (id: string) => void;
}

const modelInstance = new GalleryModel(GALLERY_ITEMS);

export default function ParallaxGrid({ onSelectItem }: ParallaxGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = modelInstance.getAllItems().slice(5, 10); // Exhibits 06 to 10

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create independent vertical parallax on scroll for different column items
      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((card) => {
        const speed = parseFloat(card.getAttribute("data-speed") || "1");
        const direction = card.getAttribute("data-dir") === "down" ? 1 : -1;
        const movement = window.innerHeight * 0.15 * speed * direction;

        gsap.fromTo(
          card,
          { y: 0 },
          {
            y: movement,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Animate editorial text lines on scroll entrance
      gsap.fromTo(
        ".editorial-text",
        { opacity: 0.1, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".editorial-text",
            start: "top 85%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-[#050505] px-4 py-24 select-none md:px-12 md:py-36"
    >
      {/* Decorative vertical coordinates */}
      <div className="pointer-events-none absolute top-12 left-6 hidden h-[80%] flex-col justify-between font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase md:left-12 lg:flex">
        <div>COORDINATES INDEX GRIDS</div>
        <div className="origin-left translate-y-16 rotate-90">SECTOR 02 // VERTICAL PARALLAX</div>
        <div>ARCHIVE FOLIO 2026</div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-16">
        {/* Editorial Narrative Panel */}
        <div className="sticky top-24 mb-12 self-start md:col-span-5 md:mb-0">
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            <Calendar className="h-3.5 w-3.5" /> STUDY OF GEOLOGIC AGE
          </div>
          <h2 className="mb-6 font-display text-4xl leading-tight font-light tracking-tight text-white md:text-5xl">
            Structural <br />
            <span className="font-serif font-normal text-neutral-400 italic">Tectonic</span> Silence
          </h2>
          <div className="editorial-text space-y-6 text-xs leading-relaxed font-light text-neutral-400 md:text-sm">
            <p>
              In this room, the timeline spans decades and epochs. From the rough board-formed
              imprint of timber shutters to the endless natural sorting of volcanic rocks on
              Iceland’s shores, materials absorb the silence around them.
            </p>
            <p className="border-l-2 border-white/20 pl-4 text-[#F5F5F0] italic">
              "We shapes stones. In return, the stones frame our relation with the terrestrial sky."
            </p>
            <p>
              By translating each image in opposition to standard linear flow, the elements reveal
              hidden perspectives, echoing the volumetric shifts that happen when light travels
              across space.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            <span>SCROLL VELOCITY: REALTIME GSAP</span>
          </div>
        </div>

        {/* Parallax Card Pile */}
        <div className="space-y-16 md:col-span-7 md:space-y-36">
          {items.map((item, index) => {
            const config = [
              {
                widthClass: "w-full md:w-[90%] ml-auto",
                speed: "0.8",
                dir: "up",
                heightClass: "h-[280px] md:h-[340px]",
              },
              {
                widthClass: "w-full md:w-[85%] mr-auto",
                speed: "1.4",
                dir: "up",
                heightClass: "h-[340px] md:h-[420px]",
              },
              {
                widthClass: "w-full md:w-[90%] ml-auto",
                speed: "0.6",
                dir: "down",
                heightClass: "h-[280px] md:h-[320px]",
              },
              {
                widthClass: "w-full md:w-[80%] mx-auto",
                speed: "1.2",
                dir: "up",
                heightClass: "h-[320px] md:h-[380px]",
              },
              {
                widthClass: "w-full md:w-[95%] ml-auto",
                speed: "0.8",
                dir: "down",
                heightClass: "h-[300px] md:h-[350px]",
              },
            ][index] || { widthClass: "w-full", speed: "1.0", dir: "up", heightClass: "h-[300px]" };

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                data-cursor="EXPAND"
                data-speed={config.speed}
                data-dir={config.dir}
                className={`parallax-card group relative ${config.widthClass} flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/60 p-5 shadow-lg shadow-black/25 transition-all duration-500 hover:border-white/30`}
              >
                <div className="mb-4 flex justify-between font-mono text-[9px] text-neutral-500 uppercase">
                  <span>EXHIBIT {item.id}</span>
                  <span>PARALLAX SPEED: {config.speed}X</span>
                </div>
                <div
                  className={`overflow-hidden rounded-xl ${config.heightClass} relative bg-[#0a0a0a]`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-xl font-normal tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[10px] text-neutral-500">{item.location}</p>
                  </div>
                  <div className="text-neutral-500 transition-colors group-hover:text-neutral-200">
                    <MoveRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

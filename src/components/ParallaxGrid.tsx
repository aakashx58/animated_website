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
        const movement = (window.innerHeight * 0.15) * speed * direction;

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
          }
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
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative py-24 md:py-36 px-4 md:px-12 bg-[#050505] overflow-hidden select-none"
    >
      {/* Decorative vertical coordinates */}
      <div className="absolute top-12 left-6 md:left-12 font-mono text-[9px] tracking-[0.3em] text-neutral-600 hidden justify-between lg:flex flex-col h-[80%] uppercase pointer-events-none">
        <div>COORDINATES INDEX GRIDS</div>
        <div className="rotate-90 origin-left translate-y-16">SECTOR 02 // VERTICAL PARALLAX</div>
        <div>ARCHIVE FOLIO 2026</div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start relative z-10">
        
        {/* Editorial Narrative Panel */}
        <div className="md:col-span-5 mb-12 md:mb-0 sticky top-24 self-start">
          <div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" /> STUDY OF GEOLOGIC AGE
          </div>
          <h2 className="text-4xl md:text-5xl font-light font-display text-white tracking-tight leading-tight mb-6">
            Structural <br />
            <span className="font-serif italic font-normal text-neutral-400">Tectonic</span> Silence
          </h2>
          <div className="editorial-text space-y-6 text-neutral-400 font-light text-xs md:text-sm leading-relaxed">
            <p>
              In this room, the timeline spans decades and epochs. From the rough board-formed imprint of timber shutters to the endless natural sorting of volcanic rocks on Iceland’s shores, materials absorb the silence around them.
            </p>
            <p className="border-l-2 border-white/20 pl-4 italic text-[#F5F5F0]">
              "We shapes stones. In return, the stones frame our relation with the terrestrial sky."
            </p>
            <p>
              By translating each image in opposition to standard linear flow, the elements reveal hidden perspectives, echoing the volumetric shifts that happen when light travels across space.
            </p>
          </div>
          
          <div className="mt-8 flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>SCROLL VELOCITY: REALTIME GSAP</span>
          </div>
        </div>

        {/* Parallax Card Pile */}
        <div className="md:col-span-7 space-y-16 md:space-y-36">
          {items.map((item, index) => {
            const config = [
              { widthClass: "w-full md:w-[90%] ml-auto", speed: "0.8", dir: "up", heightClass: "h-[280px] md:h-[340px]" },
              { widthClass: "w-full md:w-[85%] mr-auto", speed: "1.4", dir: "up", heightClass: "h-[340px] md:h-[420px]" },
              { widthClass: "w-full md:w-[90%] ml-auto", speed: "0.6", dir: "down", heightClass: "h-[280px] md:h-[320px]" },
              { widthClass: "w-full md:w-[80%] mx-auto", speed: "1.2", dir: "up", heightClass: "h-[320px] md:h-[380px]" },
              { widthClass: "w-full md:w-[95%] ml-auto", speed: "0.8", dir: "down", heightClass: "h-[300px] md:h-[350px]" },
            ][index] || { widthClass: "w-full", speed: "1.0", dir: "up", heightClass: "h-[300px]" };

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                data-cursor="EXPAND"
                data-speed={config.speed}
                data-dir={config.dir}
                className={`parallax-card group relative ${config.widthClass} bg-[#111111]/60 border border-white/10 p-5 rounded-2xl cursor-pointer hover:border-white/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/25`}
              >
                <div className="mb-4 flex justify-between font-mono text-[9px] text-neutral-500 uppercase">
                  <span>EXHIBIT {item.id}</span>
                  <span>PARALLAX SPEED: {config.speed}X</span>
                </div>
                <div className={`overflow-hidden rounded-xl ${config.heightClass} bg-[#0a0a0a] relative`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-normal font-display text-white tracking-tight">{item.title}</h3>
                    <p className="text-[10px] font-mono text-neutral-500">{item.location}</p>
                  </div>
                  <div className="text-neutral-500 group-hover:text-neutral-200 transition-colors">
                    <MoveRight className="w-5 h-5" />
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

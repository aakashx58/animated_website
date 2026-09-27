import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../constants/galleryItems";
import { GalleryModel } from "../models/GalleryModel";
import { Eye, MapPin, Grid, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  onSelectItem: (id: string) => void;
}

const modelInstance = new GalleryModel(GALLERY_ITEMS);
const horizontalItems = modelInstance.getAllItems().slice(1, 6);

export default function HorizontalScroll({ onSelectItem }: HorizontalScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const trigger = triggerRef.current;

      if (!track || !trigger) return;

      // Calculate horizontal shifting amount
      const getTranslateAmount = () => -(track.scrollWidth - window.innerWidth);

      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Slide track horizontally
      pinTimeline.to(track, {
        x: getTranslateAmount,
        ease: "none",
      });

      // Background giant moving typography parallax
      pinTimeline.to(
        ".hz-scrolling-bg-text",
        {
          x: () => `+=${window.innerWidth * 0.3}`,
          ease: "none",
        },
        "<",
      );

      // Set individual image movement within card masks for smooth parallax
      horizontalItems.forEach((_, idx) => {
        gsap.fromTo(
          `.hz-image-${idx}`,
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: trigger,
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              scrub: true,
            },
          },
        );
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative z-20 overflow-hidden bg-[#050505]">
      {/* Background Giant Text - Parallax moving behind cards */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] flex items-center justify-center overflow-hidden select-none">
        <h3 className="hz-scrolling-bg-text translate-x-[-15%] font-display text-[28vw] font-bold tracking-widest whitespace-nowrap text-white/[0.02] uppercase">
          SILENT EXHIBIT SILENT EXHIBIT
        </h3>
      </div>

      {/* Track that translates horizontally */}
      <div
        ref={trackRef}
        className="horizontal-scroll-container relative z-10 flex h-screen items-center gap-12 px-12 md:gap-24 md:px-24"
      >
        {/* Intro Section Card */}
        <div className="flex h-4/5 w-[300px] shrink-0 flex-col justify-center border-r border-white/10 pr-8 text-neutral-100 select-none md:w-[450px]">
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#a8a196] uppercase">
            <Layers className="h-3.5 w-3.5" /> SECTION 01 — HORIZONTAL TRACERY
          </div>
          <h2 className="mb-6 font-display text-4xl leading-none font-light tracking-tight md:text-6xl">
            The Sinuous <br />
            <span className="font-serif font-normal text-neutral-400 italic">Canvases</span>
          </h2>
          <p className="mb-6 font-sans text-xs leading-relaxed font-light text-neutral-400 md:text-sm">
            Rotate files. Shift viewports. Experience structure and natural forces stretching along
            an infinite planar threshold. Each monographical sheet carries an original geolocation
            coordinate and material analysis.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs tracking-wider text-neutral-500">
            <span>EXHIBITS: 02 — 06</span>
            <span>•</span>
            <span>GSAP ACCEL x1.0</span>
          </div>
        </div>

        {/* Gallery Cards list */}
        {horizontalItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            data-cursor="DISCOVER"
            className="group relative flex h-[550px] w-[320px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/60 p-6 shadow-xl shadow-black/25 backdrop-blur-sm transition-all duration-500 select-none hover:border-white/30 md:h-[620px] md:w-[420px] md:p-8"
          >
            {/* Top Index */}
            <div className="pointer-events-none z-10 flex items-center justify-between font-mono text-[10px] text-neutral-500">
              <span className="text-neutral-400">RECORD NO. {item.id}</span>
              <span className="rounded-full border border-white/5 bg-black/60 px-2.5 py-1 tracking-widest uppercase">
                {item.category}
              </span>
            </div>

            {/* Middle Image Container with Parallax Effect */}
            <div className="relative my-6 flex-grow overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a]">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent" />
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`hz-image-${index} absolute top-0 bottom-0 left-[-15%] h-full w-[130%] max-w-none object-cover transition-transform duration-700 ease-out group-hover:scale-105`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Details */}
            <div className="pointer-events-none z-10 flex flex-col gap-2 text-neutral-100">
              <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
                <MapPin className="h-3 w-3 text-neutral-500" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h4 className="font-display text-lg leading-tight font-normal tracking-tight md:text-xl">
                    {item.title}
                  </h4>
                  <p className="font-mono text-[10px] tracking-wider text-neutral-500">
                    {item.material}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/80 text-neutral-400 transition-all duration-300 group-hover:border-transparent group-hover:bg-white group-hover:text-black">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End Section Card */}
        <div className="flex h-4/5 w-[200px] shrink-0 flex-col items-center justify-center pr-12 text-center font-mono text-neutral-500 select-none md:w-[350px]">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#111]">
            <Grid className="h-5 w-5 animate-pulse text-neutral-400" />
          </div>
          <div className="mb-2 text-[10px] font-medium tracking-[0.25em] text-neutral-400">
            END HORIZONTAL PATH
          </div>
          <p className="text-[9px] leading-relaxed text-neutral-600 uppercase">
            Scrolling onwards triggers the vertical perspective matrix of the archive series.
          </p>
        </div>
      </div>
    </div>
  );
}

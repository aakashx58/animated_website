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
      pinTimeline.to(".hz-scrolling-bg-text", {
        x: () => `+=${window.innerWidth * 0.3}`,
        ease: "none",
      }, "<");

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
          }
        );
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative bg-[#050505] z-20 overflow-hidden">
      {/* Background Giant Text - Parallax moving behind cards */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden">
        <h3 className="hz-scrolling-bg-text text-[28vw] font-bold font-display text-white/[0.02] whitespace-nowrap uppercase tracking-widest translate-x-[-15%]">
          SILENT EXHIBIT SILENT EXHIBIT
        </h3>
      </div>

      {/* Track that translates horizontally */}
      <div
        ref={trackRef}
        className="horizontal-scroll-container h-screen flex items-center gap-12 md:gap-24 px-12 md:px-24 z-10 relative"
      >
        {/* Intro Section Card */}
        <div className="w-[300px] md:w-[450px] shrink-0 flex flex-col justify-center h-4/5 select-none text-neutral-100 pr-8 border-r border-white/10">
          <div className="font-mono text-[10px] tracking-widest text-[#a8a196] uppercase mb-4 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" /> SECTION 01 — HORIZONTAL TRACERY
          </div>
          <h2 className="text-4xl md:text-6xl font-light font-display tracking-tight leading-none mb-6">
            The Sinuous <br />
            <span className="font-serif italic font-normal text-neutral-400">Canvases</span>
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-400 font-light leading-relaxed mb-6">
            Rotate files. Shift viewports. Experience structure and natural forces stretching along an infinite planar threshold. Each monographical sheet carries an original geolocation coordinate and material analysis.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 tracking-wider">
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
            className="group w-[320px] md:w-[420px] h-[550px] md:h-[620px] shrink-0 relative flex flex-col justify-between bg-[#111111]/60 border border-white/10 p-6 md:p-8 rounded-2xl select-none hover:border-white/30 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm shadow-xl shadow-black/25"
          >
            {/* Top Index */}
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 z-10 pointer-events-none">
              <span className="text-neutral-400">RECORD NO. {item.id}</span>
              <span className="px-2.5 py-1 bg-black/60 border border-white/5 rounded-full tracking-widest uppercase">
                {item.category}
              </span>
            </div>

            {/* Middle Image Container with Parallax Effect */}
            <div className="my-6 flex-grow overflow-hidden rounded-xl relative bg-[#0a0a0a] border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent z-10" />
              <img
                src={item.imageUrl}
                alt={item.title}
                className={`hz-image-${index} absolute top-0 bottom-0 left-[-15%] w-[130%] h-full max-w-none object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Details */}
            <div className="z-10 text-neutral-100 flex flex-col gap-2 pointer-events-none">
              <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-lg md:text-xl font-normal font-display tracking-tight leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-500 tracking-wider">
                    {item.material}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-black/80 group-hover:bg-white border border-white/10 group-hover:border-transparent flex items-center justify-center text-neutral-400 group-hover:text-black transition-all duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End Section Card */}
        <div className="w-[200px] md:w-[350px] shrink-0 flex flex-col justify-center h-4/5 select-none text-neutral-500 font-mono pr-12 text-center items-center">
          <div className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center mb-4">
            <Grid className="w-5 h-5 text-neutral-400 animate-pulse" />
          </div>
          <div className="text-[10px] tracking-[0.25em] font-medium text-neutral-400 mb-2">END HORIZONTAL PATH</div>
          <p className="text-[9px] leading-relaxed text-neutral-600 uppercase">
            Scrolling onwards triggers the vertical perspective matrix of the archive series.
          </p>
        </div>
      </div>
    </div>
  );
}

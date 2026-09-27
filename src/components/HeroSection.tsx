import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../constants/galleryItems";
import { GalleryModel } from "../models/GalleryModel";
import { ArrowDown, Compass, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onSelectItem: (id: string) => void;
}

const modelInstance = new GalleryModel(GALLERY_ITEMS);

export default function HeroSection({ onSelectItem }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroItem = modelInstance.getAllItems()[0]; // Hero Image: "The Concrete Sanctuary"

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial mounting animations: Text reveal
      const introTl = gsap.timeline();
      introTl
        .fromTo(
          ".hero-heading span",
          { y: 150, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, stagger: 0.08, ease: "power4.out" }
        )
        .fromTo(
          ".hero-fade",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        );

      // 2. Scroll-Triggered Parallax Scale & Mask for the central image
      gsap.fromTo(
        heroImageRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          scale: 1.15,
        },
        {
          clipPath: "polygon(8% 10%, 92% 10%, 92% 90%, 8% 90%)",
          scale: 0.98,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        }
      );

      // 3. Floating labels scroll-driven parallax drift
      gsap.to(".hero-meta-left", {
        yPercent: -40,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-meta-right", {
        yPercent: -20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505] z-10 flex items-center justify-center select-none"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* Grid Overlay background lines */}
      <div className="absolute inset-0 flex justify-between pointer-events-none px-4 md:px-12 z-[1]">
        <div className="w-[1px] h-full bg-white/5" />
        <div className="w-[1px] h-full bg-white/5 hidden md:block" />
        <div className="w-[1px] h-full bg-white/5 hidden md:block" />
        <div className="w-[1px] h-full bg-white/5" />
      </div>

      {/* Hero Central Huge Scroll-Scale Image Section */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 w-full h-full z-[2] overflow-hidden"
        style={{ willChange: "clip-path, transform" }}
      >
        <div className="absolute inset-0 bg-neutral-950/25 z-[3]" /> {/* Overlay */}
        <img
          src={heroItem.imageUrl}
          alt={heroItem.title}
          className="absolute inset-0 w-full h-full object-cover origin-center"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Hero Metadata Card & Active Monograph - Outside scale element to prevent text cutting */}
      <div className="absolute inset-x-0 bottom-24 md:bottom-[110px] z-[10] pl-12 pr-8 md:pl-20 md:pr-16 flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-none">
        <div className="max-w-xl hero-fade text-white pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-100 animate-pulse" />
            <span className="text-[9px] tracking-[0.25em] font-mono uppercase text-neutral-400">
              ACTIVE DIGITAL MONOGRAPH
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light font-display tracking-tight leading-tight mb-2">
            {heroItem.title}
          </h2>
          <p className="text-[11px] md:text-xs text-neutral-400 font-sans tracking-wide leading-relaxed font-light">
            {heroItem.subtitle} — {heroItem.description.slice(0, 100)}...
          </p>
        </div>

        <button
          onClick={() => onSelectItem(heroItem.id)}
          data-cursor="EXPAND"
          className="flex items-center justify-center gap-3 px-8 py-3 border border-white/20 bg-black/60 hover:bg-white hover:text-black backdrop-blur-md text-[#F5F5F0] text-[10px] font-mono tracking-widest uppercase transition-all duration-300 hero-fade shrink-0 cursor-pointer shadow-lg pointer-events-auto"
        >
          <Eye className="w-3.5 h-3.5" />
          VIEW ARCHIVE RECORD {heroItem.id}
        </button>
      </div>

      {/* Floating Typographic Headers Behind/Above */}
      <div className="absolute inset-0 z-[5] pointer-events-none flex flex-col justify-between pl-10 pr-6 pt-6 pb-6 md:pl-16 md:pr-12 md:pt-12 md:pb-12">
        {/* Top Header */}
        <div className="flex justify-between items-start w-full hero-fade">
          <div className="flex gap-4 items-center">
            <Compass className="w-6 h-6 text-neutral-100 animate-[spin_8s_linear_infinite]" />
            <div className="font-mono text-[9px] tracking-[0.3em] text-neutral-300">
              <div>MONOLITHIC EXPOSITION</div>
              <div className="text-neutral-500">CURATED STUDY IN MOTION</div>
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-right text-neutral-400">
            <div>UTC TIME 14:51:21</div>
            <div>STATUS: FULLY ONLINE</div>
          </div>
        </div>

        {/* Center Mega Title */}
        <div className="w-full flex justify-center text-center py-20 relative z-[2] overflow-hidden">
          <h1 className="hero-heading text-[12vw] sm:text-[10vw] font-bold font-display uppercase tracking-[-0.03em] leading-none text-white select-none whitespace-nowrap overflow-hidden py-4 flex gap-1 justify-center">
            <span className="inline-block">MONO</span>
            <span className="inline-block text-outline font-light">LITH</span>
          </h1>
        </div>

        {/* Bottom Scroll Indicator bar */}
        <div className="flex justify-between items-end w-full hero-fade">
          <div className="hero-meta-left text-left font-mono">
            <div className="text-[9px] text-neutral-500 tracking-wider">GEO LOCATION</div>
            <div className="text-xs text-neutral-300 tracking-[0.1em]">{heroItem.coordinates}</div>
          </div>
          <div className="flex flex-col items-center gap-3 md:translate-y-6">
            <span className="text-[10px] font-mono tracking-[0.34em] text-neutral-400 uppercase">
              SCROLL DOWN
            </span>
            <div className="relative w-[1px] h-14 bg-zinc-800 flex justify-center overflow-hidden">
              <div className="absolute top-0 w-full h-1/2 bg-white rounded-full animate-[bounce_2s_infinite]" />
            </div>
          </div>
          <div className="hero-meta-right text-right font-mono">
            <div className="text-[9px] text-neutral-500 tracking-wider">CATALOG SPEC INDEX</div>
            <div className="text-xs text-neutral-300 tracking-[0.1em]">12 IMAGE MONOGRAPHS</div>
          </div>
        </div>
      </div>
    </section>
  );
}

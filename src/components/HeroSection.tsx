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
          { y: 0, opacity: 1, duration: 1.4, stagger: 0.08, ease: "power4.out" },
        )
        .fromTo(
          ".hero-fade",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" },
          "-=0.8",
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
        },
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
      className="relative z-10 flex h-screen w-full items-center justify-center overflow-hidden bg-[#050505] select-none"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="bg-radial-gradient pointer-events-none absolute inset-0 from-white/5 via-transparent to-transparent" />

      {/* Grid Overlay background lines */}
      <div className="pointer-events-none absolute inset-0 z-[1] flex justify-between px-4 md:px-12">
        <div className="h-full w-[1px] bg-white/5" />
        <div className="hidden h-full w-[1px] bg-white/5 md:block" />
        <div className="hidden h-full w-[1px] bg-white/5 md:block" />
        <div className="h-full w-[1px] bg-white/5" />
      </div>

      {/* Hero Central Huge Scroll-Scale Image Section */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 z-[2] h-full w-full overflow-hidden"
        style={{ willChange: "clip-path, transform" }}
      >
        <div className="absolute inset-0 z-[3] bg-neutral-950/25" /> {/* Overlay */}
        <img
          src={heroItem.imageUrl}
          alt={heroItem.title}
          className="absolute inset-0 h-full w-full origin-center object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Hero Metadata Card & Active Monograph - Outside scale element to prevent text cutting */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[10] flex flex-col items-end justify-between gap-6 pr-8 pl-12 md:bottom-[110px] md:flex-row md:pr-16 md:pl-20">
        <div className="hero-fade pointer-events-auto max-w-xl text-white">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-100" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
              ACTIVE DIGITAL MONOGRAPH
            </span>
          </div>
          <h2 className="mb-2 font-display text-3xl leading-tight font-light tracking-tight md:text-5xl">
            {heroItem.title}
          </h2>
          <p className="font-sans text-[11px] leading-relaxed font-light tracking-wide text-neutral-400 md:text-xs">
            {heroItem.subtitle} — {heroItem.description.slice(0, 100)}...
          </p>
        </div>

        <button
          onClick={() => onSelectItem(heroItem.id)}
          data-cursor="EXPAND"
          className="hero-fade pointer-events-auto flex shrink-0 cursor-pointer items-center justify-center gap-3 border border-white/20 bg-black/60 px-8 py-3 font-mono text-[10px] tracking-widest text-[#F5F5F0] uppercase shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black"
        >
          <Eye className="h-3.5 w-3.5" />
          VIEW ARCHIVE RECORD {heroItem.id}
        </button>
      </div>

      {/* Floating Typographic Headers Behind/Above */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col justify-between pt-6 pr-6 pb-6 pl-10 md:pt-12 md:pr-12 md:pb-12 md:pl-16">
        {/* Top Header */}
        <div className="hero-fade flex w-full items-start justify-between">
          <div className="flex items-center gap-4">
            <Compass className="h-6 w-6 animate-[spin_8s_linear_infinite] text-neutral-100" />
            <div className="font-mono text-[9px] tracking-[0.3em] text-neutral-300">
              <div>MONOLITHIC EXPOSITION</div>
              <div className="text-neutral-500">CURATED STUDY IN MOTION</div>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] tracking-[0.2em] text-neutral-400">
            <div>UTC TIME 14:51:21</div>
            <div>STATUS: FULLY ONLINE</div>
          </div>
        </div>

        {/* Center Mega Title */}
        <div className="relative z-[2] flex w-full justify-center overflow-hidden py-20 text-center">
          <h1 className="hero-heading flex justify-center gap-1 overflow-hidden py-4 font-display text-[12vw] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-white uppercase select-none sm:text-[10vw]">
            <span className="inline-block">MONO</span>
            <span className="text-outline inline-block font-light">LITH</span>
          </h1>
        </div>

        {/* Bottom Scroll Indicator bar */}
        <div className="hero-fade flex w-full items-end justify-between">
          <div className="hero-meta-left text-left font-mono">
            <div className="text-[9px] tracking-wider text-neutral-500">GEO LOCATION</div>
            <div className="text-xs tracking-[0.1em] text-neutral-300">{heroItem.coordinates}</div>
          </div>
          <div className="flex flex-col items-center gap-3 md:translate-y-6">
            <span className="font-mono text-[10px] tracking-[0.34em] text-neutral-400 uppercase">
              SCROLL DOWN
            </span>
            <div className="relative flex h-14 w-[1px] justify-center overflow-hidden bg-zinc-800">
              <div className="absolute top-0 h-1/2 w-full animate-[bounce_2s_infinite] rounded-full bg-white" />
            </div>
          </div>
          <div className="hero-meta-right text-right font-mono">
            <div className="text-[9px] tracking-wider text-neutral-500">CATALOG SPEC INDEX</div>
            <div className="text-xs tracking-[0.1em] text-neutral-300">12 IMAGE MONOGRAPHS</div>
          </div>
        </div>
      </div>
    </section>
  );
}

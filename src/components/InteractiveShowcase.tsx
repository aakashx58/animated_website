import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../constants/galleryItems";
import { GALLERY_CATEGORIES } from "../constants/galleryCategories";
import { GalleryModel } from "../models/GalleryModel";
import { GalleryItem } from "../models/GalleryItem";
import { Filter, Layers, Compass, BarChart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const modelInstance = new GalleryModel(GALLERY_ITEMS);

interface InteractiveShowcaseProps {
  onSelectItem: (id: string) => void;
}

export default function InteractiveShowcase({ onSelectItem }: InteractiveShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(() =>
    modelInstance.getAllItems(),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll Triggered reveals on element mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger statistics cards
      gsap.fromTo(
        ".stats-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );

      // Section header title / filter menu fade-up
      gsap.fromTo(
        ".showcase-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".showcase-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // Initial grid cards staggered animation on scroll
      gsap.fromTo(
        ".showcase-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter items based on activeCategory
  useEffect(() => {
    // Elegant transition sequence
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".showcase-card");
      if (!cards || cards.length === 0) {
        // Fallback update
        const updated = modelInstance.getItemsByCategory(activeCategory);
        setFilteredItems(updated);
        return;
      }

      // Exit-out cards first
      gsap.to(cards, {
        opacity: 0,
        scale: 0.8,
        rotateY: 45,
        y: 40,
        duration: 0.45,
        stagger: 0.03,
        ease: "power2.in",
        onComplete: () => {
          const updated = modelInstance.getItemsByCategory(activeCategory);
          setFilteredItems(updated);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory]);

  // Entrance transition of filtered items once they are updated in state
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".showcase-card");
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.8,
          rotateY: -45,
          y: -40,
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          y: 0,
          duration: 0.65,
          stagger: 0.03,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredItems]);

  // Magnetic card hover effect: cards lean toward cursor when hovered
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIdx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Constrain tilting angles
    const tiltX = (y / (rect.height / 2)) * 12; // tilt around X axis (up/down)
    const tiltY = -(x / (rect.width / 2)) * 12; // tilt around Y axis (left/right)

    gsap.to(card.querySelector(".card-tilt-wrapper"), {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 800,
      scale: 1.02,
      duration: 0.35,
      ease: "power2.out",
    });

    gsap.to(card.querySelector(".card-image-shift"), {
      x: (x / rect.width) * 15,
      y: (y / rect.height) * 15,
      duration: 0.35,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card.querySelector(".card-tilt-wrapper"), {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(card.querySelector(".card-image-shift"), {
      x: 0,
      y: 0,
      duration: 0.45,
    });
  };

  const categories = GALLERY_CATEGORIES;

  return (
    <section
      ref={containerRef}
      className="relative z-20 border-t border-white/5 bg-[#050505] px-4 py-28 select-none md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Statistics Header Grid */}
        <div className="stats-grid mb-16 grid grid-cols-2 gap-6 md:mb-24 lg:grid-cols-4">
          {useMemo(() => modelInstance.getCalculatedStatistics(), []).map((stat, idx) => (
            <div
              key={idx}
              className="stats-card flex h-36 flex-col justify-between rounded-2xl border border-white/10 bg-[#111111]/60 p-6 font-mono shadow-md transition-colors hover:border-white/20"
            >
              <div className="flex items-start justify-between text-zinc-500">
                <span className="text-[10px] tracking-widest uppercase">{stat.label}</span>
                <BarChart className="h-4 w-4 text-neutral-600" />
              </div>
              <div className="font-display text-4xl font-light tracking-tighter text-white md:text-5xl">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="showcase-header mb-12 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              <Filter className="h-3.5 w-3.5" /> SPECIFIED CLASSIFICATIONS
            </div>
            <h2 className="font-display text-3xl leading-none font-light tracking-tight text-neutral-100 md:text-5xl">
              Exhibition <span className="font-serif text-neutral-400 italic">Portal</span>
            </h2>
          </div>

          {/* Interactive Filters List */}
          <div className="flex max-w-full flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pointer-events-auto cursor-pointer rounded-full border px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "border-transparent bg-[#F5F5F0] text-black"
                    : "border-white/10 bg-black text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid View */}
        <div
          ref={gridRef}
          className="perspective-container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              className="showcase-card group cursor-pointer"
              style={{ transformStyle: "preserve-3d", contentVisibility: "auto" }}
            >
              {/* Leaning Wrapper */}
              <div className="card-tilt-wrapper relative flex h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/60 p-4 shadow-xl shadow-black/25 transition-all duration-300 hover:border-white/20">
                {/* Image Frame */}
                <div className="relative h-[220px] overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="card-image-shift absolute -top-[8%] -left-[8%] h-[116%] w-[116%] max-w-none object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 transition-colors duration-500 group-hover:bg-transparent" />

                  {/* Floating ID Layer */}
                  <div className="absolute top-3 left-3 rounded border border-white/10 bg-black/80 px-2 py-0.5 font-mono text-[9px] text-zinc-300 blur-none">
                    {item.id}
                  </div>
                </div>

                {/* Info Text Column */}
                <div className="mt-4 flex flex-grow flex-col justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 uppercase">
                    <Compass className="h-3 w-3 text-zinc-600" />
                    <span>{item.location}</span>
                  </div>

                  <div className="mt-1 flex items-end justify-between">
                    <div>
                      <h4 className="font-display text-base leading-tight font-normal tracking-tight text-white transition-colors group-hover:text-neutral-200">
                        {item.title}
                      </h4>
                      <span className="font-mono text-[9px] tracking-wider text-zinc-500">
                        {item.year} // {item.category}
                      </span>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black text-zinc-400 transition-colors group-hover:border-white/35 group-hover:text-white">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-24 text-center font-mono text-xs text-zinc-500">
            NO ASSET CODES MATCH THIS FILTER TYPE
          </div>
        )}
      </div>
    </section>
  );
}

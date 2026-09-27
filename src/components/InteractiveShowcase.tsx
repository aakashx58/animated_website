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
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(() => modelInstance.getAllItems());
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
        }
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
        }
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
        }
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
        }
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
      className="relative py-28 px-4 md:px-12 bg-[#050505] border-t border-white/5 select-none z-20"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Statistics Header Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24 stats-grid">
          {useMemo(() => modelInstance.getCalculatedStatistics(), []).map((stat, idx) => (
            <div
              key={idx}
              className="stats-card p-6 bg-[#111111]/60 border border-white/10 rounded-2xl flex flex-col justify-between h-36 font-mono hover:border-white/20 transition-colors shadow-md"
            >
              <div className="flex justify-between items-start text-zinc-500">
                <span className="text-[10px] uppercase tracking-widest">{stat.label}</span>
                <BarChart className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="text-4xl md:text-5xl font-light font-display text-white tracking-tighter">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <div className="showcase-header flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" /> SPECIFIED CLASSIFICATIONS
            </div>
            <h2 className="text-3xl md:text-5xl font-light font-display text-neutral-100 tracking-tight leading-none">
              Exhibition <span className="font-serif italic text-neutral-400">Portal</span>
            </h2>
          </div>

          {/* Interactive Filters List */}
          <div className="flex flex-wrap gap-2 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 pointer-events-auto cursor-pointer border ${
                  activeCategory === cat.id
                    ? "bg-[#F5F5F0] text-black border-transparent"
                    : "bg-black border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container"
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
              <div className="card-tilt-wrapper bg-[#111111]/60 border border-white/10 p-4 rounded-2xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between h-[360px] relative overflow-hidden shadow-xl shadow-black/25">
                {/* Image Frame */}
                <div className="relative h-[220px] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="card-image-shift absolute -top-[8%] -left-[8%] w-[116%] h-[116%] max-w-none object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating ID Layer */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-white/10 blur-none rounded text-[9px] font-mono text-zinc-300">
                    {item.id}
                  </div>
                </div>

                {/* Info Text Column */}
                <div className="mt-4 flex flex-col justify-between flex-grow">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase">
                    <Compass className="w-3 h-3 text-zinc-600" />
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-1">
                    <div>
                      <h4 className="text-base font-normal font-display text-white tracking-tight leading-tight group-hover:text-neutral-200 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                        {item.year} // {item.category}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/35 transition-colors">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-24 text-center text-zinc-500 font-mono text-xs">
            NO ASSET CODES MATCH THIS FILTER TYPE
          </div>
        )}

      </div>
    </section>
  );
}

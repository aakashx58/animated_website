import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { GalleryItem } from "../models/GalleryItem";
import { X, Globe2, Layers, Landmark, User, Clock } from "lucide-react";

interface DetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;

    // Reset scroll of body when modal is active
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(
        overlayRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        { opacity: 1, backdropFilter: "blur(20px)", duration: 0.5, ease: "power2.out" }
      )
        .fromTo(
          contentRef.current,
          { scale: 0.95, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: "power4.out" },
          "-=0.3"
        )
        .fromTo(
          ".modal-stagger",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
          "-=0.4"
        );
    }, overlayRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [item]);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      scale: 0.92,
      y: 40,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: onClose,
    });
  };

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-neutral-950/80"
    >
      {/* Background Close Click Target */}
      <div className="absolute inset-0 cursor-crosshair" onClick={handleClose} />

      {/* Main Container Card */}
      <div
        ref={contentRef}
        className="w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] bg-[#050505] border border-white/10 rounded-3xl overflow-hidden relative flex flex-col md:flex-row z-10 shadow-2xl"
      >
        {/* Close Button top-right */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all pointer-events-auto cursor-pointer z-35"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image Content */}
        <div className="w-full md:w-1/2 h-[35vh] md:h-[650px] relative bg-black overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/10">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Tag Overlay */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[9px] font-mono tracking-widest text-neutral-300 uppercase">
              RECORDS EXHIBIT {item.id}
            </span>
            <span className="px-3 py-1 bg-black/80 border border-white/10 rounded-full text-[9px] font-mono tracking-widest text-neutral-300 uppercase">
              {item.category}
            </span>
          </div>
        </div>

        {/* Right Side: Editorial Specs Details */}
        <div className="w-full md:w-1/2 flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 flex flex-col">
          
          {/* Section 1: Header Titles */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest modal-stagger">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{item.coordinates}</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-light font-display text-white tracking-tight leading-none modal-stagger">
              {item.title}
            </h2>
            
            <p className="font-serif italic text-sm md:text-base text-zinc-400 modal-stagger">
              {item.subtitle}
            </p>
          </div>

          {/* Section 2: Text Description */}
          <div className="space-y-6 mb-6 md:mb-8 modal-stagger">
            <p className="text-zinc-400 font-light text-xs md:text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Section 3: Tech Spec Table */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 border-t border-white/10 pt-6 mb-6 md:mb-0 modal-stagger mt-auto">
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                <Landmark className="w-3 h-3 text-zinc-700" /> LOCATION
              </div>
              <div className="font-sans text-xs text-neutral-200">
                {item.location}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                <Clock className="w-3 h-3 text-zinc-700" /> CHRONOLOGY AGE
              </div>
              <div className="font-sans text-xs text-neutral-200">
                {item.year} CE / RECORDED
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                <Layers className="w-3 h-3 text-zinc-700" /> CONSTITUENTS
              </div>
              <div className="font-sans text-xs text-neutral-200 leading-snug">
                {item.material}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                <User className="w-3 h-3 text-zinc-700" /> CUSTODY RECORD
              </div>
              <div className="font-sans text-xs text-neutral-200">
                {item.photographer} archive
              </div>
            </div>

          </div>

          {/* Close indicator */}
          <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-widest uppercase">
            <span>EXHIBITION REF: {item.id}</span>
            <span className="animate-pulse">CLICK CROSSHAIR TO COLLAPSE</span>
          </div>

        </div>
      </div>
    </div>
  );
}

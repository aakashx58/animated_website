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
        { opacity: 1, backdropFilter: "blur(20px)", duration: 0.5, ease: "power2.out" },
      )
        .fromTo(
          contentRef.current,
          { scale: 0.95, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: "power4.out" },
          "-=0.3",
        )
        .fromTo(
          ".modal-stagger",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
          "-=0.4",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 md:p-8"
    >
      {/* Background Close Click Target */}
      <div className="absolute inset-0 cursor-crosshair" onClick={handleClose} />

      {/* Main Container Card */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-2xl md:h-auto md:max-h-[85vh] md:flex-row"
      >
        {/* Close Button top-right */}
        <button
          onClick={handleClose}
          className="pointer-events-auto absolute top-5 right-5 z-35 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/80 text-zinc-400 transition-all hover:border-white/30 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Side: Image Content */}
        <div className="relative h-[35vh] w-full shrink-0 overflow-hidden border-b border-white/10 bg-black md:h-[650px] md:w-1/2 md:border-r md:border-b-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Tag Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 md:bottom-6 md:left-6">
            <span className="rounded-full border border-white/10 bg-black/80 px-3 py-1 font-mono text-[9px] tracking-widest text-neutral-300 uppercase">
              RECORDS EXHIBIT {item.id}
            </span>
            <span className="rounded-full border border-white/10 bg-black/80 px-3 py-1 font-mono text-[9px] tracking-widest text-neutral-300 uppercase">
              {item.category}
            </span>
          </div>
        </div>

        {/* Right Side: Editorial Specs Details */}
        <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto p-6 md:w-1/2 md:p-12">
          {/* Section 1: Header Titles */}
          <div className="mb-6 space-y-3 md:mb-8 md:space-y-4">
            <div className="modal-stagger flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              <Globe2 className="h-3.5 w-3.5" />
              <span>{item.coordinates}</span>
            </div>

            <h2 className="modal-stagger font-display text-2xl leading-none font-light tracking-tight text-white md:text-4xl">
              {item.title}
            </h2>

            <p className="modal-stagger font-serif text-sm text-zinc-400 italic md:text-base">
              {item.subtitle}
            </p>
          </div>

          {/* Section 2: Text Description */}
          <div className="modal-stagger mb-6 space-y-6 md:mb-8">
            <p className="text-xs leading-relaxed font-light text-zinc-400 md:text-sm">
              {item.description}
            </p>
          </div>

          {/* Section 3: Tech Spec Table */}
          <div className="modal-stagger mt-auto mb-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 md:mb-0 md:gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                <Landmark className="h-3 w-3 text-zinc-700" /> LOCATION
              </div>
              <div className="font-sans text-xs text-neutral-200">{item.location}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                <Clock className="h-3 w-3 text-zinc-700" /> CHRONOLOGY AGE
              </div>
              <div className="font-sans text-xs text-neutral-200">{item.year} CE / RECORDED</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                <Layers className="h-3 w-3 text-zinc-700" /> CONSTITUENTS
              </div>
              <div className="font-sans text-xs leading-snug text-neutral-200">{item.material}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                <User className="h-3 w-3 text-zinc-700" /> CUSTODY RECORD
              </div>
              <div className="font-sans text-xs text-neutral-200">{item.photographer} archive</div>
            </div>
          </div>

          {/* Close indicator */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            <span>EXHIBITION REF: {item.id}</span>
            <span className="animate-pulse">CLICK CROSSHAIR TO COLLAPSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

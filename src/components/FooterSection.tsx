import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUp, CornerRightDown, Github, Compass, Radio } from "lucide-react";

export default function FooterSection() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Magnetic back-to-top button setup
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.45,
        y: y * 0.45,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1.1, 0.4)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 px-6 md:px-12 border-t border-white/5 select-none z-20 overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neutral-900/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[50vh]">
        
        {/* Top Segment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-b border-white/5 pb-16">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-[0.25em]">
              <Radio className="w-3.5 h-3.5 text-zinc-650 animate-pulse" /> CURRENT STATION SPEC
            </div>
            <h3 className="text-3xl md:text-5xl font-light font-display text-white tracking-widest leading-none">
              MONO<span className="font-serif italic text-neutral-400">VOID</span>
            </h3>
            <p className="text-zinc-500 font-light text-xs md:text-sm max-w-sm leading-relaxed">
              Curated architectural monographies tracing light, gravity, and the sinuous geometry of tectonic formations across contemporary landscapes.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">MONOGRAPHS SECTORS</span>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#hero" className="hover:text-white transition-colors">01 // BRUTALIST CONCRETE</a></li>
              <li><a href="#hz" className="hover:text-white transition-colors">02 // TECTONIC SHARDS</a></li>
              <li><a href="#grid" className="hover:text-white transition-colors">03 // CRYSTALLINE GLASS</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">04 // MINIMAL SHADOWS</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 font-mono text-xs text-right md:text-left">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">CUSTODY LOGS</span>
            <div className="text-neutral-400 space-y-1.5 font-light">
              <div>PROJECT DESIGNER: GUEST AI</div>
              <div>DATE CAPTURED: 2026-06-08</div>
              <div>COORDINATES: GREENWICH MEAN</div>
              <div className="text-neutral-500 text-[10px]">VER: TSX-GSAP-3.12</div>
            </div>
          </div>

        </div>

        {/* Middle Segment: Grand Typography Section */}
        <div className="py-16 text-center overflow-hidden w-full select-none text-neutral-800">
          <h2 className="text-[9vw] font-bold font-display uppercase tracking-[0.4em] text-outline truncate opacity-40 hover:opacity-75 transition-opacity leading-none">
            ARCHIVE
          </h2>
        </div>

        {/* Bottom Segment: Credits and Magnetic top scroll */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <span>© 2026 MONOVOID ALL RIGHTS RESERVED</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>SPHERICAL MAP 41°N, 87°W</span>
            </div>
          </div>

          {/* Magnetic Back To Top Button */}
          <button
            ref={buttonRef}
            onClick={handleScrollTop}
            data-cursor="TOP"
            className="w-16 h-16 rounded-full bg-black/80 border border-white/10 hover:border-white/30 flex items-center justify-center text-zinc-400 hover:text-[#F5F5F0] transition-colors pointer-events-auto cursor-pointer shadow-lg"
          >
            <ArrowUp className="w-5 h-5 pointer-events-none" />
          </button>

        </div>

      </div>
    </footer>
  );
}

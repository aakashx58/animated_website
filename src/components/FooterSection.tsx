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
    <footer className="relative z-20 overflow-hidden border-t border-white/5 bg-[#050505] px-6 pt-24 pb-12 select-none md:px-12">
      {/* Background soft lighting */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-neutral-900/5 blur-[150px]" />

      <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col justify-between">
        {/* Top Segment */}
        <div className="grid grid-cols-1 items-start gap-12 border-b border-white/5 pb-16 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase">
              <Radio className="text-zinc-650 h-3.5 w-3.5 animate-pulse" /> CURRENT STATION SPEC
            </div>
            <h3 className="font-display text-3xl leading-none font-light tracking-widest text-white md:text-5xl">
              MONO<span className="font-serif text-neutral-400 italic">VOID</span>
            </h3>
            <p className="max-w-sm text-xs leading-relaxed font-light text-zinc-500 md:text-sm">
              Curated architectural monographies tracing light, gravity, and the sinuous geometry of
              tectonic formations across contemporary landscapes.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs md:col-span-3">
            <span className="mb-1 block text-[10px] tracking-widest text-zinc-600 uppercase">
              MONOGRAPHS SECTORS
            </span>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#hero" className="transition-colors hover:text-white">
                  01 // BRUTALIST CONCRETE
                </a>
              </li>
              <li>
                <a href="#hz" className="transition-colors hover:text-white">
                  02 // TECTONIC SHARDS
                </a>
              </li>
              <li>
                <a href="#grid" className="transition-colors hover:text-white">
                  03 // CRYSTALLINE GLASS
                </a>
              </li>
              <li>
                <a href="#showcase" className="transition-colors hover:text-white">
                  04 // MINIMAL SHADOWS
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-right font-mono text-xs md:col-span-3 md:text-left">
            <span className="mb-1 block text-[10px] tracking-widest text-zinc-600 uppercase">
              CUSTODY LOGS
            </span>
            <div className="space-y-1.5 font-light text-neutral-400">
              <div>PROJECT DESIGNER: GUEST AI</div>
              <div>DATE CAPTURED: 2026-06-08</div>
              <div>COORDINATES: GREENWICH MEAN</div>
              <div className="text-[10px] text-neutral-500">VER: TSX-GSAP-3.12</div>
            </div>
          </div>
        </div>

        {/* Middle Segment: Grand Typography Section */}
        <div className="w-full overflow-hidden py-16 text-center text-neutral-800 select-none">
          <h2 className="text-outline truncate font-display text-[9vw] leading-none font-bold tracking-[0.4em] uppercase opacity-40 transition-opacity hover:opacity-75">
            ARCHIVE
          </h2>
        </div>

        {/* Bottom Segment: Credits and Magnetic top scroll */}
        <div className="flex flex-col items-center justify-between gap-8 pt-8 font-mono text-[10px] tracking-widest text-zinc-500 uppercase md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>© 2026 MONOVOID ALL RIGHTS RESERVED</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              <span>SPHERICAL MAP 41°N, 87°W</span>
            </div>
          </div>

          {/* Magnetic Back To Top Button */}
          <button
            ref={buttonRef}
            onClick={handleScrollTop}
            data-cursor="TOP"
            className="pointer-events-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/80 text-zinc-400 shadow-lg transition-colors hover:border-white/30 hover:text-[#F5F5F0]"
          >
            <ArrowUp className="pointer-events-none h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

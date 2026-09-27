import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Elegant counter progress
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Accelerate sound/speed over time
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 85);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count < 100) return;

    // Trigger GSAP collapse animation of the loading screen
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      tl.to(".preloader-text-char", {
        y: -100,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: "power3.in",
      })
        .to(".preloader-progress", {
          width: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        }, "-=0.3")
        .to(".preloader-panel", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          stagger: 0.1,
        }, "-=0.2");
    });

    return () => ctx.revert();
  }, [count, onComplete]);

  // Split word into letters for typographic entrance
  const title = "MONOLITH & VOID";

  return (
    <div
      id="preloader-container"
      className="fixed inset-0 z-[100] flex flex-col justify-between p-8 md:p-12 bg-[#050505]"
    >
      {/* Visual background panels that will slide up independently */}
      <div className="preloader-panel absolute inset-0 bg-[#050505] z-[-1] origin-top" />

      {/* Top Meta */}
      <div className="flex justify-between items-center text-[10px] tracking-widest font-mono text-neutral-500">
        <div>CHRONICLES OF SPACE & FORM</div>
        <div>EXHIBITION NO. 12</div>
      </div>

      {/* Main Title Center */}
      <div className="flex flex-col items-center justify-center flex-grow uppercase text-center">
        <h1 className="text-4xl md:text-7xl font-light tracking-[0.25em] font-display flex overflow-hidden py-4 text-neutral-100">
          {title.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block preloader-text-char"
              style={{ contentVisibility: "auto" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p className="font-sans font-light tracking-[0.4em] text-neutral-500 text-[10px] md:text-xs mt-2">
          CURATED DIGITAL ARCHIVE
        </p>
      </div>

      {/* Bottom Counter and Progress */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end font-mono text-neutral-400">
          <div className="text-[10px] tracking-wider leading-none">
            INITIALIZING CORE CONTENT ASSETS...
          </div>
          <div className="text-4xl md:text-6xl font-light font-display leading-none text-neutral-100">
            {count.toString().padStart(3, "0")}%
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
          <div
            className="preloader-progress h-full bg-[#F5F5F0]"
            style={{ width: `${count}%`, transition: "width 0.15s ease-out" }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] tracking-widest font-mono text-neutral-500 uppercase">
          <div>LOC: 9°51'21" N / 2026-06-08</div>
          <div>REACT 19 + GSAP SUITE</div>
        </div>
      </div>
    </div>
  );
}

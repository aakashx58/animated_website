import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Avoid running on devices with touch-only support
    const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchOnly) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;

    if (!cursor || !dot) return;

    // Center offset
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });

    // QuickTo values for ultra-fluent, direct, lag-free cursor updates
    const xCursor = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3.out" });
    const yCursor = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3.out" });

    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xCursor(e.clientX);
      yCursor(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);

      // Make visible when mouse first moves
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Watch for custom cursor states via custom attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 1. If target has a [data-cursor] attribute (e.g. data-cursor="VIEW")
      const cursorText = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorText) {
        setText(cursorText);
        gsap.to(cursor, {
          width: 80,
          height: 80,
          backgroundColor: "rgba(245, 245, 247, 0.15)",
          borderColor: "rgba(245, 245, 247, 0.9)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        return;
      }

      // 2. Simple hover links / buttons
      const isInteractive = target.closest("button, a, [role='button'], input, select");
      if (isInteractive) {
        gsap.to(cursor, {
          scale: 1.5,
          borderColor: "rgba(245, 245, 247, 0.8)",
          borderWidth: "1.5px",
          duration: 0.25,
        });
        gsap.to(dot, { scale: 1.8, backgroundColor: "#fff", duration: 0.2 });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorText = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorText) {
        setText("");
        gsap.to(cursor, {
          width: 32,
          height: 32,
          backgroundColor: "transparent",
          borderColor: "rgba(245, 245, 247, 0.4)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
        return;
      }

      const isInteractive = target.closest("button, a, [role='button'], input, select");
      if (isInteractive) {
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(245, 245, 247, 0.4)",
          borderWidth: "1px",
          duration: 0.25,
        });
        gsap.to(dot, { scale: 1, backgroundColor: "#f5f5f7", duration: 0.2 });
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[999] flex items-center justify-center font-mono text-[9px] tracking-widest text-neutral-100 font-bold uppercase transition-[background-color,border-color,width,height] backdrop-blur-[1px] select-none text-center"
        style={{ willChange: "transform" }}
      >
        <span className="opacity-0 scale-50 transition-all duration-300 pointer-events-none" style={{ opacity: text ? 1 : 0, transform: text ? "scale(1)" : "scale(0.5)" }}>
          {text}
        </span>
      </div>

      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-neutral-100 pointer-events-none z-[999] select-none"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

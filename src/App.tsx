/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import HeroSection from "./components/HeroSection";
import HorizontalScroll from "./components/HorizontalScroll";
import ParallaxGrid from "./components/ParallaxGrid";
import InteractiveShowcase from "./components/InteractiveShowcase";
import DetailModal from "./components/DetailModal";
import FooterSection from "./components/FooterSection";
import { useGalleryController } from "./controllers/useGalleryController";
import { Compass } from "lucide-react";

export default function App() {
  const { loading, setLoading, selectedItem, scrollProgress, currentSection, handleSelectItem } =
    useGalleryController();

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-[#F5F5F0]">
      {/* Noise and Vignette overlay */}
      <div className="noise-bg" />

      {/* Elegant Header Preloader Screen */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Main Exhibition Layout */}
      {!loading && (
        <div className="fade-in-container relative">
          {/* Custom Cursor follower */}
          <CustomCursor />

          {/* Persistent Sidebar Scroll HUD */}
          <div className="pointer-events-none fixed bottom-8 left-8 z-[40] hidden items-center gap-6 rounded-full border border-zinc-900/60 bg-neutral-950/85 px-5 py-3 font-mono backdrop-blur-md select-none sm:flex">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-100" />
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase">SECTION:</span>
              <span className="text-[10px] font-semibold tracking-widest text-white uppercase">
                {currentSection}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-zinc-800" />

            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-[9px] text-zinc-400">INDEXED AT:</span>
              <span className="font-semibold text-white">
                {scrollProgress.toString().padStart(3, "0")}%
              </span>
            </div>
          </div>

          <div className="pointer-events-none fixed right-8 bottom-8 z-[40] hidden sm:flex">
            <div className="flex items-center gap-3 rounded-full border border-zinc-900/60 bg-neutral-950/85 px-5 py-3 font-mono text-[10px] backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 animate-[spin_12s_linear_infinite] text-zinc-400" />
              <span className="text-zinc-500">EXHIBIT NO. 12</span>
            </div>
          </div>

          {/* 1. Hero Introduction */}
          <div id="hero">
            <HeroSection onSelectItem={handleSelectItem} />
          </div>

          {/* 2. Horizontal Scroll Section */}
          <div id="hz">
            <HorizontalScroll onSelectItem={handleSelectItem} />
          </div>

          {/* 3. Parallax Grid Section */}
          <div id="grid">
            <ParallaxGrid onSelectItem={handleSelectItem} />
          </div>

          {/* 4. Interactive Category Gallery */}
          <div id="showcase">
            <InteractiveShowcase onSelectItem={handleSelectItem} />
          </div>

          {/* 5. Monolith Footer */}
          <FooterSection />

          {/* 6. High-end Detail Specifications Modal */}
          <DetailModal item={selectedItem} onClose={() => handleSelectItem(null)} />
        </div>
      )}
    </div>
  );
}

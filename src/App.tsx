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
  const {
    loading,
    setLoading,
    selectedItem,
    scrollProgress,
    currentSection,
    handleSelectItem,
  } = useGalleryController();

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-[#F5F5F0]">
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
          <div className="fixed bottom-8 left-8 z-[40] font-mono select-none hidden sm:flex items-center gap-6 pointer-events-none bg-neutral-950/85 border border-zinc-900/60 py-3 px-5 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-100 animate-pulse" />
              <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                SECTION:
              </span>
              <span className="text-[10px] text-white tracking-widest font-semibold uppercase">
                {currentSection}
              </span>
            </div>
            
            <div className="w-[1px] h-4 bg-zinc-800" />
            
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-[9px] text-zinc-400">INDEXED AT:</span>
              <span className="text-white font-semibold">{scrollProgress.toString().padStart(3, "0")}%</span>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-[40] hidden sm:flex pointer-events-none">
            <div className="flex items-center gap-3 text-[10px] font-mono bg-neutral-950/85 border border-zinc-900/60 py-3 px-5 rounded-full backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-zinc-400 animate-[spin_12s_linear_infinite]" />
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
          <DetailModal
            item={selectedItem}
            onClose={() => handleSelectItem(null)}
          />

        </div>
      )}
    </div>
  );
}

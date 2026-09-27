import { useState, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../constants/galleryItems";
import { GalleryModel } from "../models/GalleryModel";
import { GalleryItem } from "../models/GalleryItem";

gsap.registerPlugin(ScrollTrigger);

// Singleton instantiation of our model with initial data sources
const modelInstance = new GalleryModel(GALLERY_ITEMS);

export function useGalleryController() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>("01 / MONO");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Model accessors
  const allItems = useMemo(() => modelInstance.getAllItems(), []);
  
  const filteredItems = useMemo(() => {
    return modelInstance.getItemsByCategory(activeCategory);
  }, [activeCategory]);

  const selectedItem = useMemo(() => {
    return selectedItemId ? modelInstance.getItemById(selectedItemId) : null;
  }, [selectedItemId]);

  const statistics = useMemo(() => {
    return modelInstance.getCalculatedStatistics();
  }, [allItems]);

  // Handle category shifts
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle item selections
  const handleSelectItem = (id: string | null) => {
    setSelectedItemId(id);
  };

  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll and scroll indicator lifecycle
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    const sections = [
      { id: "hero", label: "01 / MONO" },
      { id: "hz", label: "02 / EXH" },
      { id: "grid", label: "03 / TECT" },
      { id: "showcase", label: "04 / PORT" },
    ];

    let currentSectionLocal = "01 / MONO";

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.floor(progress));
      }

      // Check current section threshold
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
            if (currentSectionLocal !== sec.label) {
              currentSectionLocal = sec.label;
              setCurrentSection(sec.label);
            }
            break;
          }
        }
      }
    };

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      handleScroll();
    });

    const rafLoop = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafLoop);
    handleScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.style.overflow === "hidden") return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        
        let currentIndex = sections.findIndex(sec => sec.label === currentSectionLocal);
        if (currentIndex === -1) currentIndex = 0;
        
        let nextIndex = currentIndex;
        if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (e.key === "ArrowUp" && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
        
        if (nextIndex !== currentIndex) {
          const targetEl = document.getElementById(sections[nextIndex].id);
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: 0, duration: 1.5 });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      gsap.ticker.remove(rafLoop);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loading]);

  useEffect(() => {
    if (!lenisRef.current) return;
    
    if (selectedItemId !== null) {
      lenisRef.current.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current.start();
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedItemId]);

  return {
    loading,
    setLoading,
    selectedItemId,
    selectedItem,
    scrollProgress,
    currentSection,
    activeCategory,
    filteredItems,
    statistics,
    handleCategoryChange,
    handleSelectItem,
  };
}

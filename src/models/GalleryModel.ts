/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GalleryItem } from "./GalleryItem";
import { Statistic } from "./Statistic";

/**
 * Model Layer
 * Represents the core business logic, query rules, and calculations.
 */
export class GalleryModel {
  private items: GalleryItem[];

  constructor(initialItems: GalleryItem[]) {
    this.items = initialItems;
  }

  /**
   * Retrieves all items in the model
   */
  getAllItems(): GalleryItem[] {
    return this.items;
  }

  /**
   * Retrieves items of a specific classification category
   */
  getItemsByCategory(category: string): GalleryItem[] {
    if (!category || category === "all") {
      return this.items;
    }
    return this.items.filter((item) => item.category === category);
  }

  /**
   * Finds a specific exhibition item by ID
   */
  getItemById(id: string): GalleryItem | null {
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Dynamically calculates metrics to keep the statistics DRY
   */
  getCalculatedStatistics(): Statistic[] {
    const totalItems = this.items.length;
    const categories = new Set(this.items.map((item) => item.category)).size;

    return [
      { value: `${totalItems.toString().padStart(2, "0")}+`, label: "Architectural Archives" },
      { value: `${categories.toString().padStart(2, "0")}`, label: "Tectonic Categories" },
      { value: "18+", label: "GSAP Motion Scenes" },
      { value: "100%", label: "Curated Aesthetics" },
    ];
  }
}

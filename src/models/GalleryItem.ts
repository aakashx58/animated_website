/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  photographer: string;
  location: string;
  year: number;
  material: string;
  coordinates: string;
  imageUrl: string;
  category: "brutalist" | "natural" | "glass" | "minimal";
  description: string;
}

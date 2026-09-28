import {
  albums as seedAlbums,
  images,
  locations as seedLocations,
  universityLogos,
  work as seedWork,
  type Album as SeedAlbum,
} from "../data/content";
import { DEFAULT_SETTINGS, type Album, type PublicContent } from "./types";

function toAlbum(item: SeedAlbum, index: number): Album {
  return {
    id: item.slug,
    slug: item.slug,
    name: item.name,
    category_id: item.series.toLowerCase(),
    series: item.series,
    number: item.number,
    short: item.short,
    description: item.description,
    finish: item.finish,
    price_uzs: 950000,
    price_label: "/ student",
    cover_url: item.image,
    telegram_url: null,
    published: true,
    sort_order: index,
    gallery: item.gallery.map((url, galleryIndex) => ({
      id: `${item.slug}-${galleryIndex}`,
      album_id: item.slug,
      url,
      storage_path: null,
      alt: `${item.name} album`,
      sort_order: galleryIndex,
    })),
  };
}

export function getFallbackContent(): PublicContent {
  return {
    albums: seedAlbums.map(toAlbum),
    categories: [
      { id: "classic", name: "Classic", slug: "classic", sort_order: 0 },
      { id: "editorial", name: "Editorial", slug: "editorial", sort_order: 1 },
      { id: "signature", name: "Signature", slug: "signature", sort_order: 2 },
    ],
    work: seedWork.map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image_url: item.image,
      storage_path: null,
      alt: item.alt,
      published: true,
      sort_order: index,
    })),
    logos: universityLogos.map((logo, index) => ({
      id: String(index),
      name: logo.name,
      image_url: logo.file,
      fallback_url: logo.fallback ?? null,
      storage_path: null,
      published: true,
      sort_order: index,
    })),
    locations: seedLocations.map((item, index) => ({
      id: item.city,
      city: item.city,
      representative_name: item.representativeName,
      phone: item.phone,
      instagram: item.instagram,
      telegram: item.telegram,
      marker_left: item.markerPosition.left,
      marker_top: item.markerPosition.top,
      label_side: item.labelSide ?? "right",
      published: true,
      sort_order: index,
    })),
    settings: { ...DEFAULT_SETTINGS, hero_image_url: images.hero },
  };
}

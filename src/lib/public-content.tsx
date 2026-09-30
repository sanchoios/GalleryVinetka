import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getFallbackContent } from "./fallback";
import { isSupabaseConfigured, supabase } from "./supabase";
import { DEFAULT_SETTINGS, type AlbumCategory, type AlbumImage, type PublicContent, type SiteSettings } from "./types";

const PublicContentContext = createContext<PublicContent>(getFallbackContent());

export function usePublicContent() {
  return useContext(PublicContentContext);
}

type AlbumRow = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  edition_number: string;
  short_text: string;
  description: string;
  finish: string;
  price_uzs: number;
  price_label: string;
  cover_url: string;
  telegram_url: string | null;
  published: boolean;
  sort_order: number;
  category?: AlbumCategory | AlbumCategory[] | null;
};

export async function loadPublicContent(): Promise<PublicContent> {
  if (!supabase) return getFallbackContent();

  const [categoriesRes, albumsRes, imagesRes, workRes, logosRes, locationsRes, settingsRes] = await Promise.all([
    supabase.from("album_categories").select("*").order("sort_order"),
    supabase.from("albums").select("*, category:album_categories(*)").eq("published", true).order("sort_order"),
    supabase.from("album_images").select("*").order("sort_order"),
    supabase.from("work_items").select("*").eq("is_cover", true).eq("published", true).order("sort_order"),
    supabase.from("client_logos").select("*").eq("published", true).order("sort_order"),
    supabase.from("locations").select("*").eq("published", true).order("sort_order"),
    supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
  ]);

  if (albumsRes.error) throw albumsRes.error;

  const categories = (categoriesRes.data ?? []) as AlbumCategory[];
  const images = (imagesRes.data ?? []) as AlbumImage[];
  const albums = ((albumsRes.data ?? []) as AlbumRow[]).map((row) => {
    const category = Array.isArray(row.category) ? row.category[0] : row.category;
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category_id: row.category_id,
      series: category?.name ?? "",
      number: row.edition_number,
      short: row.short_text,
      description: row.description,
      finish: row.finish,
      price_uzs: row.price_uzs,
      price_label: row.price_label,
      cover_url: row.cover_url,
      telegram_url: row.telegram_url,
      published: row.published,
      sort_order: row.sort_order,
      gallery: images.filter((image) => image.album_id === row.id),
    };
  });

  return {
    albums,
    categories,
    work: workRes.data ?? [],
    logos: logosRes.data ?? [],
    locations: (locationsRes.data ?? []).map((item) => ({ ...item, label_side: item.label_side === "left" ? "left" : "right" })),
    settings: { ...DEFAULT_SETTINGS, ...(settingsRes.data as SiteSettings | null) },
  };
}

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublicContent | null>(() =>
    isSupabaseConfigured ? null : getFallbackContent()
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    loadPublicContent()
      .then((data) => {
        if (!cancelled) setContent(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p role="alert">
        Ma’lumotlarni yuklab bo‘lmadi. Sahifani yangilang.
      </p>
    );
  }

  if (!content) return null;

  return (
    <PublicContentContext.Provider value={content}>
      {children}
    </PublicContentContext.Provider>
  );
}
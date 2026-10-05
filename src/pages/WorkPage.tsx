import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GalleryLightbox from "../components/GalleryLightbox";
import { ArrowUpRightIcon } from "../components/Icons";
import { usePublicContent } from "../lib/public-content";
import { supabase } from "../lib/supabase";

type Photo = { id: string; image_url: string };
export default function WorkPage() {
  const { work, settings } = usePublicContent();
  const [params] = useSearchParams();
  const requested = params.get("category");
  const selected = work.find(item => item.id === requested);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    setPhotos([]); setError(""); setLightboxIndex(null);
    if (!selected) { setLoading(false); return; }
    if (!supabase) { setPhotos([{ id: selected.id, image_url: selected.image_url }]); return; }
    setLoading(true);
    void supabase.from("work_photos").select("id, image_url").eq("category_id", selected.id)
      .eq("published", true).order("sort_order").order("id")
      .then(({ data, error: failure }) => {
        if (cancelled) return;
        setLoading(false);
        if (failure) setError("Rasmlarni yuklab bo‘lmadi. Keyinroq qayta urinib ko‘ring.");
        else setPhotos(data ?? []);
      });
    return () => { cancelled = true; };
  }, [selected?.id]);
  if (!requested) return (
    <section className="gallery-page section-shell">
      <h1 className="gallery-page__title">{settings.work_heading}</h1>
      <div className="work-grid work-layout">{work.map((item, index) => (
        <Link key={item.id} to={`/work?category=${encodeURIComponent(item.id)}`} className="work-tile" data-slot={item.sort_order + 1} aria-label={item.title}>
          <div className="work-tile__image"><img src={item.image_url} alt={item.title} loading="lazy" /></div>
          <div className="work-tile__caption"><span>0{index + 1} / {item.title}</span><ArrowUpRightIcon /></div>
        </Link>
      ))}</div>
    </section>
  );
  return (
    <section className="gallery-page section-shell">
      <Link to="/work">← Bizning ishlar</Link>
      <h1 className="gallery-page__title">{selected?.title ?? "Kategoriya topilmadi"}</h1>
      {loading && <p>Yuklanmoqda…</p>}
      {error && <p role="alert">{error}</p>}
      {selected && !loading && !error && photos.length === 0 && <p>Bu kategoriyada hozircha rasm yo‘q.</p>}
      <div className={`gallery-page__grid work-photos ${selected && [1, 3].includes(selected.sort_order) ? "work-photos--portrait" : "work-photos--landscape"}`}>{photos.map((item, index) => (
        <button key={item.id} type="button" className="gallery-page__item" onClick={() => setLightboxIndex(index)} aria-label={`${selected?.title ?? "Rasm"} ${index + 1}`}>
          <img src={item.image_url} alt={`${selected?.title ?? "Rasm"} ${index + 1}`} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
        </button>
      ))}</div>
      {lightboxIndex !== null && photos.length > 0 && <GalleryLightbox key={requested} images={photos.map((p, i) => ({ src: p.image_url, alt: `${selected?.title ?? "Rasm"} ${i + 1}` }))} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </section>
  );
}

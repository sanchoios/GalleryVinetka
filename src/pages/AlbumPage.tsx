import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GalleryLightbox from "../components/GalleryLightbox";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/Icons";
import { formatPrice, telegramHref } from "../lib/format";
import { usePublicContent } from "../lib/public-content";

export default function AlbumPage() {
  const { slug } = useParams();
  const { albums, settings } = usePublicContent();
  const album = albums.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setLightboxOpen(false);
  }, [slug]);

  if (!album) {
    return (
      <div className="not-found section-shell">
        <span className="section-kicker">404 / NOT FOUND</span>
        <h1>Ushbu albom topilmadi.</h1>
        <Link to="/catalog" className="button button--dark">Kolleksiyaga qaytish <ArrowRightIcon /></Link>
      </div>
    );
  }

  const gallery = (album.gallery.length ? album.gallery : [{ id: "cover", album_id: album.id, url: album.cover_url, storage_path: null, alt: album.name, sort_order: 0 }])
    .map((image) => ({ src: image.url, alt: image.alt || album.name }));
  const nextImage = () => setActiveImage((current) => (current + 1) % gallery.length);
  const previousImage = () => setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
  const orderUrl = telegramHref(album.telegram_url, settings.telegram_url);

  return (
    <>
      <div className="product-page section-shell">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/catalog">Albomlar</Link><span>/</span><span>{album.name}</span></nav>
        <div className="product-layout">
          <div className="product-gallery">
            <button type="button" className="product-gallery__main" onClick={() => setLightboxOpen(true)} aria-label={`Enlarge ${album.name} album image`}>
              <img src={gallery[activeImage].src} alt={gallery[activeImage].alt} fetchPriority="high" />
              <span>Kattaroq ko‘rish +</span>
            </button>
            <div className="product-gallery__bottom">
              <div className="product-gallery__thumbs" aria-label="Album images">
                {gallery.map((image, index) => (
                  <button key={`${image.src}-${index}`} type="button" className={index === activeImage ? "is-active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={index === activeImage}>
                    <img src={image.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <div className="product-gallery__arrows">
                <button type="button" aria-label="Previous album image" onClick={previousImage}><ChevronLeftIcon /></button>
                <button type="button" aria-label="Next album image" onClick={nextImage}><ChevronRightIcon /></button>
              </div>
            </div>
          </div>

          <div className="product-information">
            <span className="section-kicker">{album.series ? `${album.series.toUpperCase()} SERIES` : "Versiya"}{album.number ? ` / EDITION ${album.number}` : ""}</span>
            <h1>{album.name}<span>.</span></h1>
            <p className="product-information__lead">{album.short}</p>
            <div className="product-information__price">
              <span>Shu yerdan boshlash</span>
              <strong>{formatPrice(album.price_uzs)} {album.price_label && <small>{album.price_label}</small>}</strong>
            </div>
            <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="button button--dark product-information__order"> Buyurtma qilish <ArrowRightIcon /></a>
            <div className="product-specs">
              <h2>Tafsilotlar</h2>
              <p className="product-specs__text">{album.description}</p>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && <GalleryLightbox images={gallery} initialIndex={activeImage} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}

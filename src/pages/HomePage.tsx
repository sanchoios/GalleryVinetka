import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";
import { ArrowRightIcon, ArrowUpRightIcon, CloseIcon } from "../components/Icons";
import Reveal from "../components/Reveal";
import UzbekistanMap from "../components/UzbekistanMap";
import { telegramHref } from "../lib/format";
import { usePublicContent } from "../lib/public-content";
import type { SyntheticEvent } from "react";

function handleLogoError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  const fallback = image.dataset.fallback;
  if (fallback && image.src !== fallback) {
    image.src = fallback;
  } else {
    (image.parentElement as HTMLElement).style.display = "none";
  }
}

function LocationSection() {
  const { locations, settings } = usePublicContent();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const selected = locations.find((location) => location.city === activeCity) ?? null;

  useEffect(() => {
    if (!selected) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCity(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section
  id="locations"
  className="location-section"
  aria-labelledby="location-heading"
>
      <div className="section-shell">
        <Reveal className="location-section__heading">
          <span className="section-kicker">{settings.location_kicker}</span>
          <h2 id="location-heading">{settings.location_heading}</h2>
          <p>{settings.location_description}</p>
        </Reveal>
        <div className="uz-map" role="group" aria-label="Our cities in Uzbekistan">
          <UzbekistanMap />
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              className={`uz-map__marker${location.label_side === "left" ? " uz-map__marker--left" : ""}${selected?.city === location.city ? " is-active" : ""}`}
              style={{ left: location.marker_left, top: location.marker_top }}
              aria-label={`Show contact information for ${location.city}`}
              aria-pressed={selected?.city === location.city}
              onClick={() => setActiveCity(location.city)}
            >
              <span className="uz-map__dot" aria-hidden="true" />
              <span className="uz-map__label" aria-hidden="true">{location.city}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`city-panel-backdrop${selected ? " is-open" : ""}`} onClick={() => setActiveCity(null)} aria-hidden="true" />
      <aside className={`city-panel${selected ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label={selected ? `${selected.city} contact information` : "City contact information"} aria-hidden={!selected}>
        {selected && (
          <>
            <div className="city-panel__top">
              <span className="section-kicker">YOUR CITY / CONTACT</span>
              <button ref={closeRef} type="button" className="city-panel__close" onClick={() => setActiveCity(null)} aria-label="Close panel"><CloseIcon /></button>
            </div>
            <h3>{selected.city}</h3>
            <dl className="city-panel__details">
              <div>
                <dt>Representative</dt>
                <dd>{selected.representative_name}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd><a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}>{selected.phone}</a></dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd><a href={`https://instagram.com/${selected.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer">{selected.instagram} <ArrowUpRightIcon /></a></dd>
              </div>
              <div>
                <dt>Telegram</dt>
                <dd><a href={telegramHref(selected.telegram)} target="_blank" rel="noopener noreferrer">{selected.telegram} <ArrowUpRightIcon /></a></dd>
              </div>
            </dl>
            <a href={telegramHref(settings.telegram_url)} target="_blank" rel="noopener noreferrer" className="text-link">Or start an order online <ArrowRightIcon /></a>
          </>
        )}
      </aside>
    </section>
  );
}

export default function HomePage() {
  const { albums, logos, work, settings } = usePublicContent();
  const heroTitle = settings.hero_title.endsWith(".") ? settings.hero_title.slice(0, -1) : settings.hero_title;
  const subtitleLines = settings.hero_subtitle.split("\n");
  const heroIsExternal = settings.hero_button_link.startsWith("http");

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <img className="home-hero__image" src={settings.hero_image_url} alt="" fetchPriority="high" />
        <div className="home-hero__veil" />
        <div className="home-hero__content page-gutter">
          <div className="home-hero__copy">
            <h1 id="home-title">{heroTitle}<span>.</span></h1>
            <p>{subtitleLines.map((line, index) => <span key={index}>{line}{index < subtitleLines.length - 1 && <br />}</span>)}</p>
            {heroIsExternal
              ? <a href={settings.hero_button_link} className="button button--dark">{settings.hero_button_text} <ArrowRightIcon /></a>
              : <Link to={settings.hero_button_link || "/catalog"} className="button button--dark">{settings.hero_button_text} <ArrowRightIcon /></Link>}
          </div>
        </div>
      </section>

      <section className="albums-section section-shell" aria-labelledby="albums-heading">
        <Reveal className="albums-section__heading">
          <h2 id="albums-heading">{settings.albums_heading}</h2>
        </Reveal>
        <div className="album-grid">
          {albums.map((album) => <AlbumCard key={album.id} album={album} />)}
        </div>
        <div className="albums-section__footer">
          <Link to="/catalog" className="button button--outline">{settings.albums_button_text} <ArrowUpRightIcon /></Link>
        </div>
      </section>

      <section className="brand-marquee" aria-labelledby="clients-heading">
        <Reveal className="brand-marquee__heading section-shell">
          <h2 id="clients-heading">{settings.clients_heading}</h2>
        </Reveal>
        <ul className="visually-hidden">
          {logos.map((logo) => <li key={logo.id}>{logo.name}</li>)}
        </ul>
        <div className="brand-marquee__track" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((repeat) =>
            logos.map((logo) => (
              <div key={`${repeat}-${logo.id}`} className="brand-marquee__tile">
                <img src={logo.image_url} data-fallback={logo.fallback_url ?? undefined} alt="" loading="lazy" decoding="async" onError={handleLogoError} />
              </div>
            )),
          )}
        </div>
      </section>

      <section className="work-section section-shell" aria-labelledby="work-heading">
        <Reveal className="section-heading">
          <div>
            <span className="section-kicker">{settings.work_kicker}</span>
            <h2 id="work-heading">{settings.work_heading}</h2>
          </div>
        </Reveal>
        <div className="work-grid work-layout">
          {work.map((item, index) => (
            <Link key={item.id} to={`/work?category=${encodeURIComponent(item.id)}`} className="work-tile" data-slot={item.sort_order + 1} aria-label={`See ${item.category.toLowerCase()} work: ${item.title}`}>
              <div className="work-tile__image"><img src={item.image_url} alt={item.alt} loading="lazy" decoding="async" /></div>
              <div className="work-tile__caption"><span>0{index + 1} / {item.title}</span><ArrowUpRightIcon /></div>
            </Link>
          ))}
        </div>
        <div className="work-section__footer">
          <Link to="/work" className="button button--outline">{settings.work_button_text} <ArrowUpRightIcon /></Link>
        </div>
      </section>

      <LocationSection />
    </>
  );
}

import { useSearchParams } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";
import { usePublicContent } from "../lib/public-content";

export default function CatalogPage() {
  const { albums, categories, settings } = usePublicContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const current = categories.find((item) => item.slug === searchParams.get("series")) ?? null;
  const visibleAlbums = current ? albums.filter((album) => album.category_id === current.id || album.series.toLowerCase() === current.slug) : albums;

  return (
    <>
      <section className="catalog-heading section-shell">
        <h1 id="catalog-heading">{settings.albums_heading}</h1>
      </section>

      <section className="catalog-content section-shell" aria-label="Album catalog">
        <div className="catalog-filters" aria-label="Filter albums by series">
          <div className="catalog-filters__buttons">
            <button type="button" className={!current ? "is-active" : ""} aria-pressed={!current} onClick={() => setSearchParams({})}>Hamma albomlar</button>
            {categories.map((item) => (
              <button key={item.id} type="button" className={current?.id === item.id ? "is-active" : ""} aria-pressed={current?.id === item.id} onClick={() => setSearchParams({ series: item.slug })}>
                {item.name}
              </button>
            ))}
          </div>
          <span>{String(visibleAlbums.length).padStart(2, "0")} EDITIONS</span>
        </div>
        <div className="album-grid catalog-grid" key={current?.id ?? "all"}>
          {visibleAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}
        </div>
      </section>
    </>
  );
}

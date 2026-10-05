import { Link } from "react-router-dom";
import { formatPrice } from "../lib/format";
import type { Album } from "../lib/types";
import { ArrowUpRightIcon } from "./Icons";

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link to={`/albums/${album.slug}`} className="album-card" aria-label={`Explore the ${album.name} album`}>
      <div className="album-card__media">
        <img src={album.cover_url} alt={`${album.name} graduation album`} loading="lazy" decoding="async" />
        <span className="album-card__view" aria-hidden="true">
          <ArrowUpRightIcon />
        </span>
      </div>
      <div className="album-card__information">
        <div>
          <span className="album-card__series">{album.series}{album.number ? ` / ${album.number}` : ""}</span>
          <h3>{album.name}</h3>
        </div>
        <span className="album-card__price">{album.price_uzs ? `From ${formatPrice(album.price_uzs)}` : "dan"}</span>
      </div>
    </Link>
  );
}

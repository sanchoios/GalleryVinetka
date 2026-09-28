import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requireSupabase } from "../lib/supabase";
import { confirmDelete, Notice } from "./ui";

type Row = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  sort_order: number;
  cover_url: string;
  price_uzs: number;
  edition_number: string;
};

export default function AdminAlbums() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error: queryError } = await requireSupabase().from("albums").select("id, name, slug, published, sort_order, cover_url, price_uzs, edition_number").order("sort_order");
    if (queryError) setError(queryError.message);
    else setRows(data ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function createAlbum() {
    setBusy(true);
    setError("");
    const slug = `albom-${Date.now()}`;
    const { data, error: insertError } = await requireSupabase().from("albums").insert({
      name: "Yangi albom",
      slug,
      edition_number: String(rows.length + 1).padStart(2, "0"),
      published: false,
      sort_order: rows.length,
      price_uzs: 950000,
      price_label: "/ student",
    }).select("id").single();
    setBusy(false);
    if (insertError) setError(insertError.message);
    else if (data) navigate(`/admin/albums/${data.id}`);
  }

  async function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setRows(copy);
    const client = requireSupabase();
    await Promise.all(copy.map((row, sort_order) => client.from("albums").update({ sort_order }).eq("id", row.id)));
  }

  async function toggle(row: Row) {
    const { error: updateError } = await requireSupabase().from("albums").update({ published: !row.published }).eq("id", row.id);
    if (updateError) setError(updateError.message);
    else void load();
  }

  async function remove(row: Row) {
    if (!confirmDelete(row.name)) return;
    const { error: deleteError } = await requireSupabase().from("albums").delete().eq("id", row.id);
    if (deleteError) setError(deleteError.message);
    else void load();
  }

  return (
    <>
      <h1>Albomlar</h1>
      <p className="admin-lead">Chop etilgan albomlar bosh sahifa, katalog va o‘z sahifasida ko‘rinadi. Yashirilganlari ochiq saytda chiqmaydi.</p>
      {error && <Notice kind="err">{error}</Notice>}
      <div className="admin-toolbar">
        <button className="admin-btn" type="button" disabled={busy} onClick={() => void createAlbum()}>Yangi albom</button>
      </div>
      <div className="admin-card">
        {rows.map((row, index) => (
          <div className="admin-row" key={row.id}>
            {row.cover_url ? <img src={row.cover_url} alt="" /> : <div />}
            <div>
              <h3>{row.name}</h3>
              <p>/{row.slug} · {row.edition_number} · {row.published ? "Chop etilgan" : "Yashirin"}</p>
            </div>
            <div className="admin-actions">
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void move(index, -1)}>↑</button>
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void move(index, 1)}>↓</button>
              <Link className="admin-btn admin-btn--ghost" to={`/admin/albums/${row.id}`}>Tahrirlash</Link>
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void toggle(row)}>{row.published ? "Yashirish" : "Chop etish"}</button>
              <button className="admin-btn admin-btn--danger" type="button" onClick={() => void remove(row)}>O‘chirish</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="admin-note">Hali albom yo‘q.</p>}
      </div>
    </>
  );
}

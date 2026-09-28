import { useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase";
import { removeMedia, uploadMedia } from "../lib/upload";
import { confirmDelete, Field, Notice } from "./ui";

type Row = {
  id: string;
  name: string;
  image_url: string;
  fallback_url: string | null;
  storage_path: string | null;
  published: boolean;
  sort_order: number;
};

export default function AdminLogos() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error: queryError } = await requireSupabase().from("client_logos").select("*").order("sort_order");
    if (queryError) setError(queryError.message);
    else setRows(data ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function add(file: File) {
    try {
      const uploaded = await uploadMedia(file, "logos");
      const { error: insertError } = await requireSupabase().from("client_logos").insert({
        name: "Universitet",
        image_url: uploaded.url,
        storage_path: uploaded.path,
        published: true,
        sort_order: rows.length,
      });
      if (insertError) setError(insertError.message);
      else void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklash xatosi.");
    }
  }

  async function save(row: Row) {
    const { error: updateError } = await requireSupabase().from("client_logos").update({
      name: row.name,
      published: row.published,
      image_url: row.image_url,
    }).eq("id", row.id);
    if (updateError) setError(updateError.message);
    else setStatus("Saqlangan.");
  }

  async function replace(row: Row, file: File) {
    try {
      const uploaded = await uploadMedia(file, "logos");
      const previous = row.storage_path;
      const { error: updateError } = await requireSupabase().from("client_logos").update({ image_url: uploaded.url, storage_path: uploaded.path }).eq("id", row.id);
      if (updateError) setError(updateError.message);
      else {
        if (previous) await removeMedia(previous);
        void load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Almashtirish xatosi.");
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setRows(copy);
    const client = requireSupabase();
    await Promise.all(copy.map((row, sort_order) => client.from("client_logos").update({ sort_order }).eq("id", row.id)));
  }

  async function remove(row: Row) {
    if (!confirmDelete(row.name)) return;
    const { error: deleteError } = await requireSupabase().from("client_logos").delete().eq("id", row.id);
    if (deleteError) setError(deleteError.message);
    else {
      await removeMedia(row.storage_path);
      void load();
    }
  }

  return (
    <>
      <h1>Universitet logolari</h1>
      <p className="admin-lead">Karusel logolarini yuklang, nomlang, tartiblang yoki yashiring.</p>
      {error && <Notice kind="err">{error}</Notice>}
      {status && <Notice kind="ok">{status}</Notice>}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const file = e.target.files?.[0]; if (file) void add(file); e.target.value = ""; }} />
      <div className="admin-card" style={{ marginTop: 20 }}>
        {rows.map((row, index) => (
          <div className="admin-row" key={row.id} style={{ alignItems: "start" }}>
            <img src={row.image_url} alt="" style={{ objectFit: "contain", background: "#fff" }} />
            <div className="admin-form">
              <Field label="Nomi"><input value={row.name} onChange={(e) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, name: e.target.value } : item))} /></Field>
              <label className="admin-check"><input type="checkbox" checked={row.published} onChange={(e) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, published: e.target.checked } : item))} /> Ko‘rinsin</label>
              <Field label="Logoni almashtirish"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const file = e.target.files?.[0]; if (file) void replace(row, file); }} /></Field>
            </div>
            <div className="admin-actions">
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void move(index, -1)}>↑</button>
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void move(index, 1)}>↓</button>
              <button className="admin-btn" type="button" onClick={() => void save(row)}>Saqlash</button>
              <button className="admin-btn admin-btn--danger" type="button" onClick={() => void remove(row)}>O‘chirish</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { requireSupabase } from "../lib/supabase";
import { confirmDelete, Field, Notice } from "./ui";

type Row = {
  id: string;
  city: string;
  representative_name: string;
  phone: string;
  instagram: string;
  telegram: string;
  marker_left: string;
  marker_top: string;
  label_side: "left" | "right";
  published: boolean;
  sort_order: number;
};

const blank: Omit<Row, "id"> = {
  city: "Yangi shahar",
  representative_name: "First Name Last Name",
  phone: "+998 XX XXX XX XX",
  instagram: "@username",
  telegram: "@username",
  marker_left: "50%",
  marker_top: "50%",
  label_side: "right",
  published: true,
  sort_order: 0,
};

export default function AdminContacts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const { data, error: queryError } = await requireSupabase().from("locations").select("*").order("sort_order");
    if (queryError) setError(queryError.message);
    else setRows(data ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function add() {
    const { error: insertError } = await requireSupabase().from("locations").insert({ ...blank, sort_order: rows.length, city: `Shahar ${rows.length + 1}` });
    if (insertError) setError(insertError.message);
    else void load();
  }

  async function save(row: Row) {
    const { error: updateError } = await requireSupabase().from("locations").update({
      city: row.city,
      representative_name: row.representative_name,
      phone: row.phone,
      instagram: row.instagram,
      telegram: row.telegram,
      marker_left: row.marker_left,
      marker_top: row.marker_top,
      label_side: row.label_side,
      published: row.published,
    }).eq("id", row.id);
    if (updateError) setError(updateError.message);
    else setStatus("Saqlangan.");
  }

  async function remove(row: Row) {
    if (!confirmDelete(row.city)) return;
    const { error: deleteError } = await requireSupabase().from("locations").delete().eq("id", row.id);
    if (deleteError) setError(deleteError.message);
    else void load();
  }

  function patch(id: string, next: Partial<Row>) {
    setRows((current) => current.map((item) => item.id === id ? { ...item, ...next } : item));
  }

  return (
    <>
      <h1>Kontaktlar</h1>
      <p className="admin-lead">Xaritadagi shaharlar. Marker o‘rni foizlarda (masalan 75% va 51.9%).</p>
      {error && <Notice kind="err">{error}</Notice>}
      {status && <Notice kind="ok">{status}</Notice>}
      <button className="admin-btn" type="button" onClick={() => void add()}>Shahar qo‘shish</button>
      <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
        {rows.map((row) => (
          <div className="admin-card" key={row.id} style={{ padding: 16 }}>
            <div className="admin-form">
              <div className="admin-grid-2">
                <Field label="Shahar"><input value={row.city} onChange={(e) => patch(row.id, { city: e.target.value })} /></Field>
                <Field label="Vakil (ism familiya)"><input value={row.representative_name} onChange={(e) => patch(row.id, { representative_name: e.target.value })} /></Field>
              </div>
              <div className="admin-grid-2">
                <Field label="Telefon"><input value={row.phone} onChange={(e) => patch(row.id, { phone: e.target.value })} /></Field>
                <Field label="Telegram"><input value={row.telegram} onChange={(e) => patch(row.id, { telegram: e.target.value })} /></Field>
              </div>
              <Field label="Instagram"><input value={row.instagram} onChange={(e) => patch(row.id, { instagram: e.target.value })} /></Field>
              <div className="admin-grid-2">
                <Field label="Marker chap (left)"><input value={row.marker_left} onChange={(e) => patch(row.id, { marker_left: e.target.value })} /></Field>
                <Field label="Marker yuqori (top)"><input value={row.marker_top} onChange={(e) => patch(row.id, { marker_top: e.target.value })} /></Field>
              </div>
              <Field label="Yorliq tomoni">
                <select value={row.label_side} onChange={(e) => patch(row.id, { label_side: e.target.value as "left" | "right" })}>
                  <option value="right">O‘ng</option>
                  <option value="left">Chap</option>
                </select>
              </Field>
              <label className="admin-check"><input type="checkbox" checked={row.published} onChange={(e) => patch(row.id, { published: e.target.checked })} /> Xaritada ko‘rinsin</label>
              <div className="admin-actions">
                <button className="admin-btn" type="button" onClick={() => void save(row)}>Saqlash</button>
                <button className="admin-btn admin-btn--danger" type="button" onClick={() => void remove(row)}>O‘chirish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

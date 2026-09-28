import { useEffect, useRef, useState } from "react";
import { requireSupabase } from "../lib/supabase";
import { uploadMedia, removeMedia } from "../lib/upload";
import { confirmDelete, Field, Notice, UnsavedGuard } from "./ui";
import type { WorkItem } from "../lib/types";

type Photo = { id: string; category_id: string | null; image_url: string; storage_path: string | null; sort_order: number; published: boolean };
const accept = "image/jpeg,image/png,image/webp,image/gif";
export default function AdminWork() {
  const photoInput = useRef<HTMLInputElement>(null);
  const [covers, setCovers] = useState<WorkItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const cover = covers.find(c => c.id === selected);
  const dirty = !!cover && title !== cover.title;
  const visible = photos.filter(p => selected === "unassigned" ? !p.category_id : p.category_id === selected);
  async function load() {
    const client = requireSupabase();
    const [a, b] = await Promise.all([
      client.from("work_items").select("*").eq("is_cover", true).order("sort_order"),
      client.from("work_photos").select("*").order("sort_order").order("id")
    ]);
    if (a.error || b.error) throw new Error((a.error ?? b.error)!.message + " — 003_work_galleries.sql bajarilganini tekshiring.");
    setCovers(a.data ?? []); setPhotos(b.data ?? []);
  }
  useEffect(() => { void load().catch(e => setError(String(e.message ?? e))); }, []);
  async function action(task: () => Promise<void>, message = "Saqlangan.") {
    setBusy(true); setError(""); setStatus("");
    try { await task(); await load(); setStatus(message); }
    catch (e) { setError(e instanceof Error ? e.message : "Amal bajarilmadi."); }
    finally { setBusy(false); }
  }
  function choose(id: string) {
    if (dirty && !window.confirm("Saqlanmagan kategoriya nomi bor. Davom etasizmi?")) return;
    setSelected(id); setTitle(covers.find(c => c.id === id)?.title ?? ""); setError(""); setStatus("");
  }
  async function updatePhoto(photo: Photo, values: Partial<Photo>) {
    const { error } = await requireSupabase().from("work_photos").update(values).eq("id", photo.id).select("id").single();
    if (error) throw error;
  }
  async function upload(file: File, save: (media: { url: string; path: string }) => Promise<void>) {
    const media = await uploadMedia(file, "work");
    try { await save(media); }
    catch (e) { await removeMedia(media.path); throw e; }
  }
  async function add(files: File[]) {
    if (!cover) return;
    const categoryId = cover.id;
    let count = 0;
    await action(async () => {
      let order = Math.max(-1, ...photos.filter(p => p.category_id === categoryId).map(p => p.sort_order)) + 1;
      for (const file of files) {
        setStatus(`${count + 1} / ${files.length} yuklanmoqda…`);
        try {
          await upload(file, async media => {
            const { error } = await requireSupabase().from("work_photos").insert({ category_id: categoryId, image_url: media.url, storage_path: media.path, sort_order: order++, published: true }).select("id").single();
            if (error) throw error;
          });
          count++;
        } catch (e) {
          await load(); setStatus("");
          throw new Error(`${count} ta rasm saqlandi. ${file.name}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }, `${files.length} ta rasm kategoriya ichiga yuklandi.`);
  }
  return <>
    <UnsavedGuard dirty={dirty} />
    <h1>Our Work</h1>
    <p className="admin-lead">Kategoriyani tanlang va ichiga rasmlar yuklang. Asosiy sahifadagi 7 ta muqova o‘z joyida qoladi.</p>
    {error && <Notice kind="err">{error}</Notice>}{status && <Notice kind="ok">{status}</Notice>}
    <fieldset disabled={busy} style={{ border: 0, padding: 0, minWidth: 0 }}>
      <Field label="Kategoriya"><select value={selected} onChange={e => choose(e.target.value)}>
        <option value="">Kategoriya tanlang</option>
        {covers.map((c, i) => <option key={c.id} value={c.id}>{i + 1}. {c.title}</option>)}
        <option value="unassigned">Joylashtirilmagan eski rasmlar ({photos.filter(p => !p.category_id).length})</option>
      </select></Field>
      {cover && <div className="admin-card" style={{ marginTop: 20 }}>
        <h2>Kategoriya muqovasi</h2>
        <img className="admin-thumb" src={cover.image_url} alt={cover.title} />
        <Field label="Kategoriya nomi"><input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <button className="admin-btn" type="button" onClick={() => void action(async () => {
          if (!title.trim()) throw new Error("Kategoriya nomini yozing.");
          const { error } = await requireSupabase().from("work_items").update({ title: title.trim(), alt: title.trim() }).eq("id", cover.id).select("id").single();
          if (error) throw error; setTitle(title.trim());
        })}>Nomni saqlash</button>
        <Field label="Muqova rasmini almashtirish"><input type="file" accept={accept} onChange={e => {
          const file = e.target.files?.[0]; e.target.value = "";
          if (file) void action(() => upload(file, async media => {
            const { error } = await requireSupabase().from("work_items").update({ image_url: media.url, storage_path: media.path }).eq("id", cover.id).select("id").single();
            if (error) throw error;
          }), "Muqova yangilandi.");
        }} /></Field>
        <h2>Kategoriya ichiga rasm yuklash</h2>
        <p>Bir yoki bir nechta rasm tanlang. Nom yozish shart emas. Har bir fayl: JPG, PNG, WEBP yoki GIF, 8 MB gacha.</p>
        <button className="admin-btn work-add-photos" type="button" onClick={() => photoInput.current?.click()} disabled={busy}>{busy ? "Yuklanmoqda…" : "+ Rasm qo‘shish"}</button>
        <input ref={photoInput} hidden type="file" multiple accept={accept} onChange={e => { const files = Array.from(e.target.files ?? []); e.target.value = ""; if (files.length) void add(files); }} />
      </div>}
      {selected && <><h2 style={{ marginTop: 24 }}>Rasmlar ({visible.length})</h2>
        {selected === "unassigned" && <p>Bu rasmlar saqlangan. Har biriga kerakli kategoriyani tanlang.</p>}
        <div className="admin-gallery">{visible.map((photo, index) => <div className="admin-gallery__item" key={photo.id}>
          <img src={photo.image_url} alt={`Rasm ${index + 1}`} />
          <Field label="Kategoriya"><select value={photo.category_id ?? ""} onChange={e => {
            const id = e.target.value;
            if (id) void action(() => updatePhoto(photo, { category_id: id, sort_order: Math.max(-1, ...photos.filter(p => p.category_id === id).map(p => p.sort_order)) + 1 }));
          }}><option value="" disabled>Tanlang</option>{covers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field>
          <div className="admin-actions">
            {[-1, 1].map(direction => <button key={direction} className="admin-btn admin-btn--ghost" type="button" disabled={!visible[index + direction]} onClick={() => void action(async () => {
              const other = visible[index + direction];
              const { error } = await requireSupabase().rpc("swap_work_photos", { first_id: photo.id, second_id: other.id });
              if (error) throw error;
            })}>{direction === -1 ? "↑" : "↓"}</button>)}
            <button className="admin-btn admin-btn--ghost" onClick={() => void action(() => updatePhoto(photo, { published: !photo.published }))}>{photo.published ? "Yashirish" : "Ko‘rsatish"}</button>
            <button className="admin-btn admin-btn--danger" onClick={() => {
              if (confirmDelete("Rasm")) void action(async () => {
                const { error } = await requireSupabase().from("work_photos").delete().eq("id", photo.id).select("id").single();
                if (error) throw error;
              }, "Rasm galereyadan o‘chirildi.");
            }}>O‘chirish</button>
          </div>
          <Field label="Rasmni almashtirish"><input type="file" accept={accept} onChange={e => {
            const file = e.target.files?.[0]; e.target.value = "";
            if (file) void action(() => upload(file, media => updatePhoto(photo, { image_url: media.url, storage_path: media.path })));
          }} /></Field>
        </div>)}</div></>}
    </fieldset>
  </>;
}

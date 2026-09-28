import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { requireSupabase } from "../lib/supabase";
import { removeMedia, uploadMedia } from "../lib/upload";
import { confirmDelete, Field, ImageField, Notice, UnsavedGuard } from "./ui";

type Category = { id: string; name: string; slug: string; sort_order: number };
type ImageRow = { id: string; url: string; alt: string; sort_order: number; storage_path: string | null };

const emptyForm = {
  name: "",
  slug: "",
  category_id: "",
  edition_number: "",
  short_text: "",
  description: "",
  finish: "",
  price_uzs: 950000,
  price_label: "/ student",
  cover_url: "",
  cover_path: "",
  telegram_url: "",
  published: false,
};

export default function AdminAlbumEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [initial, setInitial] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  useEffect(() => {
    if (!id) return;
    const client = requireSupabase();
    void Promise.all([
      client.from("albums").select("*").eq("id", id).single(),
      client.from("album_images").select("*").eq("album_id", id).order("sort_order"),
      client.from("album_categories").select("*").order("sort_order"),
    ]).then(([albumRes, imageRes, catRes]) => {
      if (albumRes.error || !albumRes.data) {
        setError(albumRes.error?.message ?? "Albom topilmadi.");
        return;
      }
      const next = {
        name: albumRes.data.name ?? "",
        slug: albumRes.data.slug ?? "",
        category_id: albumRes.data.category_id ?? "",
        edition_number: albumRes.data.edition_number ?? "",
        short_text: albumRes.data.short_text ?? "",
        description: albumRes.data.description ?? "",
        finish: albumRes.data.finish ?? "",
        price_uzs: albumRes.data.price_uzs ?? 0,
        price_label: albumRes.data.price_label ?? "",
        cover_url: albumRes.data.cover_url ?? "",
        cover_path: albumRes.data.cover_path ?? "",
        telegram_url: albumRes.data.telegram_url ?? "",
        published: Boolean(albumRes.data.published),
      };
      setForm(next);
      setInitial(next);
      setImages(imageRes.data ?? []);
      setCategories(catRes.data ?? []);
    });
  }, [id]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!id) return;
    setBusy(true);
    setError("");
    setStatus("");
    const { error: updateError } = await requireSupabase().from("albums").update({
      name: form.name,
      slug: form.slug.trim(),
      category_id: form.category_id || null,
      edition_number: form.edition_number,
      short_text: form.short_text,
      description: form.description,
      finish: form.finish,
      price_uzs: Number(form.price_uzs) || 0,
      price_label: form.price_label,
      cover_url: form.cover_url,
      cover_path: form.cover_path || null,
      telegram_url: form.telegram_url || null,
      published: form.published,
    }).eq("id", id);
    setBusy(false);
    if (updateError) setError(updateError.message);
    else {
      setInitial(form);
      setStatus("Saqlangan.");
    }
  }

  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data, error: insertError } = await requireSupabase().from("album_categories").insert({ name, slug, sort_order: categories.length }).select("*").single();
    if (insertError) setError(insertError.message);
    else if (data) {
      setCategories((current) => [...current, data]);
      setForm((current) => ({ ...current, category_id: data.id }));
      setNewCategory("");
    }
  }

  async function renameCategory(category: Category, name: string) {
    const { error: updateError } = await requireSupabase().from("album_categories").update({ name }).eq("id", category.id);
    if (updateError) setError(updateError.message);
    else setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name } : item));
  }

  async function addGalleryImage(file: File) {
    if (!id) return;
    try {
      const uploaded = await uploadMedia(file, "albums");
      const { data, error: insertError } = await requireSupabase().from("album_images").insert({
        album_id: id,
        url: uploaded.url,
        storage_path: uploaded.path,
        alt: form.name,
        sort_order: images.length,
      }).select("*").single();
      if (insertError) setError(insertError.message);
      else if (data) setImages((current) => [...current, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rasm yuklanmadi.");
    }
  }

  async function updateImage(image: ImageRow, patch: Partial<ImageRow>) {
    const { error: updateError } = await requireSupabase().from("album_images").update(patch).eq("id", image.id);
    if (updateError) setError(updateError.message);
    else setImages((current) => current.map((item) => item.id === image.id ? { ...item, ...patch } : item));
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const copy = [...images];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setImages(copy);
    const client = requireSupabase();
    await Promise.all(copy.map((image, sort_order) => client.from("album_images").update({ sort_order }).eq("id", image.id)));
  }

  async function removeImage(image: ImageRow) {
    if (!confirmDelete("Galereya rasmi")) return;
    const { error: deleteError } = await requireSupabase().from("album_images").delete().eq("id", image.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setImages((current) => current.filter((item) => item.id !== image.id));
    const stillUsed = images.some((item) => item.id !== image.id && item.storage_path === image.storage_path);
    if (!stillUsed) await removeMedia(image.storage_path);
  }

  return (
    <>
      <UnsavedGuard dirty={dirty} />
      <p><Link to="/admin/albums">← Albomlar</Link></p>
      <h1>{form.name || "Albom"}</h1>
      <p className="admin-lead">Maydonlarni o‘zgartiring va saqlang. Chop etilmagan albom ochiq saytda ko‘rinmaydi.</p>
      {error && <Notice kind="err">{error}</Notice>}
      {status && <Notice kind="ok">{status}</Notice>}
      <div className="admin-form">
        <div className="admin-grid-2">
          <Field label="Nomi"><input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="URL slug"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
        </div>
        <div className="admin-grid-2">
          <Field label="Seriya / kategoriya">
            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">Tanlanmagan</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Nashr raqami"><input value={form.edition_number} onChange={(e) => set("edition_number", e.target.value)} /></Field>
        </div>
        <div className="admin-grid-2">
          <Field label="Yangi kategoriya nomi">
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          </Field>
          <div><button className="admin-btn admin-btn--ghost" type="button" onClick={() => void addCategory()}>Kategoriya qo‘shish</button></div>
        </div>
        {categories.map((category) => (
          <Field key={category.id} label={`Kategoriyani qayta nomlash: ${category.slug}`}>
            <input defaultValue={category.name} onBlur={(e) => { if (e.target.value !== category.name) void renameCategory(category, e.target.value); }} />
          </Field>
        ))}
        <Field label="Qisqa matn"><input value={form.short_text} onChange={(e) => set("short_text", e.target.value)} /></Field>
        <Field label="To‘liq tavsif"><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label="Muqova materiali / finish"><input value={form.finish} onChange={(e) => set("finish", e.target.value)} /></Field>
        <div className="admin-grid-2">
          <Field label="Narx (UZS)"><input type="number" min={0} value={form.price_uzs} onChange={(e) => set("price_uzs", Number(e.target.value))} /></Field>
          <Field label="Narx yorlig‘i"><input value={form.price_label} onChange={(e) => set("price_label", e.target.value)} /></Field>
        </div>
        <Field label="Albom Telegram havolasi (ixtiyoriy, bo‘sh bo‘lsa umumiy havola ishlatiladi)"><input value={form.telegram_url} onChange={(e) => set("telegram_url", e.target.value)} placeholder="https://t.me/YOUR_USERNAME" /></Field>
        <ImageField label="Muqova rasmi" value={form.cover_url} folder="covers" onUploaded={(url, path) => { set("cover_url", url); set("cover_path", path); }} />
        <label className="admin-check"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Chop etilgan (saytda ko‘rinsin)</label>
        <div className="admin-actions">
          <button className="admin-btn" type="button" disabled={busy} onClick={() => void save()}>{busy ? "Saqlanmoqda…" : "Saqlash"}</button>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => navigate("/admin/albums")}>Orqaga</button>
        </div>
      </div>

      <h2 style={{ marginTop: 48 }}>Galereya</h2>
      <p className="admin-lead">Bir nechta rasm yuklang, tartibini o‘zgartiring yoki alohida o‘chiring.</p>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const file = e.target.files?.[0]; if (file) void addGalleryImage(file); e.target.value = ""; }} />
      <div className="admin-gallery" style={{ marginTop: 16 }}>
        {images.map((image, index) => (
          <div className="admin-gallery__item" key={image.id}>
            <img src={image.url} alt="" />
            <Field label="Alt matn">
              <input value={image.alt} onChange={(e) => setImages((current) => current.map((item) => item.id === image.id ? { ...item, alt: e.target.value } : item))} onBlur={(e) => void updateImage(image, { alt: e.target.value })} />
            </Field>
            <div className="admin-actions">
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void moveImage(index, -1)}>↑</button>
              <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void moveImage(index, 1)}>↓</button>
              <button className="admin-btn admin-btn--danger" type="button" onClick={() => void removeImage(image)}>O‘chirish</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

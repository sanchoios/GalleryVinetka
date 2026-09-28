import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "../lib/types";
import { requireSupabase } from "../lib/supabase";
import { Field, ImageField, Notice, UnsavedGuard } from "./ui";

export default function AdminSettings() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [initial, setInitial] = useState(DEFAULT_SETTINGS);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  useEffect(() => {
    void requireSupabase().from("site_settings").select("*").eq("id", "main").maybeSingle().then(({ data, error: queryError }) => {
      if (queryError) setError(queryError.message);
      else if (data) {
        const next = { ...DEFAULT_SETTINGS, ...data };
        setForm(next);
        setInitial(next);
      }
    });
  }, []);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setError("");
    setStatus("");
    const { error: updateError } = await requireSupabase().from("site_settings").upsert({ ...form, id: "main" });
    if (updateError) setError(updateError.message);
    else {
      setInitial(form);
      setStatus("Saqlangan.");
    }
  }

  return (
    <>
      <UnsavedGuard dirty={dirty} />
      <h1>Sayt sozlamalari</h1>
      <p className="admin-lead">Brend, Telegram, email va sahifa sarlavhalari. Buyurtma Telegram orqali qoladi — ichki to‘lov yo‘q.</p>
      {error && <Notice kind="err">{error}</Notice>}
      {status && <Notice kind="ok">{status}</Notice>}
      <div className="admin-form">
        <div className="admin-grid-2">
          <Field label="Brend nomi"><input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} /></Field>
          <Field label="Brend tavsifi"><input value={form.brand_descriptor} onChange={(e) => set("brand_descriptor", e.target.value)} /></Field>
        </div>
        <ImageField label="Logo (ixtiyoriy)" value={form.logo_url} folder="brand" onUploaded={(url) => set("logo_url", url)} />
        <Field label="Footer matni"><input value={form.footer_text} onChange={(e) => set("footer_text", e.target.value)} /></Field>
        <Field label="Footer yorliq"><input value={form.footer_tagline} onChange={(e) => set("footer_tagline", e.target.value)} /></Field>
        <Field label="Kontakt email (forma shu manzilga ochiladi)"><input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></Field>
        <Field label="Umumiy Telegram buyurtma havolasi"><input value={form.telegram_url} onChange={(e) => set("telegram_url", e.target.value)} placeholder="https://t.me/YOUR_USERNAME" /></Field>
        <Field label="Instagram havolasi"><input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} /></Field>
        <h2>SEO</h2>
        <Field label="Bosh sahifa title"><input value={form.meta_title_home} onChange={(e) => set("meta_title_home", e.target.value)} /></Field>
        <Field label="Bosh sahifa description"><textarea value={form.meta_description_home} onChange={(e) => set("meta_description_home", e.target.value)} /></Field>
        <Field label="Katalog title"><input value={form.meta_title_catalog} onChange={(e) => set("meta_title_catalog", e.target.value)} /></Field>
        <Field label="Katalog description"><textarea value={form.meta_description_catalog} onChange={(e) => set("meta_description_catalog", e.target.value)} /></Field>
        <Field label="Our Work title"><input value={form.meta_title_work} onChange={(e) => set("meta_title_work", e.target.value)} /></Field>
        <Field label="Our Work description"><textarea value={form.meta_description_work} onChange={(e) => set("meta_description_work", e.target.value)} /></Field>
        <Field label="Kontakt title"><input value={form.meta_title_contact} onChange={(e) => set("meta_title_contact", e.target.value)} /></Field>
        <Field label="Kontakt description"><textarea value={form.meta_description_contact} onChange={(e) => set("meta_description_contact", e.target.value)} /></Field>
        <h2>Kontakt sahifasi</h2>
        <Field label="Kontakt kicker"><input value={form.contact_kicker} onChange={(e) => set("contact_kicker", e.target.value)} /></Field>
        <Field label="Kontakt sarlavha"><textarea value={form.contact_heading} onChange={(e) => set("contact_heading", e.target.value)} /></Field>
        <Field label="Kontakt kirish matni"><textarea value={form.contact_intro} onChange={(e) => set("contact_intro", e.target.value)} /></Field>
        <button className="admin-btn" type="button" onClick={() => void save()}>Saqlash</button>
      </div>
    </>
  );
}

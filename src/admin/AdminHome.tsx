import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "../lib/types";
import { requireSupabase } from "../lib/supabase";
import { Field, ImageField, Notice, UnsavedGuard } from "./ui";

export default function AdminHome() {
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
      <h1>Bosh sahifa</h1>
      <p className="admin-lead">Hero rasm, sarlavha va tugmalar. Dizayn o‘zgarmaydi — faqat matn va rasm.</p>
      {error && <Notice kind="err">{error}</Notice>}
      {status && <Notice kind="ok">{status}</Notice>}
      <div className="admin-form">
        <ImageField label="Hero rasm" value={form.hero_image_url} folder="home" onUploaded={(url) => set("hero_image_url", url)} />
        <Field label="Hero sarlavha"><input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} /></Field>
        <Field label="Hero ostmatn"><textarea value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} /></Field>
        <div className="admin-grid-2">
          <Field label="Hero tugma matni"><input value={form.hero_button_text} onChange={(e) => set("hero_button_text", e.target.value)} /></Field>
          <Field label="Hero tugma havolasi"><input value={form.hero_button_link} onChange={(e) => set("hero_button_link", e.target.value)} /></Field>
        </div>
        <Field label="Albomlar bo‘limi sarlavhasi"><input value={form.albums_heading} onChange={(e) => set("albums_heading", e.target.value)} /></Field>
        <Field label="Albomlar tugmasi"><input value={form.albums_button_text} onChange={(e) => set("albums_button_text", e.target.value)} /></Field>
        <Field label="Our Clients sarlavhasi"><input value={form.clients_heading} onChange={(e) => set("clients_heading", e.target.value)} /></Field>
        <Field label="Our Work kicker"><input value={form.work_kicker} onChange={(e) => set("work_kicker", e.target.value)} /></Field>
        <Field label="Our Work sarlavhasi"><input value={form.work_heading} onChange={(e) => set("work_heading", e.target.value)} /></Field>
        <Field label="Our Work tugmasi"><input value={form.work_button_text} onChange={(e) => set("work_button_text", e.target.value)} /></Field>
        <Field label="Xarita kicker"><input value={form.location_kicker} onChange={(e) => set("location_kicker", e.target.value)} /></Field>
        <Field label="Xarita sarlavhasi"><input value={form.location_heading} onChange={(e) => set("location_heading", e.target.value)} /></Field>
        <Field label="Xarita tavsifi"><textarea value={form.location_description} onChange={(e) => set("location_description", e.target.value)} /></Field>
        <button className="admin-btn" type="button" onClick={() => void save()}>Saqlash</button>
      </div>
    </>
  );
}

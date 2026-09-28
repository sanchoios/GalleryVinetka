import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Notice } from "./ui";
import "./admin.css";

export default function AdminReset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Parolni tiklash | FOLIO";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message);
    else navigate("/admin/albums", { replace: true });
  }

  return (
    <div className="admin-login">
      <form onSubmit={onSubmit}>
        <h1>Yangi parol</h1>
        <p className="admin-lead">Elektron pochtadagi havola orqali kirdingiz.</p>
        {error && <Notice kind="err">{error}</Notice>}
        <div className="admin-form">
          <label>Yangi parol<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="admin-btn" type="submit" disabled={busy}>{busy ? "Saqlanmoqda…" : "Parolni saqlash"}</button>
          <Link to="/admin/login">Kirish sahifasi</Link>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Notice } from "./ui";
import "./admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isOwner, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    document.title = "Admin kirish | FOLIO";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!loading && isOwner) navigate("/admin/albums", { replace: true });
  }, [isOwner, loading, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signError) setError(signError.message);
  }

  async function sendReset() {
    if (!supabase || !email) {
      setError("Parolni tiklash uchun elektron pochtani kiriting.");
      return;
    }
    setError("");
    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (resetError) setError(resetError.message);
    else setResetSent(true);
  }

  return (
    <div className="admin-login">
      <form onSubmit={onSubmit}>
        <h1>Admin panel</h1>
        <p className="admin-lead">Faqat sayt egasi kira oladi.</p>
        {!isSupabaseConfigured && <Notice kind="err">Supabase sozlanmagan. .env fayliga VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY qo‘shing.</Notice>}
        {user && !isOwner && !loading && <Notice kind="err">Bu hisob admin huquqiga ega emas.</Notice>}
        {error && <Notice kind="err">{error}</Notice>}
        {resetSent && <Notice kind="ok">Agar shu pochta ro‘yxatdan o‘tgan bo‘lsa, tiklash xati yuborildi.</Notice>}
        <div className="admin-form">
          <label>Elektron pochta<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Parol<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="admin-btn" type="submit" disabled={busy || !isSupabaseConfigured}>{busy ? "Kirilmoqda…" : "Kirish"}</button>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void sendReset()}>Parolni unutdingizmi?</button>
          <Link to="/">Saytga qaytish</Link>
        </div>
      </form>
    </div>
  );
}

import { useEffect } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./admin.css";

const links = [
  { to: "/admin/albums", label: "Albomlar" },
  { to: "/admin/work", label: "Our Work" },
  { to: "/admin/home", label: "Bosh sahifa" },
  { to: "/admin/logos", label: "Universitet logolari" },
  { to: "/admin/contacts", label: "Kontaktlar" },
  { to: "/admin/settings", label: "Sayt sozlamalari" },
];

export default function AdminLayout() {
  const { loading, isOwner, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin | FOLIO";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (!isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace />;
  }
  if (loading) {
    return <div className="admin-login"><p>Yuklanmoqda…</p></div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isOwner) {
    return (
      <div className="admin-login">
        <div>
          <h1>Ruxsat yo‘q</h1>
          <p className="admin-lead">Bu hisob admin emas. Chiqib, egasi hisobi bilan kiring.</p>
          <button className="admin-btn" type="button" onClick={() => { void supabase?.auth.signOut(); navigate("/admin/login"); }}>Chiqish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <span className="admin-side__brand">FOLIO admin</span>
          <nav>
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "is-active" : ""}>{item.label}</NavLink>
            ))}
          </nav>
          <button className="admin-side__out" type="button" onClick={() => { void supabase?.auth.signOut(); navigate("/admin/login"); }}>Chiqish</button>
        </aside>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

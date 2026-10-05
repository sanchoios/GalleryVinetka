import { useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Link, Navigate, Outlet, Route, useLocation } from "react-router-dom";
import AdminAlbumEdit from "./admin/AdminAlbumEdit";
import AdminAlbums from "./admin/AdminAlbums";
import AdminContacts from "./admin/AdminContacts";
import AdminHome from "./admin/AdminHome";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminLogos from "./admin/AdminLogos";
import AdminReset from "./admin/AdminReset";
import AdminSettings from "./admin/AdminSettings";
import AdminWork from "./admin/AdminWork";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { ArrowRightIcon } from "./components/Icons";
import { AuthProvider } from "./lib/auth";
import { PublicContentProvider, usePublicContent } from "./lib/public-content";
import AlbumPage from "./pages/AlbumPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";

function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  const { settings } = usePublicContent();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }

    const title = pathname === "/" ? settings.meta_title_home :
      pathname.startsWith("/albums/") ? `${settings.brand_name} album` :
      pathname === "/catalog" ? settings.meta_title_catalog :
      pathname === "/work" ? settings.meta_title_work :
      pathname === "/contact" ? settings.meta_title_contact :
      pathname.startsWith("/admin") ? "Admin | FOLIO" : settings.brand_name;
    document.title = title;

    const description = pathname === "/" ? settings.meta_description_home :
      pathname === "/catalog" ? settings.meta_description_catalog :
      pathname === "/work" ? settings.meta_description_work :
      pathname === "/contact" ? settings.meta_description_contact :
      settings.meta_description_home;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }, [pathname, hash, key, settings]);

  return null;
}

function NotFound() {
  return (
    <div className="not-found section-shell">
      <span className="section-kicker">404 / NOT FOUND</span>
      <h1>Ushbu sahifa topilmadi</h1>
      <Link to="/" className="button button--dark">Bosh sahifaga qaytish <ArrowRightIcon /></Link>
    </div>
  );
}

function PublicShell() {
  return (
    <PublicContentProvider>
      <RouteEffects />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </PublicContentProvider>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider><Outlet /></AuthProvider>}>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/reset-password" element={<AdminReset />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="albums" replace />} />
        <Route path="albums" element={<AdminAlbums />} />
        <Route path="albums/:id" element={<AdminAlbumEdit />} />
        <Route path="work" element={<AdminWork />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="logos" element={<AdminLogos />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route element={<PublicShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/albums/:slug" element={<AlbumPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/contact" element={<Navigate to="/#locations" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
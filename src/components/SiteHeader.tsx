import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { usePublicContent } from "../lib/public-content";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "./Icons";

const navigation = [
  { label: "Bosh sahifa", to: "/" },
  { label: "Katalog", to: "/catalog" },
  { label: "Ishlarimiz", to: "/work" },
  { label: "Bog‘lanish", to: "/#locations" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  // "Bog‘lanish" xaritaga olib boradi. Bu funksiya Bosh sahifa va Bog‘lanish
// ikkalasi birdaniga yonib turmasligi uchun kerak.
const isCurrent = (to: string, isActive: boolean) => {
  if (to === "/#locations") return pathname === "/" && hash === "#locations";
  if (to === "/") return isActive && hash !== "#locations";
  return isActive;
};
  const { settings } = usePublicContent();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="wordmark" aria-label={`${settings.brand_name} home`} onClick={() => setMenuOpen(false)}>
          {settings.logo_url ? <img src={settings.logo_url} alt={settings.brand_name} style={{ height: 28, width: "auto" }} /> : <>{settings.brand_name}<span className="wordmark__dot">.</span></>}
          <span className="wordmark__descriptor">{settings.brand_descriptor}</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `desktop-nav__link${isCurrent(item.to, isActive) ? " is-active" : ""}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navigation.map((item, index) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
            <span>0{index + 1}</span>{item.label}<ArrowUpRightIcon />
          </NavLink>
        ))}
        <p>{settings.footer_text}</p>
      </nav>
    </header>
  );
}

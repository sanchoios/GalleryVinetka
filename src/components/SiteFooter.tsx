import { Link } from "react-router-dom";
import { telegramHref } from "../lib/format";
import { usePublicContent } from "../lib/public-content";
import { ArrowUpRightIcon } from "./Icons";

export default function SiteFooter() {
  const { settings, locations } = usePublicContent();
  const cities = locations.map((item) => item.city).join(" / ");

  return (
    <footer className="site-footer">
      <div className="site-footer__top page-gutter">
        <div>
          <Link to="/" className="site-footer__brand" aria-label={`${settings.brand_name} home`}>{settings.brand_name}.</Link>
          <p>{settings.footer_text}</p>
        </div>
        <div className="site-footer__links">
          <div>
            <span className="footer-label">Explore</span>
            <Link to="/catalog">The albums</Link>
            <Link to="/work">Our work</Link>
            <a href={telegramHref(settings.telegram_url)} target="_blank" rel="noopener noreferrer">Start an order</a>
          </div>
          <div>
            <span className="footer-label">Get in touch</span>
            <a href={`mailto:${settings.contact_email}`}>{settings.contact_email} <ArrowUpRightIcon /></a>
            {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRightIcon /></a>}
            <span>{cities}</span>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom page-gutter">
        <span>&copy; {new Date().getFullYear()} {settings.brand_name} YEARBOOK STUDIO</span>
        <span>{settings.footer_tagline}</span>
      </div>
    </footer>
  );
}

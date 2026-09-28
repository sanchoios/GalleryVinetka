import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/Icons";
import { usePublicContent } from "../lib/public-content";

export default function ContactPage() {
  const { albums, settings } = usePublicContent();
  const [searchParams] = useSearchParams();
  const chosenAlbum = albums.some((album) => album.slug === searchParams.get("album")) ? searchParams.get("album")! : "";
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const headingLines = settings.contact_heading.split("\n");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (name: string) => String(data.get(name) ?? "").trim();
    const album = albums.find((item) => item.slug === get("album"));
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `University: ${get("university")}`,
      `Graduating class size: ${get("classSize")}`,
      `Album: ${album?.name ?? "Not decided yet"}`,
      `Photography: ${get("session")}`,
      "",
      "Anything else:",
      get("message") || "Not specified",
    ].join("\n");
    const draft = `mailto:${settings.contact_email}?subject=${encodeURIComponent(`Yearbook enquiry - ${get("university")}`)}&body=${encodeURIComponent(body)}`;
    setEmailDraft(draft);
    window.location.href = draft;
  }

  return (
    <>
      <section className="contact-intro section-shell" aria-labelledby="contact-heading">
        <span className="section-kicker">{settings.contact_kicker}</span>
        <h1 id="contact-heading">{headingLines.map((line, index) => <span key={index}>{line.replace(/\.$/, "")}{index < headingLines.length - 1 && <br />}</span>)}<span>.</span></h1>
        <p>{settings.contact_intro}</p>
      </section>
      <section className="contact-layout section-shell" aria-label="Start a yearbook enquiry">
        <div className="contact-aside">
          <span className="section-kicker">01 / GET IN TOUCH</span>
          <h2>A good album starts with a conversation.</h2>
          <p>Have a question before you begin? Write to us directly.</p>
          <a href={`mailto:${settings.contact_email}`} className="text-link">{settings.contact_email} <ArrowUpRightIcon /></a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} onChange={() => { if (emailDraft) setEmailDraft(null); }}>
          <div className="contact-form__row">
            <label>Your name <span>*</span><input name="name" type="text" autoComplete="name" placeholder="Your full name" required /></label>
            <label>Email address <span>*</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          </div>
          <div className="contact-form__row">
            <label>University <span>*</span><input name="university" type="text" placeholder="Your university" required /></label>
            <label>Graduating class size <span>*</span><input name="classSize" type="number" min="2" max="1000" placeholder="e.g. 80" required /></label>
          </div>
          <div className="contact-form__row">
            <label>Album edition
              <select name="album" defaultValue={chosenAlbum}>
                <option value="">Help me choose</option>
                {albums.map((album) => <option key={album.slug} value={album.slug}>{album.name}</option>)}
              </select>
            </label>
            <label>Photography session
              <select name="session" defaultValue="Campus">
                <option>Campus</option>
                <option>Studio</option>
                <option>Not sure yet</option>
              </select>
            </label>
          </div>
          <label>Anything we should know?
            <textarea name="message" rows={4} placeholder="Tell us about your class, timeline or ideas." />
          </label>
          <div className="contact-form__submit">
            <button type="submit" className="button button--dark">Prepare your enquiry <ArrowRightIcon /></button>
            <span>We'll open an email draft with your details, ready for you to send.</span>
          </div>
          {emailDraft && <p className="contact-form__notice" role="status">Your email draft is ready. <a href={emailDraft}>Open it again</a> if your mail app did not appear.</p>}
        </form>
      </section>
      <div className="contact-bottom section-shell"><Link to="/catalog" className="text-link">Still deciding? Explore the albums <ArrowRightIcon /></Link></div>
    </>
  );
}

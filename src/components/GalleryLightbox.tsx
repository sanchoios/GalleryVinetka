import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./Icons";

export type LightboxImage = { src: string; alt: string };

export default function GalleryLightbox({ images, initialIndex, onClose }: { images: LightboxImage[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + images.length) % images.length);
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [images.length, onClose]);

  return (
    <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Image gallery" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="lightbox__toolbar">
        <span>{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery"><CloseIcon /></button>
      </div>
      <div className="lightbox__stage">
        <button type="button" className="lightbox__arrow" onClick={() => setIndex((index - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeftIcon /></button>
        <img src={images[index].src} alt={images[index].alt} />
        <button type="button" className="lightbox__arrow" onClick={() => setIndex((index + 1) % images.length)} aria-label="Next image"><ChevronRightIcon /></button>
      </div>
      <p className="lightbox__hint">USE ARROW KEYS TO EXPLORE</p>
    </div>
  );
}
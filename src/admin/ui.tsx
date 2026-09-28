import { useEffect, useState, type ReactNode } from "react";
import { useBlocker } from "react-router-dom";
import { uploadMedia } from "../lib/upload";

export function Notice({ kind, children }: { kind?: "ok" | "err"; children: ReactNode }) {
  return <p className={`admin-note${kind === "ok" ? " admin-note--ok" : kind === "err" ? " admin-note--err" : ""}`}>{children}</p>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label>{label}{children}</label>;
}

export function UnsavedGuard({ dirty }: { dirty: boolean }) {
  const blocker = useBlocker(dirty);
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const leave = window.confirm("Saqlanmagan o‘zgarishlar bor. Sahifadan chiqasizmi?");
    if (leave) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  return null;
}

export function ImageField({
  label,
  value,
  folder,
  onUploaded,
}: {
  label: string;
  value: string;
  folder: string;
  onUploaded: (url: string, path: string) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function onChange(file: File | undefined) {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const result = await uploadMedia(file, folder, setProgress);
      onUploaded(result.url, result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklash muvaffaqiyatsiz.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      {value && <img className="admin-thumb" src={value} alt="" />}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void onChange(event.target.files?.[0])} />
      {progress != null && <small>Yuklanmoqda… {progress}%</small>}
      {error && <Notice kind="err">{error}</Notice>}
    </div>
  );
}

export function confirmDelete(label: string) {
  return window.confirm(`"${label}" ni o‘chirmoqchimisiz? Bu amalni qaytarib bo‘lmaydi.`);
}

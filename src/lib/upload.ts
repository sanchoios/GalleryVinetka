import { requireSupabase } from "./supabase";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 1920;

export class UploadError extends Error {}

function extension(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

async function compress(file: File): Promise<{ blob: Blob; type: string }> {
  if (file.type === "image/gif") return { blob: file, type: file.type };
  if (file.size < 350_000) return { blob: file, type: file.type };

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, type: file.type };
  ctx.drawImage(bitmap, 0, 0, width, height);
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  if (!blob) return { blob: file, type: file.type };
  return { blob, type };
}

export async function uploadMedia(file: File, folder: string, onProgress?: (percent: number) => void): Promise<{ url: string; path: string }> {
  if (!ALLOWED.includes(file.type)) {
    throw new UploadError("Faqat JPG, PNG, WEBP yoki GIF rasm yuklash mumkin.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Rasm 8 MB dan katta bo‘lmasligi kerak.");
  }

  onProgress?.(12);
  const prepared = await compress(file);
  onProgress?.(40);

  const path = `${folder}/${crypto.randomUUID()}.${extension(prepared.type)}`;
  const client = requireSupabase();
  const { error } = await client.storage.from("media").upload(path, prepared.blob, { contentType: prepared.type, upsert: false });
  if (error) throw new UploadError(error.message);
  onProgress?.(90);

  const { data } = client.storage.from("media").getPublicUrl(path);
  onProgress?.(100);
  return { url: data.publicUrl, path };
}

export async function removeMedia(path: string | null | undefined) {
  if (!path) return;
  const client = requireSupabase();
  await client.storage.from("media").remove([path]);
}

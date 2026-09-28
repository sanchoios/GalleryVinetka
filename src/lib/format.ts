export function formatPrice(uzs: number | null | undefined): string {
  if (uzs == null || Number.isNaN(uzs)) return "";
  return `${new Intl.NumberFormat("en-US").format(uzs)} UZS`;
}

export function telegramHref(value: string | null | undefined, fallback?: string): string {
  const raw = (value || fallback || "").trim();
  if (!raw) return "https://t.me/YOUR_USERNAME";
  if (raw.startsWith("http")) return raw;
  return `https://t.me/${raw.replace(/^@/, "")}`;
}

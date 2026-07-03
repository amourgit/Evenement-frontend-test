export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function ensureUniqueSlug(base: string, existingSlugs: string[]): string {
  let candidate = base || "evenement";
  let i = 2;
  while (existingSlugs.includes(candidate)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

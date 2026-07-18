/**
 * shared/utils.ts
 * Common slug, string, and dedup helpers used across all crawlers.
 */

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function dedupe<T>(arr: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>()
  return arr.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function normalizeDifficulty(raw: string): string {
  const d = raw?.trim().toLowerCase()
  if (d === "easy" || d === "1" || d === "e") return "Easy"
  if (d === "medium" || d === "2" || d === "m") return "Medium"
  if (d === "hard" || d === "3" || d === "h") return "Hard"
  return "Medium"
}

export function buildLeetcodeUrl(title: string, id?: string | number): string {
  if (id) return `https://leetcode.com/problems/${toSlug(String(title))}/`
  return `https://leetcode.com/problems/${toSlug(title)}/`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

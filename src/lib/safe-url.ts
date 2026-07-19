export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    if (!url.hostname || url.username || url.password) return null

    return url.toString()
  } catch {
    return null
  }
}

/**
 * shared/fetch.ts
 * Resilient HTTP fetcher with retry, rate-limiting, and user-agent rotation.
 */
import axios, { AxiosRequestConfig } from "axios"

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
]

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface FetchResult {
  ok: boolean
  status: number
  data: string
  error?: string
}

export async function fetchPage(url: string, retries = 3, delayMs = 1200): Promise<FetchResult> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await sleep(delayMs + Math.random() * 500)
      const config: AxiosRequestConfig = {
        headers: {
          "User-Agent": randomUA(),
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
        },
        timeout: 15000,
        maxRedirects: 5,
      }
      const response = await axios.get(url, config)
      return { ok: true, status: response.status, data: String(response.data) }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number }; message?: string }
      const status = axiosErr.response?.status ?? 0
      if (status === 403 || status === 429 || status === 401) {
        return {
          ok: false,
          status,
          data: "",
          error: `HTTP ${status} — access denied. Crawler blocked by server.`,
        }
      }
      if (attempt < retries) {
        await sleep(2000 * (attempt + 1))
        continue
      }
      return {
        ok: false,
        status,
        data: "",
        error: String(axiosErr.message ?? err),
      }
    }
  }
  return { ok: false, status: 0, data: "", error: "Max retries exceeded" }
}

/**
 * shared/markdown.ts
 * Converts raw HTML from crawled pages into clean Markdown.
 * Uses cheerio for DOM parsing.
 */
import * as cheerio from "cheerio"

type CheerioAPI = ReturnType<typeof cheerio.load>

export function htmlToMarkdown(html: string, baseUrl?: string): string {
  const $ = cheerio.load(html)

  // Remove noise
  $("script, style, nav, footer, header, .cookie-notice, .ads, iframe, noscript").remove()

  // Find main content
  const mainSelectors = [
    "main",
    "article",
    ".content",
    ".post-content",
    "#content",
    ".main-content",
    ".article-body",
    ".entry-content",
  ]

  let $content: any = $("body")
  for (const sel of mainSelectors) {
    if ($(sel).length) {
      $content = $(sel).first()
      break
    }
  }

  return convertNodeToMd($, $content[0] as any, baseUrl).trim()
}

function convertNodeToMd($: CheerioAPI, node: any, baseUrl?: string): string {
  if (!node) return ""

  if (node.type === "text") {
    return (node as any).data?.replace(/\s+/g, " ") ?? ""
  }

  if (node.type !== "tag") return ""

  const el = node as cheerio.Element
  const tag = el.tagName?.toLowerCase() ?? ""
  const children = el.children ?? []
  const innerText = children.map(c => convertNodeToMd($, c, baseUrl)).join("")

  switch (tag) {
    case "h1": return `\n# ${innerText.trim()}\n`
    case "h2": return `\n## ${innerText.trim()}\n`
    case "h3": return `\n### ${innerText.trim()}\n`
    case "h4": return `\n#### ${innerText.trim()}\n`
    case "h5": return `\n##### ${innerText.trim()}\n`
    case "h6": return `\n###### ${innerText.trim()}\n`
    case "p":  return `\n${innerText.trim()}\n`
    case "br": return `\n`
    case "hr": return `\n---\n`
    case "strong":
    case "b":  return `**${innerText}**`
    case "em":
    case "i":  return `*${innerText}*`
    case "code": return `\`${innerText}\``
    case "pre": {
      const codeEl = $(el).find("code").first()
      const lang = codeEl.attr("class")?.replace("language-", "") ?? ""
      const code = codeEl.length ? codeEl.text() : innerText
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`
    }
    case "a": {
      const href = $(el).attr("href") ?? ""
      const fullHref = href.startsWith("http") ? href : `${baseUrl ?? ""}${href}`
      return `[${innerText}](${fullHref})`
    }
    case "img": {
      const src = $(el).attr("src") ?? ""
      const alt = $(el).attr("alt") ?? "image"
      return `![${alt}](${src})`
    }
    case "ul": {
      const items = children
        .filter(c => c.type === "tag" && (c as cheerio.Element).tagName === "li")
        .map(c => `- ${convertNodeToMd($, c, baseUrl).trim()}`)
        .join("\n")
      return `\n${items}\n`
    }
    case "ol": {
      let idx = 1
      const items = children
        .filter(c => c.type === "tag" && (c as cheerio.Element).tagName === "li")
        .map(c => `${idx++}. ${convertNodeToMd($, c, baseUrl).trim()}`)
        .join("\n")
      return `\n${items}\n`
    }
    case "li": return `${innerText.trim()}`
    case "blockquote": return `\n> ${innerText.trim()}\n`
    case "table": return convertTable($, el)
    case "thead":
    case "tbody":
    case "tr":
    case "td":
    case "th":
      return innerText
    case "div":
    case "section":
    case "article":
    case "main":
    case "span":
      return innerText
    default:
      return innerText
  }
}

function convertTable($: CheerioAPI, el: cheerio.Element): string {
  const rows: string[][] = []
  $(el).find("tr").each((_, tr) => {
    const cells: string[] = []
    $(tr).find("th, td").each((_, td) => {
      cells.push($(td).text().replace(/\s+/g, " ").trim())
    })
    if (cells.length) rows.push(cells)
  })

  if (!rows.length) return ""

  const header = `| ${rows[0].join(" | ")} |`
  const divider = `| ${rows[0].map(() => "---").join(" | ")} |`
  const body = rows
    .slice(1)
    .map(r => `| ${r.join(" | ")} |`)
    .join("\n")

  return `\n${header}\n${divider}\n${body}\n`
}

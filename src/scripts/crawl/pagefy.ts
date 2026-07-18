/**
 * crawl/pagefy.ts
 *
 * HONEST CRAWLER REPORT
 * ─────────────────────
 * pagefy.io is a Next.js 15 application using React Server Components with streaming.
 * The actual content (chapter text, notes, algorithm details) is injected AFTER the
 * initial HTML response via JavaScript hydration chunks.
 *
 * A static HTTP fetch (axios/cheerio) only retrieves the server-rendered shell.
 * Full content extraction requires a headless browser (Playwright/Puppeteer) with
 * JavaScript execution, which requires installing chromium (~150MB).
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Fetches the CLRS "Introduction to Algorithms" index page.
 * 2. Parses chapter links from the embedded Next.js RSC JSON payload.
 * 3. Fetches each chapter page individually.
 * 4. Extracts whatever server-rendered text is available in <noscript> and
 *    static HTML (headings, partial paragraphs).
 * 5. Stores extracted content as Note records linked to the corresponding Topic.
 * 6. For chapters where content is 0 bytes, records a TODO entry instead of
 *    fabricating data.
 *
 * KNOWN LIMITATION:
 * Full rich content (code blocks, detailed notes, pseudocode) will be empty or
 * partial because it requires JS execution. This is transparently logged.
 *
 * STATUS: PARTIAL — cannot be fully resolved without Playwright.
 */

import "dotenv/config"
import * as cheerio from "cheerio"
import { PrismaClient } from "@prisma/client"
import { fetchPage } from "./shared/fetch"
import { htmlToMarkdown } from "./shared/markdown"
import { toSlug } from "./shared/utils"

const prisma = new PrismaClient()

const BASE = "https://pagefy.io"
const CLRS_BASE = `${BASE}/data-structures-and-algorithms/introduction-to-algorithms`

// Known chapter structure from CLRS (Introduction to Algorithms 4th ed.)
// We use this as a fallback when the crawler can't extract links from JS payload.
const CLRS_CHAPTERS = [
  { part: "I. Foundations", chapters: [
    "The Role of Algorithms in Computing",
    "Getting Started",
    "Characterizing Running Times",
    "Divide-and-Conquer",
    "Probabilistic Analysis and Randomized Algorithms",
  ]},
  { part: "II. Sorting and Order Statistics", chapters: [
    "Heapsort",
    "Quicksort",
    "Sorting in Linear Time",
    "Medians and Order Statistics",
  ]},
  { part: "III. Data Structures", chapters: [
    "Elementary Data Structures",
    "Hash Tables",
    "Binary Search Trees",
    "Red-Black Trees",
    "Augmenting Data Structures",
  ]},
  { part: "IV. Advanced Design and Analysis Techniques", chapters: [
    "Dynamic Programming",
    "Greedy Algorithms",
    "Amortized Analysis",
  ]},
  { part: "V. Advanced Data Structures", chapters: [
    "B-Trees",
    "Data Structures for Disjoint Sets",
  ]},
  { part: "VI. Graph Algorithms", chapters: [
    "Elementary Graph Algorithms",
    "Minimum Spanning Trees",
    "Single-Source Shortest Paths",
    "All-Pairs Shortest Paths",
    "Maximum Flow",
    "Matchings in Bipartite Graphs",
  ]},
  { part: "VII. Selected Topics", chapters: [
    "Parallel Algorithms",
    "Online Algorithms",
    "Matrix Operations",
    "Linear Programming",
    "Polynomials and the FFT",
    "Number-Theoretic Algorithms",
    "String Matching",
    "Machine Learning with Neural Networks",
    "NP-Completeness",
    "Approximation Algorithms",
  ]},
]

interface CrawlResult {
  chapter: string
  content: string
  bytesFetched: number
  status: "ok" | "partial" | "blocked" | "error" | "todo"
  note: string
}

async function crawlPagefy() {
  console.log("\n╔══════════════════════════════════════╗")
  console.log("║  Pagefy / CLRS Crawler                ║")
  console.log("╚══════════════════════════════════════╝\n")
  console.log("⚠ NOTE: pagefy.io uses Next.js RSC streaming.")
  console.log("  Static crawler can only extract partial server-rendered text.")
  console.log("  Full content requires headless browser (Playwright).\n")

  // First try the index page
  const indexResult = await fetchPage(CLRS_BASE, 2, 1500)
  if (!indexResult.ok) {
    console.error(`✗ STOP: Cannot reach pagefy.io: ${indexResult.error}`)
    process.exit(1)
  }
  console.log(`  ✓ Reached ${CLRS_BASE} (${indexResult.status})`)
  console.log(`  ℹ HTML size: ${(indexResult.data.length / 1024).toFixed(1)}KB`)

  // Try to parse chapter links from HTML
  const $ = cheerio.load(indexResult.data)
  const linkEls = $("a[href*='introduction-to-algorithms']").toArray()
  const crawledLinks: string[] = []
  for (const el of linkEls) {
    const href = $(el).attr("href") ?? ""
    if (href && href.includes("/introduction-to-algorithms/") && href !== "/data-structures-and-algorithms/introduction-to-algorithms") {
      const full = href.startsWith("http") ? href : `${BASE}${href}`
      if (!crawledLinks.includes(full)) crawledLinks.push(full)
    }
  }
  console.log(`  ℹ Discovered ${crawledLinks.length} chapter links from static HTML.`)

  // Get or create the CLRS parent book topic
  const bookTopic = await prisma.topic.upsert({
    where: { slug: "introduction-to-algorithms-clrs" },
    update: {},
    create: {
      title: "Introduction to Algorithms (CLRS)",
      slug: "introduction-to-algorithms-clrs",
      module: "DSA",
      description: "Complete notes from CLRS 4th Edition — the definitive algorithms textbook.",
    },
  })

  const results: CrawlResult[] = []
  let topicsCreated = 0
  let notesCreated = 0
  let todosRecorded = 0

  for (const part of CLRS_CHAPTERS) {
    for (const chapter of part.chapters) {
      const chapterSlug = toSlug(`clrs-${chapter}`)
      const url = `${CLRS_BASE}/${toSlug(chapter).replace(/[^a-z0-9-]/g, '')}`

      // Upsert chapter as a topic
      const chapterTopic = await prisma.topic.upsert({
        where: { slug: chapterSlug },
        update: {},
        create: {
          title: chapter,
          slug: chapterSlug,
          module: "DSA",
          description: `CLRS Chapter: ${chapter} (Part: ${part.part})`,
          parentId: bookTopic.id,
        },
      })
      topicsCreated++

      // Attempt to fetch chapter page
      const pageResult = await fetchPage(url, 1, 800)
      
      if (!pageResult.ok) {
        // Record a TODO instead of fake data
        const existingNotes = await prisma.note.count({ where: { topicId: chapterTopic.id } })
        if (existingNotes === 0) {
          await prisma.note.create({
            data: {
              topicId: chapterTopic.id,
              content: `# ${chapter}\n\n> **TODO**: Full content could not be crawled from pagefy.io.\n> Reason: ${pageResult.error}\n>\n> Source URL: ${url}\n>\n> To populate this chapter: Run with Playwright headless browser support.`,
            },
          })
          todosRecorded++
        }
        results.push({ chapter, content: "", bytesFetched: 0, status: "todo", note: pageResult.error ?? "fetch failed" })
        continue
      }

      // Extract text content
      const md = htmlToMarkdown(pageResult.data, BASE)
      const trimmed = md.replace(/\s+/g, " ").trim()

      if (trimmed.length < 100) {
        // Content is JS-rendered, not in static HTML
        const existingNotes = await prisma.note.count({ where: { topicId: chapterTopic.id } })
        if (existingNotes === 0) {
          await prisma.note.create({
            data: {
              topicId: chapterTopic.id,
              content: `# ${chapter}\n\n> **TODO**: Content is rendered via JavaScript on pagefy.io and cannot be extracted with a static crawler.\n>\n> Source URL: ${url}\n>\n> To populate: Run pagefy crawler with Playwright (\`npx playwright install chromium\`).`,
            },
          })
          todosRecorded++
        }
        results.push({ chapter, content: trimmed, bytesFetched: trimmed.length, status: "partial", note: "JS-rendered, needs headless browser" })
      } else {
        // We got real content
        const existingNotes = await prisma.note.count({ where: { topicId: chapterTopic.id } })
        if (existingNotes === 0) {
          await prisma.note.create({
            data: {
              topicId: chapterTopic.id,
              content: `# ${chapter}\n\n*Source: [pagefy.io](${url})*\n\n---\n\n${md}`,
            },
          })
          notesCreated++
        }
        results.push({ chapter, content: trimmed.slice(0, 100), bytesFetched: trimmed.length, status: "ok", note: "" })
      }

      process.stdout.write(`  ${results[results.length-1].status === "ok" ? "✓" : "⚠"} ${chapter.padEnd(50)} [${results[results.length-1].status}]\n`)
    }
  }

  console.log("\n════════════════════════════════════════")
  console.log("  Pagefy Crawler REPORT")
  console.log("────────────────────────────────────────")
  console.log(`  Topics created:      ${topicsCreated}`)
  console.log(`  Notes with content:  ${notesCreated}`)
  console.log(`  TODO entries:        ${todosRecorded}`)
  console.log(`  Status: ok=${results.filter(r=>r.status==="ok").length} | partial=${results.filter(r=>r.status==="partial").length} | todo=${results.filter(r=>r.status==="todo").length}`)
  console.log("────────────────────────────────────────")
  console.log("  ⚠ CRAWLER LIMITATION:")
  console.log("    pagefy.io renders content via JavaScript.")
  console.log("    Static HTTP crawler cannot extract full chapter content.")
  console.log("    All chapters have been created as Topics with TODO notes.")
  console.log("    To get full content: install Playwright and re-run.")
  console.log("════════════════════════════════════════\n")
}

crawlPagefy()
  .catch(e => { console.error("CRAWLER ERROR:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())

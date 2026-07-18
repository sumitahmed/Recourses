/**
 * crawl/leetcode.ts
 * 
 * Parses the cloned liquidslr/leetcode-company-wise-problems repository.
 * Reads every company folder, reads "All.csv" (or falls back to "3. Six Months.csv"),
 * normalises records, and upserts them into Prisma.
 *
 * CSV schema (actual columns from repo):
 *   Difficulty, Title, Frequency, Acceptance Rate, Link, Topics
 */

import "dotenv/config"
import * as fs from "fs"
import * as path from "path"
import { PrismaClient } from "@prisma/client"
import { parseCSVFile } from "./shared/parser"
import { toSlug, normalizeDifficulty, chunkArray } from "./shared/utils"

const prisma = new PrismaClient()

const REPO_DIR = path.join(__dirname, "data", "leetcode-company-data")

// Preference order for which CSV file to read per company
const CSV_PRIORITY = [
  "5. All.csv",
  "4. More Than Six Months.csv",
  "3. Six Months.csv",
  "2. Three Months.csv",
  "1. Thirty Days.csv",
]

interface ProblemRow {
  company: string
  title: string
  slug: string
  url: string
  difficulty: string
  frequency: number
  tags: string
  timeframe: string
}

function getCompanyCSV(companyDir: string): { file: string; timeframe: string } | null {
  for (const csvName of CSV_PRIORITY) {
    const filePath = path.join(companyDir, csvName)
    if (fs.existsSync(filePath)) {
      return { file: filePath, timeframe: csvName.replace(".csv", "").replace(/^\d+\.\s*/, "") }
    }
  }
  // Try any CSV in the folder
  const files = fs.readdirSync(companyDir).filter(f => f.endsWith(".csv"))
  if (files.length) {
    return { file: path.join(companyDir, files[0]), timeframe: "All Time" }
  }
  return null
}

async function crawlLeetcode() {
  console.log("\n╔══════════════════════════════════════╗")
  console.log("║  LeetCode Company Crawler             ║")
  console.log("╚══════════════════════════════════════╝\n")

  if (!fs.existsSync(REPO_DIR)) {
    console.error(`✗ Repository not found at: ${REPO_DIR}`)
    console.error("  Run: git clone https://github.com/liquidslr/leetcode-company-wise-problems src/scripts/crawl/data/leetcode-company-data")
    process.exit(1)
  }

  const companyFolders = fs
    .readdirSync(REPO_DIR)
    .filter(name => {
      const full = path.join(REPO_DIR, name)
      return fs.statSync(full).isDirectory() && !name.startsWith(".")
    })

  console.log(`Found ${companyFolders.length} company folders.\n`)

  const allRows: ProblemRow[] = []
  const companyNames: string[] = []
  let filesSkipped = 0

  for (const companyName of companyFolders) {
    const companyDir = path.join(REPO_DIR, companyName)
    const csvInfo = getCompanyCSV(companyDir)

    if (!csvInfo) {
      console.log(`  [SKIP] ${companyName} — no CSV found`)
      filesSkipped++
      continue
    }

    const rows = parseCSVFile(csvInfo.file)
    if (!rows.length) {
      console.log(`  [SKIP] ${companyName} — empty CSV`)
      filesSkipped++
      continue
    }

    companyNames.push(companyName)
    for (const row of rows) {
      const title = (row["Title"] || row["title"] || row["Problem"] || "").trim()
      if (!title) continue

      const rawUrl = (row["Link"] || row["URL"] || row["url"] || "").trim()
      const url = rawUrl || `https://leetcode.com/problems/${toSlug(title)}/`

      allRows.push({
        company: companyName,
        title,
        slug: toSlug(title),
        url,
        difficulty: normalizeDifficulty(row["Difficulty"] || row["difficulty"] || "Medium"),
        frequency: Math.round(parseFloat(row["Frequency"] || row["frequency"] || "1") * 100) || 1,
        tags: (row["Topics"] || row["Tags"] || row["topics"] || "").trim(),
        timeframe: csvInfo.timeframe,
      })
    }
    process.stdout.write(`  ✓ ${companyName.padEnd(30)} ${rows.length} problems\n`)
  }

  console.log(`\n────────────────────────────────────────`)
  console.log(`Companies with data:    ${companyNames.length}`)
  console.log(`Companies skipped:      ${filesSkipped}`)
  console.log(`Total problem rows:     ${allRows.length}`)
  console.log(`────────────────────────────────────────\n`)

  if (allRows.length === 0) {
    console.error("✗ STOP: Zero problems parsed. Something is wrong with the CSV files.")
    process.exit(1)
  }

  // ── Step 1: Upsert all Companies ──────────────────────────────────────────
  console.log("Upserting companies…")
  for (const name of companyNames) {
    await prisma.company.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log(`  ✓ ${companyNames.length} companies upserted`)

  // ── Step 2: Upsert LeetCode problems (deduplicated by URL) ────────────────
  console.log("Upserting LeetCode problems…")
  const uniqueProblems = new Map<string, ProblemRow>()
  for (const row of allRows) {
    if (!uniqueProblems.has(row.url)) {
      uniqueProblems.set(row.url, row)
    }
  }

  const problemList = [...uniqueProblems.values()]
  const BATCH = 200
  let problemsDone = 0
  for (const batch of chunkArray(problemList, BATCH)) {
    for (const p of batch) {
      await prisma.leetcodeProblem.upsert({
        where: { url: p.url },
        update: { title: p.title, difficulty: p.difficulty, tags: p.tags },
        create: {
          title: p.title,
          url: p.url,
          difficulty: p.difficulty,
          tags: p.tags,
        },
      })
    }
    problemsDone += batch.length
    process.stdout.write(`  ✓ ${problemsDone}/${problemList.length} unique problems\r`)
  }
  console.log(`\n  ✓ ${problemList.length} unique problems upserted`)

  // ── Step 3: Upsert CompanyQuestion join records ───────────────────────────
  console.log("Linking problems to companies…")
  let linksDone = 0
  let linksFailed = 0
  for (const batch of chunkArray(allRows, BATCH)) {
    for (const row of batch) {
      try {
        const [company, problem] = await Promise.all([
          prisma.company.findUnique({ where: { name: row.company } }),
          prisma.leetcodeProblem.findUnique({ where: { url: row.url } }),
        ])
        if (!company || !problem) { linksFailed++; continue }

        await prisma.companyQuestion.upsert({
          where: { companyId_leetcodeProblemId: { companyId: company.id, leetcodeProblemId: problem.id } },
          update: { frequency: row.frequency, timeframe: row.timeframe },
          create: {
            companyId: company.id,
            leetcodeProblemId: problem.id,
            frequency: row.frequency,
            timeframe: row.timeframe,
          },
        })
        linksDone++
      } catch {
        linksFailed++
      }
    }
    process.stdout.write(`  ✓ ${linksDone} links done, ${linksFailed} failed\r`)
  }
  console.log(`\n  ✓ ${linksDone} company↔problem links created`)
  if (linksFailed > 0) console.log(`  ⚠ ${linksFailed} links failed (usually duplicates, safe to ignore)`)

  // ── Final verification ─────────────────────────────────────────────────────
  const [finalCompanies, finalProblems, finalLinks] = await Promise.all([
    prisma.company.count(),
    prisma.leetcodeProblem.count(),
    prisma.companyQuestion.count(),
  ])

  console.log("\n════════════════════════════════════════")
  console.log("  LeetCode Crawler COMPLETE")
  console.log("────────────────────────────────────────")
  console.log(`  Companies imported:     ${finalCompanies}`)
  console.log(`  Unique problems:        ${finalProblems}`)
  console.log(`  Company-Problem links:  ${finalLinks}`)
  console.log("════════════════════════════════════════\n")

  if (finalCompanies === 0 || finalProblems === 0) {
    console.error("✗ STOP: Import failed — zero records in database.")
    process.exit(1)
  }
}

crawlLeetcode()
  .catch(e => {
    console.error("CRAWLER ERROR:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

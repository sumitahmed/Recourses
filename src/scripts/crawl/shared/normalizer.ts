/**
 * shared/normalizer.ts
 * Normalize raw crawled data into consistent Prisma-ready shapes.
 */
import { toSlug, normalizeDifficulty, buildLeetcodeUrl } from "./utils"

export interface NormalizedProblem {
  title: string
  slug: string
  url: string
  difficulty: string
  tags: string
  frequency: number
  timeframe: string
}

export interface NormalizedCompany {
  name: string
  slug: string
}

/**
 * Normalize a raw CSV row from liquidslr/leetcode-company-wise-problems.
 *
 * Expected columns (may vary per company file):
 * "ID", "Title", "URL", "Acceptance", "Difficulty", "Frequency", "Leetcode Premium"
 */
export function normalizeRow(
  companyName: string,
  row: Record<string, string>,
  timeframe: string
): { company: NormalizedCompany; problem: NormalizedProblem } | null {
  // Try multiple column name formats found across the repo's CSVs
  const title =
    row["Title"] ||
    row["title"] ||
    row["Problem"] ||
    row["problem"] ||
    row["Name"] ||
    ""

  if (!title.trim()) return null

  const rawDiff =
    row["Difficulty"] ||
    row["difficulty"] ||
    row["Level"] ||
    row["level"] ||
    "Medium"

  const rawFreq =
    row["Frequency"] ||
    row["frequency"] ||
    row["freq"] ||
    row["Count"] ||
    "1"

  const rawUrl =
    row["URL"] ||
    row["url"] ||
    row["Link"] ||
    row["link"] ||
    ""

  const rawTags =
    row["Tags"] ||
    row["tags"] ||
    row["Topic"] ||
    row["topics"] ||
    ""

  const url = rawUrl.trim() || buildLeetcodeUrl(title)
  const freq = parseInt(rawFreq.replace(/[^0-9]/g, ""), 10) || 1

  return {
    company: {
      name: companyName,
      slug: toSlug(companyName),
    },
    problem: {
      title: title.trim(),
      slug: toSlug(title.trim()),
      url,
      difficulty: normalizeDifficulty(rawDiff),
      tags: rawTags.trim(),
      frequency: freq,
      timeframe,
    },
  }
}

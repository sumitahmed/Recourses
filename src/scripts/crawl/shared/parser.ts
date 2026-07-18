/**
 * shared/parser.ts
 * CSV parser using csv-parse. Returns rows as string[][].
 */
import { parse } from "csv-parse/sync"
import * as fs from "fs"

export interface CsvRow {
  [key: string]: string
}

export function parseCSVFile(filePath: string): CsvRow[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    // csv-parse sync returns array of arrays or objects
    const records = parse(content, {
      columns: true,           // use first row as headers
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
    }) as CsvRow[]
    return records
  } catch (err) {
    console.error(`  [parser] Failed to parse ${filePath}: ${err}`)
    return []
  }
}

export function parseCSVString(content: string): CsvRow[] {
  try {
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
    }) as CsvRow[]
  } catch (err) {
    console.error(`  [parser] Failed to parse CSV string: ${err}`)
    return []
  }
}

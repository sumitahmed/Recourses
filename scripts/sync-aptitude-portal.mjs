import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(here, '../../Aptitude/placement-portal')
const destination = resolve(here, '../public/aptitude-portal')

if (!existsSync(source)) {
  console.log(`Placement portal source not found at ${source}. Skipping sync. (This is expected during Vercel deployment where the parent directory is not checked out)`)
  process.exit(0)
}
rmSync(destination, { recursive: true, force: true })
mkdirSync(destination, { recursive: true })
cpSync(source, destination, {
  recursive: true,
  filter: path => !path.includes('node_modules') && !path.includes('.git')
})
console.log(`Synced aptitude portal to ${destination}`)

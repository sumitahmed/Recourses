import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const topics = await prisma.topic.count()
  const checklists = await prisma.checklist.count()
  const items = await prisma.checklistItem.count()
  const companies = await prisma.company.count()
  const lc = await prisma.leetcodeProblem.count()
  const iq = await prisma.interviewQuestion.count()
  const projects = await prisma.project.count()
  const tasks = await prisma.task.count()
  const resources = await prisma.resource.count()

  console.log("=== DATABASE AUDIT ===")
  console.log(`Topics:             ${topics}`)
  console.log(`Checklists:         ${checklists}`)
  console.log(`Checklist Items:    ${items}`)
  console.log(`Companies:          ${companies}`)
  console.log(`Leetcode Problems:  ${lc}`)
  console.log(`Interview Questions:${iq}`)
  console.log(`Projects:           ${projects}`)
  console.log(`Tasks:              ${tasks}`)
  console.log(`Resources:          ${resources}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

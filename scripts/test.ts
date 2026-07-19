import { PrismaClient, Prisma } from '@prisma/client';
const db = new PrismaClient();
async function test() {
  try {
    const targetModules = ['DSA'];
    const rows = await db.$queryRaw(Prisma.sql`
    SELECT
      t.id,
      t.title,
      t.slug,
      t.module,
      t.description,
      t.status,
      t."parentId",
      COUNT(i.id)::int AS "totalItems",
      COUNT(i.id) FILTER (WHERE i."isCompleted")::int AS "completedItems"
    FROM "Topic" t
    LEFT JOIN "Checklist" c ON c."topicId" = t.id
    LEFT JOIN "ChecklistItem" i ON i."checklistId" = c.id
    WHERE t.module IN (${Prisma.join(targetModules)})
    GROUP BY t.id
    ORDER BY t.title ASC
  `);
    console.log(rows.length);
  } catch(e) {
    console.error(e)
  }
}
test();

"use server"

import { db as prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { isValidRecordId } from "@/lib/validation"

export async function toggleChecklistItem(itemId: unknown) {
  if (!isValidRecordId(itemId)) return

  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    select: { isCompleted: true },
  })
  if (!item) return

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { isCompleted: !item.isCompleted }
  })
  
  revalidatePath('/checklists')
  revalidatePath('/t/[slug]', 'page')
}

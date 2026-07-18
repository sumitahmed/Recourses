"use server"

import { db as prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function toggleChecklistItem(itemId: string, currentStatus: boolean) {
  await prisma.checklistItem.update({
    where: { id: itemId },
    data: { isCompleted: !currentStatus }
  })
  
  revalidatePath('/checklists')
  revalidatePath('/t/[slug]', 'page')
}

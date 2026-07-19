"use server"

import { db as prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { isValidRecordId, parseTaskInput } from "@/lib/validation"

export async function addTask(title: unknown, priority: unknown = "Medium", dueDate?: unknown) {
  const input = parseTaskInput(title, priority, dueDate)
  if (!input) return
  
  await prisma.task.create({
    data: {
      title: input.title,
      status: "Pending",
      priority: input.priority,
      dueDate: input.dueDate,
    }
  })
  
  revalidatePath('/')
}

export async function toggleTaskStatus(taskId: unknown) {
  if (!isValidRecordId(taskId)) return

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { status: true },
  })
  if (!task) return

  const newStatus = task.status === "Completed" ? "Pending" : "Completed"
  
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  })
  
  revalidatePath('/')
}

export async function deleteTask(taskId: unknown) {
  if (!isValidRecordId(taskId)) return

  await prisma.task.deleteMany({
    where: { id: taskId },
  })
  
  revalidatePath('/')
}

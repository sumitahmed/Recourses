"use server"

import { db as prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addTask(title: string, priority: string = "Medium", dueDate?: string) {
  if (!title || title.trim() === '') return
  
  await prisma.task.create({
    data: {
      title,
      status: "Pending",
      priority,
      dueDate: dueDate ? new Date(dueDate) : null
    }
  })
  
  revalidatePath('/')
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const newStatus = currentStatus === "Completed" ? "Pending" : "Completed"
  
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  })
  
  revalidatePath('/')
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({
    where: { id: taskId }
  })
  
  revalidatePath('/')
}

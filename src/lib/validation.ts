const ID_PATTERN = /^[A-Za-z0-9_-]{10,128}$/
const PRIORITIES = new Set(["Low", "Medium", "High"])

export function isValidRecordId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value)
}

export function parseTaskInput(title: unknown, priority: unknown, dueDate: unknown) {
  if (typeof title !== "string") return null

  const normalizedTitle = title.trim()
  if (normalizedTitle.length === 0 || normalizedTitle.length > 200) return null

  const normalizedPriority = typeof priority === "string" && PRIORITIES.has(priority)
    ? priority
    : "Medium"

  if (dueDate === undefined || dueDate === null || dueDate === "") {
    return { title: normalizedTitle, priority: normalizedPriority, dueDate: null }
  }

  if (typeof dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null

  const parsedDueDate = new Date(`${dueDate}T00:00:00.000Z`)
  if (Number.isNaN(parsedDueDate.getTime())) return null

  return { title: normalizedTitle, priority: normalizedPriority, dueDate: parsedDueDate }
}

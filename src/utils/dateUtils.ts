export function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysUntil(date: string) {
  // 2026-12-31
  const [year, month, day] = date.split('-').map(Number)
  const target = new Date(year!, month! - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
}

export function formatCountdown(days: number) {
  if (days < 0) return 'Уже прошло'
  if (days === 0) return 'Сегодня!'
  if (days === 1) return 'Завтра'
  return `Через ${days} ${plural(days, ['день', 'дня', 'дней'])}`
}

export function formatMoney(n: number): string {
  if (n >= 1e15) return `$${(n / 1e15).toFixed(2)}Qa`
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(1)}K`
  if (n < 1)     return `$${n.toFixed(2)}`
  return `$${Math.floor(n)}`
}

export function formatRate(n: number): string {
  if (n < 0.01) return '0/sek'
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T/sek`
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B/sek`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)}M/sek`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K/sek`
  return `${n.toFixed(1)}/sek`
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatNumber(n: number): string {
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
  return `${Math.floor(n)}`
}

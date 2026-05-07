export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-emerald-400'
  if (status >= 300 && status < 400) return 'text-sky-400'
  if (status >= 400) return 'text-red-400'
  return 'text-gray-400'
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as Record<string, T[]>,
  )
}

export function sortBy<T>(array: T[], keyFn: (item: T) => any, direction: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)

    if (direction === "desc") {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
  })
}

export function filterBy<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate)
}

export function findById<T extends { id: string }>(array: T[], id: string): T | undefined {
  return array.find((item) => item.id === id)
}

export function removeById<T extends { id: string }>(array: T[], id: string): T[] {
  return array.filter((item) => item.id !== id)
}

export function updateById<T extends { id: string }>(array: T[], id: string, updates: Partial<T>): T[] {
  return array.map((item) => (item.id === id ? { ...item, ...updates } : item))
}

export function toggleById<T extends { id: string }>(array: T[], id: string, toggleKey: keyof T): T[] {
  return array.map((item) => (item.id === id ? { ...item, [toggleKey]: !item[toggleKey] } : item))
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

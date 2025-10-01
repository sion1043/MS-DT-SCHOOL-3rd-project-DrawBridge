"use client"

import { useState, useEffect } from "react"

export function useApiOptions(endpoint: string, fallbackOptions: string[] = []) {
  const [options, setOptions] = useState<string[]>(["전체"])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(endpoint, {
          cache: "no-store",
          signal: ac.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const list: string[] = Array.isArray(json)
          ? json
          : (json.jobPositions ?? json.jobPostings ?? json.jobSkills ?? []);
        
        const uniq = Array.from(new Set(list)).sort((a, b) => a.localeCompare(b, "ko"))
        setOptions(["전체", ...uniq])
      } catch (e) {
        console.error(e)
        setOptions(["전체", ...fallbackOptions])
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [endpoint, fallbackOptions])

  return { options, loading }
}

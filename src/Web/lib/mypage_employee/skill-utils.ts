import type { SkillStack, SortOption } from "@/types"

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800"
  if (score >= 60) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export function calculateAverageScore(skills: SkillStack[]): number {
  if (skills.length === 0) return 0
  return Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length)
}

export function sortSkills(skills: SkillStack[], sortBy: SortOption): SkillStack[] {
  return [...skills].sort((a, b) => {
    switch (sortBy) {
      case "score-desc":
        return b.score - a.score
      case "score-asc":
        return a.score - b.score
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return new Date(b.lastTested).getTime() - new Date(a.lastTested).getTime()
      default:
        return 0
    }
  })
}

export function filterSkillsByCategory(skills: SkillStack[], category: string): SkillStack[] {
  if (category === "all") return skills
  return skills.filter((skill) => skill.category === category)
}

export function searchSkills(skills: string[], query: string): string[] {
  if (!query.trim()) return skills
  return skills.filter((skill) => skill.toLowerCase().includes(query.toLowerCase()))
}

export function generateRandomScore(min = 60, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function getSkillCategoryFromName(skillName: string, skillCategories: Record<string, string[]>): string {
  for (const [category, skills] of Object.entries(skillCategories)) {
    if (skills.includes(skillName)) {
      return category
    }
  }
  return "기타"
}

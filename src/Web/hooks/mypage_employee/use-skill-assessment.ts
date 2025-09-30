"use client"

import { useState, useCallback } from "react"
import { generateRandomScore, getSkillCategoryFromName } from "@/lib/mypage_employee/skill-utils"
import { getCurrentDateString } from "@/lib/mypage_employee/date-utils"
import { SKILL_CATEGORIES } from "@/constants/mypage_employee/skills"
import type { SkillStack, AssessmentStep, SortOption } from "@/types/mypage_employee"

const INITIAL_SKILLS: SkillStack[] = [
  {
    name: "JavaScript",
    score: 85,
    lastTested: "2024-01-15",
    category: "프론트엔드",
  },
  {
    name: "React",
    score: 82,
    lastTested: "2024-01-12",
    category: "프론트엔드",
  },
  {
    name: "TypeScript",
    score: 78,
    lastTested: "2024-01-10",
    category: "프론트엔드",
  },
  {
    name: "Node.js",
    score: 65,
    lastTested: "2024-01-08",
    category: "백엔드",
  },
  {
    name: "Python",
    score: 72,
    lastTested: "2024-01-05",
    category: "백엔드",
  },
  {
    name: "SQL",
    score: 95,
    lastTested: "2024-01-10",
    category: "데이터베이스",
  },
  {
    name: "MongoDB",
    score: 58,
    lastTested: "2024-01-03",
    category: "데이터베이스",
  },
  {
    name: "Git",
    score: 88,
    lastTested: "2024-01-14",
    category: "도구",
  },
  {
    name: "Docker",
    score: 45,
    lastTested: "2024-01-01",
    category: "도구",
  },
  {
    name: "AWS",
    score: 52,
    lastTested: "2023-12-28",
    category: "클라우드",
  },
]

export function useSkillAssessment() {
  const [skillStacks, setSkillStacks] = useState<SkillStack[]>(INITIAL_SKILLS)
  const [currentStep, setCurrentStep] = useState<AssessmentStep>("results")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [testAnswer, setTestAnswer] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("score-desc")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const addOrUpdateSkill = useCallback((skillName: string, answer: string) => {
    const score = generateRandomScore()
    const category = getSkillCategoryFromName(skillName, SKILL_CATEGORIES)

    const newSkill: SkillStack = {
      name: skillName,
      score: score,
      lastTested: getCurrentDateString(),
      category: category as any,
    }

    setSkillStacks((prev) => {
      const existingIndex = prev.findIndex((s) => s.name === skillName)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newSkill
        return updated
      } else {
        return [...prev, newSkill]
      }
    })

    return newSkill
  }, [])

  const startNewAssessment = useCallback(() => {
    setCurrentStep("skillSearch")
    setSearchQuery("")
    setSelectedSkill("")
    setTestAnswer("")
  }, [])

  const selectSkill = useCallback((skill: string) => {
    setSelectedSkill(skill)
    setCurrentStep("guidelines")
  }, [])

  const startTest = useCallback(() => {
    setCurrentStep("test")
    setTestAnswer("")
  }, [])

  const submitTest = useCallback(() => {
    const newSkill = addOrUpdateSkill(selectedSkill, testAnswer)
    setCurrentStep("completed")
    return newSkill
  }, [selectedSkill, testAnswer, addOrUpdateSkill])

  const goBack = useCallback(() => {
    switch (currentStep) {
      case "skillSearch":
        setCurrentStep("results")
        break
      case "guidelines":
        setCurrentStep("skillSearch")
        break
      case "test":
        setCurrentStep("guidelines")
        break
      case "completed":
        setCurrentStep("results")
        break
      default:
        setCurrentStep("results")
    }
  }, [currentStep])

  const viewResults = useCallback(() => {
    setCurrentStep("results")
  }, [])

  const getSelectedSkillResult = useCallback(() => {
    return skillStacks.find((s) => s.name === selectedSkill)
  }, [skillStacks, selectedSkill])

  return {
    // State
    skillStacks,
    currentStep,
    selectedSkill,
    searchQuery,
    testAnswer,
    sortBy,
    filterCategory,

    // Actions
    setSearchQuery,
    setTestAnswer,
    setSortBy,
    setFilterCategory,
    startNewAssessment,
    selectSkill,
    startTest,
    submitTest,
    goBack,
    viewResults,
    getSelectedSkillResult,
  }
}

"use client"

import { useMemo } from "react"
import type { Candidate } from "@/types/company_monitor/candidate"
import type { FilterState } from "./use-filter-state"

export function useCandidateFiltering(candidates: Candidate[], filters: FilterState) {
  return useMemo(() => {
    let result = [...candidates]

    // 지원 공고 필터: Job posting filter
    if (filters.jobPosting.length > 0) {
      result = result.filter((candidate) => {
        return filters.jobPosting.some((jobPosting) => {
          if (!candidate.posting_title_s) return false
          return candidate.posting_title_s.includes(jobPosting) || jobPosting.includes(candidate.posting_title_s)
        })
      })
    }

    // 직무 필터: Position filter
    if (filters.position.length > 0) {
      result = result.filter((candidate) => {
        const cleanCandidateTitle = candidate.job_category_kor.replace(/^(주니어|미드레벨|시니어)\s+/, "")
        return filters.position.some((position) => {
          if (cleanCandidateTitle === position) return true
          if (cleanCandidateTitle.includes(position) || position.includes(cleanCandidateTitle)) return true
          return false
        })
      })
    }

    // 경력 필터: Experience filter
    if (filters.experience.length > 0) {
      result = result.filter((candidate) => {
        return filters.experience.some((exp) => {
          switch (exp) {
            case "신입":
              return candidate.career === "신입"
            case "1-3년":
              return ["1년", "2년", "3년"].includes(candidate.career)
            case "4-7년":
              return ["4년", "5년", "6년", "7년"].includes(candidate.career)
            case "8-10년":
              return ["8년", "9년", "10년"].includes(candidate.career)
            case "10-15년":
              return ["10년", "11년", "12년", "13년", "14년", "15년"].includes(candidate.career)
            case "16-20년":
              return ["16년", "17년", "18년", "19년", "20년"].includes(candidate.career)
            case "20년+":
              return candidate.career === "20년+"
            default:
              return true
          }
        })
      })
    }

    // 기술 스택 필터: Skills filter
    if (filters.skills.length > 0) {
      result = result.filter((candidate) =>
        filters.skills.some((skill) =>
          candidate.skills_current.some((candidateSkill) => candidateSkill.toLowerCase().includes(skill.toLowerCase())),
        ),
      )
    }

    // 학력 필터: Education filter
    if (filters.education.length > 0) {
      result = result.filter((candidate) => {
        return filters.education.some((edu) => {
          switch (edu) {
            case "고졸미만":
              return candidate.education === "고졸미만"
            case "고졸(예정)":
              return candidate.education === "고졸(예정)"
            case "초대졸(예정)":
              return candidate.education === "초대졸(예정)"
            case "대졸(예정)":
              return candidate.education === "대졸(예정)"
            case "석박사(예정)":
              return candidate.education === "석박사(예정)"
            case "석박사":
              return ["석박사(예정)", "석사", "박사", "MBA"].includes(candidate.education)
            default:
              return candidate.education === edu
          }
        })
      })
    }

    // 위치 필터: Location filter
    if (filters.location.length > 0) {
      result = result.filter((candidate) => {
        return filters.location.some((loc) => {
          if (loc === "원격근무") {
            return candidate.availability.includes("원격") || candidate.location.includes("원격")
          } else {
            return candidate.location === loc
          }
        })
      })
    }

    // 입사 시기 필터: Start date filter
    if (filters.startDate.length > 0) {
      result = result.filter((candidate) => {
        return filters.startDate.some((startDate) => {
          switch (startDate) {
            case "즉시":
              return candidate.availability.includes("즉시")
            case "1개월 이내":
              return (
                candidate.availability.includes("즉시") ||
                candidate.availability.includes("2주") ||
                candidate.availability.includes("1개월")
              )
            case "3개월 이내":
              return !candidate.availability.includes("기회")
            case "협의":
              return candidate.availability.includes("기회") || candidate.availability.includes("협의")
            default:
              return true
          }
        })
      })
    }

    // 연봉 범위 필터: Salary filter
    if (filters.salary.length > 0) {
      result = result.filter((candidate) => {
        const salaryNum = Number.parseInt(candidate.salary.replace(/[^0-9]/g, "")) || 0

        return filters.salary.some((salaryRange) => {
          switch (salaryRange) {
            case "3000만원 이하":
              return salaryNum <= 3000
            case "3000-5000만원":
              return salaryNum >= 3000 && salaryNum <= 5000
            case "5000-7000만원":
              return salaryNum >= 5000 && salaryNum <= 7000
            case "7000만원 이상":
              return salaryNum >= 7000
            default:
              return true
          }
        })
      })
    }

    // 이전 지원 필터: Previous applications filter
    if (filters.previousApplications.length > 0) {
      result = result.filter((candidate) => {
        return filters.previousApplications.some((filter) => {
          if (filter === "있음") {
            return candidate.last_process && candidate.last_process.length > 0
          } else if (filter === "없음") {
            return !candidate.last_process || candidate.last_process.length === 0
          }
          return true
        })
      })
    }

    console.log("data", "filters: hooks>use-candidate-filtering", filters)
    // 정렬 필터: sortBy
    function score(candidate: Candidate) {
      const c: string[] = candidate.skills_current || []
      const cl: number[] = (candidate.skfn_current || []).map(Number)
      const p: string[] = candidate.skills_past || []
      const pl: number[] = (candidate.skfn_past || []).map(Number)
      const pm = new Map<string, number>();
      for (let i = 0; i < p.length; i++) pm.set(p[i], Number(pl[i] ?? 0));
    
      const o: Record<string, { techStack: string; curLevel: number; growth: number }> = {};
      for (let i = 0; i < c.length; i++) {
        const n = c[i];
        if (!n) continue;
        const cur = Number(cl[i] ?? 0);
        const g = pm.size ? (pm.has(n) ? cur - (pm.get(n) as number) : 0) : 0;
        o[n] = { techStack: n, curLevel: cur, growth: g }; // 같은 스킬명은 마지막 값으로 덮어씀
      }
    
      const sorted = Object.values(o).sort(
        (a, b) => (b.growth - a.growth) || a.techStack.localeCompare(b.techStack)
      );
      const maxCount = Math.min(sorted.length, 100)
      const sum = sorted.reduce((acc, { growth }) => acc + growth, 0);
      const avg = Math.round((sum * 100 / maxCount)) / 100;
      return avg
    }
    const ppCareer = (career: string): number => {
      if (!career) return 0
      if (career === "신입") return 0
      if (career.endsWith("+")) return parseInt(career.replace(/[^0-9]/g, ""), 10)
      const num = parseInt(career.replace(/[^0-9]/g, ""), 10)
      return isNaN(num) ? 0 : num
    }
    // 정렬: Sorting
    const sortKey = Array.isArray(filters.sortBy) ? filters.sortBy[0] : filters.sortBy || "성장률 (높은순)"
    switch (sortKey) {
      case "성장률 (높은순)":
        result.sort((a, b) => (score(b) ?? -Infinity) - (score(a) ?? -Infinity))
        break
      case "성장률 (낮은순)":
        result.sort((a, b) => (score(a) ?? -Infinity) - (score(b) ?? -Infinity))
        break
      case "이름 (가나다순)":
        result.sort((a, b) => (a.employee_name ?? "").localeCompare(b.employee_name ?? "", "ko"))
        break
      case "이름 (가나다 역순)":
        result.sort((a, b) => (b.employee_name ?? "").localeCompare(a.employee_name ?? "", "ko"))
        break
      case "경력 (높은순)":
        result.sort((a, b) => (ppCareer(b.career) ?? -Infinity) - (ppCareer(a.career) ?? -Infinity))
        break
      case "경력 (낮은순)":
        result.sort((a, b) => (ppCareer(a.career) ?? -Infinity) - (ppCareer(b.career) ?? -Infinity))
        break
      default:
        break
    }

    return result
  }, [candidates, filters])
}

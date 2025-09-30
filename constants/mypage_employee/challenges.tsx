import type { ChallengeDifficulty } from "@/types/mypage_employee"

export const CHALLENGE_DIFFICULTIES: ChallengeDifficulty[] = ["초급", "중급", "고급"]

export const CHALLENGE_DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  초급: "bg-green-100 text-green-800",
  중급: "bg-yellow-100 text-yellow-800",
  고급: "bg-red-100 text-red-800",
}

export const CHALLENGE_CATEGORIES = ["코딩 테스트", "프로젝트", "학습", "네트워킹", "포트폴리오", "면접"]

export const CHALLENGE_DIFFICULTY_OPTIONS = CHALLENGE_DIFFICULTIES.map((difficulty) => ({
  value: difficulty,
  label: difficulty,
}))

export const CHALLENGE_CATEGORY_OPTIONS = CHALLENGE_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

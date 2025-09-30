export interface Candidate {
  id: string
  name: string
  avatar?: string
  photo?: string
  title: string
  location: string
  skills: string[]
  skillStack?: string[] // Keep for backward compatibility
  skillLevel: "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Principal"
  experience: string
  isBookmarked?: boolean
  salary: string
  salaryRange?: string
  availability: string
  education: string
  improvement: number
  // Enhanced for database relations
  previousApplications?: PreviousApplication[]
  skillProficiency?: SkillProficiency[]
  skillProficiencyGrowth?: SkillGrowth[]
  // Database metadata
  createdAt?: string
  updatedAt?: string
  profileViews?: number
  lastActive?: string
}

export interface PreviousApplication {
  id?: string
  candidateId?: string
  jobTitle: string
  company: string
  appliedDate: string
  status: "지원완료" | "서류통과" | "면접진행" | "최종합격" | "불합격"
  position?: string // Keep for backward compatibility
}

export interface SkillProficiency {
  id?: string
  candidateId?: string
  skill: string
  currentLevel: number
  improvementRate: number
}

export interface SkillGrowth {
  skill: string
  growth: string
}

export interface SkillProgressionData {
  [candidateId: string]: {
    name: string
    skillProgression: Array<{
      month: string
      [skill: string]: string | number
    }>
  }
}

// Database query interfaces
export interface CandidateQueryOptions {
  include?: {
    previousApplications?: boolean
    skillProficiency?: boolean
    skillProgression?: boolean
  }
  where?: {
    skillLevel?: string[]
    location?: string[]
    availability?: string[]
    skills?: {
      some: {
        name: {
          in: string[]
        }
      }
    }
  }
  orderBy?: {
    [key: string]: "asc" | "desc"
  }
  take?: number
  skip?: number
}

export interface Candidate {
  id: string;
  age: string;                       // "30"
  career: string;                     // "신입"
  company_name_clean_s: string;       // "이비즈테크"
  createdAt: string;                  // ""
  education: string;                  // "대졸(예정)"
  employee_id: string;                // "a00000929"
  employee_name: string;              // "강XX"
  gender: string;                     // "여자"
  job_category_kor: string;           // "기술지원"
  posting_id: string;                 // "51629223"
  posting_id_all: string;             // "51741538;51629223;..."
  posting_title_s: string;            // "경력 Veeam 백업 엔지니어 모집"
  skfn_current: string[];             // ["4", "6", "7"]
  skfn_past: string[];                // []
  skills_current: string[];           // ["HTML5", "FW", "AWS"]
  skills_past: string[];              // []
  isBookmarked?: boolean;              // false
  last_process: string[];             // ["최종합격", "불합격", ...]
}

export interface legacy_Candidate {
  id: string
  name: string
  avatar?: string
  title: string
  location: string
  skills: string[]
  skillLevel: "Junior" | "Mid" | "Senior"
  experience: string
  isBookmarked?: boolean
  salary: string
  availability: string
  education: string
  improvement: number
  appliedJobPosting?: string
  skillProficiencies?: {
    skill: string
    proficiency: number // 1-5 scale
    growthRate: number // percentage
    monthsExperience: number
  }[]
  previousApplications?: {
    company: string
    jobTitle: string
    status: string
  }[]
}

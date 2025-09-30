// 공통 타입 정의
export interface PopularJob {
  id: string
  title: string
  growth: string
  demand: "High" | "Medium" | "Low"
  salary: string
  skills: string[]
  description: string
}

export interface JobTrend {
  id: string
  title: string
  rank: number
  jobPosts: string
  applicants: string
  companies: string
  skills: string[]
}

export interface AIModel {
  id: string
  name: string // id 필드를 name으로 사용
  author: string
  downloads: string // 포맷된 문자열 (예: "8.3M")
  likes: string // 포맷된 문자열 (예: "1.8K")
  pipeline_tag: string
  library_name: string
  last_modified: string
}

export interface AIDistribution {
  name: string
  value: number
  fill: string
}

export interface TrendChart {
  month: string
  jobs: number
  applicants: number
  companies: number
}

export interface SkillDemand {
  skill: string
  demand: number
  growth: number
}

// 실제 DB 테이블 구조에 맞는 타입 정의
export interface HiringData {
  posting_id: string
  posting_title_j: string
  posting_title_s: string
  company_name_j: string
  company_name_s: string
  company_name_clean_j: string
  company_name_clean_s: string
  job_category: number
  job_category_kor: string
  company_tech_stack: string
  posting_tech_stack: string
  employee_id: string
  employee_name: string
  age: number
  gender: string
  education: string
  career: string
  job: string
  posting_id_all: string
  skills_current: string
  skfn_current: string
  skills_past: string
  skfn_past: string
  skills_p2: string
  skfn_p2: string
  skills_p3: string
  skfn_p3: string
  skills_p4: string
  skfn_p4: string
  skills_p5: string
  skfn_p5: string
  skills_p6: string
  skfn_p6: string
  last_process: string
}

// 집계된 직무 트렌드 데이터
export interface JobTrendStats {
  job_category_kor: string
  job_category: number
  total_postings: number
  total_applicants: number
  total_companies: number
  top_skills: string[]
  rank: number
}

export interface HFModelData {
  id: string
  author: string
  pipeline_tag: string
  library_name: string
  likes: number
  downloads: number
  last_modified: string
}

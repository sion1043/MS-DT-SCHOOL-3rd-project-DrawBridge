import { NextResponse } from "next/server"
import type { PopularJob } from "@/types/employee_trend"

export async function GET() {
  try {
    // TODO: 실제 DB에서 데이터 가져오기
    // const jobs = await db.popularJobs.findMany()

    // 임시 데이터 (실제 DB 연결 시 제거)
    const jobs: PopularJob[] = [
      {
        id: "1",
        title: "AI/ML 엔지니어",
        growth: "+45%",
        demand: "High",
        salary: "7,000-12,000만원",
        skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
        description: "AI 모델 개발 및 머신러닝 시스템 구축을 담당하는 핵심 직무입니다.",
      },
      {
        id: "2",
        title: "Frontend 개발자",
        growth: "+32%",
        demand: "High",
        salary: "4,500-8,000만원",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        description: "사용자 인터페이스 개발 및 웹 애플리케이션 프론트엔드를 담당합니다.",
      },
      {
        id: "3",
        title: "DevOps 엔지니어",
        growth: "+28%",
        demand: "Medium",
        salary: "5,500-9,500만원",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        description: "개발과 운영을 연결하는 인프라 및 배포 자동화를 담당합니다.",
      },
      {
        id: "4",
        title: "Product Manager",
        growth: "+25%",
        demand: "Medium",
        salary: "6,000-11,000만원",
        skills: ["기획", "데이터 분석", "사용자 리서치", "프로젝트 관리"],
        description: "제품 전략 수립 및 개발 프로세스 관리를 담당하는 역할입니다.",
      },
      {
        id: "5",
        title: "Data Scientist",
        growth: "+22%",
        demand: "High",
        salary: "5,000-10,000만원",
        skills: ["Python", "R", "SQL", "통계학", "데이터 시각화"],
        description: "데이터 분석 및 인사이트 도출을 통한 비즈니스 의사결정을 지원합니다.",
      },
    ]

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching popular jobs:", error)
    return NextResponse.json({ error: "Failed to fetch popular jobs" }, { status: 500 })
  }
}

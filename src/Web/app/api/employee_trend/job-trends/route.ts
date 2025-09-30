import { NextResponse } from "next/server"
import type { JobTrend } from "@/types/employee_trend"
import { query } from "@/lib/db"

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const jobTrendsQuery = `
        WITH base_all AS (  -- 공고/지원자/회사 수
            SELECT
                job_category_kor,
                posting_id,
                employee_id,
                company_name_s
            FROM gold.gld_company_chayongpit_hiring
            WHERE job_category_kor IS NOT NULL
              AND job_category_kor != ''
              AND posting_id IS NOT NULL
        ),
        base_skill AS (     -- 스킬 분리
            SELECT
                h.job_category_kor,
                TRIM(s) AS skill
            FROM gold.gld_company_chayongpit_hiring h
            CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(h.skills_current, ';')) AS s
            WHERE h.job_category_kor IS NOT NULL
              AND h.job_category_kor != ''
              AND h.posting_id IS NOT NULL
              AND h.skills_current IS NOT NULL
              AND h.skills_current != ''
        ),
        skill_counts AS (   -- 카테고리 내 스킬 빈도
            SELECT
                job_category_kor,
                skill,
                COUNT(*) AS skill_count
            FROM base_skill
            GROUP BY 1,2
        ),
        cat_stats AS (      -- 카테고리별 집계
            SELECT
                job_category_kor,
                COUNT(DISTINCT posting_id)     AS total_postings,
                COUNT(DISTINCT employee_id)    AS total_applicants,
                COUNT(DISTINCT company_name_s) AS total_companies
            FROM base_all
            GROUP BY 1
        ),
        cat_ranked AS (     -- 카테고리별 합계 순위
            SELECT
                cs.*,
                RANK() OVER (ORDER BY (cs.total_postings+cs.total_applicants+cs.total_companies) DESC) AS cat_rank
            FROM cat_stats cs
        ),
        skill_ranked AS (   -- 각 카테고리 안에서 스킬 순위
            SELECT
                sc.job_category_kor,
                sc.skill,
                sc.skill_count,
                RANK() OVER (
                    PARTITION BY sc.job_category_kor
                    ORDER BY sc.skill_count DESC, sc.skill
                ) AS skill_rank
            FROM skill_counts sc
        )
        SELECT
            c.cat_rank AS rank,  -- 카테고리 순위
            c.job_category_kor,
            c.total_postings,
            c.total_applicants,
            c.total_companies,
            STRING_AGG(s.skill, ';' ORDER BY s.skill_count DESC, s.skill) AS all_skills
        FROM cat_ranked c
        JOIN skill_ranked s
          ON c.job_category_kor = s.job_category_kor
        WHERE 
            (c.cat_rank <= 3  AND s.skill_rank <= 5)   -- TOP 3 → 스킬 5개
        OR (c.cat_rank >  3  AND s.skill_rank <= 15)  -- 나머지 → 스킬 15개
        GROUP BY
            c.cat_rank,
            c.job_category_kor,
            c.total_postings, c.total_applicants, c.total_companies
        ORDER BY c.cat_rank;
      `

      const results = await query(jobTrendsQuery)

      const trends: Record<string, JobTrend> = {}

      results.forEach((row: any, index: number) => {
        trends[(index + 1).toString()] = {
          id: row.rank,
          title: row.job_category_kor,
          rank: row.rank,
          jobPosts: row.total_postings.toLocaleString(),
          applicants: row.total_applicants.toLocaleString(),
          companies: row.total_companies.toLocaleString(),
          skills: row.all_skills.split(";").map((skill: string) => skill.trim()),
        }
      })

      return NextResponse.json(trends)
    }

    // 임시 데이터 (DATABASE_URL 환경변수가 없을 때 사용)
    const trends: Record<string, JobTrend> = {
      "인공지능/머신러닝": {
        id: "8",
        title: "인공지능/머신러닝",
        rank: 1,
        jobPosts: "1,907",
        applicants: "16,609",
        companies: "645",
        skills: ["Python", "PyTorch", "TensorFlow", "CUDA", "Docker"],
      },
      "Frontend 개발자": {
        id: "1",
        title: "Frontend 개발자",
        rank: 2,
        jobPosts: "2,341",
        applicants: "18,234",
        companies: "892",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
      },
      "Backend 개발자": {
        id: "2",
        title: "Backend 개발자",
        rank: 3,
        jobPosts: "2,156",
        applicants: "15,432",
        companies: "743",
        skills: ["Node.js", "Python", "Java", "PostgreSQL", "Docker"],
      },
      "DevOps 엔지니어": {
        id: "3",
        title: "DevOps 엔지니어",
        rank: 4,
        jobPosts: "1,523",
        applicants: "12,876",
        companies: "567",
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
      },
      "Product Manager": {
        id: "4",
        title: "Product Manager",
        rank: 5,
        jobPosts: "987",
        applicants: "8,234",
        companies: "423",
        skills: ["Figma", "Jira", "Analytics", "SQL", "A/B Testing"],
      },
      "UI/UX 디자이너": {
        id: "5",
        title: "UI/UX 디자이너",
        rank: 6,
        jobPosts: "756",
        applicants: "6,543",
        companies: "321",
        skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
      },
      "Data Scientist": {
        id: "6",
        title: "Data Scientist",
        rank: 7,
        jobPosts: "654",
        applicants: "5,432",
        companies: "234",
        skills: ["Python", "R", "SQL", "Tableau", "Statistics"],
      },
      "Mobile 개발자": {
        id: "7",
        title: "Mobile 개발자",
        rank: 8,
        jobPosts: "543",
        applicants: "4,321",
        companies: "198",
        skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      },
      "QA 엔지니어": {
        id: "9",
        title: "QA 엔지니어",
        rank: 9,
        jobPosts: "432",
        applicants: "3,210",
        companies: "156",
        skills: ["Selenium", "Jest", "Cypress", "Postman", "JIRA"],
      },
      "Security 엔지니어": {
        id: "10",
        title: "Security 엔지니어",
        rank: 10,
        jobPosts: "321",
        applicants: "2,109",
        companies: "123",
        skills: ["Penetration Testing", "SIEM", "Firewall", "Vulnerability Assessment", "Incident Response"],
      },
      "Cloud 엔지니어": {
        id: "11",
        title: "Cloud 엔지니어",
        rank: 11,
        jobPosts: "298",
        applicants: "1,987",
        companies: "109",
        skills: ["AWS", "Azure", "GCP", "Terraform", "CloudFormation"],
      },
      "Blockchain 개발자": {
        id: "12",
        title: "Blockchain 개발자",
        rank: 12,
        jobPosts: "187",
        applicants: "1,543",
        companies: "87",
        skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "DeFi"],
      },
      "Game 개발자": {
        id: "13",
        title: "Game 개발자",
        rank: 13,
        jobPosts: "165",
        applicants: "1,234",
        companies: "76",
        skills: ["Unity", "Unreal Engine", "C#", "C++", "3D Modeling"],
      },
      "System 엔지니어": {
        id: "14",
        title: "System 엔지니어",
        rank: 14,
        jobPosts: "143",
        applicants: "1,098",
        companies: "65",
        skills: ["Linux", "Windows Server", "VMware", "Monitoring", "Scripting"],
      },
      "Network 엔지니어": {
        id: "15",
        title: "Network 엔지니어",
        rank: 15,
        jobPosts: "121",
        applicants: "987",
        companies: "54",
        skills: ["Cisco", "Routing", "Switching", "Firewall", "Network Security"],
      },
      "Database 관리자": {
        id: "16",
        title: "Database 관리자",
        rank: 16,
        jobPosts: "109",
        applicants: "876",
        companies: "43",
        skills: ["MySQL", "PostgreSQL", "Oracle", "MongoDB", "Performance Tuning"],
      },
      "Technical Writer": {
        id: "17",
        title: "Technical Writer",
        rank: 17,
        jobPosts: "87",
        applicants: "654",
        companies: "32",
        skills: ["Documentation", "API Documentation", "Markdown", "Git", "Technical Communication"],
      },
      "Solutions Architect": {
        id: "18",
        title: "Solutions Architect",
        rank: 18,
        jobPosts: "76",
        applicants: "543",
        companies: "28",
        skills: ["System Design", "Cloud Architecture", "Microservices", "API Design", "Enterprise Architecture"],
      },
    }

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error fetching job trends:", error)
    return NextResponse.json({ error: "Failed to fetch job trends" }, { status: 500 })
  }
}

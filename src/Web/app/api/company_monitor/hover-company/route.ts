import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Candidate } from "@/types/company_monitor/candidate"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const candidate: Candidate = JSON.parse(searchParams.get("candidate") || "{}")

    if (process.env.DATABASE_URL) {
      // 실제 DB 연결 시 사용할 쿼리
      const postgres_query = `
      SELECT
        skills_past, skfn_past,
        skills_p2,   skfn_p2,
        skills_p3,   skfn_p3,
        skills_p4,   skfn_p4,
        skills_p5,   skfn_p5,
        skills_p6,   skfn_p6
      FROM gold.gld_company_chayongpit_hiring
      WHERE posting_id           = $1
        AND company_name_clean_s = $2
        AND employee_id          = $3
        AND job_category_kor     = $4;
    `;

      const params = [
        String(candidate.posting_id),
        String(candidate.company_name_clean_s),
        String(candidate.employee_id),
        String(candidate.job_category_kor),
      ];
      const results = await query(postgres_query, params)
      return NextResponse.json(results[0])
    }
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return NextResponse.json({ error: "Failed to fetch AI models" }, { status: 500 })
  }
}
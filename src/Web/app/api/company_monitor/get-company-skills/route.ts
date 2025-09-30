export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserFromSession } from "@/lib/session"; // server-only OK

// 필요하면 활성 공고만: WHERE ... AND (status = '진행중' OR deadline > now())
// const TITLE_EXPR = `COALESCE(job_category_kor, job_category)`;
const TITLE_EXPR = `skills_current`;

export async function GET() {
  try {
    const user = await getUserFromSession();

    // 기업 계정만 회사 필터 적용
    const companyNames =
      user?.accountType === "company"
        ? (user.companies ?? []).map((c: any) => c.company_name).filter(Boolean)
        : [];

    // 회사 정보가 없으면 빈 배열 반환
    if (!companyNames.length) {
      return NextResponse.json({ jobSkills: [] });
    }

    // company_id 컬럼이 있다면 company_id ANY(...)로 바꾸는 게 더 안전합니다.
    const text = `
      SELECT DISTINCT unnest(string_to_array(${TITLE_EXPR}, ';')) AS skill
      FROM gold.gld_company_hiring
      WHERE company_name_clean_s = ANY($1::text[])
      AND ${TITLE_EXPR} IS NOT NULL AND ${TITLE_EXPR} <> ''
      ORDER BY skill ASC;
    `;
    const values = [companyNames];

    const { rows } = await pool.query<{ skill: string }>({ text, values });
    const skills = rows.map(r => r.skill);

    return NextResponse.json({ jobSkills: skills });
  } catch (err) {
    console.error("[GET /api/company_monitor/get-company-skills] error:", err);
    return NextResponse.json({ jobSkills: [] }, { status: 500 });
  }
}

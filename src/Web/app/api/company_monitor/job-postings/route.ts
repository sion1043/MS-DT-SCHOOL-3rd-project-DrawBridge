export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserFromSession } from "@/lib/session"; // server-only OK

// 필요하면 활성 공고만: WHERE ... AND (status = '진행중' OR deadline > now())
const TITLE_EXPR = `COALESCE(posting_title_s, posting_title_j)`;

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
      return NextResponse.json({ jobPostings: [] });
    }

    // company_id 컬럼이 있다면 company_id ANY(...)로 바꾸는 게 더 안전합니다.
    const text = `
      SELECT DISTINCT ${TITLE_EXPR} AS title
      FROM gold.gld_company_hiring
      WHERE company_name_clean_s = ANY($1)
      AND ${TITLE_EXPR} IS NOT NULL AND ${TITLE_EXPR} <> ''
      ORDER BY title ASC
    `;
    const values = [companyNames];

    const { rows } = await pool.query<{ title: string }>({ text, values });
    const titles = rows.map(r => r.title);

    return NextResponse.json({ jobPostings: titles });
  } catch (err) {
    console.error("[GET /api/company_monitor/job-postings] error:", err);
    return NextResponse.json({ jobPostings: [] }, { status: 500 });
  }
}

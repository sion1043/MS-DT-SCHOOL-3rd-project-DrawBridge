// app/api/company_monitor/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

type EmployeeRow = {
  posting_id: string | null;
  posting_title_j: string | null;
  posting_title_s: string | null;
  company_name_j: string | null;
  company_name_s: string | null;
  company_name_clean_j: string | null;
  company_name_clean_s: string | null;
  job_category: bigint | null;
  job_category_kor: string | null;
  employee_id: string | null;           // char(9)
  employee_name: string | null;  // varchar(5)
  age: bigint | null;            // varchar(10)
  gender: string | null;         // char(2)
  education: string | null;      // varchar(20)
  career: string | null;         // varchar(10)
  skills_current: string | null; // text (쉼표/줄바꿈 구분 가정)
  skfn_current: string | null;
  posting_id_all: string | null;
  skills_past: string | null;
  skfn_past: string | null;
  last_process: string | null;
};

const toISO = (v: unknown): string | null => {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") {
    // 이미 ISO이면 그대로 두고, 아니면 Date 파싱 시도
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toISOString();
  }
  if (typeof v === "number" || typeof v === "bigint") {
    const d = new Date(Number(v));
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return String(v);
};

// 페이지에서 쓰는 Candidate 형태에 맞춰 매핑
function toCandidate(r: any) {
  return {
    id: uuidv4(),
    posting_id: r.posting_id ?? "",
    posting_title_s: r.posting_title_s ?? "",
    company_name_clean_s: r.company_name_clean_s ?? "",
    job_category_kor: r.job_category_kor ?? "",
    employee_id: r.employee_id ?? "",
    employee_name: r.employee_name ?? "",
    age: r.age ?? "",
    gender: r.gender ?? "",
    education: r.education ?? "",
    career: r.career ?? "",
    skills_current: r.skills_past?.trim().split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) ?? [],
    skfn_current: r.skfn_past?.trim().split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) ?? [],
    posting_id_all: r.posting_id_all,
    skills_past: r.skills_p2?.trim().split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) ?? [],
    skfn_past: r.skfn_p2?.trim().split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) ?? [],
    isBookmarked: false,
    last_process: r.last_process?.trim().split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) ?? [],
    createdAt: "",
  };
}

// GET /api/company_monitor/candidates?limit=20&cursorTs=...&cursorId=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // limit = all 지원하는 형태로 변경
    const limitParam = url.searchParams.get("limit");
    const wantAll = !limitParam || limitParam.toLowerCase() === "all";
    const limit = wantAll ? null : Math.min(parseInt(limitParam || "20", 10), 100);
    const cursorTs = url.searchParams.get("cursorTs"); // ISO string
    const cursorId = url.searchParams.get("cursorId"); // employee_id (text)

    const params: any[] = [];
    const whereParts: string[] = [];

    if (cursorTs && cursorId) {
      whereParts.push(`("timestamp", employee_id) < ($1::timestamptz, $2::text)`);
      params.push(cursorTs, cursorId);
    }

    // 세션에서 유저 확인 -> 기업이라면 회사 확인
    const user = await getUserFromSession();
    if (user?.accountType === "company") {
      const companyNames = user.companies.map((c) => c.company_name).filter(Boolean);
      if (companyNames.length) {
        whereParts.push(`company_name_clean_s = ANY($${params.length + 1})`);
        params.push(companyNames);
      }
    }

    const whereSQL = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
    let sql = `
      SELECT *
      FROM gold.gld_company_chayongpit_hiring
      ${whereSQL}
      ORDER BY employee_name ASC, employee_id ASC, job_category_kor ASC
    `;

    // LIMIT 동적 추가
    if (limit != null) {
      sql += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    const { rows } = await pool.query<EmployeeRow>(sql, params);
    const candidates = rows.map(toCandidate);

    // nextCursor 계산
    const last = rows[rows.length - 1];
    const rawTs = last ? (last as any).ts ?? (last as any).ts ?? null: null;
    const nextCursor = last
      ? { cursorTs: toISO(rawTs), cursorId: String((last as any).employee_id) }
      : null;

    return NextResponse.json({
      candidates,
      nextCursor,
      hasMore: !!last && rows.length === limit,
    });
  } catch (err) {
    console.error("[GET /api/company_monitor] error:", err);
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }
}

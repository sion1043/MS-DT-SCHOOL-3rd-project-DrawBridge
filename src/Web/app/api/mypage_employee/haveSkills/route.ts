import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromSession } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getUserFromSession();
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const sql = `
      SELECT
        skill AS name,
        score,
        to_char(taken_at, 'YYYY-MM-DD') AS "lastTested"  -- ✅ camelCase + 고정 포맷
      FROM public.user_skill_scores
      WHERE user_id = $1
      ORDER BY taken_at DESC
    `;
    const params = [String(user?.id)];

    const raw = await query(sql, params);
    const rows = Array.isArray((raw as any)?.rows) ? (raw as any).rows : Array.isArray(raw) ? raw : [];

    return NextResponse.json({ ok: true, data: rows });
  } catch (error) {
    console.error("[haveSkills][GET] error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const user = await getUserFromSession();
  try {
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

    const body = await req.json().catch(() => null);
    const skill = String(body?.name ?? body?.skill ?? "").trim();
    const scoreNum = Number(body?.score);
    const takenAt = body?.takenAt ? String(body.takenAt) : null;

    if (!skill || !Number.isFinite(scoreNum)) {
      return NextResponse.json(
        { error: "Invalid payload: { name|skill: string, score: number, takenAt?: ISO string }" },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO public.user_skill_scores (user_id, skill, score, taken_at)
      VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()))
      ON CONFLICT (user_id, skill)
      DO UPDATE SET
        score    = EXCLUDED.score,
        taken_at = EXCLUDED.taken_at
      RETURNING
        user_id,
        skill AS name,
        score,
        to_char(taken_at, 'YYYY-MM-DD') AS "lastTested";  -- ✅ GET과 동일 포맷
    `;
    const params = [String(user.id), skill, scoreNum, takenAt];

    const raw = await query(sql, params);
    const rows = Array.isArray((raw as any)?.rows) ? (raw as any).rows : Array.isArray(raw) ? raw : [];

    return NextResponse.json({ ok: true, data: rows[0] ?? null }, { status: 201 });
  } catch (e: any) {
    console.error("[haveSkills][POST] error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed to upsert skill" }, { status: 500 });
  }
}

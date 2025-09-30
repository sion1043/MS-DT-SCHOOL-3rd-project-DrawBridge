import "server-only";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import crypto from "node:crypto";

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 1;

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url"); // URL-safe
  const expires = new Date(Date.now() + SESSION_DAYS*24*60*60*1000);

  await pool.query(
    `INSERT INTO sessions (session_token, user_id, expires)
     VALUES ($1, $2, $3)`,
    [token, userId, expires.toISOString()]
  );

  // httpOnly 쿠키로 저장
  cookies().set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });

  return { token, expires };
}

export async function deleteCurrentSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await pool.query(`DELETE FROM sessions WHERE session_token = $1`, [token]);
  }
  cookies().delete(SESSION_COOKIE);
}

export async function legacy_getUserFromSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.name
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.session_token = $1 AND s.expires > now()`,
    [token]
  );
  return rows[0] ?? null;
}

export type CompanyMembership = {
  company_id: string;
  company_name: string;
  role: "owner" | "admin" | "recruiter";
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  is_job_seeker: boolean;
  companies: CompanyMembership[];
  accountType: "company" | "jobseeker";
};

export async function getUserFromSession(): Promise<SessionUser | null> {
  const token = cookies().get(process.env.SESSION_COOKIE_NAME ?? "session")?.value;
  if (!token) return null;

  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      EXISTS (SELECT 1 FROM job_seekers js WHERE js.user_id = u.id) AS is_job_seeker,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'company_id', c.id,
              'company_name', c.name,
              'role', cm.role
            )
          )
          FROM company_members cm
          JOIN companies c ON c.id = cm.company_id
          WHERE cm.user_id = u.id
        ),
        '[]'::json
      ) AS companies
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.session_token = $1
      AND s.expires > now()
    LIMIT 1
    `,
    [token]
  );

  const row = rows[0];
  if (!row) return null;

  const companies = (row as any).companies as CompanyMembership[];
  if (companies?.length > 0) {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      is_job_seeker: true, // 회사 소속이면 구직자 여부는 크게 의미 없음
      companies,
      accountType: "company",
    };
  }

  if ((row as any).is_job_seeker) {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      is_job_seeker: true,
      companies: [],
      accountType: "jobseeker",
    };
  }

  // 역할 없으면 로그인된 걸로 취급하지 않음
  return null;
}
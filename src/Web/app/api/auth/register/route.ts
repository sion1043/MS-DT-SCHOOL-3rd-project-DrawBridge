export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/session"; // 세션 쿠키 발급 유틸(앞서 만든 것)

// // 구직자
// {
//   "type":"jobseeker",
//   "name":"홍길동",
//   "email":"x@x.com",
//   "phone":"010-1234-5678",
//   "password":"secret123"
// }

// // 기업
// {
//   "type":"company",
//   "companyName":"(주)테크컴퍼니",
//   "bizRegNo":"123-45-67890",
//   "managerName":"김담당",
//   "managerEmail":"manager@company.com",
//   "managerPhone":"010-1234-5678",
//   "password":"secret123"
// }

const JobSeekerBody = z.object({
  type: z.literal("jobseeker"),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

const CompanyBody = z.object({
  type: z.literal("company"),
  companyName: z.string().min(1),
  bizRegNo: z.string().min(1),
  managerName: z.string().min(1),
  managerEmail: z.string().email(),
  managerPhone: z.string().optional(),
  password: z.string().min(8),
});

// 핵심: type을 기준으로 한 번에 파싱 (discriminated union)
const RegisterBody = z.discriminatedUnion("type", [JobSeekerBody, CompanyBody]);
type RegisterReq = z.infer<typeof RegisterBody>;

export async function POST(req: Request) {
  const json = await req.json();
  const body: RegisterReq = RegisterBody.parse(json); // <- 여기서 한 번만 파싱
  console.log(body)
  const cx = await pool.connect();
  try {
    await cx.query("BEGIN");

    if (body.type === "jobseeker") {
      // 여기서는 body가 JobSeeker로 좁혀짐
      const { type, email, name, phone, password } = body;
      const pwd = await bcrypt.hash(password, 12);

      const dup = await cx.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
      if (dup.rowCount) {
        await cx.query("ROLLBACK");
        return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
      }

      const u = await cx.query(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1,$2,$3)
         RETURNING id, email, name`,
        [email, pwd, name]
      );
      const user = u.rows[0];

      await cx.query(`INSERT INTO job_seekers (user_id) VALUES ($1)`, [user.id]);

      await cx.query("COMMIT");
      await createSession(user.id);
      return NextResponse.json({ ok: true, user });
    }

    // 여기로 오면 body.type === "company"
    const { type, companyName, bizRegNo, managerName, managerEmail, managerPhone, password } = body;
    const pwd = await bcrypt.hash(password, 12);

    const dupUser = await cx.query(`SELECT 1 FROM users WHERE email = $1`, [managerEmail]);
    if (dupUser.rowCount) {
      await cx.query("ROLLBACK");
      return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
    }

    const dupBiz = await cx.query(`SELECT 1 FROM companies WHERE biz_reg_no = $1`, [bizRegNo]);
    if (dupBiz.rowCount) {
      await cx.query("ROLLBACK");
      return NextResponse.json({ error: "BIZ_REG_NO_IN_USE" }, { status: 409 });
    }

    const u = await cx.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name`,
      [managerEmail, pwd, managerName]
    );
    const user = u.rows[0];

    const c = await cx.query(
      `INSERT INTO companies (name, biz_reg_no)
       VALUES ($1,$2)
       RETURNING id, name, biz_reg_no`,
      [companyName, bizRegNo]
    );
    const company = c.rows[0];

    await cx.query(
      `INSERT INTO company_members (company_id, user_id, role)
       VALUES ($1, $2, 'HR')`,
      [company.id, user.id]
    );

    await cx.query("COMMIT");
    await createSession(user.id);
    return NextResponse.json({ ok: true, user, company });
  } catch (e: any) {
    await cx.query("ROLLBACK");
    console.error("[register] error", e);
    if (e?.code === "23505") {
      return NextResponse.json({ error: "UNIQUE_CONSTRAINT" }, { status: 409 });
    }
    return NextResponse.json({ error: "REGISTER_FAILED" }, { status: 400 });
  } finally {
    cx.release();
  }
}
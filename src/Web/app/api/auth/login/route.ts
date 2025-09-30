// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { findUserByEmail } from "@/data/users.repo";
// import { verifyPassword } from "@/lib/password";
// import { createSession } from "@/lib/session";

// const Body = z.object({
//   email: z.string().email(),
//   password: z.string().min(1),
// });

// export async function POST(req: Request) {
//   try {
//     const { email, password } = Body.parse(await req.json());
//     const user = await findUserByEmail(email);
//     // 이메일 존재 유무를 굳이 구분해 주지 않는 것이 보안상 안전
//     if (!user) {
//       return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
//     }
//     const ok = await verifyPassword(password, user.password_hash);
//     if (!ok) {
//       return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
//     }

//     await createSession(user.id);
//     return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
//   } catch (e) {
//     console.error("[login] error", e);
//     return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
//   }
// }


export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/session";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["jobseeker", "company"]), // ← 로그인 유형을 명시적으로 받음
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    const f = parsed.error.flatten();
    return NextResponse.json(
      { error: "VALIDATION_ERROR", fieldErrors: f.fieldErrors },
      { status: 422 }
    );
  }

  const { email, password, role } = parsed.data;

  // 유저 + 역할 존재 여부 한 번에 조회
  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      u.password_hash,
      EXISTS (SELECT 1 FROM job_seekers js WHERE js.user_id = u.id) AS is_job_seeker,
      EXISTS (SELECT 1 FROM company_members cm WHERE cm.user_id = u.id) AS is_company
    FROM users u
    WHERE u.email = $1
    `,
    [email]
  );

  const user = rows[0];
  // 이메일 미존재 → 같은 메시지로 숨김
  if (!user) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // 비밀번호 검증
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // 역할 매칭 강제
  if (role === "jobseeker" && !user.is_job_seeker) {
    // 가입은 했지만 구직자 프로필이 없음
    return NextResponse.json({ error: "ROLE_MISMATCH" }, { status: 403 });
  }
  if (role === "company" && !user.is_company) {
    // 가입은 했지만 회사 소속이 없음
    return NextResponse.json({ error: "ROLE_MISMATCH" }, { status: 403 });
  }

  // 통과: 세션 생성
  await createSession(user.id);

  // 선택: 응답에 accountType 힌트 제공
  const accountType =
    user.is_company ? "company" : user.is_job_seeker ? "jobseeker" : "unassigned";

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
    accountType,
  });
}

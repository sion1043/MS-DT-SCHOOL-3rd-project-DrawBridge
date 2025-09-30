import "server-only";
import bcrypt from "bcryptjs";

// 해시 생성 (회원가입/비번변경)
export async function hashPassword(plain: string) {
  // 10~12 정도가 무난. 너무 높이면 로그인 지연
  return bcrypt.hash(plain, 12);
}

// 해시 검증 (로그인 시)
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

import { Pool } from "pg";

declare global {
    // Hot reload 대비: dev에서 연결 풀 중복 생성 방지
    // eslint-disable-next-line no-var
    var _pgPool: Pool | undefined;
}

export const pool = global._pgPool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

if (process.env.NODE_ENV !== "production") {
    global._pgPool = pool;
}

// 데이터베이스 쿼리 함수
export async function query(text: string, params?: any[]) {
    const client = await pool.connect()
    try {
        const result = await client.query(text, params)
        return result.rows
    } catch (error) {
        console.error("Database query error:", error)
        throw error
    } finally {
        client.release()
    }
}
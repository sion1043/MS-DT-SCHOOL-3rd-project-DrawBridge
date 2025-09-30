import { pool } from "./db";
import type { PoolClient } from "pg";

export async function withTx<T>(fn: (cx: PoolClient) => Promise<T>): Promise<T> {
  const cx = await pool.connect();
  try {
    await cx.query("BEGIN");
    const res = await fn(cx);
    await cx.query("COMMIT");
    return res;
  } catch (e) {
    await cx.query("ROLLBACK");
    throw e;
  } finally {
    cx.release();
  }
}

import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const postgres_query = `
      `

      const results = await query(postgres_query)

      // 숫자를 포맷된 문자열로 변환
      const api_response = results.map(model => ({
        ...model,
        name: model.id, // id를 name으로 사용
      }))

      return NextResponse.json(api_response)
    }
  } catch (error) {
    console.error("Error fetching job trends:", error)
    return NextResponse.json({ error: "Failed to fetch job trends" }, { status: 500 })
  }
}

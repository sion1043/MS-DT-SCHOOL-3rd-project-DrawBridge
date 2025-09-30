import { NextResponse } from "next/server"
import type { AIModel } from "@/types/employee_trend"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"

    if (process.env.DATABASE_URL) {
      // 실제 DB 연결 시 사용할 쿼리
      const postgres_query = `
        SELECT 
          id,
          author,
          downloads,
          likes,
          pipeline_tag,
          library_name,
          last_modified
        FROM gold.gld_company_chayongpit_hf 
        ORDER BY downloads DESC, likes DESC
        LIMIT ${limit}
      `
      const results = await query(postgres_query)
      
      // 숫자를 포맷된 문자열로 변환
      const formattedModels = results.map(model => ({
        ...model,
        name: model.id, // id를 name으로 사용
        downloads: formatNumber(model.downloads),
        likes: formatNumber(model.likes)
      }))
      
      return NextResponse.json(formattedModels)
    }

    const models: AIModel[] = [
      {
        id: "openai/clip-vit-large-patch14",
        name: "openai/clip-vit-large-patch14",
        author: "openai",
        downloads: "8.36M",
        likes: "1.86K",
        pipeline_tag: "zero-shot-image-classification",
        library_name: "transformers",
        last_modified: "2023-09-15 15:49:35+00",
      },
      {
        id: "microsoft/DialoGPT-medium",
        name: "microsoft/DialoGPT-medium",
        author: "microsoft",
        downloads: "5.2M",
        likes: "1.2K",
        pipeline_tag: "conversational",
        library_name: "transformers",
        last_modified: "2023-08-20 10:30:15+00",
      },
      {
        id: "stabilityai/stable-diffusion-xl-base-1.0",
        name: "stabilityai/stable-diffusion-xl-base-1.0",
        author: "stabilityai",
        downloads: "12.5M",
        likes: "3.4K",
        pipeline_tag: "text-to-image",
        library_name: "diffusers",
        last_modified: "2023-09-10 14:22:45+00",
      },
      {
        id: "google/flan-t5-large",
        name: "google/flan-t5-large",
        author: "google",
        downloads: "7.8M",
        likes: "2.1K",
        pipeline_tag: "text2text-generation",
        library_name: "transformers",
        last_modified: "2023-08-25 09:15:30+00",
      },
      {
        id: "facebook/bart-large-mnli",
        name: "facebook/bart-large-mnli",
        author: "facebook",
        downloads: "4.3M",
        likes: "890",
        pipeline_tag: "zero-shot-classification",
        library_name: "transformers",
        last_modified: "2023-07-18 16:45:20+00",
      },
    ]

    const limitedModels = models.slice(0, Number.parseInt(limit))
    return NextResponse.json(limitedModels)
  } catch (error) {
    console.error("Error fetching AI models:", error)
    return NextResponse.json({ error: "Failed to fetch AI models" }, { status: 500 })
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

import { NextResponse } from "next/server"
import type { AIDistribution } from "@/types/employee_trend"
import { query } from "@/lib/db"

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      // 실제 DB 연결 시 사용할 쿼리
      const pipelineQuery = `
        SELECT 
          pipeline_tag as name,
          COUNT(*) as value
        FROM gold.gld_company_chayongpit_hf 
        GROUP BY pipeline_tag
        HAVING pipeline_tag IS NOT NULL
        ORDER BY value DESC
      `
      
      const libraryQuery = `
        SELECT 
          library_name as name,
          COUNT(*) as value
        FROM gold.gld_company_chayongpit_hf 
        GROUP BY library_name
        HAVING library_name IS NOT NULL
        ORDER BY value DESC
      `
      
      const pipelineData = await query(pipelineQuery)
      const libraryData = await query(libraryQuery)
      const COLORS = [
        "#3B82F6", // blue-500
        "#10B981", // emerald-500
        "#F59E0B", // amber-500
        "#EF4444", // red-500
        "#8B5CF6", // violet-500
        "#06B6D4", // cyan-500
        "#84CC16", // lime-500
        "#F97316", // orange-500
        "#EC4899", // pink-500
        "#14B8A6", // teal-500
        "#A855F7", // purple-500
        "#22C55E", // green-500
        "#F472B6", // pink-400
        "#6366F1", // indigo-500
        "#EAB308", // yellow-500
        "#DC2626", // red-600
        "#7C3AED", // violet-600
        "#059669", // emerald-600
        "#D97706", // amber-600
        "#6B7280", // gray-500
      ]
      
      return NextResponse.json({
        fieldDistribution: pipelineData.map((item, index) => ({
          ...item,
          
          fill: COLORS[index % COLORS.length],
        })),
        libraryDistribution: libraryData.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        })),
      })
    }

    const fieldDistribution: AIDistribution[] = [
      { name: "text-generation", value: 3245, fill: "#3b82f6" },
      { name: "text-to-image", value: 2156, fill: "#ef4444" },
      { name: "automatic-speech-recognition", value: 1834, fill: "#10b981" },
      { name: "zero-shot-image-classification", value: 1523, fill: "#f59e0b" },
      { name: "conversational", value: 1287, fill: "#8b5cf6" },
      { name: "text2text-generation", value: 987, fill: "#ec4899" },
      { name: "zero-shot-classification", value: 876, fill: "#06b6d4" },
      { name: "feature-extraction", value: 765, fill: "#84cc16" },
      { name: "image-classification", value: 654, fill: "#f97316" },
      { name: "question-answering", value: 543, fill: "#6366f1" },
      { name: "summarization", value: 432, fill: "#14b8a6" },
      { name: "translation", value: 321, fill: "#f43f5e" },
      { name: "text-classification", value: 298, fill: "#a855f7" },
      { name: "image-to-text", value: 234, fill: "#0ea5e9" },
      { name: "object-detection", value: 187, fill: "#22c55e" },
    ]

    const libraryDistribution: AIDistribution[] = [
      { name: "transformers", value: 4521, fill: "#3b82f6" },
      { name: "diffusers", value: 2876, fill: "#ef4444" },
      { name: "pytorch", value: 2134, fill: "#10b981" },
      { name: "tensorflow", value: 1654, fill: "#f59e0b" },
      { name: "sentence-transformers", value: 1543, fill: "#84cc16" },
      { name: "onnx", value: 1234, fill: "#ec4899" },
      { name: "jax", value: 987, fill: "#8b5cf6" },
      { name: "ultralytics", value: 876, fill: "#06b6d4" },
      { name: "timm", value: 765, fill: "#f97316" },
      { name: "keras", value: 654, fill: "#eab308" },
      { name: "spacy", value: 543, fill: "#6366f1" },
      { name: "scikit-learn", value: 432, fill: "#14b8a6" },
      { name: "detectron2", value: 321, fill: "#be185d" },
      { name: "fairseq", value: 298, fill: "#0891b2" },
      { name: "xgboost", value: 234, fill: "#f43f5e" },
      { name: "lightgbm", value: 187, fill: "#a855f7" },
      { name: "fastai", value: 165, fill: "#0ea5e9" },
      { name: "paddlepaddle", value: 132, fill: "#22c55e" },
      { name: "catboost", value: 98, fill: "#dc2626" },
      { name: "mindspore", value: 76, fill: "#7c3aed" },
    ]

    return NextResponse.json({
      fieldDistribution,
      libraryDistribution,
    })
  } catch (error) {
    console.error("Error fetching AI distribution:", error)
    return NextResponse.json({ error: "Failed to fetch AI distribution" }, { status: 500 })
  }
}

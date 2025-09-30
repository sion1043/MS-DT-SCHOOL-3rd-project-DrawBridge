import { NextResponse } from "next/server";

const AZURE_URL =
  "https://rag-answer-functionapp-aweza7aeh6hzfucf.koreacentral-01.azurewebsites.net/api/evaluate_skill";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fnKey = process.env.AZURE_FUNCTION_KEY;
    if (!fnKey) {
      console.error("AZURE_FUNCTION_KEY is missing");
      return NextResponse.json(
        { error: "Server misconfiguration: missing function key" },
        { status: 500 }
      );
    }

    const res = await fetch(AZURE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-functions-key": fnKey, // 🔒 서버에서만 전송
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({} as any));

    if (!res.ok) {
      // Azure의 에러를 그대로 전달(디버깅 용)
      return NextResponse.json(
        { error: "Azure Function 호출 실패", status: res.status, data },
        { status: res.status }
      );
    }

    // // ✅ question만 추출해서 반환
    // const question =
    //   typeof data?.question === "string"
    //     ? data.question
    //     : typeof data?.question?.text === "string"
    //     ? data.question.text
    //     : null;

    // if (!question) {
    //   return NextResponse.json(
    //     { error: "응답에 question이 없습니다.", data },
    //     { status: 200 }
    //   );
    // }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[route] API Error:", err);
    return NextResponse.json({ error: "서버 내부 에러 발생" }, { status: 500 });
  }
}

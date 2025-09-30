"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/mypage_employee/common/page-header"
import { useEffect, useState } from "react"
import { SKILL_CATEGORIES } from "@/constants/mypage_employee/skills"

interface AssessmentTestProps {
  selectedSkill: string
  testAnswer: string
  questionNumRef: number
  onAnswerChange: (answer: string) => void
  onSubmit: () => void
  onBack: () => void
}

const MIN_CHARS = 5;   // ✅ 최소 글자수
const MAX_CHARS = 300;  // ✅ 최대 글자수

export function AssessmentTest({
  selectedSkill,
  testAnswer,
  questionNumRef,
  onAnswerChange,
  onSubmit,
  onBack,
}: AssessmentTestProps) {
  const [question, setQuestion] = useState<string>("문제를 불러오는 중...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 길이 관련 유틸
  const rawLen = testAnswer.length;
  const trimmedLen = testAnswer.trim().length;
  const tooShort = trimmedLen < MIN_CHARS;
  const tooLong = rawLen > MAX_CHARS; // onChange에서 자를 거라 보통 false
  const canSubmit = !tooShort && !tooLong;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/mypage_employee/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill_id: SKILL_CATEGORIES[selectedSkill],
        user_answer: "",
        question_num: questionNumRef,
      }),
    })
      .then((res) => res.json())
      .then((api_response) => {
        if (cancelled) return;
        console.log("[client] /api/mypage_employee/question 응답:", api_response);
        // 서버가 { question: "..."} 형태로 준다고 가정
        const q = api_response?.question ?? api_response?.data?.question;
        const text =
          typeof q === "string"
            ? q
            : typeof q?.text === "string"
            ? q.text
            : null;

        setQuestion(text || "질문을 불러오지 못했습니다.");
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("API 호출 에러:", e);
        setError("문제를 불러오는 중 에러가 발생했습니다.");
        setQuestion("질문을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={`${selectedSkill} 숙련도 검사`} onBack={onBack} />

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {loading ? "문제를 불러오는 중..." : question}
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedSkill}에 대한 본인의 지식을 설명해주세요.
              </p>
            </div>

            <Textarea
              value={testAnswer}
              onChange={(e) => {
                const next = e.target.value.slice(0, MAX_CHARS);
                onAnswerChange(next);
              }}
              aria-invalid={tooShort || tooLong}
              aria-describedby="answer-help"
              className={`min-h-[200px] resize-none border-2 ${
                tooShort || tooLong
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-gray-300"
              }`}
            />

            {/* 도움말 + 글자 카운터 */}
            <div className="flex items-center justify-between text-sm" id="answer-help">
              <span className={tooShort ? "text-red-600" : "text-muted-foreground"}>
                {tooShort
                  ? `최소 ${MIN_CHARS}자 이상 작성해주세요.`
                  : ""}
              </span>
              <span className={tooShort || tooLong ? "text-red-600" : "text-muted-foreground"}>
                {rawLen} / {MAX_CHARS}
              </span>
            </div>

            <div className="text-center">
              <Button
                onClick={onSubmit}
                className="bg-primary hover:bg-primary/90 px-8"
                disabled={!canSubmit}
              >
                제출하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

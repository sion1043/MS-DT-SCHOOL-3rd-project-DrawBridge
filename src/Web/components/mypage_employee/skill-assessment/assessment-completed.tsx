"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/mypage_employee/common/page-header"
import { CheckCircle } from "lucide-react"
import type { SkillStack } from "@/types/mypage_employee"
import { useEffect, useRef, useState } from "react"
import { SKILL_CATEGORIES } from "@/constants/mypage_employee/skills"

interface AssessmentCompletedProps {
  selectedSkill: string;
  testAnswer: string;
  questionNumRef: number;
  skillResult: SkillStack | undefined;
  onSaved: (saved: SkillStack) => void;
  onViewResults: () => void;
  onBack: () => void;
}

async function saveSkill(name: string, score: number, takenAt?: string) {
  const res = await fetch("/api/mypage_employee/haveSkills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      name,
      score: Number(score),
      takenAt: takenAt ?? new Date().toISOString(),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data; // { ok: true, data: { name, score, lastTested } }
}

export function AssessmentCompleted({
  selectedSkill,
  testAnswer,
  questionNumRef,
  skillResult,
  onSaved,
  onViewResults,
  onBack,
}: AssessmentCompletedProps) {
  const [score, setScore] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/mypage_employee/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill_id: SKILL_CATEGORIES[selectedSkill],
        user_answer: testAnswer,
        question_num: questionNumRef,
      }),
    })
      .then((res) => res.json())
      .then(async (api_response) => {
        if (cancelled) return;

        const top3 = Number(api_response?.data?.skill_level_top3);
        if (!Number.isFinite(top3)) {
          setError("유효한 점수를 받지 못했습니다.");
          setScore("0");
          return;
        }

        const rounded = Math.round(top3);
        setScore(String(rounded));

        // ✅ saveSkill 헬퍼 사용: 한 번만 저장
        if (!savedRef.current) {
          savedRef.current = true;
          try {
            setSaving(true);
            const saved = await saveSkill(selectedSkill, rounded);
            // 서버가 { ok, data: { name, score, lastTested } } 반환한다고 가정
            const item: SkillStack =
              saved?.data ?? {
                name: selectedSkill,
                score: rounded,
                lastTested: new Date().toISOString().slice(0, 10),
              };
            onSaved(item);
          } catch (e) {
            console.error("saveSkill 실패:", e);
            setError("결과 저장 중 오류가 발생했습니다.");
          } finally {
            setSaving(false);
          }
        }
      })
      .catch((e) => {
        if (cancelled) return;
        console.error("점수 계산 API 에러:", e);
        setError("점수 계산 중 오류가 발생했습니다.");
        setScore("0");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSkill, testAnswer, questionNumRef, onSaved]);

  return (
    <div className="space-y-6">
      <PageHeader title="검사 완료" onBack={onBack} />
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">{selectedSkill} 검사 완료!</h3>
          <div className="text-6xl font-bold text-primary mb-4">
            {loading ? "점수를 계산하는 중..." : `${score}점`}
          </div>
          <p className="text-muted-foreground mb-6">
            {loading
              ? "잠시만 기다려주세요. (งᐖ)ว"
              : saving
              ? "결과 저장 중…"
              : error
              ? error
              : "검사 결과가 저장되었습니다."}
          </p>
          <Button onClick={onViewResults} className="bg-primary hover:bg-primary/90">
            결과 확인하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import { useState, useRef, useEffect } from "react"
import { SkillSearch } from "./skill-assessment/skill-search"
import { AssessmentGuidelines } from "./skill-assessment/assessment-guidelines"
import { AssessmentTest } from "./skill-assessment/assessment-test"
import { AssessmentCompleted } from "./skill-assessment/assessment-completed"
import { SkillResults } from "./skill-assessment/skill-results"
import { generateRandomScore, getSkillCategoryFromName } from "@/lib/mypage_employee/skill-utils"
import { getCurrentDateString } from "@/lib/mypage_employee/date-utils"
import { SKILL_CATEGORIES } from "@/constants/mypage_employee/skills"
import type { SkillStack, AssessmentStep, SortOption } from "@/types/mypage_employee"
import { useApi } from "@/hooks/use-api"

// ...생략
export function SkillAssessment() {
  const questionNumRef = useRef<number>(Math.floor(Math.random() * 10) + 1).current;
  const [currentStep, setCurrentStep] = useState<AssessmentStep>("results");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [testAnswer, setTestAnswer] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [skillStacks, setSkillStacks] = useState<SkillStack[]>([]);

  type ApiResp = { ok: boolean; data: SkillStack[] };
  const { data: resp, loading, error, refetch } = useApi<ApiResp>("/api/mypage_employee/haveSkills");

  // 초기 주입 + results 화면일 때 변경분 동기화 (랜덤값 덮어쓰기 방지)
  useEffect(() => {
    if (resp?.data && currentStep === "results") {
      const safe = resp.data.map(s => ({
        ...s,
        lastTested: s.lastTested || new Date().toISOString().slice(0, 10),
      }));
      setSkillStacks(safe);
    }
  }, [resp, currentStep]);

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill);
    setCurrentStep("guidelines");
  };

  const handleStartTest = () => {
    setCurrentStep("test");
    setTestAnswer("");
  };

  // 랜덤 점수로 state를 덮어쓰지 않기
  const handleSubmitTest = () => {
    setCurrentStep("completed"); // 페이지 전환만
  };

  // completed에서 확정 점수 저장 후 부모 state 업데이트
  const handleSaved = (saved: SkillStack) => {
    setSkillStacks(prev => {
      const i = prev.findIndex(s => s.name === saved.name);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleStartNewAssessment = () => {
    setCurrentStep("skillSearch");
    setSearchQuery("");
  };

  const handleViewResults = async () => {
    await refetch(); // ✅ 서버 최신 동기화(선택)
    setCurrentStep("results");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "skillSearch":
        setCurrentStep("results"); break;
      case "guidelines":
        setCurrentStep("skillSearch"); break;
      case "test":
        setCurrentStep("guidelines"); break;
      case "completed":
        setCurrentStep("results"); break;
      default:
        setCurrentStep("results");
    }
  };

  switch (currentStep) {
    case "skillSearch":
      return (
        <SkillSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSkillSelect={handleSkillSelect}
          onBack={handleBack}
        />
      );
    case "guidelines":
      return (
        <AssessmentGuidelines
          selectedSkill={selectedSkill}
          onStartTest={handleStartTest}
          onBack={handleBack}
        />
      );
    case "test":
      return (
        <AssessmentTest
          selectedSkill={selectedSkill}
          testAnswer={testAnswer}
          questionNumRef={questionNumRef}
          onAnswerChange={setTestAnswer}
          onSubmit={handleSubmitTest}
          onBack={handleBack}
        />
      );
    case "completed":
      const newSkill = skillStacks.find((s) => s.name === selectedSkill);
      return (
        <AssessmentCompleted
          selectedSkill={selectedSkill}
          testAnswer={testAnswer}
          questionNumRef={questionNumRef}
          skillResult={newSkill}
          onSaved={handleSaved}
          onViewResults={handleViewResults}
          onBack={handleBack}
        />
      );
    default:
      return (
        <SkillResults
          skillStacks={skillStacks}
          sortBy={sortBy}
          filterCategory={filterCategory}
          onSortChange={setSortBy}
          onFilterChange={setFilterCategory}
          onStartNewAssessment={handleStartNewAssessment}
        />
      );
  }
}

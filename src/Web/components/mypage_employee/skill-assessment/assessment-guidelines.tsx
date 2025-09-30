"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/mypage_employee/common/page-header"

interface AssessmentGuidelinesProps {
  selectedSkill: string
  onStartTest: () => void
  onBack: () => void
}

export function AssessmentGuidelines({ selectedSkill, onStartTest, onBack }: AssessmentGuidelinesProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={`${selectedSkill} 검사 유의사항`} onBack={onBack} />

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">검사 시작 전 유의사항</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">진실된 답변</h4>
                  <p className="text-muted-foreground">외부 참고 없이 본인의 지식을 바탕으로 솔직하게 답변해주세요.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">정확한 설명</h4>
                  <p className="text-muted-foreground">장황한 답변이 아닌 키워드 중심으로 적어주세요.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">시간 제한</h4>
                  <p className="text-muted-foreground">검사 시간은 제한이 없으니 성심성의껏 적어주세요.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">점수 책정</h4>
                  <p className="text-muted-foreground">개발 단계로 인해 점수가 다소 부정확할 수 있습니다.</p>
                </div>
              </div>

            </div>

            <div className="text-center pt-6">
              <Button onClick={onStartTest} className="bg-primary hover:bg-primary/90 px-8">
                검사 시작하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

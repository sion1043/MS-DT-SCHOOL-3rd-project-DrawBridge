"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Goals() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>취업 목표</CardTitle>
          <CardDescription>취업 목표를 설정하고 진행 상황을 추적하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-position">희망 직무</Label>
              <Input id="target-position" defaultValue="풀스택 개발자" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-salary">희망 연봉</Label>
              <Input id="target-salary" defaultValue="6000만원" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-company">희망 기업 유형</Label>
            <Input id="target-company" defaultValue="대기업, 스타트업" />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">월간 목표</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>이력서 업데이트</span>
                <Badge className="bg-green-500 text-white">완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>포트폴리오 개선</span>
                <Badge className="bg-yellow-500 text-black">진행 중</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>기술 면접 준비</span>
                <Badge variant="secondary">예정</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

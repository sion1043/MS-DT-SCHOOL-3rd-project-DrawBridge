"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Lock } from "lucide-react"

interface Tier {
  name: string
  color: string
  minXP: number
  maxXP: number
  icon: string
}

interface ChallengesProps {
  tiers: Tier[]
  currentTier: Tier
  totalXP: number
  xpForNextLevel: number
  xpProgress: number
}

export function Challenges({ tiers, currentTier, totalXP, xpForNextLevel, xpProgress }: ChallengesProps) {
  if (!currentTier || !tiers || tiers.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p>도전과제를 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{currentTier.icon}</span>
            <span>현재 진행 상황 - {currentTier.name} 티어</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">현재 XP: {totalXP}</span>
              <Badge className="bg-primary text-black">{currentTier.name}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>다음 티어까지</span>
                <span>{xpForNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>도전과제</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiers.map((tier, index) => {
              const isUnlocked = totalXP >= tier.minXP
              const isCurrentTier = tier === currentTier

              return (
                <div
                  key={tier.name}
                  className={`p-4 border rounded-lg ${
                    isUnlocked ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{isUnlocked ? tier.icon || "🔒" : "🔒"}</span>
                      <div>
                        <h3 className={`font-semibold ${isUnlocked ? "" : "text-gray-400"}`}>{tier.name} 티어</h3>
                        <p className={`text-sm ${isUnlocked ? "text-muted-foreground" : "text-gray-400"}`}>
                          {tier.minXP} - {tier.maxXP === Number.POSITIVE_INFINITY ? "∞" : tier.maxXP} XP
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCurrentTier && <Badge className="bg-primary text-black">현재</Badge>}
                      {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>

                  {isUnlocked && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-sm">도전과제:</h4>
                      <div className="space-y-1">
                        {tier.name === "아이언" && (
                          <>
                            <div className="flex items-center space-x-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>첫 이력서 작성하기 (+50 XP)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>프로필 사진 설정하기 (+30 XP)</span>
                            </div>
                          </>
                        )}
                        {tier.name === "브론즈" && (
                          <>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>첫 지원하기 (+100 XP)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>관심 기업 5곳 추가하기 (+50 XP)</span>
                            </div>
                          </>
                        )}
                        {tier.name === "실버" && (
                          <>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>면접 3회 완료하기 (+150 XP)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>이력서 5회 업데이트하기 (+100 XP)</span>
                            </div>
                          </>
                        )}
                        {tier.name === "골드" && (
                          <>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>최종 면접 통과하기 (+200 XP)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="h-4 w-4 border-2 border-primary rounded-sm" />
                              <span>포트폴리오 완성하기 (+150 XP)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

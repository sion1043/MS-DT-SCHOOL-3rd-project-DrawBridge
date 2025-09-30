"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, ArrowRight, Briefcase, CheckCircle } from "lucide-react"

export function AIRecommendationBanner() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setShowResults(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const mockRecommendations = [
    { position: "Senior Frontend Developer", match: 92, company: "토스" },
    { position: "React Developer", match: 88, company: "당근마켓" },
    { position: "Full Stack Engineer", match: 85, company: "컬리" },
  ]

  return (
    <>
      <Card
        className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/5 border-primary/20 overflow-hidden relative cursor-pointer transition-all hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity ${isHovered ? "opacity-100" : "opacity-50"}`}
        />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 transition-transform ${isHovered ? "scale-110" : "scale-100"}`}
            >
              <Sparkles className={`h-6 w-6 text-primary transition-all ${isHovered ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">AI 맞춤 포지션 추천</h3>
              <p className="text-muted-foreground">당신의 스킬과 경험을 분석한 개인화 추천</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">회원님을 위한 맞춤 분석</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    현재 트렌드와 당신의 프로필을 매칭하여 최적의 포지션을 찾아드립니다
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      분석중...
                    </>
                  ) : (
                    <>
                      분석 시작하기
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>프로필 분석 중...</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">* 점핏의 AI 추천 시스템과 연동됩니다</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI 추천 결과
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold">분석이 완료되었습니다!</p>
              <p className="text-sm text-muted-foreground">당신에게 맞는 포지션을 찾았어요</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">추천 포지션</h4>
              {mockRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <h5 className="font-medium">{rec.position}</h5>
                    <p className="text-sm text-muted-foreground">{rec.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{rec.match}%</div>
                    <div className="text-xs text-muted-foreground">매치율</div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={() => setShowResults(false)}>
              <Briefcase className="h-4 w-4 mr-2" />
              상세 분석 보기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, ArrowLeft, Eye, EyeOff, Briefcase } from "lucide-react"


export default function SignupPage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "jobseeker"
  const router = useRouter() // 회원가입용 라우터

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false) // 회원가입용 로딩 상태
  const [error, setError] = useState<string | null>(null) // 회원가입용 에러 상태

  // 회원가입용 응답 처리
  async function handleResponse(res: Response) {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) {
        if (data?.error === "EMAIL_IN_USE") setError("이미 사용 중인 이메일입니다.")
        else if (data?.error === "BIZ_REG_NO_IN_USE") setError("이미 사용 중인 사업자등록번호입니다.")
        else setError("중복된 정보가 있습니다.")
      } else {
        setError("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
      return
    }
    // 성공
    router.replace("/")
    router.refresh()
  }

  // 회원가입용 구직자 정보 제출
  async function onSubmitJobSeeker(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const name = String(fd.get("name") || "")
      const email = String(fd.get("email") || "")
      const phone = String(fd.get("phone") || "")
      const password = String(fd.get("password") || "")
      const confirmPassword = String(fd.get("confirmPassword") || "")
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.")
        return
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "jobseeker", name, email, phone, password }),
      })
      await handleResponse(res)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmitCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const companyName = String(fd.get("companyName") || "")
      const bizRegNo = String(fd.get("bizRegNo") || "")
      const managerName = String(fd.get("managerName") || "")
      const managerEmail = String(fd.get("managerEmail") || "")
      const managerPhone = String(fd.get("managerPhone") || "")
      const password = String(fd.get("password") || "")
      const confirmPassword = String(fd.get("confirmPassword") || "")
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.")
        return
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "company", companyName, bizRegNo, managerName, managerEmail, managerPhone, password }),
      })
      await handleResponse(res)
    } finally {
      setLoading(false)
    }
  }    

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F4B819] to-[#E6A617] flex items-center justify-center shadow-lg">
            <Image src="/logo_white.png" alt="Logo" width={50} height={50} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">DrawBridge</h1>
          <p className="text-muted-foreground text-sm">당신의 커리어를 연결하는 플랫폼</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          홈으로 돌아가기
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">회원가입</CardTitle>
            <CardDescription className="text-muted-foreground">DrawBridge에 오신 것을 환영합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={userType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>구직자</span>
                </TabsTrigger>
                <TabsTrigger value="employer" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>기업</span>
                </TabsTrigger>
              </TabsList>

              {/* 구직자 */}
              <TabsContent value="jobseeker">
                <form className="space-y-4" onSubmit={onSubmitJobSeeker}>
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" name="name" placeholder="홍길동" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" name="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="010-1234-5678" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="8자 이상 입력해주세요"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력해주세요"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 에러 메시지 */}
                  {error && <div className="text-red-500">{error}</div>}

                  <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    {loading ? "가입 중..." : "구직자로 가입하기"}
                  </Button>
                </form>
              </TabsContent>

              {/* 기업 */}
              <TabsContent value="employer">
                <form className="space-y-4" onSubmit={onSubmitCompany}>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">회사명</Label>
                    <Input id="companyName" name="companyName" placeholder="(주)테크컴퍼니" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessNumber">사업자등록번호</Label>
                    <Input id="businessNumber" name="bizRegNo" placeholder="123-45-67890" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerName">담당자명</Label>
                    <Input id="managerName" name="managerName" placeholder="김담당" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerEmail">담당자 이메일</Label>
                    <Input id="managerEmail" name="managerEmail" type="email" placeholder="manager@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerPhone">담당자 연락처</Label>
                    <Input id="managerPhone" name="managerPhone" type="tel" placeholder="010-1234-5678" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerPassword">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="employerPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="8자 이상 입력해주세요"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerConfirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="employerConfirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력해주세요"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* 에러 메시지 */}
                  {error && <div className="text-red-500">{error}</div>}

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading ? "가입 중..." : "기업으로 가입하기"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/main_login" className="text-primary hover:underline">
                  로그인하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

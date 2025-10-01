"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, ArrowLeft, Eye, EyeOff, Briefcase } from "lucide-react"


type Role = "jobseeker" | "company"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Role>("jobseeker")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formErrors, setFormErrors] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 로그인 확인용
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setFormErrors(null)
    setFieldErrors({})

    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: activeTab }),
    })

    if (res.status === 422) {
      const data = await res.json()
      const fe: Record<string, string> = {}
      Object.entries<string[]>(data.fieldErrors || {}).forEach(([k, v]) =>(
        fe[k] = v?.[0] ?? ""
      ))
      setFieldErrors(fe)
    } else if (res.status === 403) {
      setFormErrors(
        activeTab === "jobseeker"
        ? "기업 계정으로 접속할 수 없습니다."
        : "구직자 계정으로 접속할 수 없습니다."
      )
    } else if (res.status === 401) {
      setFormErrors("이메일 또는 비밀번호가 일치하지 않습니다.")
    } else if (!res.ok) {
      setFormErrors("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } else {
      router.replace("/")
      router.refresh();
    }
    setLoading(false)
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
            <CardTitle className="text-2xl text-foreground">로그인</CardTitle>
            <CardDescription className="text-muted-foreground">계정에 로그인하여 서비스를 이용하세요</CardDescription>
          </CardHeader>
          <CardContent>

            {/* 기존에는 defaultvalue="jobseeker" */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Role)} className="w-full">

              {/* 로그인 구분 */}
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>구직자</span>
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>기업</span>
                </TabsTrigger>
              </TabsList>

              {/* 구직자 로그인 */}
              <TabsContent value="jobseeker">
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="jobseekerEmail">이메일</Label>
                    <Input id="jobseekerEmail" name="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobseekerPassword">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="jobseekerPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력해주세요"
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
                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>

                  {/* 에러 확인 */}
                  {formErrors && (
                    <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                  )}

                  <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    {loading ? "로그인 중..." : "구직자 로그인"}
                  </Button>
                </form>
              </TabsContent>

              {/* 기업 로그인 */}
              <TabsContent value="company">
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="employerEmail">담당자 이메일</Label>
                    <Input id="employerEmail" name="email" type="email" placeholder="manager@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerPassword">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="employerPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력해주세요"
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
                  <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>

                  {/* 에러 확인 */}
                  {formErrors && (
                    <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                  )}

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading ? "로그인 중..." : "기업 로그인"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                아직 계정이 없으신가요?{" "}
                <Link href="/main_signup" className="text-primary hover:underline">
                  회원가입하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
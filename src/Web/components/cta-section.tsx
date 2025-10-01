import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, UserCheck, Bell, Star, Target, Users, TrendingUp } from "lucide-react"

export function legacy_CTASection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="min-h-screen bg-background">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful matches between talented professionals and forward-thinking companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* For Companies */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:bg-card/80 border-2 hover:border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Looking for a job seeker if it's a company!</h3>
              <p className="text-muted-foreground mb-6">
                Post your job openings and connect with qualified candidates. Our advanced matching system helps you
                find the perfect fit for your team.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary" />
                  <span>Access to 50K+ qualified candidates</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary" />
                  <span>Advanced filtering and matching</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-primary" />
                  <span>Dedicated account manager</span>
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/company_job">Post a Job</Link>
              </Button>
            </CardContent>
          </Card>

          {/* For Job Seekers */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:bg-card/80 border-2 hover:border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                <UserCheck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Looking for a job seeker if it's a job seeker!
              </h3>
              <p className="text-muted-foreground mb-6">
                Discover your next career opportunity with our personalized job recommendations and career guidance from
                industry experts.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Bell className="w-4 h-4 text-secondary" />
                  <span>Personalized job alerts</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Bell className="w-4 h-4 text-secondary" />
                  <span>Career coaching and resume tips</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Bell className="w-4 h-4 text-secondary" />
                  <span>Direct employer connections</span>
                </div>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Find Jobs</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}


export function CTASection() {
  return (
    <section className="py-16 bg-muted/50">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            채용과 구직을 위한
            <span className="text-primary"> 스마트 플랫폼</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            기업은 효율적인 채용 관리를, 구직자는 맞춤형 커리어 로드맵을 제공받으세요
          </p>

          {/* User Type Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Employers */}
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">구직자 회원</CardTitle>
                <CardDescription className="text-muted-foreground">커리어 로드맵과 맞춤형 공고 추천</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>개인 맞춤 커리어 로드맵</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  <span>스킬 기반 공고 추천</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>이력서 및 포트폴리오 관리</span>
                </div>
                <Link href="/main_signup?type=jobseeker" className="block pt-4">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    구직자 회원가입
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Job Seekers */}
            <Card className="border-2 hover:border-secondary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl text-foreground">기업 회원</CardTitle>
                <CardDescription className="text-muted-foreground">채용 공고 관리와 지원자 이력 분석</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-secondary" />
                  <span>채용 공고 작성 및 관리</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-secondary" />
                  <span>지원자 이력 및 스킬 분석</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 text-secondary" />
                  <span>채용 프로세스 최적화</span>
                </div>
                <Link href="/main_signup?type=employer" className="block pt-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    기업 회원가입
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground mb-4">이미 계정이 있으신가요?</p>
            <Link href="/main_login">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                로그인하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

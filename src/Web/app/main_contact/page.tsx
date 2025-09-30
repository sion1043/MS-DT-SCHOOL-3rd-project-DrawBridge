"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("문의가 성공적으로 전송되었습니다!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {/* bg-primary text-primary-foreground  */}
      <section className="py-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Get in Touch</h1>
          <p className="text-xl md:text-2xl mb-8 text-balance max-w-3xl mx-auto opacity-90">
            궁금한 점이 있으시거나 파트너십과 제휴를 원하신다면 언제든 연락주세요
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">문의하기</CardTitle>
                <CardDescription>아래 양식을 작성해 주시면 빠른 시일 내에 답변드리겠습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="홍길동"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="hong@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">회사명</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="회사명 (선택사항)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">메시지 *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="문의 내용을 자세히 적어주세요..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    문의 보내기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">연락처 정보</h2>
              <p className="text-lg text-muted-foreground mb-8">다양한 방법으로 저희와 소통하실 수 있습니다.</p>
            </div>

            <div className="space-y-6">
              <Card className="bg-secondary">
                <CardContent className="pt-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">이메일</h3>
                      <p className="text-secondary-foreground">contact@drawbridge.co.kr</p>
                      <p className="text-sm text-muted-foreground mt-1">일반 문의 및 파트너십 관련</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardContent className="pt-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">전화</h3>
                      <p className="text-secondary-foreground">02-1234-5678</p>
                      <p className="text-sm text-muted-foreground mt-1">평일 09:00 - 18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardContent className="pt-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">주소</h3>
                      <p className="text-secondary-foreground">
                        서울특별시 강남구 테헤란로 123
                        <br />
                        드로우브릿지 빌딩 10층
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardContent className="pt-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">운영시간</h3>
                      <div className="text-secondary-foreground space-y-1">
                        <p>평일: 09:00 - 18:00</p>
                        <p>토요일: 10:00 - 15:00</p>
                        <p>일요일 및 공휴일: 휴무</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">서비스 이용료가 있나요?</h4>
                  <p className="text-sm text-muted-foreground">
                    구직자는 무료로 이용 가능하며, 기업은 프리미엄 플랜을 통해 추가 기능을 이용할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">어떤 채용 사이트와 연동되나요?</h4>
                  <p className="text-sm text-muted-foreground">
                    현재 사람인과 점핏과 연동되어 있으며, 향후 더 많은 플랫폼과 연동 예정입니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">개인정보는 안전한가요?</h4>
                  <p className="text-sm text-muted-foreground">
                    모든 개인정보는 암호화되어 저장되며, 관련 법규를 준수하여 안전하게 관리됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold text-primary mb-4">Drawbridge</div>
          <p className="text-card-foreground/80">더 나은 채용 문화를 만들어가는 연결고리</p>
        </div>
      </footer>
    </div>
  )
}

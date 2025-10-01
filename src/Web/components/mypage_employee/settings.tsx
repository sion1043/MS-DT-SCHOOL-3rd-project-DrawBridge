"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Eye, Shield } from "lucide-react"

interface SettingsProps {
  notifications: boolean
  setNotifications: (value: boolean) => void
  privacy: boolean
  setPrivacy: (value: boolean) => void
}

export function Settings({ notifications, setNotifications, privacy, setPrivacy }: SettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>계정 설정</CardTitle>
          <CardDescription>계정 정보와 보안 설정을 관리하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" defaultValue="김사용자" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" defaultValue="kim.user@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">소개</Label>
            <Input id="bio" defaultValue="웹 개발자" />
          </div>
          <Button>변경사항 저장</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>받고 싶은 알림을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="notifications">푸시 알림</Label>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <Label htmlFor="privacy">프로필 공개</Label>
            </div>
            <Switch id="privacy" checked={privacy} onCheckedChange={setPrivacy} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>보안</CardTitle>
          <CardDescription>계정 보안을 강화하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Shield className="mr-2 h-4 w-4" />
            비밀번호 변경
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Shield className="mr-2 h-4 w-4" />
            2단계 인증 설정
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

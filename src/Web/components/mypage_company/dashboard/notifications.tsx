"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, MessageSquare, Calendar, Users, FileText, Settings } from "lucide-react"
import { useState } from "react"

export function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    statusUpdates: false,
    weeklyReports: true,
    systemUpdates: false,
  })

  const [pushNotifications, setPushNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    statusUpdates: true,
    urgentUpdates: true,
  })

  const [notificationFrequency, setNotificationFrequency] = useState("immediate")

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>알림 설정</CardTitle>
          </div>
          <CardDescription>채용 관련 알림을 받을 방법과 빈도를 설정하세요</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              이메일 알림
            </CardTitle>
            <CardDescription>이메일로 받을 알림을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">새로운 지원서</p>
                <p className="text-sm text-muted-foreground">새 지원자가 있을 때 알림</p>
              </div>
              <Switch
                checked={emailNotifications.newApplications}
                onCheckedChange={() => handleEmailToggle("newApplications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">면접 일정 알림</p>
                <p className="text-sm text-muted-foreground">면접 1시간 전 리마인더</p>
              </div>
              <Switch
                checked={emailNotifications.interviewReminders}
                onCheckedChange={() => handleEmailToggle("interviewReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">지원자 상태 변경</p>
                <p className="text-sm text-muted-foreground">지원자 상태가 변경될 때</p>
              </div>
              <Switch
                checked={emailNotifications.statusUpdates}
                onCheckedChange={() => handleEmailToggle("statusUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">주간 리포트</p>
                <p className="text-sm text-muted-foreground">매주 채용 현황 요약</p>
              </div>
              <Switch
                checked={emailNotifications.weeklyReports}
                onCheckedChange={() => handleEmailToggle("weeklyReports")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">시스템 업데이트</p>
                <p className="text-sm text-muted-foreground">새로운 기능 및 업데이트 소식</p>
              </div>
              <Switch
                checked={emailNotifications.systemUpdates}
                onCheckedChange={() => handleEmailToggle("systemUpdates")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              푸시 알림
            </CardTitle>
            <CardDescription>브라우저 푸시 알림 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">새로운 지원서</p>
                <p className="text-sm text-muted-foreground">즉시 알림 받기</p>
              </div>
              <Switch
                checked={pushNotifications.newApplications}
                onCheckedChange={() => handlePushToggle("newApplications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">면접 일정 알림</p>
                <p className="text-sm text-muted-foreground">면접 시간 리마인더</p>
              </div>
              <Switch
                checked={pushNotifications.interviewReminders}
                onCheckedChange={() => handlePushToggle("interviewReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">상태 업데이트</p>
                <p className="text-sm text-muted-foreground">지원자 상태 변경 알림</p>
              </div>
              <Switch
                checked={pushNotifications.statusUpdates}
                onCheckedChange={() => handlePushToggle("statusUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">긴급 알림</p>
                <p className="text-sm text-muted-foreground">중요한 업데이트만</p>
              </div>
              <Switch
                checked={pushNotifications.urgentUpdates}
                onCheckedChange={() => handlePushToggle("urgentUpdates")}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            알림 빈도 설정
          </CardTitle>
          <CardDescription>알림을 받을 빈도를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">알림 빈도</p>
              <p className="text-sm text-muted-foreground">알림을 받을 주기를 설정하세요</p>
            </div>
            <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">즉시</SelectItem>
                <SelectItem value="hourly">1시간마다</SelectItem>
                <SelectItem value="daily">하루에 한 번</SelectItem>
                <SelectItem value="weekly">일주일에 한 번</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            최근 알림 내역
          </CardTitle>
          <CardDescription>최근 7일간 받은 알림 내역</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">새로운 지원서 도착</p>
                <p className="text-sm text-muted-foreground">김민수님이 프론트엔드 개발자 포지션에 지원했습니다</p>
                <p className="text-xs text-muted-foreground mt-1">2시간 전</p>
              </div>
              <Badge variant="secondary">이메일</Badge>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">면접 일정 리마인더</p>
                <p className="text-sm text-muted-foreground">이지영님과의 면접이 1시간 후 시작됩니다</p>
                <p className="text-xs text-muted-foreground mt-1">1시간 전</p>
              </div>
              <Badge variant="secondary">푸시</Badge>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">주간 리포트</p>
                <p className="text-sm text-muted-foreground">이번 주 채용 현황 요약 리포트가 준비되었습니다</p>
                <p className="text-xs text-muted-foreground mt-1">1일 전</p>
              </div>
              <Badge variant="secondary">이메일</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">초기화</Button>
        <Button className="bg-[#F4B819] text-black hover:bg-[#F4B819]/90">설정 저장</Button>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, MessageSquare, Calendar, Users, FileText } from "lucide-react"
import { useState } from "react"

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    newApplication: { email: true, push: true, sms: false },
    interviewReminder: { email: true, push: true, sms: true },
    applicationStatus: { email: true, push: false, sms: false },
    jobExpiry: { email: true, push: true, sms: false },
    weeklyReport: { email: true, push: false, sms: false },
    systemUpdates: { email: false, push: true, sms: false },
  })

  const updateNotification = (type: string, method: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [method]: value,
      },
    }))
  }

  const notificationTypes = [
    {
      key: "newApplication",
      icon: <Users className="h-4 w-4" />,
      title: "새로운 지원자",
      description: "새로운 지원서가 접수되었을 때",
      priority: "high",
    },
    {
      key: "interviewReminder",
      icon: <Calendar className="h-4 w-4" />,
      title: "면접 일정 알림",
      description: "면접 30분 전 미리 알림",
      priority: "high",
    },
    {
      key: "applicationStatus",
      icon: <FileText className="h-4 w-4" />,
      title: "지원 상태 변경",
      description: "지원자의 상태가 변경되었을 때",
      priority: "medium",
    },
    {
      key: "jobExpiry",
      icon: <Bell className="h-4 w-4" />,
      title: "공고 만료 알림",
      description: "채용 공고 만료 3일 전",
      priority: "medium",
    },
    {
      key: "weeklyReport",
      icon: <FileText className="h-4 w-4" />,
      title: "주간 리포트",
      description: "매주 월요일 채용 현황 요약",
      priority: "low",
    },
    {
      key: "systemUpdates",
      icon: <Bell className="h-4 w-4" />,
      title: "시스템 업데이트",
      description: "새로운 기능 및 시스템 공지사항",
      priority: "low",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, text: "중요" },
      medium: { variant: "default" as const, text: "보통" },
      low: { variant: "secondary" as const, text: "낮음" },
    }
    const config = variants[priority as keyof typeof variants] || variants.medium
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 설정
          </CardTitle>
          <CardDescription>원하는 알림 방식을 선택하여 중요한 채용 정보를 놓치지 마세요</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium">이메일</span>
            </div>
            <p className="text-sm text-muted-foreground">상세한 정보와 함께 이메일로 알림을 받습니다</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-green-600" />
              <span className="font-medium">푸시 알림</span>
            </div>
            <p className="text-sm text-muted-foreground">브라우저나 앱에서 즉시 알림을 받습니다</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <span className="font-medium">SMS</span>
            </div>
            <p className="text-sm text-muted-foreground">긴급한 알림을 문자 메시지로 받습니다</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>알림 유형별 설정</CardTitle>
          <CardDescription>각 알림 유형에 대해 원하는 방식을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type, index) => (
            <div key={type.key}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{type.icon}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{type.title}</Label>
                      {getPriorityBadge(type.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 ml-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-blue-600" />
                    <span className="text-sm">이메일</span>
                  </div>
                  <Switch
                    checked={notifications[type.key as keyof typeof notifications].email}
                    onCheckedChange={(checked) => updateNotification(type.key, "email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-3 w-3 text-green-600" />
                    <span className="text-sm">푸시</span>
                  </div>
                  <Switch
                    checked={notifications[type.key as keyof typeof notifications].push}
                    onCheckedChange={(checked) => updateNotification(type.key, "push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3 w-3 text-purple-600" />
                    <span className="text-sm">SMS</span>
                  </div>
                  <Switch
                    checked={notifications[type.key as keyof typeof notifications].sms}
                    onCheckedChange={(checked) => updateNotification(type.key, "sms", checked)}
                  />
                </div>
              </div>

              {index < notificationTypes.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 시간 설정</CardTitle>
          <CardDescription>알림을 받을 시간대를 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>업무 시간에만 알림 받기</Label>
              <p className="text-sm text-muted-foreground">평일 오전 9시 ~ 오후 6시에만 알림을 받습니다</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>주말 알림</Label>
              <p className="text-sm text-muted-foreground">주말에도 긴급 알림을 받습니다</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

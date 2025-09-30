"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Calendar, FileText } from "lucide-react"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>받고 싶은 알림을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="job-notifications">새로운 채용공고 알림</Label>
            </div>
            <Switch id="job-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <Label htmlFor="interview-notifications">면접 일정 알림</Label>
            </div>
            <Switch id="interview-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <Label htmlFor="application-notifications">지원 결과 알림</Label>
            </div>
            <Switch id="application-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

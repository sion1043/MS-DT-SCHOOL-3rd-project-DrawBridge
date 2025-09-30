"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SettingsIcon,
  Shield,
  Users,
  Bell,
  Trash2,
  Building,
  Globe,
  Key,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { useState } from "react"

export function Settings() {
  const [settings, setSettings] = useState({
    companyName: "테크 이노베이션",
    adminEmail: "admin@techinnovation.co.kr",
    companyPhone: "02-1234-5678",
    companyAddress: "서울시 강남구 테헤란로 123",
    website: "https://techinnovation.co.kr",
    description: "혁신적인 기술로 미래를 만들어가는 IT 기업입니다.",
    autoReply: true,
    emailNotifications: true,
    smsNotifications: false,
    publicProfile: true,
    allowDirectContact: true,
    dataRetention: "2years",
    backupFrequency: "daily",
    timezone: "Asia/Seoul",
    language: "ko",
    theme: "light",
  })

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings)
    // 실제 저장 로직 구현
  }

  const handlePasswordChange = () => {
    console.log("Changing password:", passwordForm)
    setIsPasswordDialogOpen(false)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleExportData = () => {
    console.log("Exporting data...")
    // 데이터 내보내기 로직
  }

  const handleImportData = () => {
    console.log("Importing data...")
    // 데이터 가져오기 로직
  }

  const handleDeleteAccount = () => {
    console.log("Deleting account...")
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            시스템 설정
          </CardTitle>
          <CardDescription>회사 정보와 시스템 설정을 관리하세요</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            회사 정보
          </TabsTrigger>
          <TabsTrigger value="recruitment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            채용 설정
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            보안 설정
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            시스템
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>회사의 기본 정보를 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">회사명</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">관리자 이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">대표 전화</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyPhone"
                      value={settings.companyPhone}
                      onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">회사 주소</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="회사에 대한 간단한 소개를 입력하세요"
                  rows={4}
                />
              </div>
              <Button onClick={handleSaveSettings} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                변경사항 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>채용 프로세스 설정</CardTitle>
              <CardDescription>채용 관련 자동화 및 설정을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>자동 답장</Label>
                  <p className="text-sm text-muted-foreground">지원자에게 자동으로 접수 확인 메일을 발송합니다</p>
                </div>
                <Switch
                  checked={settings.autoReply}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoReply: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>공개 프로필</Label>
                  <p className="text-sm text-muted-foreground">구직자가 회사 프로필을 볼 수 있도록 허용합니다</p>
                </div>
                <Switch
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => setSettings({ ...settings, publicProfile: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>직접 연락 허용</Label>
                  <p className="text-sm text-muted-foreground">구직자가 회사에 직접 연락할 수 있도록 허용합니다</p>
                </div>
                <Switch
                  checked={settings.allowDirectContact}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowDirectContact: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>데이터 보관 기간</Label>
                <Select
                  value={settings.dataRetention}
                  onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1년</SelectItem>
                    <SelectItem value="2years">2년</SelectItem>
                    <SelectItem value="3years">3년</SelectItem>
                    <SelectItem value="5years">5년</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">지원자 데이터를 보관할 기간을 설정합니다</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>다양한 알림 방식을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">새로운 지원자, 면접 일정 등을 이메일로 알려드립니다</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>SMS 알림</Label>
                  <p className="text-sm text-muted-foreground">긴급한 알림을 SMS로 받아보세요</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>알림 시간대</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Seoul">한국 표준시 (KST)</SelectItem>
                    <SelectItem value="America/New_York">동부 표준시 (EST)</SelectItem>
                    <SelectItem value="Europe/London">그리니치 표준시 (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">일본 표준시 (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">상세 알림 설정</h4>
                <p className="text-sm text-blue-700 mb-3">
                  더 세부적인 알림 설정은 알림 설정 페이지에서 관리할 수 있습니다.
                </p>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 bg-transparent">
                  상세 설정으로 이동
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>계정 보안을 강화하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>비밀번호 변경</Label>
                  <p className="text-sm text-muted-foreground">정기적으로 비밀번호를 변경하세요</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">마지막 변경: 2024년 1월 15일</span>
                  </div>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      변경
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>비밀번호 변경</DialogTitle>
                      <DialogDescription>새로운 비밀번호를 입력하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">현재 비밀번호</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">새 비밀번호</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        취소
                      </Button>
                      <Button onClick={handlePasswordChange} className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">
                        변경
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>2단계 인증</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">추가 보안을 위해 2단계 인증을 설정하세요</p>
                    <Badge variant="destructive">미설정</Badge>
                  </div>
                </div>
                <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      설정
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>2단계 인증 설정</DialogTitle>
                      <DialogDescription>계정 보안을 강화하기 위해 2단계 인증을 설정합니다</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">설정 방법</h4>
                        <ol className="text-sm text-blue-700 space-y-1">
                          <li>1. 인증 앱(Google Authenticator, Authy 등)을 설치하세요</li>
                          <li>2. 아래 QR 코드를 스캔하거나 키를 입력하세요</li>
                          <li>3. 앱에서 생성된 6자리 코드를 입력하세요</li>
                        </ol>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                          QR 코드
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">또는 수동으로 입력:</p>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">ABCD EFGH IJKL MNOP</code>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">인증 코드</Label>
                        <Input id="verificationCode" placeholder="6자리 코드 입력" maxLength={6} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIs2FADialogOpen(false)}>
                        취소
                      </Button>
                      <Button className="bg-[#F4B819] hover:bg-[#F4B819]/90 text-black">인증 설정</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>로그인 기록</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">현재 세션</p>
                        <p className="text-xs text-muted-foreground">Chrome, Windows • 서울, 대한민국</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">지금</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">이전 로그인</p>
                        <p className="text-xs text-muted-foreground">Safari, macOS • 서울, 대한민국</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2시간 전</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
              <CardDescription>언어, 테마 및 데이터 관리 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>언어</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>테마</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">라이트</SelectItem>
                      <SelectItem value="dark">다크</SelectItem>
                      <SelectItem value="system">시스템 설정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>백업 주기</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                    <SelectItem value="monthly">매월</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">데이터 자동 백업 주기를 설정합니다</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>데이터 관리</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    데이터 내보내기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportData}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Upload className="h-4 w-4" />
                    데이터 가져오기
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  모든 채용 데이터를 CSV 또는 JSON 형식으로 내보내거나 가져올 수 있습니다
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                위험 구역
              </CardTitle>
              <CardDescription>신중하게 진행하세요. 이 작업들은 되돌릴 수 없습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>계정 삭제</Label>
                  <p className="text-sm text-muted-foreground">모든 데이터가 영구적으로 삭제됩니다</p>
                </div>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      계정 삭제
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>계정 삭제 확인</DialogTitle>
                      <DialogDescription>
                        이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-900 mb-2">삭제될 데이터:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• 모든 채용 공고</li>
                          <li>• 지원자 정보 및 이력서</li>
                          <li>• 면접 일정 및 기록</li>
                          <li>• 회사 프로필 및 설정</li>
                          <li>• 분석 데이터 및 리포트</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmDelete">확인을 위해 회사명을 입력하세요</Label>
                        <Input id="confirmDelete" placeholder={settings.companyName} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        취소
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        영구 삭제
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

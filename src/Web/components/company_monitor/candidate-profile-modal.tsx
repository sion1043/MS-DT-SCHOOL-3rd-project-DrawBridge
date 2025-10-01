"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  History,
  Award,
  BookOpen,
  Briefcase,
  User
} from "lucide-react"
import type { Candidate } from "@/types/company_monitor/candidate"

interface CandidateProfileModalProps {
  candidate: Candidate
  isOpen: boolean
  onClose: () => void
}

function score(candidate: Candidate) {
  const c: string[] = candidate.skills_current || []
  const cl: number[] = (candidate.skfn_current || []).map(Number)
  const p: string[] = candidate.skills_past || []
  const pl: number[] = (candidate.skfn_past || []).map(Number)
  const pm = new Map<string, number>();
  for (let i = 0; i < p.length; i++) pm.set(p[i], Number(pl[i] ?? 0));

  const o: Record<string, { techStack: string; curLevel: number; growth: number }> = {};
  for (let i = 0; i < c.length; i++) {
    const n = c[i];
    if (!n) continue;
    const cur = Number(cl[i] ?? 0);
    const g = pm.size ? (pm.has(n) ? cur - (pm.get(n) as number) : 0) : 0;
    o[n] = { techStack: n, curLevel: cur, growth: g }; // 같은 스킬명은 마지막 값으로 덮어씀
  }

  const sorted = Object.values(o).sort(
    (a, b) => (b.growth - a.growth) || a.techStack.localeCompare(b.techStack)
  );
  const maxCount = Math.min(sorted.length, 100)
  const sum = sorted.reduce((acc, { growth }) => acc + growth, 0);
  const avg = Math.round((sum * 100 / maxCount)) / 100;
  return avg
}

export function CandidateProfileModal({ candidate, isOpen, onClose }: CandidateProfileModalProps) {
  const skills = candidate.skills_current || candidate.skills_past || []
  console.log("data", "candidate-profile-modal", candidate)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>지원자 프로필</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={candidate.avatar || candidate.photo || "/placeholder-user.jpg"} alt={candidate.employee_name} />
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{candidate.employee_name}</h2>
                  <p className="text-lg text-gray-600 mt-1">{candidate.job_category_kor}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {candidate.education}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {candidate.career}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {candidate.age + "세 " + candidate.gender}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {candidate.employee_name.toLowerCase().replace(" ", ".")}@email.com
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  010-XXXX-XXXX
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Proficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                기술 스택 및 숙련도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.map((skill) => {
                  const proficiency = candidate.skillProficiency?.find((p) => p.skill === skill)
                  return (
                    <div key={skill} className="flex items-center justify-between p-0 bg-gray-50 rounded-lg">
                      <Badge variant="secondary">{skill}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  학력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{candidate.education || "서울대학교"}</p>
                  <p className="text-sm text-gray-600">컴퓨터공학과</p>
                  <p className="text-sm text-gray-600">2018 - 2022</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  경력 개선도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">{score(candidate) || 0}%</span>
                  <span className="text-sm text-gray-600">향상</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">마지막 지원서 수정 대비</p>
              </CardContent>
            </Card>
          </div>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>링크</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Globe className="h-4 w-4" />
                  Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

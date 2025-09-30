import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Clock, DollarSign, Bookmark } from "lucide-react"

const jobListings = [
  {
    id: 1,
    title: "시니어 프론트엔드 개발자",
    company: "테크스타트업",
    location: "서울 강남구",
    salary: "5000-7000만원",
    type: "정규직",
    skills: ["React", "TypeScript", "Next.js"],
    postedAt: "2일 전",
    isBookmarked: false,
  },
  {
    id: 2,
    title: "백엔드 개발자 (Node.js)",
    company: "글로벌IT",
    location: "서울 서초구",
    salary: "4500-6000만원",
    type: "정규직",
    skills: ["Node.js", "MongoDB", "AWS"],
    postedAt: "1일 전",
    isBookmarked: true,
  },
  {
    id: 3,
    title: "UX/UI 디자이너",
    company: "디자인에이전시",
    location: "서울 홍대",
    salary: "3500-5000만원",
    type: "계약직",
    skills: ["Figma", "Sketch", "Prototyping"],
    postedAt: "3일 전",
    isBookmarked: false,
  },
  {
    id: 4,
    title: "데이터 사이언티스트",
    company: "AI스타트업",
    location: "경기 판교",
    salary: "6000-8000만원",
    type: "정규직",
    skills: ["Python", "TensorFlow", "SQL"],
    postedAt: "1일 전",
    isBookmarked: false,
  },
  {
    id: 5,
    title: "마케팅 매니저",
    company: "이커머스",
    location: "서울 마포구",
    salary: "4000-5500만원",
    type: "정규직",
    skills: ["디지털마케팅", "GA", "Facebook Ads"],
    postedAt: "4일 전",
    isBookmarked: true,
  },
  {
    id: 6,
    title: "DevOps 엔지니어",
    company: "클라우드서비스",
    location: "서울 여의도",
    salary: "5500-7500만원",
    type: "정규직",
    skills: ["Docker", "Kubernetes", "Jenkins"],
    postedAt: "2일 전",
    isBookmarked: false,
  },
]

export function JobListings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>추천 채용정보</CardTitle>
        <Button variant="outline" size="sm">
          전체보기
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobListings.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-balance">{job.title}</h3>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Bookmark className={`h-4 w-4 ${job.isBookmarked ? "fill-current text-primary" : ""}`} />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{job.type}</Badge>
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {job.postedAt}
                  </div>
                  <Button size="sm">지원하기</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

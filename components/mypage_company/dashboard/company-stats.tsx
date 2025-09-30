import { Card, CardContent } from "@/components/ui/card"
import { FileText, Calendar, Heart } from "lucide-react"

interface Stats {
  totalJobs: number
  scheduledInterviews: number
  bookmarkedCandidates: number
}

interface CompanyStatsProps {
  stats: Stats
}

export function CompanyStats({ stats }: CompanyStatsProps) {
  const statItems = [
    {
      label: "등록한 공고",
      value: stats.totalJobs,
      icon: FileText,
    },
    {
      label: "면접 예정",
      value: stats.scheduledInterviews,
      icon: Calendar,
    },
    {
      label: "관심 인재",
      value: stats.bookmarkedCandidates,
      icon: Heart,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index} className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Icon className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

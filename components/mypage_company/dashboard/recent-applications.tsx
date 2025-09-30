import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

interface Application {
  id: number
  title: string
  status: string
  date: string
}

interface RecentApplicationsProps {
  applications: Application[]
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">새 지원자</Badge>
      case "reviewing":
        return <Badge variant="outline">면접 대기</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">최근 지원 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{application.title}</h4>
                <p className="text-sm text-gray-500">지원일: {application.date}</p>
              </div>
              <div className="flex-shrink-0">{getStatusBadge(application.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

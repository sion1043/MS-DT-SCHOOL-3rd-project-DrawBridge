import { Badge } from "@/components/ui/badge"

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">비활성</Badge>
    case "closed":
      return <Badge variant="secondary">마감</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">검토중</Badge>
    case "interview":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">면접</Badge>
    case "hired":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">채용</Badge>
    case "rejected":
      return <Badge variant="destructive">불합격</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

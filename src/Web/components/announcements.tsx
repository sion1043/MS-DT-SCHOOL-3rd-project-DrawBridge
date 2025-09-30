import { Card, CardContent } from "@/components/ui/card"

const announcements = [
  {
    title: "[공지] 개인정보 처리방침 개정에 대해 ...",
    date: "2025-08",
  },
  {
    title: "[이벤트] 신규 회원 가입 혜택 안내",
    date: "2025-08",
  },
]

export function Announcements() {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <span className="text-green-500 font-semibold text-sm">Notice</span>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 hover:bg-muted/30 transition-colors cursor-pointer rounded"
            >
              <p className="text-xs text-muted-foreground flex-1 truncate pr-2">{announcement.title}</p>
              <span className="text-xs text-muted-foreground flex-shrink-0">{announcement.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import type { StatCard as StatCardType } from "@/types/mypage_employee"

interface StatCardProps extends StatCardType {
  className?: string
}

export function StatCard({ title, value, description, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-4xl font-bold text-primary">{value}</p>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}

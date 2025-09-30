"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  onBack?: () => void
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
  }
  className?: string
}

export function PageHeader({ title, description, onBack, action, className }: PageHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            className={action.variant === "default" ? "bg-primary hover:bg-primary/90" : ""}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

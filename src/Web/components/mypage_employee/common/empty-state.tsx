"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="flex justify-center mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary/90">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

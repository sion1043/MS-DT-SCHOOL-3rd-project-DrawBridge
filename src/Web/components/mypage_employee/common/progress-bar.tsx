interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: "primary" | "success" | "warning" | "danger"
}

export function ProgressBar({ value, max = 100, className, showLabel = false, color = "primary" }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-muted-foreground mt-1 text-right">
          {value}/{max}
        </div>
      )}
    </div>
  )
}

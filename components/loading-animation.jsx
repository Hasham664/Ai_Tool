"use client"

export function LoadingAnimation({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    default: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-muted animate-spin`}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        </div>
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary/20 to-chart-1/20 animate-pulse-glow`}
        ></div>
      </div>
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

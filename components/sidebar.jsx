"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, MessageSquare, Settings, ChevronLeft, ChevronRight } from "lucide-react"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("cover-letter")

  const menuItems = [
    {
      id: "cover-letter",
      label: "Cover Letter & Resume",
      icon: FileText,
      description: "AI-powered optimization",
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: MessageSquare,
      description: "Get help and guidance",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Preferences & account",
    },
  ]

  return (
    <Card className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 m-4 h-fit`}>
      <div className="p-4">
        {/* Collapse toggle */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

"use client"
import { Applications } from "./applications"
import type React from "react"

import { Favorites } from "./favorites"
import { ResumeManagement } from "./resume-management"
import { Interviews } from "./interviews"
import { Companies } from "./companies"
import { Goals } from "./goals"
import { TodoList } from "./todo-list"
import { Challenges } from "./challenges"
import { SkillAssessment } from "./skill-assessment"
import { Settings } from "./settings"
import { NotificationSettings } from "./notification-settings"

interface MainContentProps {
  activeTab: string
  notifications: boolean
  setNotifications: (value: boolean) => void
  privacy: boolean
  setPrivacy: (value: boolean) => void
  userProfile: {
    name: string
    email: string
    avatar: string
    tier: string
    xp: number
    nextLevelXp: number
  }
  setUserProfile: (profile: any) => void
  todos: Array<{ id: number; text: string; completed: boolean }>
  setTodos: (todos: any) => void
  tiers: Array<{
    name: string
    color: string
    minXP: number
    maxXP: number
    icon: string
  }>
  currentTier: {
    name: string
    color: string
    minXP: number
    maxXP: number
    icon: string
  }
  totalXP: number
  xpForNextLevel: number
  xpProgress: number
}

export function MainContent({
  activeTab,
  notifications,
  setNotifications,
  privacy,
  setPrivacy,
  userProfile,
  setUserProfile,
  todos,
  setTodos,
  tiers,
  currentTier,
  totalXP,
  xpForNextLevel,
  xpProgress,
}: MainContentProps) {
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-6xl mx-auto">{children}</div>
  )

  if (activeTab === "profile") {
    return null
  }

  if (activeTab === "applications") {
    return (
      <ContentWrapper>
        <Applications />
      </ContentWrapper>
    )
  }

  if (activeTab === "favorites") {
    return (
      <ContentWrapper>
        <Favorites />
      </ContentWrapper>
    )
  }

  if (activeTab === "resume") {
    return (
      <ContentWrapper>
        <ResumeManagement />
      </ContentWrapper>
    )
  }

  if (activeTab === "interviews") {
    return (
      <ContentWrapper>
        <Interviews />
      </ContentWrapper>
    )
  }

  if (activeTab === "companies") {
    return (
      <ContentWrapper>
        <Companies />
      </ContentWrapper>
    )
  }

  if (activeTab === "goals") {
    return (
      <ContentWrapper>
        <Goals />
      </ContentWrapper>
    )
  }

  if (activeTab === "todos") {
    return (
      <ContentWrapper>
        <TodoList todos={todos} setTodos={setTodos} />
      </ContentWrapper>
    )
  }

  if (activeTab === "challenges") {
    return (
      <ContentWrapper>
        <Challenges
          tiers={tiers}
          currentTier={currentTier}
          totalXP={totalXP}
          xpForNextLevel={xpForNextLevel}
          xpProgress={xpProgress}
        />
      </ContentWrapper>
    )
  }

  if (activeTab === "skill-assessment") {
    return (
      <ContentWrapper>
        <SkillAssessment />
      </ContentWrapper>
    )
  }

  if (activeTab === "settings") {
    return (
      <ContentWrapper>
        <Settings
          notifications={notifications}
          setNotifications={setNotifications}
          privacy={privacy}
          setPrivacy={setPrivacy}
        />
      </ContentWrapper>
    )
  }

  if (activeTab === "notifications") {
    return (
      <ContentWrapper>
        <NotificationSettings />
      </ContentWrapper>
    )
  }

  return null
}

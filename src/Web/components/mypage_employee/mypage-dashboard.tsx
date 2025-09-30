"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { ProfileSection } from "./profile-section"
import { MainContent } from "./main-content"

export default function MyPageDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState(true)
  const [privacy, setPrivacy] = useState(false)

  const [userProfile, setUserProfile] = useState({
    name: "김사용자",
    email: "kim.user@example.com",
    phone: "010-1234-5678",
    location: "서울, 대한민국",
    joinDate: "2024.01.15",
    position: "웹 개발자",
    avatar: "👤",
  })

  const emojiOptions = ["👤", "😊", "🚀", "💼", "🎯", "⭐", "🔥", "💪", "🎨", "💻", "📚", "🌟"]

  const tiers = [
    { name: "아이언", color: "bg-gray-500", minXP: 0, maxXP: 99, icon: "🔩" },
    { name: "브론즈", color: "bg-amber-600", minXP: 100, maxXP: 299, icon: "🥉" },
    { name: "실버", color: "bg-gray-400", minXP: 300, maxXP: 599, icon: "🥈" },
    { name: "골드", color: "bg-yellow-500", minXP: 600, maxXP: 999, icon: "🥇" },
    { name: "플레티넘", color: "bg-cyan-500", minXP: 1000, maxXP: 1499, icon: "💎" },
    { name: "에메랄드", color: "bg-emerald-500", minXP: 1500, maxXP: 2099, icon: "💚" },
    { name: "다이아", color: "bg-blue-500", minXP: 2100, maxXP: 2799, icon: "💠" },
    { name: "마스터", color: "bg-purple-600", minXP: 2800, maxXP: Number.POSITIVE_INFINITY, icon: "👑" },
  ]

  const totalXP = 150
  const currentTier = tiers.find((tier) => totalXP >= tier.minXP && totalXP <= tier.maxXP) || tiers[0]
  const nextTier = tiers[tiers.indexOf(currentTier) + 1]
  const xpForNextLevel = nextTier ? nextTier.minXP - totalXP : 0
  const xpProgress = nextTier ? ((totalXP - currentTier.minXP) / (nextTier.minXP - currentTier.minXP)) * 100 : 100

  const [todos, setTodos] = useState([
    { id: 1, text: "이력서 업데이트하기", completed: false, xp: 50 },
    { id: 2, text: "관심 기업 3곳 찾기", completed: true, xp: 30 },
    { id: 3, text: "포트폴리오 정리하기", completed: false, xp: 100 },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header userProfile={userProfile} />

      <div className="container mx-auto px-60 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <ProfileSection
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                currentTier={currentTier}
                totalXP={totalXP}
                xpForNextLevel={xpForNextLevel}
                xpProgress={xpProgress}
                emojiOptions={emojiOptions}
              />
            )}

            <MainContent
              activeTab={activeTab}
              notifications={notifications}
              setNotifications={setNotifications}
              privacy={privacy}
              setPrivacy={setPrivacy}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              todos={todos}
              setTodos={setTodos}
              tiers={tiers}
              currentTier={currentTier}
              totalXP={totalXP}
              xpForNextLevel={xpForNextLevel}
              xpProgress={xpProgress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { MyPageDashboard }

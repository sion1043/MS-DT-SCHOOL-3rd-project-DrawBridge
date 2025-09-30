"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogoutButton } from "@/components/logout-button"
import { Search, Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header_jobseeker() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      {/* Top Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/*밑에 div className의 값 중에 하나 bg-primary-foreground */}
            <div className="w-10 h-10 text-primary rounded-lg flex items-center justify-center font-bold text-xl">
            <img
              src="/logo_white.png"              // public/logo.png 경로에 넣어두세요
              alt="DrawBridge Logo"
              className="w-full h-full object-contain"
            />
            </div>
            <span className="text-2xl font-bold">
              <Link href="/">DrawBridge</Link>
            </span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search jobs, companies..." className="pl-10 bg-white text-foreground" />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/main_mypage">마이페이지</Link>
            </Button>
            <LogoutButton />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search jobs, companies..." className="pl-10 bg-white text-foreground" />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`border-t border-primary-foreground/20 ${isMenuOpen ? "block" : "hidden md:block"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 py-2">
{/*             
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 py-2 hover:text-secondary transition-colors">
                <span>구직자 페이지</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/employee_roadmap">커리어 로드맵</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/employee_jd">추천 채용 공고</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            <Link href="/employee_roadmap" className="py-2 hover:text-secondary transition-colors">
              스킬 핏
            </Link>
            <Link href="/employee_jd" className="py-2 hover:text-secondary transition-colors">
              커리어 로드맵
            </Link>
            <Link href="/employee_careerfit" className="py-2 hover:text-secondary transition-colors">
              채용 핏
            </Link>

            <Link href="/main_about" className="py-2 hover:text-secondary transition-colors">
              About
            </Link>
            <Link href="/main_contact" className="py-2 hover:text-secondary transition-colors">
              Contact
            </Link>
            <Link href="/jumpit_main" className="py-2 hover:text-secondary transition-colors">
              테스트
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

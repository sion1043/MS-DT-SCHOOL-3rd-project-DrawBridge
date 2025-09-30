"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const bannerSlides = [
  {
    title: "Top Companies Hiring Now",
    description: "Join industry leaders and grow your career",
    image: "/modern-glass-office.png",
    cta: "View Companies",
  },
  {
    title: "Remote Work Opportunities",
    description: "Work from anywhere with flexible positions",
    image: "/person-working-remotely-on-laptop-in-cozy-home-off.jpg",
    cta: "Find Remote Jobs",
  },
  {
    title: "Tech Jobs in High Demand",
    description: "Discover cutting-edge technology roles",
    image: "/modern-tech-workspace-with-multiple-monitors-and-c.jpg",
    cta: "Explore Tech Jobs",
  },
]

export function DynamicBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  return (
    <div className="relative h-[100px] md:h-[415px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg">
      <div className="relative h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-r from-white/95 to-white/80 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 text-balance">
                  {slide.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-pretty text-sm md:text-base leading-relaxed">
                  {slide.description}
                </p>
                <Button className="w-fit bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-lg transition-all hover:scale-105">
                  {slide.cta}
                </Button>
              </div>
              <div className="flex-1 relative">
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-gray-200"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-gray-200"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary scale-125 shadow-md"
                : "bg-white/70 hover:bg-white/90 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

import { DynamicBanner } from "./dynamic-banner"
import { LoginWidget } from "./login-widget"
import { Announcements } from "./announcements"

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          {/* 왼쪽 - DynamicBanner */}
          <div className="lg:col-span-5">
            <DynamicBanner />
          </div>

          {/* 오른쪽 - Login + Announcements */}
          <div className="lg:col-span-2 flex flex-col h-[400px]">
            <div className="flex-1 mb-4">
              <LoginWidget />
            </div>
            <div className="flex-1">
              <Announcements />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

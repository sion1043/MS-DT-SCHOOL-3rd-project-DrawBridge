import { CareerDashboard } from "@/components/employee_skillfit/career-dashboard"

const dashboard_url = "https://app.powerbi.com/view?r=eyJrIjoiNmY1MWQwYzMtMTE0My00Nzg1LWJkYmYtZTk4YjQ4ZmZmYTIwIiwidCI6IjVmYjI1NmYwLWZiZjItNDBkMi04MWQ1LWJhYzFiMzJjNDE5ZCJ9"
const DASHBOARD_WIDTH = 1050
const DASHBOARD_HEIGHT = 2060
const BANNER_HEIGHT = 60

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-60 py-0 space-y-8">
      <div className="relative" style={{ width: DASHBOARD_WIDTH, height: DASHBOARD_HEIGHT }}>
          <iframe
            title="Company Dashboard"
            src={dashboard_url}
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            style={{ border: "none", display: "block" }}
          >
          </iframe>
          <div
            aria-hidden
            className="absolute left-0 right-0 bottom-0 pointer-events-auto"
            style={{
              height: BANNER_HEIGHT,
              background: "var(--background, #fff)",
            }}
          />
        </div>
        {/* <CareerDashboard /> */}
      </main>
    </div>
  )
}
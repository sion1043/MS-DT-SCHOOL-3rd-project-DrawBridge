import { Header } from "@/components/header"
import { ResumeSection } from "@/components/employee_career/resume-section"
import { TechStackSection } from "@/components/employee_career/tech-stack-section"
import { JobRecommendations } from "@/components/employee_career/job-recommendations"
import { JobCards } from "@/components/job-cards"

const dashboard_url = "https://app.powerbi.com/view?r=eyJrIjoiNWQ3M2NlMmMtNTQ4Ni00MzgyLTg1NTgtNDc0NTUzYzgyZGIwIiwidCI6IjVmYjI1NmYwLWZiZjItNDBkMi04MWQ1LWJhYzFiMzJjNDE5ZCJ9"
const dashboard_width = 1050
const dashboard_height = 2760
const BANNER_HEIGHT = 220

export default function JobSeekerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-60 py-0 space-y-8">
      <div className="relative" style={{ width: dashboard_width, height: dashboard_height }}>
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

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResumeSection />
          <TechStackSection />
        </div>
        <JobCards />
        <JobRecommendations /> */}
      </main>
    </div>
  )
}

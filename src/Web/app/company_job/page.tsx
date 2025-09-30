import { JobPostingForm } from "@/components/company_job/job-posting-form"
import { ComparisonDashboard } from "@/components/company_job/comparison-dashboard"
import { AnalysisReports } from "@/components/company_job/analysis-reports"

const dashboard_url = "https://app.powerbi.com/view?r=eyJrIjoiYzkzNmFjYzEtNjc2NS00MTg2LTg5YTctMWZlYTUxNDMwNDZmIiwidCI6IjVmYjI1NmYwLWZiZjItNDBkMi04MWQ1LWJhYzFiMzJjNDE5ZCJ9"
const dashboard_width = 1050
const dashboard_height = 2710
const BANNER_HEIGHT = 60

export default function HomePage() {
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

        {/* <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            주석: Job Posting Form
            <div className="xl:col-span-2">
              <JobPostingForm />
            </div>

            주석: Analysis Reports
            <div className="xl:col-span-1">
              <AnalysisReports />
            </div>
          </div>

          주석: Comparison Dashboard
          <div className="mt-12">
            <ComparisonDashboard />
          </div>
        </main> */}
      </main>
    </div>
  )
}

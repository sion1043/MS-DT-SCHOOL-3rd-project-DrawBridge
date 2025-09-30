import { CombinedJobTrends } from "@/components/employee_trend/combined-job-trends"
import { AIModelTrends } from "@/components/employee_trend/ai-model-trends"
import { TrendingCompanies } from "@/components/employee_trend/trending-companies"
import { AIRecommendationBanner } from "@/components/employee_trend/ai-recommendation-banner"
import { AIDistributionCharts } from "@/components/employee_trend/ai-distribution-charts"

export default function JobFitPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-60 py-8 space-y-8">
        <CombinedJobTrends />

        {/* 요즘 폼 미친 기업들 */}
        <TrendingCompanies />

        <div className="grid lg:grid-cols-7 gap-8">
          <div className="lg:col-span-3">
            <AIModelTrends />
          </div>
          <div className="lg:col-span-4">
            <AIDistributionCharts />
          </div>
        </div>

        <AIRecommendationBanner />
      </main>
    </div>
  )
}

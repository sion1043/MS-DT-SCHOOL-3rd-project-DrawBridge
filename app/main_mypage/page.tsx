"server-only"

import { redirect } from "next/navigation"
import { getUserFromSession } from "@/lib/session"
import { MyPageDashboard } from "@/components/mypage_employee/mypage-dashboard"
import { CompanyDashboard } from "@/components/mypage_company/company-dashboard"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function HomePage() {
  const user = await getUserFromSession()
  if (!user) {
    redirect("/main_login")
  }

  const isCompany = Boolean((user as any).accountType === "company");
  const isJobSeeker = Boolean((user as any).accountType === "jobseeker");

  if (isCompany) {
    return <CompanyDashboard />
  }

  if (isJobSeeker) {
    return <MyPageDashboard />
  }
}
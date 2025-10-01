import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { getUserFromSession } from '@/lib/session'
import { Header } from '@/components/header'
import { Header_company } from '@/components/header_company'
import { Header_jobseeker } from '@/components/header_jobseeker'
import { RouteScrollbarFix } from './company_monitor/RouteScrollbarFix'

export const metadata: Metadata = {
  title: 'DrawBridge',
  description: 'Created with v0',
  generator: 'v0.app',
}

export const dynamic = 'force-dynamic'    // 세션 기반 개인화 캐시 방지
export const runtime = 'nodejs'           // 러닝타임 환경 설정

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserFromSession()
  
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {user
          ? (user.accountType === "company"
              ? <Header_company />
              : <Header_jobseeker />)
          : <Header />}
        <RouteScrollbarFix />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

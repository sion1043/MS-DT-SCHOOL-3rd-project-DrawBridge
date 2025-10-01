"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export function LoginWidget() {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div className="space-y-3">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">DrawBrdige에 오신 것을 환영합니다!</p>
            {/* <p className="text-sm text-muted-foreground">편리하게 이용해보세요.</p> */}
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-black rounded grid grid-cols-8 gap-px p-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`} />
                ))}
              </div>
            </div> */}
          </div>
        </div>

        <Button
          className="w-full h-17 bg-black hover:bg-gray-800 text-white font-large">
          <Link href="/main_login">로그인 / 회원가입</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const onClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");     // 홈으로
    router.refresh();        // 서버 컴포넌트 재렌더 → 비로그인 헤더로 전환
  };

  return (
    <Button
        onClick={onClick}
        variant="outline"
        className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
        로그아웃
    </Button>
  );
}

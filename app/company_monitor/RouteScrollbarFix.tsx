"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteScrollbarFix() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    // 이 부분을 원하는 페이지 경로로 바꾸세요.
    const shouldApply = pathname.startsWith("/company-monitor"); 

    html.classList.toggle("scroll-gutter-stable", shouldApply);
    return () => html.classList.remove("scroll-gutter-stable");
  }, [pathname]);

  return null;
}
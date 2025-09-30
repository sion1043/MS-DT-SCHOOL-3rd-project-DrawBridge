"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const optsRef = useRef(options); // 의존성 폭발 방지
  optsRef.current = options;

  const fetchOnce = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url, { ...optsRef.current, signal });

      // 에러 바디도 읽어서 보여주기
      if (!res.ok) {
        let errBody = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
            errBody = JSON.stringify(j);
          } else {
            errBody = await res.text();
          }
        } catch {
          /* ignore parse error */
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}${errBody ? ` - ${errBody}` : ""}`);
      }

      // 204/빈 응답 대비
      let result: any = null;
      const text = await res.text();
      if (text) result = JSON.parse(text);

      setData(result as T);
    } catch (e: any) {
      if (e?.name === "AbortError") return; // 취소된 요청 무시
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const ac = new AbortController();
    fetchOnce(ac.signal);
    return () => ac.abort();
  }, [fetchOnce]);

  const refetch = useCallback(async () => {
    const ac = new AbortController();
    await fetchOnce(ac.signal);
  }, [fetchOnce]);

  return { data, loading, error, refetch };
}

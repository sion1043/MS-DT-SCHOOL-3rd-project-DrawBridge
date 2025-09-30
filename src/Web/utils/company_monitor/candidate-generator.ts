import type { Candidate } from "@/types/company_monitor/candidate"

export async function generateMockCandidates(count = 10000): Promise<Candidate[]> {
    const res = await fetch(`/api/company_monitor/candidates`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  
  const data = await res.json();
  console.log("data", data)
  return Array.isArray(data?.candidates) ? data.candidates : [];
}

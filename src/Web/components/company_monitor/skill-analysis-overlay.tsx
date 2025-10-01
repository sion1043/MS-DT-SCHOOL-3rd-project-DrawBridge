"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  History,
  Award,
  BookOpen,
  Briefcase,
  User,
  Loader2
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import type { Candidate } from "@/types/company_monitor/candidate"
import { useApi } from "@/hooks/company_monitor/use-api"
import { useEffect, useMemo } from "react"


// ______                __  _  _          _____   ___  ______ 
// | ___ \              / _|(_)| |        |_   _| / _ \ | ___ \
// | |_/ / _ __   ___  | |_  _ | |  ___     | |  / /_\ \| |_/ /
// |  __/ | '__| / _ \ |  _|| || | / _ \    | |  |  _  || ___ \
// | |    | |   | (_) || |  | || ||  __/    | |  | | | || |_/ /
// \_|    |_|    \___/ |_|  |_||_| \___|    \_/  \_| |_/\____/ 
interface CandidateProfileModalProps {
  candidate: Candidate
  isOpen: boolean
  onClose: () => void
}

function score(candidate: Candidate) {
  const c: string[] = candidate.skills_current || []
  const cl: number[] = (candidate.skfn_current || []).map(Number)
  const p: string[] = candidate.skills_past || []
  const pl: number[] = (candidate.skfn_past || []).map(Number)
  const pm = new Map<string, number>();
  for (let i = 0; i < p.length; i++) pm.set(p[i], Number(pl[i] ?? 0));

  const o: Record<string, { techStack: string; curLevel: number; growth: number }> = {};
  for (let i = 0; i < c.length; i++) {
    const n = c[i];
    if (!n) continue;
    const cur = Number(cl[i] ?? 0);
    const g = pm.size ? (pm.has(n) ? cur - (pm.get(n) as number) : 0) : 0;
    o[n] = { techStack: n, curLevel: cur, growth: g }; // 같은 스킬명은 마지막 값으로 덮어씀
  }

  const sorted = Object.values(o).sort(
    (a, b) => (b.growth - a.growth) || a.techStack.localeCompare(b.techStack)
  );
  const maxCount = Math.min(sorted.length, 100)
  const sum = sorted.reduce((acc, { growth }) => acc + growth, 0);
  const avg = Math.round((sum * 100 / maxCount)) / 100;
  return avg
}



// ___   _   _   ___   _     __   __ _____  _____  _____    _____   ___  ______ 
// / _ \ | \ | | / _ \ | |    \ \ / //  ___||_   _|/  ___|  |_   _| / _ \ | ___ \
// / /_\ \|  \| |/ /_\ \| |     \ V / \ `--.   | |  \ `--.     | |  / /_\ \| |_/ /
// |  _  || . ` ||  _  || |      \ /   `--. \  | |   `--. \    | |  |  _  || ___ \
// | | | || |\  || | | || |____  | |  /\__/ / _| |_ /\__/ /    | |  | | | || |_/ /
// \_| |_/\_| \_/\_| |_/\_____/  \_/  \____/  \___/ \____/     \_/  \_| |_/\____/ 
interface SkillAnalysisOverlayProps {
  candidate: Candidate
  position?: "left" | "right"
}


// ___  ______  _____   _____   ___   _      _      ______  _____  _____  _   __  _____  _____ ______    ____ 
// / _ \ | ___ \|_   _| /  __ \ / _ \ | |    | |     | ___ \|_   _|/  __ \| | / / |_   _||  _  || ___ \  / ___|
// / /_\ \| |_/ /  | |   | /  \// /_\ \| |    | |     | |_/ /  | |  | /  \/| |/ /    | |  | | | || |_/ / / /___ 
// |  _  ||  __/   | |   | |    |  _  || |    | |     |  __/   | |  | |    |    \    | |  | | | ||  __/  | ___ \
// | | | || |     _| |_  | \__/\| | | || |____| |____ | |     _| |_ | \__/\| |\  \   | |  \ \_/ /| |     | \_/ |
// \_| |_/\_|     \___/   \____/\_| |_/\_____/\_____/ \_|     \___/  \____/\_| \_/   \_/   \___/ \_|     \_____/                                                                                              
// 스킬 목록 6개를 뽑아내기 위한 함수들
type ApiRow = {
  skills_past?: string | null;
  skfn_past?: string | null;
  skills_p2?: string | null;
  skfn_p2?: string | null;
  skills_p3?: string | null;
  skfn_p3?: string | null;
  skills_p4?: string | null;
  skfn_p4?: string | null;
  skills_p5?: string | null;
  skfn_p5?: string | null;
  skills_p6?: string | null;
  skfn_p6?: string | null;
  company_tech_stack?: string | null;
  posting_tech_stack?: string | null;
};

const toStrArr = (s?: string | null) =>
  (s ?? "")
    .split(";")
    .map(v => v.trim())
    .filter(Boolean);

const toNumArr = (s?: string | null) =>
  (s ?? "")
    .split(";")
    .map(v => Number(v.trim()))
    .map(n => (Number.isFinite(n) ? n : 0));

/** 주어진 데이터에서 규칙 1~7을 적용해 스킬 6개를 추출 */
export function pickTopSkills(row: ApiRow, limit = 6): string[] {
  const suffixes = ["past", "p2", "p3", "p4", "p5", "p6"] as const;

  // 1) skills_past ~ skills_p6 종합 빈도수 & 최고 숙련도 수집
  const freq = new Map<string, number>();
  const maxLevel = new Map<string, number>();
  const allSkillSet = new Set<string>();

  for (const sfx of suffixes) {
    const skills = toStrArr((row as any)[`skills_${sfx}`]);
    const lvls = toNumArr((row as any)[`skfn_${sfx}`]);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      const lvl = lvls[i] ?? 0;
      allSkillSet.add(skill);
      freq.set(skill, (freq.get(skill) ?? 0) + 1);
      maxLevel.set(skill, Math.max(maxLevel.get(skill) ?? -Infinity, lvl));
    }
  }

  // 2) company ∩ posting ∩ candidate(skills) 교집합
  const company = toStrArr(row.company_tech_stack);
  const posting = toStrArr(row.posting_tech_stack);
  const companySet = new Set(company);
  const postingSet = new Set(posting);

  const result: string[] = [];
  const pushIfNew = (name: string) => {
    if (!name) return;
    if (!result.includes(name)) result.push(name);
  };

  // 정렬 기준 도우미 (빈도↓, 숙련도↓, 이름↑)
  const sortByFreqLevelName = (a: string, b: string) =>
    (freq.get(b)! - freq.get(a)!) ||
    (maxLevel.get(b)! - maxLevel.get(a)!) ||
    a.localeCompare(b);

  // step 2
  const interAll = [...allSkillSet].filter(
    s => companySet.has(s) && postingSet.has(s)
  );
  interAll.sort(sortByFreqLevelName).forEach(s => {
    if (result.length < limit) pushIfNew(s);
  });

  // 3) company ∩ posting (2번에 이미 들어간 건 제외), "posting 순서"로 넣기
  if (result.length < limit) {
    const interCP = posting.filter(s => companySet.has(s) && !result.includes(s));
    interCP.forEach(s => {
      if (result.length < limit) pushIfNew(s);
    });
  }

  // 4) posting 앞에서부터
  if (result.length < limit) {
    for (const s of posting) {
      if (result.length >= limit) break;
      if (!result.includes(s)) pushIfNew(s);
    }
  }

  // 5) company 앞에서부터
  if (result.length < limit) {
    for (const s of company) {
      if (result.length >= limit) break;
      if (!result.includes(s)) pushIfNew(s);
    }
  }

  // 6) 숙련도 높은 순(종합 maxLevel 기준)으로 all skills에서 채우기
  if (result.length < limit) {
    const allSorted = [...allSkillSet].sort((a, b) => {
      const lv = (maxLevel.get(b) ?? 0) - (maxLevel.get(a) ?? 0);
      return lv || a.localeCompare(b);
    });
    for (const s of allSorted) {
      if (result.length >= limit) break;
      if (!result.includes(s)) pushIfNew(s);
    }
  }

  // 7) 최종 6개로 슬라이스
  return result.slice(0, limit);
}



// ______  _____  _   _ ______   _   _  _____  _____ ______   _____  _   __ _____  _      _     
// |  ___||_   _|| \ | ||  _  \ | | | |/  ___||  ___|| ___ \ /  ___|| | / /|_   _|| |    | |    
// | |_     | |  |  \| || | | | | | | |\ `--. | |__  | |_/ / \ `--. | |/ /   | |  | |    | |    
// |  _|    | |  | . ` || | | | | | | | `--. \|  __| |    /   `--. \|    \   | |  | |    | |    
// | |     _| |_ | |\  || |/ /  | |_| |/\__/ /| |___ | |\ \  /\__/ /| |\  \ _| |_ | |____| |____
// \_|     \___/ \_| \_/|___/    \___/ \____/ \____/ \_| \_| \____/ \_| \_/ \___/ \_____/\_____/
// 1) 정규화 (대소문자/구두점/공백 정리)
const norm = (s: string) =>
  s.toLowerCase()
   .replace(/[.+#]/g, "")   // . + #
   .replace(/\s+/g, " ")    // 다중 공백
   .trim();

// 2) 대표명 그룹 (간단 alias)
const GROUPS: string[][] = [
  ["react", "reactjs", "react js", "react.js"],
  ["node", "nodejs", "node js", "node.js"],
  ["typescript", "ts"],
  ["javascript", "js"],
  ["csharp", "c#"],
  ["cpp", "c++"],
  ["aws", "amazon web services", "amazonws"],
  ["azure", "microsoft azure", "msazure"],
  ["gcp", "google cloud", "google cloud platform"],
  ["postgres", "postgresql", "postgre sql"],
  ["k8s", "kubernetes"],
  ["tensorflow", "tf"],
  ["pytorch", "torch"],
  ["opencv", "open cv"],
];

const aliasMap: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const group of GROUPS) {
    const canon = norm(group[0]);
    for (const a of group) m[norm(a)] = canon;
  }
  return m;
})();

// 3) 토큰 Jaccard + 포함도 기반 간단 유사도
const tokens = (s: string) => norm(s).split(" ").filter(Boolean);
const jaccard = (a: string[], b: string[]) => {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
};
const strInclScore = (a: string, b: string) => {
  const A = norm(a), B = norm(b);
  if (A.includes(B) || B.includes(A)) {
    const minLen = Math.min(A.length, B.length);
    const maxLen = Math.max(A.length, B.length) || 1;
    return minLen / maxLen;
  }
  return 0;
};

// 4) 후보 풀에서 가장 비슷한 이름 찾기
function findSimilar(target: string, pool: string[], threshold = 0.3): string | null {
  const tNorm = norm(target);
  // alias 우선
  const tCanon = aliasMap[tNorm] ?? tNorm;

  let best: { name: string; score: number } | null = null;
  for (const p of pool) {
    const pNorm = norm(p);
    const pCanon = aliasMap[pNorm] ?? pNorm;

    // 동일/같은 그룹이면 바로 채택
    if (tCanon === pCanon) return p; // 원래 표기 유지

    // 점수 계산
    const score = Math.max(
      jaccard(tokens(tCanon), tokens(pCanon)),
      strInclScore(tCanon, pCanon)
    );

    if (!best || score > best.score) best = { name: p, score };
  }
  return best && best.score >= threshold ? best.name : null;
}

/* ---------- level 인덱스 (이전과 동일 로직) ---------- */
function buildLevelIndex(row?: ApiRow | null) {
  if (!row) return {} as Record<string, Partial<Record<"past"|"p2"|"p3"|"p4"|"p5"|"p6", number>>>;
  const idx: Record<string, Partial<Record<"past"|"p2"|"p3"|"p4"|"p5"|"p6", number>>> = {};
  (["past","p2","p3","p4","p5","p6"] as const).forEach(sfx => {
    const names = toStrArr((row as any)[`skills_${sfx}`]);
    const lvls  = toNumArr((row as any)[`skfn_${sfx}`]);
    for (let i = 0; i < names.length; i++) {
      const n = names[i];
      if (!n) continue;
      (idx[n] ||= {});
      idx[n][sfx] = lvls[i] ?? 0;
    }
  });
  return idx;
}


// ___  ___  ___   _____  _   _ 
// |  \/  | / _ \ |_   _|| \ | |
// | .  . |/ /_\ \  | |  |  \| |
// | |\/| ||  _  |  | |  | . ` |
// | |  | || | | | _| |_ | |\  |
// \_|  |_/\_| |_/ \___/ \_| \_/
export function SkillAnalysisOverlay({ candidate, position = "right" }: SkillAnalysisOverlayProps) {
  // url 생성
  const url = candidate
  ? `/api/company_monitor/hover-skill?candidate=${encodeURIComponent(JSON.stringify(candidate))}`
  : ""

  // 좌측 탭에 넣을 스킬 리스트
  const skills = candidate.skills_current || candidate.skills_past || []
  
  // API 호출
  const { data: user_skills, loading, error } = useApi<ApiRow>(url)
  
  // 1) top 6 스킬 (그대로)
  const topSkills = useMemo(
    () => (user_skills ? pickTopSkills(user_skills, 6) : []),
    [user_skills]
  );
  console.log("data", "user_skills", user_skills);
  console.log("data", "topSkills", topSkills);

  // 2) level 인덱스
  const levelIndex = useMemo(() => buildLevelIndex(user_skills), [user_skills]);

  // 3) 특정 스킬 이름에 대해, levelIndex에서 "유사한" 키를 찾아 레벨 뽑기
  function getLevelsBySimilar(name: string) {
    const pool = Object.keys(levelIndex);
    const matched = findSimilar(name, pool) ?? name; // 없으면 원래 이름
    const L = levelIndex[matched] ?? {};
    const current = L.past ?? 0;                             // 현재(가장 최근 스냅샷)
    const previous = L.p2 ?? L.p3 ?? L.p4 ?? L.p5 ?? L.p6 ?? 0; // 직전(없으면 뒤로 fallback)
    return { matched, current, previous };
  }

  // 4) skillData / comparisonData / progressionData 생성 (모두 useMemo)
  const skillData = useMemo(() => {
    return topSkills.map(name => {
      const { current, previous } = getLevelsBySimilar(name);
      return {
        name,
        past: previous,
        current,
        required: 50
      };
    });
  }, [topSkills, levelIndex]);
  console.log("data", "skillData", skillData);
  
  // const skillData = [
  //   { name: "React", past: 85, current: 96, required: 50 },
  //   { name: "TypeScript", past: 80, current: 92, required: 50 },
  //   { name: "Node.js", past: 75, current: 88, required: 50 },
  //   { name: "Problem Solving", past: 75, current: 82, required: 50 },
  //   { name: "Code Quality", past: 77, current: 99, required: 50 },
  //   { name: "Team Collaboration", past: 89, current: 100, required: 50 },
  // ]

  const comparisonData = [
    { skill: "React", previous: 85, current: 96 },
    { skill: "TypeScript", previous: 80, current: 92 },
    { skill: "Node.js", previous: 75, current: 88 },
  ]

  const progressionData = useMemo(() => {
    if (!topSkills.length) return [];
    const months = ["Jan","Feb","Mar","Apr","May","Jun"] as const;
    const tags   = ["p6","p5","p4","p3","p2","past"] as const; // 과거→현재
    const top3   = topSkills.slice(0, 6);                      // 상위 3개 스킬 표시
    const pool   = Object.keys(levelIndex);
  
    // 미리 유사 매칭 결과 캐시 (표시 라벨 s → 실제 key k)
    const m = new Map<string, string>();
    for (const s of top3) {
      m.set(s, findSimilar(s, pool) ?? s);
    }
  
    // [{ month:'Jan', <s1>:p6, <s2>:p6, <s3>:p6 }, ... , { month:'Jun', ...past }]
    return tags.map((tag, i) => {
      const row: Record<string, number | string> = { month: months[i] };
      for (const s of top3) {
        const key = m.get(s)!; // 유사 매칭된 실제 키
        row[s] = (levelIndex[key]?.[tag as keyof typeof levelIndex[string]] as number) ?? 0;
      }
      return row;
    });
  }, [levelIndex, topSkills]);
  console.log("data", "progressionData", progressionData);

  // const progressionData = [
  //   { month: "Jan", React: 85, TypeScript: 80, "Node.js": 75 },
  //   { month: "Feb", React: 87, TypeScript: 82, "Node.js": 78 },
  //   { month: "Mar", React: 90, TypeScript: 85, "Node.js": 82 },
  //   { month: "Apr", React: 93, TypeScript: 88, "Node.js": 85 },
  //   { month: "May", React: 95, TypeScript: 90, "Node.js": 87 },
  //   { month: "Jun", React: 96, TypeScript: 92, "Node.js": 88 },
  // ]


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)] gap-x-4">
      {!loading && !error && user_skills && (
        <div
          className={`absolute mt-2 w-[1200px] z-50 bg-white border rounded-lg shadow-xl p-6 ${
            position === "left" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Skill Bars */}
            <div className="min-w-0">
              {/* Skill Summary */}
              <div className="space-y-6 ">
                {/* Skills & Proficiency */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      기술 스택 및 숙련도
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {skills.map((skill) => {
                        const proficiency = candidate.skillProficiency?.find((p) => p.skill === skill)
                        return (
                          <div key={skill} className="flex items-center justify-between p-0 bg-gray-50 rounded-lg">
                            <Badge variant="secondary">{skill}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      경력 개선도
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                      <span className="text-2xl font-bold text-green-600">{score(candidate) || 0}%</span>
                      <span className="text-sm text-gray-600">향상</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">마지막 지원서 수정 대비</p>
                  </CardContent>
                </Card>
                {/* Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>링크</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Globe className="h-4 w-4" />
                        Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* <div className="text-center">
                  <div className="text-2xl font-bold">96%</div>
                  <div className="text-sm text-green-600">React</div>
                  <div className="text-xs text-green-600">+11% improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-blue-600">TypeScript</div>
                  <div className="text-xs text-green-600">+12% improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">88%</div>
                  <div className="text-sm text-purple-600">Node.js</div>
                  <div className="text-xs text-green-600">+13% improvement</div>
                </div> */}
              </div>
            </div>

            {/* Right Column - Charts */}
            {/* Bar Chart */}
            <div className="space-y-6 min-w-0">
              {/* <div>
                <h4 className="font-medium mb-3">회사 핵심 요구 기술 비교 (직전 vs 현재)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="previous" fill="#FFA500" name="Previous" />
                      <Bar dataKey="current" fill="#FFB84D" name="Current" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div> */}

              {/* Line Chart */}
              <div>
                <h4 className="font-medium mb-3">회사 핵심 요구 기술 비교 (시계열)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressionData} margin={{ top: 8, right: 4, left: 8, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey={topSkills[0]} stroke="#4E79A7" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey={topSkills[1]} stroke="#F28E2B" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey={topSkills[2]} stroke="#59A14F" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey={topSkills[3]} stroke="#E15759" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey={topSkills[4]} stroke="#B07AA1" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey={topSkills[5]} stroke="#76B7B2" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Current vs Previous Assessment */}
              <div>
                <h4 className="font-medium mb-4">회사 핵심 요구 기술 비교 (직전 vs 현재)</h4>
                <div className="space-y-3">
                  {skillData.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-gray-500">직전 숙련도: {skill.past}%</span>
                          <span className="text-blue-600">현재 숙련도: {skill.current}%</span>
                          {/* <span className="text-red-600">타 지원자 평균: {skill.required}%</span> */}
                        </div>
                      </div>
                      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500 rounded-full" style={{ width: `${skill.current}%` }} />
                        <div
                          className="absolute inset-0 bg-green-500 rounded-full opacity-100"
                          style={{ width: `${skill.past}%` }}
                        />
                        {/* <div className="absolute top-0 bottom-0 w-1 bg-red-500" style={{ left: `${skill.required}%` }} /> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

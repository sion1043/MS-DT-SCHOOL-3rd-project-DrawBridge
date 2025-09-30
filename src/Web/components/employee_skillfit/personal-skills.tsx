"use client"

export function PersonalSkills() {
  return (
    // bg-gradient-to-r from-[#F4B819]/20 to-[#F4B819]/30
    <div className="p-8 rounded-xl border-2 border-[#F4B819]/40 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
        <div className="w-2 h-8 bg-[#F4B819] rounded-full"></div>
        나의 기술 스택 & 숙련도
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground border-b-2 border-[#F4B819]/30 pb-2">보유 기술</h4>
          <div className="space-y-4">
            {[
              { name: "React", level: 85, experience: "3년" },
              { name: "TypeScript", level: 78, experience: "2년" },
              { name: "Node.js", level: 72, experience: "2년" },
              { name: "Python", level: 65, experience: "1년" },
              { name: "AWS", level: 58, experience: "1년" },
            ].map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{skill.experience}</span>
                    <span className="text-lg font-bold text-foreground">{skill.level}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#F4B819] to-[#F4B819]/80 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground border-b-2 border-[#F4B819]/30 pb-2">학습 중인 기술</h4>
          <div className="space-y-4">
            {[
              { name: "Next.js", progress: 45, target: "6개월" },
              { name: "Docker", progress: 30, target: "3개월" },
              { name: "GraphQL", progress: 20, target: "4개월" },
            ].map((learning) => (
              <div key={learning.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">{learning.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      목표: {learning.target}
                    </span>
                    <span className="text-lg font-bold text-foreground">{learning.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#F4B819]/70 to-[#F4B819] h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${learning.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-[#F4B819]/30 to-[#F4B819]/20 rounded-xl border-2 border-[#F4B819]/50 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-lg font-bold text-foreground">전체 스킬 점수</h5>
                <p className="text-sm text-muted-foreground">시장 평균 대비</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-foreground">74점</div>
                <div className="text-base font-semibold text-green-600 flex items-center gap-1">
                  +12% <span className="text-lg">↗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

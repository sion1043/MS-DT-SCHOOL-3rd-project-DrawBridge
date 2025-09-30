"use client"

import { TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SkillAnalysisOverlayProps {
  candidateData: {
    name: string
    skillProgression: Array<{
      month: string
      [key: string]: string | number
    }>
  }
  candidateName: string
}

export function SkillAnalysisOverlay({ candidateData, candidateName }: SkillAnalysisOverlayProps) {
  const skills = Object.keys(candidateData.skillProgression[0]).filter((key) => key !== "month")
  const firstAssessment = candidateData.skillProgression[0]
  const lastAssessment = candidateData.skillProgression[candidateData.skillProgression.length - 1]

  return (
    <div className="absolute top-full right-0 mt-2 w-[1200px] bg-white border rounded-lg shadow-xl z-50 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Skill Analysis - {candidateName}
        </h3>

        {/* Skill summary with percentages and improvements */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {skills.map((skill) => {
            const firstMonth = firstAssessment[skill as keyof typeof firstAssessment] as number
            const lastMonth = lastAssessment[skill as keyof typeof lastAssessment] as number
            const improvement = lastMonth - firstMonth

            return (
              <div key={skill} className="text-center">
                <div className="text-sm font-medium text-muted-foreground mb-1">{skill}</div>
                <div className="text-2xl font-bold">{lastMonth}%</div>
                <div className="text-sm text-green-600">+{improvement}% improvement</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left column - Skill bars */}
          <div>
            <h4 className="font-medium mb-4">Current vs Previous Assessment</h4>
            <div className="space-y-3">
              {[...skills, "Problem Solving", "Code Quality", "Team Collaboration"].map((skill, index) => {
                // Get actual data for main skills, simulate for additional skills
                let pastValue, currentValue, requiredValue

                if (skills.includes(skill)) {
                  pastValue = firstAssessment[skill as keyof typeof firstAssessment] as number
                  currentValue = lastAssessment[skill as keyof typeof lastAssessment] as number
                } else {
                  // Simulate data for additional skills
                  const baseValues = [75, 77, 89]
                  const improvements = [7, 22, 11]
                  pastValue = baseValues[index - skills.length] || 75
                  currentValue = pastValue + (improvements[index - skills.length] || 10)
                }

                // Set required values
                const requiredValues: { [key: string]: number } = {
                  React: 85,
                  TypeScript: 80,
                  "Node.js": 75,
                  "Problem Solving": 90,
                  "Code Quality": 70,
                  "Team Collaboration": 88,
                }
                requiredValue = requiredValues[skill] || 80

                return (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{skill}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-gray-500">Past: {pastValue}%</span>
                        <span className="text-blue-600">Current: {currentValue}%</span>
                        <span className="text-red-600">Required: {requiredValue}%</span>
                      </div>
                    </div>
                    <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden">
                      {/* Past skill level (background) */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
                        style={{ width: `${pastValue}%` }}
                      />
                      {/* Current skill level (foreground) */}
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${currentValue}%` }}
                      />
                      {/* Required level marker */}
                      <div className="absolute top-0 h-full w-0.5 bg-red-500" style={{ left: `${requiredValue}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right column - Charts */}
          <div className="space-y-4">
            {/* Skill Comparison Chart */}
            <div>
              <h4 className="font-medium mb-3">Skill Comparison Chart</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={skills.map((skill) => ({
                    name: skill,
                    Previous: firstAssessment[skill as keyof typeof firstAssessment] as number,
                    Current: lastAssessment[skill as keyof typeof lastAssessment] as number,
                  }))}
                  margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="Previous" fill="#F59E0B" name="Previous" />
                  <Bar dataKey="Current" fill="#EAB308" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Progression Over Time Line Chart */}
            <div>
              <h4 className="font-medium mb-3">Skill Progression Over Time</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={candidateData.skillProgression} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  {skills.map((skill, index) => {
                    const colors = ["#F59E0B", "#EAB308", "#10B981"]
                    return (
                      <Line
                        key={skill}
                        type="monotone"
                        dataKey={skill}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

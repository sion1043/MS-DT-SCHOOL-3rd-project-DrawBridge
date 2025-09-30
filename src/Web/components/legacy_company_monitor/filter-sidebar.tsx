"use client"

import { Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSidebarProps {
  onAddFilter: (filter: string) => void
  onRemoveFilter: (filter: string) => void
  selectedFilters: string[] // Added selectedFilters prop for bidirectional sync
}

export function FilterSidebar({ onAddFilter, onRemoveFilter, selectedFilters }: FilterSidebarProps) {
  const jobPostings = [
    { label: "Frontend Developer (React)", value: "job-frontend-react" },
    { label: "Frontend Developer (Vue.js)", value: "job-frontend-vue" },
    { label: "Backend Developer (Node.js)", value: "job-backend-node" },
    { label: "Backend Developer (Python)", value: "job-backend-python" },
    { label: "Backend Developer (Java)", value: "job-backend-java" },
    { label: "Full Stack Developer", value: "job-fullstack" },
    { label: "iOS Developer", value: "job-mobile-ios" },
    { label: "Android Developer", value: "job-mobile-android" },
    { label: "DevOps Engineer", value: "job-devops" },
    { label: "UI/UX Designer", value: "job-designer" },
    { label: "Product Manager", value: "job-product-manager" },
    { label: "Data Scientist", value: "job-data-scientist" },
  ]

  const handleJobPostingAllChange = (checked: boolean) => {
    if (checked) {
      jobPostings.forEach((job) => {
        if (!selectedFilters.includes(job.value)) {
          onAddFilter(job.value)
        }
      })
    } else {
      jobPostings.forEach((job) => {
        if (selectedFilters.includes(job.value)) {
          onRemoveFilter(job.value)
        }
      })
    }
  }

  const allJobPostingsSelected = jobPostings.every((job) => selectedFilters.includes(job.value))
  const someJobPostingsSelected = jobPostings.some((job) => selectedFilters.includes(job.value))

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <div className="space-y-6">
          {/* Job Posting */}
          <div>
            <h3 className="font-medium mb-3">Job Posting</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="job-all"
                  checked={allJobPostingsSelected}
                  onCheckedChange={handleJobPostingAllChange}
                  className={
                    someJobPostingsSelected && !allJobPostingsSelected
                      ? "data-[state=checked]:bg-blue-500 data-[state=indeterminate]:bg-blue-500"
                      : ""
                  }
                />
                <label htmlFor="job-all" className="text-sm font-medium cursor-pointer">
                  All Job Postings
                </label>
              </div>

              {jobPostings.map((job) => (
                <div key={job.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={job.value}
                    checked={selectedFilters.includes(job.value)}
                    onCheckedChange={(checked) => {
                      if (checked) onAddFilter(job.value)
                      else onRemoveFilter(job.value)
                    }}
                  />
                  <label htmlFor={job.value} className="text-sm cursor-pointer">
                    {job.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Career Level */}
          <div>
            <h3 className="font-medium mb-3">Career Level</h3>
            <div className="space-y-2">
              {[
                { label: "Intern", value: "intern" },
                { label: "Junior (0-2 years)", value: "junior" },
                { label: "Mid-level (2-5 years)", value: "mid" },
                { label: "Senior (5-8 years)", value: "senior" },
                { label: "Lead (8+ years)", value: "lead" },
                { label: "Principal/Staff", value: "principal" },
              ].map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={level.value}
                    checked={selectedFilters.includes(level.value)} // Added checked state sync
                    onCheckedChange={(checked) => {
                      if (checked) onAddFilter(level.value)
                      else onRemoveFilter(level.value)
                    }}
                  />
                  <label htmlFor={level.value} className="text-sm cursor-pointer">
                    {level.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <Select onValueChange={(value) => onAddFilter(`location-${value}`)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                <SelectItem value="new-york">New York, NY</SelectItem>
                <SelectItem value="seattle">Seattle, WA</SelectItem>
                <SelectItem value="austin">Austin, TX</SelectItem>
                <SelectItem value="boston">Boston, MA</SelectItem>
                <SelectItem value="chicago">Chicago, IL</SelectItem>
                <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                <SelectItem value="denver">Denver, CO</SelectItem>
                <SelectItem value="remote-us">Remote (US)</SelectItem>
                <SelectItem value="remote-global">Remote (Global)</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="font-medium mb-3">Technical Skills</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Frontend</h4>
                <div className="space-y-2">
                  {["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML/CSS"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedFilters.includes(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))} // Added checked state sync
                        onCheckedChange={(checked) => {
                          if (checked) onAddFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                          else onRemoveFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                        }}
                      />
                      <label htmlFor={skill} className="text-sm cursor-pointer">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Backend</h4>
                <div className="space-y-2">
                  {["Node.js", "Python", "Java", "C#", "Go", "Ruby"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedFilters.includes(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))} // Added checked state sync
                        onCheckedChange={(checked) => {
                          if (checked) onAddFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                          else onRemoveFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                        }}
                      />
                      <label htmlFor={skill} className="text-sm cursor-pointer">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Cloud & DevOps</h4>
                <div className="space-y-2">
                  {["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedFilters.includes(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))} // Added checked state sync
                        onCheckedChange={(checked) => {
                          if (checked) onAddFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                          else onRemoveFilter(skill.toLowerCase().replace(/[^a-z0-9]/g, "-"))
                        }}
                      />
                      <label htmlFor={skill} className="text-sm cursor-pointer">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h3 className="font-medium mb-3">Salary Range</h3>
            <Select onValueChange={(value) => onAddFilter(`salary-${value}`)}>
              <SelectTrigger>
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50k-70k">$50k - $70k</SelectItem>
                <SelectItem value="70k-90k">$70k - $90k</SelectItem>
                <SelectItem value="90k-120k">$90k - $120k</SelectItem>
                <SelectItem value="120k-150k">$120k - $150k</SelectItem>
                <SelectItem value="150k-200k">$150k - $200k</SelectItem>
                <SelectItem value="200k-plus">$200k+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="space-y-2">
              {[
                { label: "Immediately", value: "immediate" },
                { label: "Within 2 weeks", value: "2-weeks" },
                { label: "Within 1 month", value: "1-month" },
                { label: "Within 3 months", value: "3-months" },
                { label: "Open to opportunities", value: "open" },
              ].map((availability) => (
                <div key={availability.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={availability.value}
                    checked={selectedFilters.includes(`availability-${availability.value}`)} // Added checked state sync
                    onCheckedChange={(checked) => {
                      if (checked) onAddFilter(`availability-${availability.value}`)
                      else onRemoveFilter(`availability-${availability.value}`)
                    }}
                  />
                  <label htmlFor={availability.value} className="text-sm cursor-pointer">
                    {availability.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-medium mb-3">Education</h3>
            <div className="space-y-2">
              {[
                { label: "High School", value: "high-school" },
                { label: "Associate Degree", value: "associate" },
                { label: "Bachelor's Degree", value: "bachelor" },
                { label: "Master's Degree", value: "master" },
                { label: "PhD", value: "phd" },
                { label: "Bootcamp", value: "bootcamp" },
                { label: "Self-taught", value: "self-taught" },
              ].map((education) => (
                <div key={education.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={education.value}
                    checked={selectedFilters.includes(`education-${education.value}`)} // Added checked state sync
                    onCheckedChange={(checked) => {
                      if (checked) onAddFilter(`education-${education.value}`)
                      else onRemoveFilter(`education-${education.value}`)
                    }}
                  />
                  <label htmlFor={education.value} className="text-sm cursor-pointer">
                    {education.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

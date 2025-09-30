"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink } from "lucide-react"
import { useState } from "react"

const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $150k",
    description: "Join our dynamic team to build cutting-edge web applications using React and TypeScript.",
    tags: ["React", "TypeScript", "Remote"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    description: "Create beautiful and intuitive user experiences for our growing portfolio of digital products.",
    tags: ["Figma", "Prototyping", "User Research"],
    posted: "1 day ago",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $140k",
    description: "Analyze complex datasets and build machine learning models to drive business insights.",
    tags: ["Python", "ML", "SQL"],
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130k - $160k",
    description: "Lead product strategy and work with cross-functional teams to deliver innovative solutions.",
    tags: ["Strategy", "Agile", "Leadership"],
    posted: "1 day ago",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $130k",
    description: "Build and maintain scalable infrastructure using modern cloud technologies and automation.",
    tags: ["AWS", "Docker", "Kubernetes"],
    posted: "4 days ago",
  },
  {
    id: 6,
    title: "Marketing Specialist",
    company: "Growth Agency",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$70k - $90k",
    description: "Drive digital marketing campaigns and analyze performance metrics to optimize ROI.",
    tags: ["Digital Marketing", "Analytics", "SEO"],
    posted: "2 days ago",
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "API Solutions",
    location: "Chicago, IL",
    type: "Contract",
    salary: "$80 - $100/hr",
    description: "Develop robust APIs and microservices using Node.js and modern database technologies.",
    tags: ["Node.js", "MongoDB", "GraphQL"],
    posted: "5 days ago",
  },
  {
    id: 8,
    title: "Sales Representative",
    company: "SalesPro Corp",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$60k - $80k + Commission",
    description: "Build relationships with clients and drive revenue growth through strategic sales initiatives.",
    tags: ["B2B Sales", "CRM", "Negotiation"],
    posted: "1 day ago",
  },
]

export function JobCards() {
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Job Opportunities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your next career move from our curated selection of top job openings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobListings.map((job) => (
            <Card
              key={job.id}
              className="group hover:shadow-lg transition-all duration-300 hover:bg-card/80 border hover:border-primary/20 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1 text-balance">
                      {job.title}
                    </h3>
                    <p className="text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveJob(job.id)
                    }}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.type} • {job.posted}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 space-x-2">
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Apply Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  )
}

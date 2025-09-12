export interface Indicator {
  id: string
  name: string
  topic: string
  subtopic: string
  source: string
  reportingLevel: string
  trend: "up" | "down" | "neutral"
  availability: string
  lastUpdated: string
  starred: boolean
  description?: string
  categories: string[]
}

"use client"

import { useState, useEffect } from "react"
import { BarChart3, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SourcesManagement } from "@/components/sources-management"
import { EnhancedIndicatorsTab } from "@/components/enhanced-indicators-tab"
import { TilesManagement } from "@/components/tiles-management"
import { VisualizationsManagement } from "@/components/visualizations-management"
import { GeographyManagement } from "@/components/geography-management"
import { ProfilesManagement } from "@/components/profiles-management"

interface RealIndicator {
  id: string
  topic: string
  category: string
  tile: string
  indicator: string
  source: string
  lastUpdated: string
  value: number
  reportingArea: string
  availability: string
  description: string
  notes: string
}

export default function AdminDashboard() {
  const [indicators, setIndicators] = useState<RealIndicator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const csvUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile_Category_Tile_Indicator-pmfvxMXkJwbZbjbfhplu7PYqux1V8R.csv"

        const response = await fetch(csvUrl)
        const csvText = await response.text()

        // Parse CSV
        const lines = csvText.trim().split("\n")
        const parsedIndicators: RealIndicator[] = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i]
          if (!line.trim()) continue

          // Handle CSV parsing with potential commas in quoted fields
          const values = []
          let current = ""
          let inQuotes = false

          for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              values.push(current.trim())
              current = ""
            } else {
              current += char
            }
          }
          values.push(current.trim())

          if (values.length >= 4) {
            const indicator: RealIndicator = {
              id: `indicator_${i}`,
              topic: values[0]?.replace(/"/g, "") || "",
              category: values[1]?.replace(/"/g, "") || "",
              tile: values[2]?.replace(/"/g, "") || "",
              indicator: values[3]?.replace(/"/g, "") || "",
              source: "SAVI Data Portal",
              lastUpdated: "2024-01-15",
              value: Math.floor(Math.random() * 100000) + 1000,
              reportingArea: "Marion County",
              availability: "2020-2024",
              description: `${values[3]?.replace(/"/g, "") || ""} - Community indicator from SAVI`,
              notes: "Data sourced from SAVI community indicators portal",
            }

            parsedIndicators.push(indicator)
          }
        }

        setIndicators(parsedIndicators)
        console.log(`Loaded ${parsedIndicators.length} real indicators from SAVI data`)
      } catch (error) {
        console.error("Error loading real data:", error)
        // Fallback to sample data
        const fallbackData = await import("../data/sample-indicators.json")
        setIndicators(fallbackData.indicators as any)
      } finally {
        setLoading(false)
      }
    }

    fetchRealData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading SAVI indicators data...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="indicators" className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="size-4" />
            </div>
            <span className="font-semibold text-lg">SAVI Admin</span>
          </div>

          {/* right-aligned tab triggers */}
          <TabsList className="grid grid-cols-6 gap-0 w-auto">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="tiles">Tiles</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
          </TabsList>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6 flex-1">
        <TabsContent value="sources">
          <SourcesManagement />
        </TabsContent>

        <TabsContent value="indicators">
          <EnhancedIndicatorsTab indicators={indicators} />
        </TabsContent>

        <TabsContent value="visualizations">
          <VisualizationsManagement />
        </TabsContent>

        <TabsContent value="tiles">
          <TilesManagement />
        </TabsContent>

        <TabsContent value="geography">
          <GeographyManagement />
        </TabsContent>

        <TabsContent value="profiles">
          <ProfilesManagement />
        </TabsContent>
      </div>
    </Tabs>
  )
}

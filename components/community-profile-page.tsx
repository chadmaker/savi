"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Map,
  Plus,
  BarChart3,
  Table,
  Download,
  Share,
  Edit,
  ArrowLeft,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CommunityProfilePageProps {
  communityName: string
  onBack: () => void
}

interface IndicatorData {
  id: string
  name: string
  category: string
  value: string | number
  timeRange: string
  source: string
  trend?: "up" | "down" | "stable"
}

export function CommunityProfilePage({ communityName, onBack }: CommunityProfilePageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])

  // Sample community stats
  const communityStats = {
    population: "34,936",
    area: "8.2 sq miles",
    medianIncome: "$52,340",
    medianAge: "32.1 years",
  }

  // Sample indicator data
  const availableIndicators: IndicatorData[] = [
    {
      id: "pop-total",
      name: "Total Population",
      category: "Demographics",
      value: "34,936",
      timeRange: "2020-2023",
      source: "US Census",
      trend: "up",
    },
    {
      id: "median-income",
      name: "Median Household Income",
      category: "Economics",
      value: "$52,340",
      timeRange: "2020-2023",
      source: "American Community Survey",
      trend: "up",
    },
    {
      id: "unemployment",
      name: "Unemployment Rate",
      category: "Economics",
      value: "4.2%",
      timeRange: "2023",
      source: "Bureau of Labor Statistics",
      trend: "down",
    },
    {
      id: "education-bachelor",
      name: "Bachelor's Degree or Higher",
      category: "Education",
      value: "42.8%",
      timeRange: "2020-2023",
      source: "American Community Survey",
      trend: "up",
    },
    {
      id: "housing-median",
      name: "Median Home Value",
      category: "Housing",
      value: "$185,400",
      timeRange: "2023",
      source: "Zillow",
      trend: "up",
    },
    {
      id: "crime-rate",
      name: "Crime Rate per 1,000",
      category: "Safety",
      value: "28.5",
      timeRange: "2023",
      source: "Local Police Department",
      trend: "down",
    },
    {
      id: "air-quality",
      name: "Air Quality Index",
      category: "Environment",
      value: "Good (45)",
      timeRange: "2023 Average",
      source: "EPA",
      trend: "stable",
    },
    {
      id: "walkability",
      name: "Walk Score",
      category: "Transportation",
      value: "72",
      timeRange: "2023",
      source: "Walk Score",
      trend: "stable",
    },
  ]

  const categories = [
    "all",
    "Demographics",
    "Economics",
    "Education",
    "Housing",
    "Safety",
    "Environment",
    "Transportation",
  ]

  const filteredIndicators = availableIndicators.filter((indicator) => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || indicator.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedIndicatorData = availableIndicators.filter((indicator) => selectedIndicators.includes(indicator.id))

  const handleToggleIndicator = (indicatorId: string) => {
    if (selectedIndicators.includes(indicatorId)) {
      setSelectedIndicators(selectedIndicators.filter((id) => id !== indicatorId))
    } else {
      setSelectedIndicators([...selectedIndicators, indicatorId])
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <span className="text-green-600">↗</span>
      case "down":
        return <span className="text-red-600">↘</span>
      case "stable":
        return <span className="text-gray-600">→</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Image src="/pro-tools-logo.png" alt="Pro Tools Logo" width={80} height={32} />
          </div>
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search with Pro Tools AI" className="pl-10 w-full" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>User Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Bottom Row */}
        <div className="flex h-16 items-center gap-10 px-6">
          <h1 className="text-xl font-bold text-gray-800">Pro Tools</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Pro Tools</span>
            <span className="font-medium text-gray-900">{communityName} Profile</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Community Overview Panel */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">{communityName}</CardTitle>
                <p className="text-gray-600 mt-1">Community Profile Overview</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{communityStats.population}</div>
                <div className="text-sm text-gray-600">Population</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{communityStats.area}</div>
                <div className="text-sm text-gray-600">Area</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{communityStats.medianIncome}</div>
                <div className="text-sm text-gray-600">Median Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{communityStats.medianAge}</div>
                <div className="text-sm text-gray-600">Median Age</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Interactive Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <Map className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">{communityName} Geographic View</p>
                <p className="text-gray-500 text-sm mt-2">Interactive map with demographic overlays</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Indicator Search and Selection */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Data Explorer</CardTitle>
              <p className="text-gray-600">Search and add indicators to your profile</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search indicators..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredIndicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedIndicators.includes(indicator.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleToggleIndicator(indicator.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                          {getTrendIcon(indicator.trend)}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {indicator.category}
                          </Badge>
                          <span className="text-sm text-gray-600">{indicator.timeRange}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{indicator.value}</div>
                        <Button
                          variant={selectedIndicators.includes(indicator.id) ? "default" : "outline"}
                          size="sm"
                          className="mt-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {selectedIndicators.includes(indicator.id) ? "Added" : "Add"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Indicators Display */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Profile Data</CardTitle>
                  <p className="text-gray-600">Selected indicators ({selectedIndicators.length})</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Table className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Chart
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedIndicatorData.length > 0 ? (
                <div className="space-y-4">
                  {selectedIndicatorData.map((indicator) => (
                    <div key={indicator.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(indicator.trend)}
                          <Button variant="ghost" size="sm" onClick={() => handleToggleIndicator(indicator.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Value:</span>
                          <span className="ml-2 font-semibold">{indicator.value}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time Range:</span>
                          <span className="ml-2">{indicator.timeRange}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="ml-2">{indicator.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Source:</span>
                          <span className="ml-2">{indicator.source}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No indicators selected</p>
                  <p className="text-sm mt-1">Add indicators from the Data Explorer to build your profile</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

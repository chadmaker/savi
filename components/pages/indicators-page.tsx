"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, Star, TrendingUp, List, LayoutGrid } from "lucide-react"

interface IndicatorsPageProps {
  onSelectIndicators: () => void
}

export function IndicatorsPage({ onSelectIndicators }: IndicatorsPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)
  const [savedIndicators, setSavedIndicators] = useState([
    {
      id: 1,
      name: "Median Household Income",
      category: "Economics",
      starred: true,
      timeRange: "2010-2023",
      lastUsed: "2024-01-15",
    },
    {
      id: 2,
      name: "High School Graduation Rate",
      category: "Education",
      starred: false,
      timeRange: "2015-2023",
      lastUsed: "2024-01-12",
    },
    {
      id: 3,
      name: "Population Density",
      category: "Demographics",
      starred: true,
      timeRange: "2010-2023",
      lastUsed: "2024-01-10",
    },
    {
      id: 4,
      name: "Housing Units",
      category: "Housing",
      starred: false,
      timeRange: "2010-2023",
      lastUsed: "2024-01-08",
    },
    {
      id: 5,
      name: "Poverty Rate",
      category: "Economics",
      starred: true,
      timeRange: "2010-2023",
      lastUsed: "2024-01-05",
    },
  ])

  const getCategoryColor = (category: string) => {
    const colors = {
      Economics: "bg-green-100 text-green-800",
      Education: "bg-blue-100 text-blue-800",
      Demographics: "bg-purple-100 text-purple-800",
      Housing: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const toggleStar = (id: number) => {
    setSavedIndicators((prevIndicators) =>
      prevIndicators.map((indicator) =>
        indicator.id === id ? { ...indicator, starred: !indicator.starred } : indicator,
      ),
    )
  }

  const filteredIndicators = showStarred ? savedIndicators.filter((indicator) => indicator.starred) : savedIndicators

  return (
    <div>
      {/* Header Section */}
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center mb-12">
        <div className="rounded-full bg-green-100 p-6 mb-6">
          <Database className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Indicators</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Browse and select data indicators for your analysis. Access demographics, education, economics, and housing
          data.
        </p>
        <Button onClick={onSelectIndicators} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Select Data Indicators
        </Button>
      </div>

      {/* Saved Indicators */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Indicators</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant={showStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarred(!showStarred)}
            >
              ⭐ Starred
            </Button>
          </div>
        </div>

        {filteredIndicators.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndicators.map((indicator) => (
                <Card key={indicator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">{indicator.name}</h3>
                        <Badge className={getCategoryColor(indicator.category)}>{indicator.category}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleStar(indicator.id)}>
                        <Star
                          className={`h-4 w-4 ${indicator.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{indicator.timeRange}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Indicator Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Category</th>
                    <th className="text-left p-4 font-medium text-gray-900">Time Range</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Used</th>
                    <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicators.map((indicator, index) => (
                    <tr key={indicator.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-gray-900">{indicator.name}</td>
                      <td className="p-4">
                        <Badge className={getCategoryColor(indicator.category)}>{indicator.category}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{indicator.timeRange}</td>
                      <td className="p-4 text-gray-600">{new Date(indicator.lastUsed).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button variant="ghost" onClick={() => toggleStar(indicator.id)}>
                          <Star
                            className={`h-4 w-4 ${indicator.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Database className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>No saved indicators yet. Browse indicators to save your favorites.</p>
          </div>
        )}
      </div>
    </div>
  )
}

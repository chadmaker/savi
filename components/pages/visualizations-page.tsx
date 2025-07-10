"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, BarChart3, Map, Table, User, Calendar, List, LayoutGrid, Star, StarOff } from "lucide-react"

export function VisualizationsPage() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)

  const savedVisualizations = [
    {
      id: 1,
      name: "Marion County Demographics",
      type: "Map",
      lastModified: "2024-01-15",
      communities: 3,
      indicators: 5,
      description: "Population and demographic analysis",
      starred: true,
    },
    {
      id: 2,
      name: "Education Trends Analysis",
      type: "Chart",
      lastModified: "2024-01-12",
      communities: 8,
      indicators: 3,
      description: "School performance across neighborhoods",
      starred: false,
    },
    {
      id: 3,
      name: "Housing Market Overview",
      type: "Table",
      lastModified: "2024-01-10",
      communities: 5,
      indicators: 7,
      description: "Real estate trends and affordability",
      starred: true,
    },
    {
      id: 4,
      name: "Community Health Profile",
      type: "Profile",
      lastModified: "2024-01-08",
      communities: 2,
      indicators: 4,
      description: "Health outcomes and access metrics",
      starred: false,
    },
  ]

  const getTypeIcon = (type: string) => {
    const icons = {
      Map: Map,
      Chart: BarChart3,
      Table: Table,
      Profile: User,
    }
    const Icon = icons[type as keyof typeof icons] || BarChart3
    return <Icon className="h-4 w-4" />
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Map: "bg-blue-100 text-blue-800",
      Chart: "bg-green-100 text-green-800",
      Table: "bg-purple-100 text-purple-800",
      Profile: "bg-orange-100 text-orange-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const toggleStar = (id: number) => {
    // In a real application, you would update the state or database here
    console.log(`Visualization ${id} starred status toggled`)
  }

  const filteredVisualizations = showStarred ? savedVisualizations.filter((viz) => viz.starred) : savedVisualizations

  return (
    <div>
      {/* Header Section */}
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center mb-12">
        <div className="rounded-full bg-indigo-100 p-6 mb-6">
          <BarChart3 className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Visualizations</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Create and manage your data visualizations. Build maps, charts, tables, and community profiles from your
          selected data.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Start New Visualization
        </Button>
      </div>

      {/* Saved Visualizations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Visualizations</h2>
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
              {showStarred ? "⭐ Starred" : "All"}
            </Button>
          </div>
        </div>

        {filteredVisualizations.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVisualizations.map((viz) => (
                <Card key={viz.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{viz.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{viz.description}</p>
                        <Badge className={getTypeColor(viz.type)}>
                          <span className="flex items-center space-x-1">
                            {getTypeIcon(viz.type)}
                            <span>{viz.type}</span>
                          </span>
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleStar(viz.id)}>
                        {viz.starred ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Communities:</span>
                        <span>{viz.communities}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Indicators:</span>
                        <span>{viz.indicators}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(viz.lastModified).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
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
                    <th className="text-left p-4 font-medium text-gray-900">Visualization Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">Description</th>
                    <th className="text-left p-4 font-medium text-gray-900">Communities</th>
                    <th className="text-left p-4 font-medium text-gray-900">Indicators</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Modified</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisualizations.map((viz, index) => (
                    <tr key={viz.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-gray-900">{viz.name}</td>
                      <td className="p-4">
                        <Badge className={getTypeColor(viz.type)}>
                          <span className="flex items-center space-x-1">
                            {getTypeIcon(viz.type)}
                            <span>{viz.type}</span>
                          </span>
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-600">{viz.description}</td>
                      <td className="p-4 text-gray-600">{viz.communities}</td>
                      <td className="p-4 text-gray-600">{viz.indicators}</td>
                      <td className="p-4 text-gray-600">{new Date(viz.lastModified).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleStar(viz.id)}>
                            {viz.starred ? (
                              <Star className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>No saved visualizations yet. Create your first visualization to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, BarChart3, Map, Table, List, LayoutGrid, Star, MoreHorizontal, Palette } from "lucide-react"
import { UsersIcon as Profile } from "lucide-react"

interface VisualizationsPageProps {
  onAddVisualization: () => void
}

export function VisualizationsPage({ onAddVisualization }: VisualizationsPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)
  const [filter, setFilter] = useState("all")

  const [savedVisualizations, setSavedVisualizations] = useState([
    {
      id: 1,
      name: "Marion County Demographics",
      type: "Map",
      lastModified: "2024-01-15T10:30:00Z",
      geography: "Marion County",
      indicator: "Population Density",
      description: "Population and demographic analysis",
      starred: true,
    },
    {
      id: 2,
      name: "Education Trends Analysis",
      type: "Chart",
      lastModified: "2024-01-12T11:00:00Z",
      geography: "Indianapolis Metro",
      indicator: "High School Graduation Rate",
      description: "School performance across neighborhoods",
      starred: false,
    },
  ])

  const toggleStar = (id: number) => {
    setSavedVisualizations((prev) => prev.map((viz) => (viz.id === id ? { ...viz, starred: !viz.starred } : viz)))
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "map":
        return <Map className="h-4 w-4" />
      case "chart":
        return <BarChart3 className="h-4 w-4" />
      case "table":
        return <Table className="h-4 w-4" />
      case "profile":
        return <Profile className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const filteredVisualizations = savedVisualizations
    .filter((viz) => (showStarred ? viz.starred : true))
    .filter((viz) => {
      if (filter === "all") return true
      return viz.type.toLowerCase() === filter
    })

  return (
    <div>
      {/* Header Section */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-100 p-4">
              <Palette className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Studio</h2>
              <p className="text-gray-600 mt-1">
                Create and manage your data visualizations in our comprehensive studio. Build maps, charts, tables, and
                community profiles.
              </p>
            </div>
          </div>
          <Button onClick={onAddVisualization} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Visualization
          </Button>
        </div>
      </div>

      {/* My Visualizations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Visualizations</h2>
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">View All</SelectItem>
                <SelectItem value="map">Maps</SelectItem>
                <SelectItem value="chart">Charts</SelectItem>
                <SelectItem value="table">Tables</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarred(!showStarred)}
              className={showStarred ? "bg-gray-900 text-white" : ""}
            >
              <Star className={`h-4 w-4 mr-1 ${showStarred ? "fill-current text-yellow-400" : ""}`} />
              Starred
            </Button>
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
          </div>
        </div>

        {filteredVisualizations.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVisualizations.map((viz) => (
                <div
                  key={viz.id}
                  className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="flex items-center w-fit">
                        {getTypeIcon(viz.type)}
                        <span className="ml-2">{viz.type}</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-1"
                        onClick={() => toggleStar(viz.id)}
                      >
                        <Star className={`h-4 w-4 ${viz.starred ? "fill-current text-yellow-400" : "text-gray-400"}`} />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-gray-800 mt-2">{viz.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{viz.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(viz.lastModified).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button onClick={onAddVisualization} variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 w-12"></th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Geography</th>
                    <th className="text-left p-4 font-medium text-gray-900">Indicator</th>
                    <th className="text-left p-4 font-medium text-gray-900">Updated</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisualizations.map((viz, index) => (
                    <tr key={viz.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="icon" onClick={() => toggleStar(viz.id)}>
                          <Star
                            className={`h-4 w-4 ${viz.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="flex items-center w-fit">
                          {getTypeIcon(viz.type)}
                          <span className="ml-2">{viz.type}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{viz.name}</div>
                        <div className="text-sm text-gray-600">{viz.description}</div>
                      </td>
                      <td className="p-4 text-gray-600">{viz.geography}</td>
                      <td className="p-4 text-gray-600">{viz.indicator}</td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          <div>{new Date(viz.lastModified).toLocaleDateString()}</div>
                          <div>
                            {new Date(viz.lastModified).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZoneName: "short",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Button onClick={onAddVisualization} variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <Palette className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>No visualizations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

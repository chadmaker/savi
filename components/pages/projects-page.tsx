"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, BarChart3, List, LayoutGrid, Calendar, Eye, Star } from "lucide-react"

interface ProjectsPageProps {
  onCreateProject: () => void
}

export function ProjectsPage({ onCreateProject }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  // Sample projects data
  const [savedProjects, setSavedProjects] = useState([
    {
      id: 1,
      name: "Marion County Analysis",
      description: "Demographics and housing analysis",
      lastModified: "2024-01-15",
      communities: 3,
      indicators: 5,
      starred: false,
    },
    {
      id: 2,
      name: "Education Trends",
      description: "School performance across neighborhoods",
      lastModified: "2024-01-12",
      communities: 8,
      indicators: 3,
      starred: true,
    },
    {
      id: 3,
      name: "Housing Market Study",
      description: "Real estate trends and affordability",
      lastModified: "2024-01-10",
      communities: 5,
      indicators: 7,
      starred: false,
    },
  ])

  const filteredProjects = showStarredOnly ? savedProjects.filter((project) => project.starred) : savedProjects

  const toggleStar = (id: number) => {
    setSavedProjects(
      savedProjects.map((project) => (project.id === id ? { ...project, starred: !project.starred } : project)),
    )
  }

  return (
    <div>
      {/* Empty State */}
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-6">
          <BarChart3 className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Projects</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Create and manage your data visualization projects. Start exploring data by creating your first project.
        </p>
        <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Saved Projects */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
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
              variant={showStarredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarredOnly(!showStarredOnly)}
            >
              <Star className={`h-4 w-4 mr-1 ${showStarredOnly ? "fill-current" : ""}`} />
              {showStarredOnly ? "⭐ Starred" : "Starred"}
            </Button>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Communities:</span>
                        <span>{project.communities}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Indicators:</span>
                        <span>{project.indicators}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(project.id)
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${project.starred ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
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
                    <th className="text-left p-4 font-medium text-gray-900">Project Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Description</th>
                    <th className="text-left p-4 font-medium text-gray-900">Communities</th>
                    <th className="text-left p-4 font-medium text-gray-900">Indicators</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Modified</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-gray-900">{project.name}</td>
                      <td className="p-4 text-gray-600">{project.description}</td>
                      <td className="p-4 text-gray-600">{project.communities}</td>
                      <td className="p-4 text-gray-600">{project.indicators}</td>
                      <td className="p-4 text-gray-600">{new Date(project.lastModified).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleStar(project.id)}>
                            <Star
                              className={`h-4 w-4 ${project.starred ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`}
                            />
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
            <p>No saved projects yet. Create your first project to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Folder, List, LayoutGrid, Eye, Star, Lock, Users, Link, MoreHorizontal } from "lucide-react"

interface ProjectsPageProps {
  onCreateProject: () => void
  onOpenProject: (projectData: any) => void
}

export function ProjectsPage({ onCreateProject, onOpenProject }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("list")
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [filter, setFilter] = useState("all")

  // Sample projects data
  const [savedProjects, setSavedProjects] = useState([
    {
      id: 1,
      name: "Marion County Analysis",
      description: "Demographics and housing analysis",
      visibility: "private",
      lastModified: "2024-01-15T14:30:00",
      communities: 3,
      indicators: 5,
      visualizations: 2,
      starred: false,
    },
    {
      id: 2,
      name: "Education Trends",
      description: "School performance across neighborhoods",
      visibility: "community",
      lastModified: "2024-01-12T09:15:00",
      communities: 8,
      indicators: 3,
      visualizations: 1,
      starred: true,
    },
    {
      id: 3,
      name: "Housing Market Study",
      description: "Real estate trends and affordability",
      visibility: "unlisted",
      lastModified: "2024-01-10T16:45:00",
      communities: 5,
      indicators: 7,
      visualizations: 3,
      starred: false,
    },
  ])

  const filteredProjects = savedProjects
    .filter((project) => (showStarredOnly ? project.starred : true))
    .filter((project) => {
      if (filter === "all") return true
      if (filter === "shared") return project.visibility === "unlisted" || project.visibility === "community"
      return true
    })

  const toggleStar = (id: number) => {
    setSavedProjects(
      savedProjects.map((project) => (project.id === id ? { ...project, starred: !project.starred } : project)),
    )
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-3 w-3" />
      case "unlisted":
        return <Link className="h-3 w-3" />
      case "community":
        return <Users className="h-3 w-3" />
      default:
        return <Lock className="h-3 w-3" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Private"
      case "unlisted":
        return "Shared"
      case "community":
        return "Community"
      default:
        return "Private"
    }
  }

  const handleOpenProject = (project: any) => {
    // Convert the saved project data to match the expected format
    const projectData = {
      name: project.name,
      description: project.description,
      visibility: project.visibility,
      relatedPopulations: [],
      relatedTopics: [],
      createdDate: new Date().toISOString(), // Use current date as placeholder
      lastModified: project.lastModified,
    }
    onOpenProject(projectData)
  }

  return (
    <div>
      {/* Header Section */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-100 p-4">
              <Folder className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Projects</h2>
              <p className="text-gray-600 mt-1">
                Use data projects to organize your data, communities, and visualizations in one area. Projects can be
                shared.
              </p>
            </div>
          </div>
          <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* Saved Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Data Projects</h2>
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">View all</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showStarredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={showStarredOnly ? "bg-gray-900 text-white" : ""}
            >
              <Star className={`h-4 w-4 mr-1 ${showStarredOnly ? "fill-current text-yellow-400" : ""}`} />
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

        {filteredProjects.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-1"
                        onClick={() => toggleStar(project.id)}
                      >
                        <Star
                          className={`h-4 w-4 ${project.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{project.description}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      {getVisibilityIcon(project.visibility)}
                      <span>{getVisibilityLabel(project.visibility)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{project.communities} Communities</span>
                      <span>{project.indicators} Indicators</span>
                      <span>{project.visualizations} Visuals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(project.lastModified).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleOpenProject(project)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Open
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
                    <th className="text-left p-4 font-medium text-gray-900">Project Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Visibility</th>
                    <th className="text-left p-4 font-medium text-gray-900">Communities</th>
                    <th className="text-left p-4 font-medium text-gray-900">Indicators</th>
                    <th className="text-left p-4 font-medium text-gray-900">Visualizations</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Modified</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => toggleStar(project.id)}>
                          <Star
                            className={`h-4 w-4 ${project.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-600">{project.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {getVisibilityIcon(project.visibility)}
                          <span>{getVisibilityLabel(project.visibility)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{project.communities}</td>
                      <td className="p-4 text-gray-600">{project.indicators}</td>
                      <td className="p-4 text-gray-600">{project.visualizations}</td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          <div>{new Date(project.lastModified).toLocaleDateString()}</div>
                          <div>
                            {new Date(project.lastModified).toLocaleTimeString("en-US", {
                              hour12: true,
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm" onClick={() => handleOpenProject(project)}>
                            <Eye className="h-3 w-3 mr-1" />
                            Open
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
            <Folder className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>No saved data projects match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

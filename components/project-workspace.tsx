"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Map, BarChart3, Upload, Eye, Calendar, List, LayoutGrid, Star, Edit, Plus } from "lucide-react"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModal } from "./modals/select-indicators-modal"
import { DataUploadModal } from "./modals/data-upload-modal"
import { CreateProjectModal } from "./modals/create-project-modal"
import type { ProjectData } from "./modals/create-project-modal"

interface ProjectWorkspaceProps {
  projectName: string
  projectData?: ProjectData & { createdDate: string }
  onStartVisualization: () => void
  onBackToDashboard: () => void
  onUpdateProject?: (projectData: ProjectData) => void
}

export function ProjectWorkspace({
  projectName,
  projectData,
  onStartVisualization,
  onBackToDashboard,
  onUpdateProject,
}: ProjectWorkspaceProps) {
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [showIndicatorsModal, setShowIndicatorsModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [uploadedDatasets, setUploadedDatasets] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  // Sample data for demonstration
  const savedCommunities = [
    { id: 1, name: "Marion County", type: "County", starred: true, lastUsed: "2024-01-15" },
    { id: 2, name: "Broad Ripple", type: "Neighborhood", starred: false, lastUsed: "2024-01-12" },
  ]

  const savedIndicators = [
    { id: 1, name: "Median Household Income", category: "Economics", starred: true, timeRange: "2010-2023" },
    { id: 2, name: "Population Density", category: "Demographics", starred: false, timeRange: "2010-2023" },
  ]

  const savedCharts = [{ id: 1, name: "Population Trends", type: "Chart", starred: false, lastModified: "2024-01-15" }]

  const savedMaps = [{ id: 1, name: "Income Distribution", type: "Map", starred: true, lastModified: "2024-01-14" }]

  const canStartVisualization = selectedCommunities.length > 0 && selectedIndicators.length > 0

  const handleEditProject = (updatedData: ProjectData) => {
    if (onUpdateProject) {
      onUpdateProject(updatedData)
    }
    setShowEditModal(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6">
          {/* Single row with Back, Project Name, and Edit */}
          <div className="flex items-center space-x-4 py-4">
            <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">{projectName}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Project Details Panel */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                {projectData?.description && <p className="text-gray-600">{projectData.description}</p>}

                {projectData?.createdDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created {new Date(projectData.createdDate).toLocaleDateString()}</span>
                  </div>
                )}

                {(projectData?.relatedTopics?.length || projectData?.relatedPopulations?.length) && (
                  <div className="space-y-3">
                    {Array.isArray(projectData?.relatedTopics) && projectData.relatedTopics.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Related Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {projectData.relatedTopics.map((topic) => (
                            <Badge key={topic} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {Array.isArray(projectData?.relatedPopulations) && projectData.relatedPopulations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Related Populations</h4>
                        <div className="flex flex-wrap gap-2">
                          {projectData.relatedPopulations.map((population) => (
                            <Badge
                              key={population}
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {population}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Strip */}
          <div className="flex items-center space-x-4 mb-8">
            <Button onClick={() => setShowCommunityModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Community
            </Button>
            <Button onClick={() => setShowIndicatorsModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Indicators
            </Button>
            <Button onClick={() => setShowUploadModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
            <Button onClick={onStartVisualization} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Visualization
            </Button>
          </div>

          {/* Build Your Project Heading */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Build Your Project</h2>
            <p className="text-gray-600 mb-8">
              Start building your project by adding one or more Communities. Then you can select Indicators (and upload
              your data) to create charts, maps and reports.
            </p>

            {/* Primary Action Tiles - Four Equal Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
                onClick={() => setShowCommunityModal(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="rounded-full bg-blue-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Map className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Community</h3>
                  <p className="text-gray-600">Choose geographic areas to analyze</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200"
                onClick={() => setShowIndicatorsModal(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="rounded-full bg-green-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Indicators</h3>
                  <p className="text-gray-600">Choose data points to visualize</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200"
                onClick={() => setShowUploadModal(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="rounded-full bg-purple-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Data</h3>
                  <p className="text-gray-600">Import your own datasets</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-200"
                onClick={onStartVisualization}
              >
                <CardContent className="p-8 text-center">
                  <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Visualization</h3>
                  <p className="text-gray-600">Create charts, maps and reports</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Communities Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Communities</h3>
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
                  ⭐ Starred
                </Button>
              </div>
            </div>

            {savedCommunities.length > 0 ? (
              viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCommunities.map((community) => (
                    <Card key={community.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{community.name}</h4>
                            <Badge variant="secondary" className="mt-1">
                              {community.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Star
                              className={`h-4 w-4 ${community.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">
                            Last used: {new Date(community.lastUsed).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">
                            Use
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
                        <th className="text-left p-4 font-medium text-gray-900">Community</th>
                        <th className="text-left p-4 font-medium text-gray-900">Type</th>
                        <th className="text-left p-4 font-medium text-gray-900">Last Used</th>
                        <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedCommunities.map((community, index) => (
                        <tr key={community.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-4 font-medium text-gray-900">{community.name}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{community.type}</Badge>
                          </td>
                          <td className="p-4 text-gray-600">{new Date(community.lastUsed).toLocaleDateString()}</td>
                          <td className="p-4">
                            <Star
                              className={`h-4 w-4 ${community.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                            />
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">
                              Use
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500 border rounded-lg">
                <Map className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>No communities added yet. Add your first community to get started.</p>
              </div>
            )}
          </div>

          {/* Indicators Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Data Indicators</h3>
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
                  ⭐ Starred
                </Button>
              </div>
            </div>

            <div className="text-center py-12 text-gray-500 border rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-gray-300" />
              <p>No indicators added yet. Add data indicators to analyze your communities.</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Charts</h3>
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
                  ⭐ Starred
                </Button>
              </div>
            </div>

            {savedCharts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCharts.map((chart) => (
                  <Card key={chart.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{chart.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {chart.type}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Star
                            className={`h-4 w-4 ${chart.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          Modified: {new Date(chart.lastModified).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>No charts created yet. Start visualization to create charts.</p>
              </div>
            )}
          </div>

          {/* Start Visualization */}
          <div className="text-center">
            <Button
              onClick={onStartVisualization}
              disabled={!canStartVisualization}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
            >
              <Eye className="h-5 w-5 mr-2" />
              Start Visualization
            </Button>
          </div>
        </div>
      </main>

      <SelectCommunityModal
        open={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        selectedCommunities={selectedCommunities}
        onSelectionChange={setSelectedCommunities}
      />

      <SelectIndicatorsModal
        open={showIndicatorsModal}
        onClose={() => setShowIndicatorsModal(false)}
        selectedIndicators={selectedIndicators}
        onSelectionChange={setSelectedIndicators}
      />

      <DataUploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />

      <CreateProjectModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onCreateProject={handleEditProject}
        editData={projectData}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Map, BarChart3, Upload, Eye, List, LayoutGrid, Star, Edit, Lock, Link, ArrowLeft } from "lucide-react"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModal } from "./modals/select-indicators-modal"
import { DataUploadModal } from "./modals/data-upload-modal"
import { CreateProjectModal } from "./modals/create-project-modal"
import type { ProjectData } from "./modals/create-project-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectWorkspaceProps {
  projectName: string
  projectData?: ProjectData & { createdDate: string; lastModified?: string }
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

  // Set initial state to empty arrays and card view
  const [uploadedDatasets, setUploadedDatasets] = useState<any[]>([])
  const [savedCommunities, setSavedCommunities] = useState<any[]>([])
  const [savedIndicators, setSavedIndicators] = useState<any[]>([])
  const [savedVisualizations, setSavedVisualizations] = useState<any[]>([])

  const [communitiesViewMode, setCommunitiesViewMode] = useState<"card" | "list">("card")
  const [indicatorsViewMode, setIndicatorsViewMode] = useState<"card" | "list">("card")
  const [uploadsViewMode, setUploadsViewMode] = useState<"card" | "list">("card")
  const [visualizationsViewMode, setVisualizationsViewMode] = useState<"card" | "list">("card")

  const [communitiesShowStarred, setCommunitiesShowStarred] = useState(false)
  const [indicatorsShowStarred, setIndicatorsShowStarred] = useState(false)
  const [uploadsShowStarred, setUploadsShowStarred] = useState(false)
  const [visualizationsShowStarred, setVisualizationsShowStarred] = useState(false)

  const toggleCommunityStarred = (id: number) => {
    setSavedCommunities((prev) =>
      prev.map((community) => (community.id === id ? { ...community, starred: !community.starred } : community)),
    )
  }

  const toggleIndicatorStarred = (id: number) => {
    setSavedIndicators((prev) =>
      prev.map((indicator) => (indicator.id === id ? { ...indicator, starred: !indicator.starred } : indicator)),
    )
  }

  const toggleVisualizationStarred = (id: number) => {
    setSavedVisualizations((prev) => prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item)))
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-4 w-4 text-gray-500" />
      case "unlisted":
        return <Link className="h-4 w-4 text-gray-500" />
      case "community":
        return <Link className="h-4 w-4 text-gray-500" />
      default:
        return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Private"
      case "unlisted":
        return "Unlisted"
      case "community":
        return "Community"
      default:
        return "Private"
    }
  }

  const handleEditProject = (updatedData: ProjectData) => {
    if (onUpdateProject) {
      onUpdateProject(updatedData)
    }
    setShowEditModal(false)
  }

  const filteredCommunities = communitiesShowStarred
    ? savedCommunities.filter((community) => community.starred)
    : savedCommunities
  const filteredIndicators = indicatorsShowStarred
    ? savedIndicators.filter((indicator) => indicator.starred)
    : savedIndicators
  const filteredUploads = uploadsShowStarred ? uploadedDatasets.filter((dataset) => dataset.starred) : uploadedDatasets
  const filteredVisualizations = visualizationsShowStarred
    ? savedVisualizations.filter((item) => item.starred)
    : savedVisualizations

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl">
          {/* Project Header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBackToDashboard} className="text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All projects
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 text-center flex-grow">{projectName}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>

          {/* Shaded Project Details Area */}
          <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-6">
              {projectData?.createdDate && (
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Created: </span>
                  <span className="text-gray-800">{new Date(projectData.createdDate).toLocaleDateString()}</span>
                </div>
              )}
              {projectData?.lastModified && (
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Updated: </span>
                  <span className="text-gray-800">{new Date(projectData.lastModified).toLocaleDateString()}</span>
                </div>
              )}
              {projectData?.visibility && (
                <div className="text-sm flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Visibility: </span>
                  <div className="flex items-center text-gray-800">
                    {getVisibilityIcon(projectData.visibility)}
                    <span className="ml-2">{getVisibilityLabel(projectData.visibility)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Communities Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Communities</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md bg-white">
                  <Button
                    variant={communitiesViewMode === "card" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCommunitiesViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={communitiesViewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCommunitiesViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommunitiesShowStarred(!communitiesShowStarred)}
                  className="bg-white"
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${communitiesShowStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                  />
                  Starred
                </Button>
              </div>
            </div>

            {communitiesViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunities.map((community) => (
                  <Card key={community.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">{/* Card content here */}</CardContent>
                  </Card>
                ))}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-300 bg-blue-50/50"
                  onClick={() => setShowCommunityModal(true)}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full min-h-[140px]">
                    <div className="rounded-full bg-blue-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Map className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Add Community</h4>
                    <p className="text-sm text-gray-600">Choose geographic areas</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">{/* Table content here */}</table>
                <div className="p-4 bg-gray-50">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-blue-300 text-blue-600 bg-white hover:bg-blue-50"
                    onClick={() => setShowCommunityModal(true)}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Add Community
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Data Indicators Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Indicators</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md bg-white">
                  <Button
                    variant={indicatorsViewMode === "card" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setIndicatorsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={indicatorsViewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setIndicatorsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIndicatorsShowStarred(!indicatorsShowStarred)}
                  className="bg-white"
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${indicatorsShowStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                  />
                  Starred
                </Button>
              </div>
            </div>

            {indicatorsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIndicators.map((indicator) => (
                  <Card key={indicator.id} className="hover:shadow-md transition-shadow">
                    {/* Card content here */}
                  </Card>
                ))}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-green-200 hover:border-green-300 bg-green-50/50"
                  onClick={() => setShowIndicatorsModal(true)}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full min-h-[140px]">
                    <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Add Indicators</h4>
                    <p className="text-sm text-gray-600">Choose data points</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">{/* Table content here */}</table>
                <div className="p-4 bg-gray-50">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-green-300 text-green-600 bg-white hover:bg-green-50"
                    onClick={() => setShowIndicatorsModal(true)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Add Indicator
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Data Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Uploaded Datasets</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md bg-white">
                  <Button
                    variant={uploadsViewMode === "card" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setUploadsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={uploadsViewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setUploadsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadsShowStarred(!uploadsShowStarred)}
                  className="bg-white"
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${uploadsShowStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                  />
                  Starred
                </Button>
              </div>
            </div>

            {uploadsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUploads.map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                    {/* Card content here */}
                  </Card>
                ))}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-300 bg-purple-50/50"
                  onClick={() => setShowUploadModal(true)}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full min-h-[140px]">
                    <div className="rounded-full bg-purple-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Upload Data</h4>
                    <p className="text-sm text-gray-600">Import datasets</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">{/* Table content here */}</table>
                <div className="p-4 bg-gray-50">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-purple-300 text-purple-600 bg-white hover:bg-purple-50"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Visualizations Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Visualizations</h4>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">View All</SelectItem>
                    <SelectItem value="charts">Charts</SelectItem>
                    <SelectItem value="maps">Maps</SelectItem>
                    <SelectItem value="profiles">Profiles</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md bg-white">
                  <Button
                    variant={visualizationsViewMode === "card" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setVisualizationsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={visualizationsViewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setVisualizationsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisualizationsShowStarred(!visualizationsShowStarred)}
                  className="bg-white"
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${visualizationsShowStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                  />
                  Starred
                </Button>
              </div>
            </div>

            {visualizationsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVisualizations.map((item) => (
                  <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
                    {/* Card content here */}
                  </Card>
                ))}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-indigo-200 hover:border-indigo-300 bg-indigo-50/50"
                  onClick={onStartVisualization}
                >
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full min-h-[140px]">
                    <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Add Visualization</h4>
                    <p className="text-sm text-gray-600">Create charts & maps</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">{/* Table content here */}</table>
                <div className="p-4 bg-gray-50">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-indigo-300 text-indigo-600 bg-white hover:bg-indigo-50"
                    onClick={onStartVisualization}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Add Visualization
                  </Button>
                </div>
              </div>
            )}
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

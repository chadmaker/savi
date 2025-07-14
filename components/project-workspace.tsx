"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, BarChart3, Upload, Eye, Calendar, List, LayoutGrid, Star, Edit, Lock, Users, Link } from "lucide-react"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModal } from "./modals/select-indicators-modal"
import { DataUploadModal } from "./modals/data-upload-modal"
import { CreateProjectModal } from "./modals/create-project-modal"
import type { ProjectData } from "./modals/create-project-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

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
  const [uploadedDatasets, setUploadedDatasets] = useState<any[]>([])

  const [communitiesViewMode, setCommunitiesViewMode] = useState<"card" | "list">("list")
  const [indicatorsViewMode, setIndicatorsViewMode] = useState<"card" | "list">("list")
  const [uploadsViewMode, setUploadsViewMode] = useState<"card" | "list">("list")
  const [visualizationsViewMode, setVisualizationsViewMode] = useState<"card" | "list">("list")

  const [communitiesShowStarred, setCommunitiesShowStarred] = useState(false)
  const [indicatorsShowStarred, setIndicatorsShowStarred] = useState(false)
  const [uploadsShowStarred, setUploadsShowStarred] = useState(false)
  const [visualizationsShowStarred, setVisualizationsShowStarred] = useState(false)

  // Sample data for demonstration
  const [savedCommunities, setSavedCommunities] = useState([
    { id: 1, name: "Marion County", type: "County", starred: true, lastUsed: "2024-01-15" },
    { id: 2, name: "Broad Ripple", type: "Neighborhood", starred: false, lastUsed: "2024-01-12" },
  ])

  const [savedIndicators, setSavedIndicators] = useState([
    { id: 1, name: "Median Household Income", category: "Economics", starred: true, timeRange: "2010-2023" },
    { id: 2, name: "Population Density", category: "Demographics", starred: false, timeRange: "2010-2023" },
  ])

  const [savedCharts, setSavedCharts] = useState([
    { id: 1, name: "Population Trends", type: "Chart", starred: false, lastModified: "2024-01-15" },
  ])

  const [savedMaps, setSavedMaps] = useState([
    { id: 1, name: "Income Distribution", type: "Map", starred: true, lastModified: "2024-01-14" },
  ])

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

  const toggleVisualizationStarred = (id: number, type: "chart" | "map") => {
    if (type === "chart") {
      setSavedCharts((prev) => prev.map((chart) => (chart.id === id ? { ...chart, starred: !chart.starred } : chart)))
    } else {
      setSavedMaps((prev) => prev.map((map) => (map.id === id ? { ...map, starred: !map.starred } : map)))
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-4 w-4 text-gray-500" />
      case "unlisted":
        return <Link className="h-4 w-4 text-gray-500" />
      case "community":
        return <Users className="h-4 w-4 text-gray-500" />
      default:
        return <Lock className="h-4 w-4 text-gray-500" />
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
  const filteredVisualizations = visualizationsShowStarred
    ? [...savedCharts, ...savedMaps].filter((item) => item.starred)
    : [...savedCharts, ...savedMaps]

  return (
    <div className="min-h-screen bg-white">
      {/* Global Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <button
              onClick={onBackToDashboard}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image src="/savi-logo.png" alt="SAVI Logo" width={100} height={40} />
            </button>

            {/* Navigation Tabs */}
            <nav className="flex space-x-8">
              <button
                onClick={onBackToDashboard}
                className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 text-sm font-medium"
              >
                Projects
              </button>
              <button
                onClick={onBackToDashboard}
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 py-4 px-1 text-sm font-medium"
              >
                Communities
              </button>
              <button
                onClick={onBackToDashboard}
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 py-4 px-1 text-sm font-medium"
              >
                Indicators
              </button>
              <button
                onClick={onBackToDashboard}
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 py-4 px-1 text-sm font-medium"
              >
                Uploads
              </button>
              <button
                onClick={onBackToDashboard}
                className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 py-4 px-1 text-sm font-medium"
              >
                Visualizations
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Project Header & Details Container */}
        <div className="p-4 mb-8" style={{ padding: "16px" }}>
          {/* Project Header Row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{projectName}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>

          {/* Project Details - Horizontal Layout */}
          <div className="flex items-center space-x-6 mb-4">
            {/* Visibility */}
            {projectData?.visibility && (
              <div className="flex items-center text-sm text-gray-600">
                {getVisibilityIcon(projectData.visibility)}
                <span className="font-medium ml-2">Visibility:</span>
                <span className="ml-1">{getVisibilityLabel(projectData.visibility)}</span>
              </div>
            )}

            {/* Created Date */}
            {projectData?.createdDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                <span className="font-medium">Created:</span>
                <span className="ml-1">{new Date(projectData.createdDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Last Modified */}
            {projectData?.lastModified && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Last Updated:</span>
                <span className="ml-1">{new Date(projectData.lastModified).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {projectData?.description && (
            <div className="mb-4">
              <span className="text-sm font-medium text-blue-600">Description:</span>
              <span className="text-sm text-gray-600 ml-2">{projectData.description}</span>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Communities Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Communities</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={communitiesViewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCommunitiesViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={communitiesViewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCommunitiesViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant={communitiesShowStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCommunitiesShowStarred(!communitiesShowStarred)}
                  className={communitiesShowStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${communitiesShowStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
              </div>
            </div>

            {communitiesViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunities.map((community) => (
                  <Card key={community.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{community.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {community.type}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleCommunityStarred(community.id)}>
                          <Star
                            className={`h-4 w-4 ${community.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
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

                {/* Add Community Action Card */}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-300"
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
                    {filteredCommunities.map((community, index) => (
                      <tr key={community.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-4 font-medium text-gray-900">{community.name}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{community.type}</Badge>
                        </td>
                        <td className="p-4 text-gray-600">{new Date(community.lastUsed).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => toggleCommunityStarred(community.id)}>
                            <Star
                              className={`h-4 w-4 ${community.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            Use
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-blue-200 hover:border-blue-300 text-blue-600 bg-transparent"
                          onClick={() => setShowCommunityModal(true)}
                        >
                          <Map className="h-4 w-4 mr-2" />
                          Add Community
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Data Indicators Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Indicators</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={indicatorsViewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIndicatorsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={indicatorsViewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIndicatorsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant={indicatorsShowStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIndicatorsShowStarred(!indicatorsShowStarred)}
                  className={indicatorsShowStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${indicatorsShowStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
              </div>
            </div>

            {indicatorsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIndicators.map((indicator) => (
                  <Card key={indicator.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {indicator.category}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleIndicatorStarred(indicator.id)}>
                          <Star
                            className={`h-4 w-4 ${indicator.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">Time Range: {indicator.timeRange}</span>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Indicators Action Card */}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-green-200 hover:border-green-300"
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
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Indicator</th>
                      <th className="text-left p-4 font-medium text-gray-900">Category</th>
                      <th className="text-left p-4 font-medium text-gray-900">Time Range</th>
                      <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIndicators.map((indicator, index) => (
                      <tr key={indicator.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-4 font-medium text-gray-900">{indicator.name}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{indicator.category}</Badge>
                        </td>
                        <td className="p-4 text-gray-600">{indicator.timeRange}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => toggleIndicatorStarred(indicator.id)}>
                            <Star
                              className={`h-4 w-4 ${indicator.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            Use
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-green-200 hover:border-green-300 text-green-600 bg-transparent"
                          onClick={() => setShowIndicatorsModal(true)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Add Indicator
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Data Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Uploaded Datasets</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={uploadsViewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setUploadsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={uploadsViewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setUploadsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant={uploadsShowStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadsShowStarred(!uploadsShowStarred)}
                  className={uploadsShowStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${uploadsShowStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
              </div>
            </div>

            {uploadsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedDatasets.map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{dataset.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {dataset.size}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">Records: {dataset.records}</span>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Upload Data Action Card */}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-purple-200 hover:border-purple-300"
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
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Dataset</th>
                      <th className="text-left p-4 font-medium text-gray-900">Size</th>
                      <th className="text-left p-4 font-medium text-gray-900">Records</th>
                      <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedDatasets.map((dataset, index) => (
                      <tr key={dataset.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-4 font-medium text-gray-900">{dataset.name}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{dataset.size}</Badge>
                        </td>
                        <td className="p-4 text-gray-600">{dataset.records}</td>
                        <td className="p-4">
                          <Star className="h-4 w-4 text-gray-400" />
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            Use
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-purple-200 hover:border-purple-300 text-purple-600 bg-transparent"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Data
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Visualizations Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Saved Visualizations</h4>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">View All</SelectItem>
                    <SelectItem value="charts">Charts</SelectItem>
                    <SelectItem value="maps">Maps</SelectItem>
                    <SelectItem value="profiles">Profiles</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={visualizationsViewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setVisualizationsViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={visualizationsViewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setVisualizationsViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant={visualizationsShowStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualizationsShowStarred(!visualizationsShowStarred)}
                  className={visualizationsShowStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${visualizationsShowStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
              </div>
            </div>

            {visualizationsViewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVisualizations.map((item) => (
                  <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {item.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleVisualizationStarred(item.id, item.type.toLowerCase() as "chart" | "map")
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${item.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          Modified: {new Date(item.lastModified).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Visualization Action Card */}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-indigo-200 hover:border-indigo-300"
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
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Visualization</th>
                      <th className="text-left p-4 font-medium text-gray-900">Type</th>
                      <th className="text-left p-4 font-medium text-gray-900">Modified</th>
                      <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisualizations.map((item, index) => (
                      <tr key={`${item.type}-${item.id}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-4 font-medium text-gray-900">{item.name}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{item.type}</Badge>
                        </td>
                        <td className="p-4 text-gray-600">{new Date(item.lastModified).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleVisualizationStarred(item.id, item.type.toLowerCase() as "chart" | "map")
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${item.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4">
                        <Button
                          variant="outline"
                          className="w-full border-dashed border-indigo-200 hover:border-indigo-300 text-indigo-600 bg-transparent"
                          onClick={onStartVisualization}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Add Visualization
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

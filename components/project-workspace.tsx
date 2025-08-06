"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectCommunityModal } from "@/components/modals/select-community-modal"
import { SelectIndicatorsModal } from "@/components/modals/select-indicators-modal"
import { DataUploadModal } from "@/components/modals/data-upload-modal"
import { ArrowLeft, MapPin, BarChart3, Database, Upload, Eye, Settings, Share } from "lucide-react"
import { Grid3X3, List } from "lucide-react"
import type { ProjectData } from "./modals/create-project-modal"
import { CreateProjectModal } from "./modals/create-project-modal"

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
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
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
    { id: 2, name: "Economic Analysis", type: "Table", starred: false, lastModified: "2024-01-13" },
  ])

  const [savedMaps, setSavedMaps] = useState([
    { id: 1, name: "Income Distribution", type: "Map", starred: true, lastModified: "2024-01-14" },
    { id: 2, name: "Community Dashboard", type: "Profile", starred: false, lastModified: "2024-01-12" },
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

  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case "Chart":
        return BarChart3
      case "Map":
        return MapPin
      case "Table":
        return List
      case "Profile":
        return Grid3X3
      default:
        return Eye
    }
  }

  const getVisualizationPlaceholder = (type: string) => {
    const baseClasses = "w-full aspect-[4/3] rounded-lg flex items-center justify-center"
    const Icon = getVisualizationIcon(type)

    switch (type) {
      case "Chart":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-100 to-purple-200`}>
            <Icon className="h-8 w-8 text-purple-600" />
          </div>
        )
      case "Map":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-100 to-green-100`}>
            <Icon className="h-8 w-8 text-blue-600" />
          </div>
        )
      case "Table":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-100 to-green-200`}>
            <Icon className="h-8 w-8 text-green-600" />
          </div>
        )
      case "Profile":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-orange-100 to-orange-200`}>
            <Icon className="h-8 w-8 text-orange-600" />
          </div>
        )
      default:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-gray-100 to-gray-200`}>
            <Icon className="h-8 w-8 text-gray-600" />
          </div>
        )
    }
  }

  const getVisualizationListPlaceholder = (type: string) => {
    const baseClasses = "w-12 h-9 rounded flex items-center justify-center flex-shrink-0"
    const Icon = getVisualizationIcon(type)

    switch (type) {
      case "Chart":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-100 to-purple-200`}>
            <Icon className="h-4 w-4 text-purple-600" />
          </div>
        )
      case "Map":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-100 to-green-100`}>
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        )
      case "Table":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-100 to-green-200`}>
            <Icon className="h-4 w-4 text-green-600" />
          </div>
        )
      case "Profile":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-orange-100 to-orange-200`}>
            <Icon className="h-4 w-4 text-orange-600" />
          </div>
        )
      default:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-gray-100 to-gray-200`}>
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
        )
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <ArrowLeft className="h-4 w-4 text-gray-500" />
      case "unlisted":
        return <Share className="h-4 w-4 text-gray-500" />
      case "community":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <ArrowLeft className="h-4 w-4 text-gray-500" />
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
  const filteredVisualizations = visualizationsShowStarred
    ? [...savedCharts, ...savedMaps].filter((item) => item.starred)
    : [...savedCharts, ...savedMaps]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBackToDashboard}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{projectName}</h1>
                <p className="text-sm text-gray-500">Project Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Project Setup</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Community Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Select Community
                  </CardTitle>
                  <CardDescription>Choose the geographic area for your analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedCommunity ? (
                    <div className="space-y-3">
                      <Badge variant="outline" className="text-sm">
                        {selectedCommunity}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setShowCommunityModal(true)}>
                        Change Community
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowCommunityModal(true)}>Select Community</Button>
                  )}
                </CardContent>
              </Card>

              {/* Data Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Data Indicators
                  </CardTitle>
                  <CardDescription>Choose the data points you want to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedIndicators.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedIndicators.slice(0, 3).map((indicator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                        {selectedIndicators.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedIndicators.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowIndicatorsModal(true)}>
                        Modify Selection
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowIndicatorsModal(true)}>Select Indicators</Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Project Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Complete these steps to set up your analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedCommunity ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {selectedCommunity ? "✓" : "1"}
                      </div>
                      <span className="font-medium">Select Community</span>
                    </div>
                    <Badge variant={selectedCommunity ? "default" : "secondary"}>
                      {selectedCommunity ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedIndicators.length > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {selectedIndicators.length > 0 ? "✓" : "2"}
                      </div>
                      <span className="font-medium">Choose Data Indicators</span>
                    </div>
                    <Badge variant={selectedIndicators.length > 0 ? "default" : "secondary"}>
                      {selectedIndicators.length > 0 ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                        3
                      </div>
                      <span className="font-medium">Create Visualizations</span>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
                {selectedCommunity && selectedIndicators.length > 0 && (
                  <div className="mt-6">
                    <Button onClick={onStartVisualization} className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Start Creating Visualizations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Data
                  </CardTitle>
                  <CardDescription>Add your own datasets to the project</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowUploadModal(true)}>Upload Files</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Data Sources
                  </CardTitle>
                  <CardDescription>Manage connected data sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">No external data sources connected</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Tools</CardTitle>
                <CardDescription>Advanced analysis and modeling tools</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Analysis tools will be available once you complete the project setup.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Results & Reports</CardTitle>
                <CardDescription>View and export your analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Results will appear here once you complete your analysis.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <SelectCommunityModal
        open={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        onSelectCommunity={setSelectedCommunity}
        selectedCommunity={selectedCommunity}
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

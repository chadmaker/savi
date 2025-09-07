"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Upload,
  Users,
  Database,
  BarChart3,
  Map,
  FileText,
  Home,
} from "lucide-react"

import { CreateProjectModal } from "./modals/create-project-modal"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModalEnhanced } from "./modals/select-indicators-modal-enhanced"
import { DataUploadModal } from "./modals/data-upload-modal"
import { CreateReportModal } from "./modals/create-report-modal"
import VisualizationStudioModal from "./modals/visualization-studio-modal"
import { ProjectsPage } from "./pages/projects-page"
import { ProjectWorkspace } from "./project-workspace"
import { VisualizationBuilder } from "./visualization-builder"
import { CommunityProfilePage } from "./community-profile-page"
import type { ProjectData } from "./modals/create-project-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HamburgerMenu } from "./hamburger-menu"

interface DashboardProps {
  onCreateProject: (project: ProjectData) => void
}

export function Dashboard({ onCreateProject: passUpstreamCreateProject }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [showIndicatorsModal, setShowIndicatorsModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showVisualizationStudio, setShowVisualizationStudio] = useState(false)
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "workspace" | "visualization" | "profile">(
    "dashboard",
  )
  const [currentProjectData, setCurrentProjectData] = useState<any>(null)
  const [selectedCommunityForProfile, setSelectedCommunityForProfile] = useState<string>("")

  const handleCreateProject = (projectData: ProjectData) => {
    const projectWithDate = {
      ...projectData,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setCurrentProject(projectData.name)
    setCurrentProjectData(projectWithDate)
    setCurrentScreen("workspace")
    passUpstreamCreateProject(projectWithDate)
  }

  const handleActionPanelAction = (actionId: string) => {
    switch (actionId) {
      case "new-project":
        setShowCreateModal(true)
        break
      case "analyze-community":
        setShowCommunityModal(true)
        break
      case "upload-data":
        setShowUploadModal(true)
        break
      case "customize-profile":
        setShowCommunityModal(true)
        break
      case "search-data":
        setShowIndicatorsModal(true)
        break
      case "create-chart":
        setShowVisualizationStudio(true)
        break
      case "view-map":
        setShowVisualizationStudio(true)
        break
      case "build-report":
        setShowReportModal(true)
        break
      default:
        console.warn("Unhandled action:", actionId)
        break
    }
  }

  const handleProToolsAction = (actionId: string) => {
    switch (actionId) {
      case "dashboard":
        setCurrentScreen("dashboard")
        break
      case "upload-data":
        setShowUploadModal(true)
        break
      case "customize-profile":
        setShowCommunityModal(true)
        break
      case "search-data":
        setShowIndicatorsModal(true)
        break
      case "create-chart":
        setShowVisualizationStudio(true)
        break
      case "view-map":
        setShowVisualizationStudio(true)
        break
      case "build-report":
        setShowReportModal(true)
        break
      default:
        console.warn("Unhandled Pro Tools action:", actionId)
        break
    }
  }

  const handleStartVisualization = () => {
    if (!currentProject) {
      const tempProject = {
        name: "New Visualization",
        description: "Create a new visualization.",
        visibility: "private",
        createdDate: new Date().toISOString(),
        relatedPopulations: [],
        relatedTopics: [],
      }
      setCurrentProject(tempProject.name)
      setCurrentProjectData(tempProject)
    }
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
  }

  const handleReturnToWorkspace = () => {
    setCurrentScreen("workspace")
  }

  const handleOpenProject = (projectData: any) => {
    setCurrentProject(projectData.name)
    setCurrentProjectData(projectData)
    setCurrentScreen("workspace")
  }

  const handleCommunitySelection = (communities: string[]) => {
    if (communities.length > 0) {
      setSelectedCommunityForProfile(communities[0])
      setCurrentScreen("profile")
      setShowCommunityModal(false)
    }
  }

  const handleBackFromProfile = () => {
    setCurrentScreen("dashboard")
    setSelectedCommunityForProfile("")
  }

  // Show community profile page
  if (currentScreen === "profile" && selectedCommunityForProfile) {
    return <CommunityProfilePage communityName={selectedCommunityForProfile} onBack={handleBackFromProfile} />
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
            </button>
          </div>
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search with SAVI AI" className="pl-10 w-full" />
          </div>
          <div className="flex items-center gap-2">
            {/* Pro Tools dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="font-medium">Pro Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleProToolsAction("dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("upload-data")}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Add your own data</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("customize-profile")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Customize a Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("search-data")}>
                  <Database className="mr-2 h-4 w-4" />
                  <span>Search Data</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("create-chart")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Create a Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("view-map")}>
                  <Map className="mr-2 h-4 w-4" />
                  <span>Create a Map</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProToolsAction("build-report")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Create a Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div>
          {currentScreen === "dashboard" && (
            <ProjectsPage
              onCreateProject={() => setShowCreateModal(true)}
              onOpenProject={handleOpenProject}
              onActionSelect={handleActionPanelAction}
            />
          )}
          {currentScreen === "workspace" && currentProject && (
            <ProjectWorkspace
              projectName={currentProject}
              projectData={currentProjectData}
              onStartVisualization={handleStartVisualization}
              onBackToDashboard={handleBackToDashboard}
            />
          )}
          {currentScreen === "visualization" && currentProject && (
            <VisualizationBuilder
              projectName={currentProject}
              projectData={currentProjectData}
              onBackToWorkspace={
                currentProjectData?.name === "New Visualization" ? handleBackToDashboard : handleReturnToWorkspace
              }
            />
          )}
        </div>
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={(proj) => {
          handleCreateProject(proj)
          setShowCreateModal(false)
        }}
      />

      <SelectCommunityModal
        open={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        selectedCommunities={selectedCommunities}
        onSelectionChange={(communities) => {
          setSelectedCommunities(communities)
          if (communities.length > 0) {
            handleCommunitySelection(communities)
          }
        }}
      />

      <SelectIndicatorsModalEnhanced
        isOpen={showIndicatorsModal}
        onClose={() => setShowIndicatorsModal(false)}
        onSelectIndicators={(indicators) => {
          setSelectedIndicators(indicators.map((ind) => ind.id))
          setShowIndicatorsModal(false)
        }}
        selectedIndicators={selectedIndicators.map((id) => ({ id }))}
      />

      <DataUploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />

      <CreateReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onCreateReport={(reportData) => {
          console.log("Report created:", reportData)
          setShowReportModal(false)
        }}
      />

      <VisualizationStudioModal isOpen={showVisualizationStudio} onClose={() => setShowVisualizationStudio(false)} />
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ChevronDown, User, LogOut } from "lucide-react"

import { CreateProjectModal } from "./modals/create-project-modal"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModal } from "./modals/select-indicators-modal"
import { DataUploadModal } from "./modals/data-upload-modal"
import { ProjectsPage } from "./pages/projects-page"
import { CommunitiesPage } from "./pages/communities-page"
import { IndicatorsPage } from "./pages/indicators-page"
import { VisualizationsPage } from "./pages/visualizations-page"
import { DashboardPage } from "./pages/dashboard-page"
import { ProjectWorkspace } from "./project-workspace"
import { VisualizationBuilder } from "./visualization-builder"
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
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "projects" | "communities" | "indicators" | "visualizations"
  >("dashboard")
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "workspace" | "visualization">("dashboard")
  const [currentProjectData, setCurrentProjectData] = useState<any>(null)

  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", active: activeTab === "dashboard" },
    { id: "projects", label: "Projects", active: activeTab === "projects" },
    { id: "indicators", label: "Data Catalog", active: activeTab === "indicators" },
    { id: "communities", label: "Communities", active: activeTab === "communities" },
    { id: "visualizations", label: "Studio", active: activeTab === "visualizations" },
  ]

  const handleCreateProject = (projectData: ProjectData) => {
    const projectWithDate = {
      ...projectData,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setCurrentProject(projectData.name)
    setCurrentProjectData(projectWithDate)
    setActiveTab("projects") // Set Data Projects tab as active
    setCurrentScreen("workspace") // Use the same workspace layout as existing projects
    passUpstreamCreateProject(projectWithDate)
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
    setActiveTab("projects") // Keep Data Projects tab active
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
    setActiveTab("projects") // Keep Data Projects tab active when returning
  }

  const handleReturnToWorkspace = () => {
    setActiveTab("projects") // Keep Data Projects tab active
    setCurrentScreen("workspace")
  }

  const handleOpenProject = (projectData: any) => {
    setCurrentProject(projectData.name)
    setCurrentProjectData(projectData)
    setActiveTab("projects") // Set Data Projects tab as active
    setCurrentScreen("workspace")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <button
              onClick={() => {
                setCurrentScreen("dashboard")
                setActiveTab("dashboard")
              }}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
            </button>
          </div>
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search with SAVI AI" className="pl-10 w-full" />
          </div>
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
        {/* Bottom Row */}
        <div className="flex h-16 items-center gap-10">
          <h1 className="text-xl font-bold text-gray-800">SAVI Pro</h1>
          <nav className="flex space-x-8">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  if (currentScreen !== "dashboard") {
                    setCurrentScreen("dashboard")
                  }
                }}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  tab.active
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div>
          {currentScreen === "dashboard" && (
            <>
              {activeTab === "dashboard" && (
                <DashboardPage
                  onNavigateToProjects={() => setActiveTab("projects")}
                  onNavigateToCommunities={() => setActiveTab("communities")}
                  onNavigateToIndicators={() => setActiveTab("indicators")}
                  onNavigateToVisualizations={() => setActiveTab("visualizations")}
                  onCreateProject={() => setShowCreateModal(true)}
                />
              )}
              {activeTab === "projects" && (
                <ProjectsPage onCreateProject={() => setShowCreateModal(true)} onOpenProject={handleOpenProject} />
              )}
              {activeTab === "communities" && <CommunitiesPage onSelectCommunity={() => setShowCommunityModal(true)} />}
              {activeTab === "indicators" && <IndicatorsPage onSelectIndicators={() => setShowIndicatorsModal(true)} />}
              {activeTab === "visualizations" && <VisualizationsPage onAddVisualization={handleStartVisualization} />}
            </>
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
        onSelectionChange={setSelectedCommunities}
      />

      <SelectIndicatorsModal
        open={showIndicatorsModal}
        onClose={() => setShowIndicatorsModal(false)}
        selectedIndicators={selectedIndicators}
        onSelectionChange={setSelectedIndicators}
      />

      <DataUploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  )
}

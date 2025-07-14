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
import { UploadPage } from "./pages/upload-page"
import { VisualizationsPage } from "./pages/visualizations-page"
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
  const [activeTab, setActiveTab] = useState<"projects" | "communities" | "indicators" | "upload" | "visualizations">(
    "projects",
  )
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "workspace" | "visualization">("dashboard")
  const [currentProjectData, setCurrentProjectData] = useState<any>(null)

  const navigationTabs = [
    { id: "projects", label: "Projects", active: activeTab === "projects" },
    { id: "communities", label: "Communities", active: activeTab === "communities" },
    { id: "indicators", label: "Indicators", active: activeTab === "indicators" },
    { id: "upload", label: "Uploads", active: activeTab === "upload" },
    { id: "visualizations", label: "Visualizations", active: activeTab === "visualizations" },
  ]

  const handleCreateProject = (projectData: ProjectData) => {
    const projectWithDate = {
      ...projectData,
      createdDate: new Date().toISOString(),
    }
    setCurrentProject(projectData.name)
    setCurrentProjectData(projectWithDate)
    setCurrentScreen("workspace")
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
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
  }

  const handleReturnToWorkspace = () => {
    setCurrentScreen("workspace")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white px-6">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <button
              onClick={() => {
                setCurrentScreen("dashboard")
                setActiveTab("projects")
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
                Account
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
          <h1 className="text-2xl font-bold text-gray-800">SAVI Pro</h1>
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
      <main className="flex-1 p-6">
        <div>
          {currentScreen === "dashboard" && (
            <>
              {activeTab === "projects" && <ProjectsPage onCreateProject={() => setShowCreateModal(true)} />}
              {activeTab === "communities" && <CommunitiesPage onSelectCommunity={() => setShowCommunityModal(true)} />}
              {activeTab === "indicators" && <IndicatorsPage onSelectIndicators={() => setShowIndicatorsModal(true)} />}
              {activeTab === "upload" && <UploadPage onUploadData={() => setShowUploadModal(true)} />}
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

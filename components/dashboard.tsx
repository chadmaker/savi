"use client"

import { useState } from "react"
import { CreateProjectModal } from "./modals/create-project-modal"
import { SelectCommunityModal } from "./modals/select-community-modal"
import { SelectIndicatorsModal } from "./modals/select-indicators-modal"
import { DataUploadModal } from "./modals/data-upload-modal"
import { ProjectsPage } from "./pages/projects-page"
import { CommunitiesPage } from "./pages/communities-page"
import { IndicatorsPage } from "./pages/indicators-page"
import { UploadPage } from "./pages/upload-page"
import { VisualizationsPage } from "./pages/visualizations-page"
import { ProjectWorkspace } from "./project-workspace" // Assuming this component exists

interface DashboardProps {
  onCreateProject: (project: ProjectData) => void
}

interface ProjectData {
  name: string
  description: string
  // Add other project data fields as needed
}

export function Dashboard({ onCreateProject }: DashboardProps) {
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
    { id: "upload", label: "Data Upload", active: activeTab === "upload" },
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
  }

  const handleStartVisualization = () => {
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
    setCurrentProject(null)
    setCurrentProjectData(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">S</div>
            <span className="text-xl font-semibold text-gray-900">SAVI PRO</span>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex space-x-8 px-6">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                tab.active
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {currentScreen === "dashboard" && (
            <>
              {activeTab === "projects" && <ProjectsPage onCreateProject={() => setShowCreateModal(true)} />}
              {activeTab === "communities" && <CommunitiesPage onSelectCommunity={() => setShowCommunityModal(true)} />}
              {activeTab === "indicators" && <IndicatorsPage onSelectIndicators={() => setShowIndicatorsModal(true)} />}
              {activeTab === "upload" && <UploadPage onUploadData={() => setShowUploadModal(true)} />}
              {activeTab === "visualizations" && <VisualizationsPage />}
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
          {currentScreen === "visualization" && (
            <div>
              {/* Visualization Component Here */}
              <h2>Visualization</h2>
              <button onClick={handleBackToDashboard}>Back to Dashboard</button>
            </div>
          )}
        </div>
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={(proj) => {
          handleCreateProject(proj) // proj is already the object
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

"use client"

import { useState } from "react"
import { ProjectsPage } from "./pages/projects-page"
import { CommunitiesPage } from "./pages/communities-page"
import { IndicatorsPage } from "./pages/indicators-page"
import { UploadPage } from "./pages/upload-page"
import { VisualizationsPage } from "./pages/visualizations-page"
import { DashboardPage } from "./pages/dashboard-page"
import { ProjectWorkspace } from "./project-workspace"
import { VisualizationBuilder } from "./visualization-builder"
import { HamburgerMenu } from "./hamburger-menu"
import type { ProjectData } from "./modals/create-project-modal"

type Page = "dashboard" | "projects" | "communities" | "indicators" | "upload" | "visualizations"

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [showVisualizationBuilder, setShowVisualizationBuilder] = useState(false)

  const handleCreateProject = (projectData: ProjectData) => {
    const projectWithDate = {
      ...projectData,
      createdDate: new Date().toISOString(),
    }
    setSelectedProject(projectWithDate)
    setCurrentPage("projects")
  }

  const handleSelectProject = (project: ProjectData) => {
    setSelectedProject(project)
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
    setCurrentPage("projects")
  }

  const handleStartVisualization = () => {
    setShowVisualizationBuilder(true)
  }

  const handleBackToWorkspace = () => {
    setShowVisualizationBuilder(false)
  }

  if (showVisualizationBuilder) {
    return (
      <VisualizationBuilder
        projectName={selectedProject?.name || "New Visualization"}
        projectData={selectedProject}
        onBackToWorkspace={handleBackToWorkspace}
      />
    )
  }

  if (selectedProject && currentPage === "projects") {
    return (
      <ProjectWorkspace
        project={selectedProject}
        onBack={handleBackToProjects}
        onStartVisualization={handleStartVisualization}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img src="/savi-logo.png" alt="SAVI Pro" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900">SAVI Pro</span>
              </div>
              <nav className="flex space-x-8">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("projects")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "projects"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setCurrentPage("communities")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "communities"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Communities
                </button>
                <button
                  onClick={() => setCurrentPage("indicators")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "indicators"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Indicators
                </button>
                <button
                  onClick={() => setCurrentPage("upload")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "upload"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Upload
                </button>
                <button
                  onClick={() => setCurrentPage("visualizations")}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === "visualizations"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-4"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Visualizations
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/placeholder-user.jpg" alt="User" className="h-8 w-8 rounded-full" />
              <HamburgerMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {currentPage === "dashboard" && (
        <DashboardPage onCreateProject={handleCreateProject} onStartVisualization={handleStartVisualization} />
      )}
      {currentPage === "projects" && (
        <ProjectsPage onCreateProject={handleCreateProject} onSelectProject={handleSelectProject} />
      )}
      {currentPage === "communities" && <CommunitiesPage />}
      {currentPage === "indicators" && <IndicatorsPage />}
      {currentPage === "upload" && <UploadPage />}
      {currentPage === "visualizations" && <VisualizationsPage />}
    </div>
  )
}

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
import type { ProjectData } from "./modals/create-project-modal"
import Image from "next/image"

type ActivePage =
  | "dashboard"
  | "projects"
  | "communities"
  | "indicators"
  | "uploads"
  | "visualizations"
  | "project-workspace"
  | "visualization-builder"

interface Project extends ProjectData {
  id: number
  createdDate: string
  lastModified?: string
}

export function Dashboard() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Marion County Analysis",
      description: "Comprehensive analysis of Marion County demographics and economics",
      visibility: "private",
      relatedTopics: ["Environment", "Economy"],
      relatedPopulations: ["African Americans", "Working Age"],
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      name: "Housing Study",
      description: "Housing affordability and availability study",
      visibility: "community",
      relatedTopics: ["Housing"],
      relatedPopulations: ["Families with Children"],
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
    },
  ])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  const handleCreateProject = (projectData: ProjectData) => {
    const newProject: Project = {
      ...projectData,
      id: projects.length + 1,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    setProjects([...projects, newProject])
    setCurrentProject(newProject)
    setActivePage("project-workspace")
  }

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project)
    setActivePage("project-workspace")
  }

  const handleUpdateProject = (projectData: ProjectData) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        ...projectData,
        lastModified: new Date().toISOString(),
      }
      setProjects(projects.map((p) => (p.id === currentProject.id ? updatedProject : p)))
      setCurrentProject(updatedProject)
    }
  }

  const handleBackToDashboard = () => {
    setActivePage("dashboard")
    setCurrentProject(null)
  }

  const handleStartVisualization = () => {
    setActivePage("visualization-builder")
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage onCreateProject={handleCreateProject} onStartVisualization={handleStartVisualization} />
      case "projects":
        return (
          <ProjectsPage projects={projects} onCreateProject={handleCreateProject} onOpenProject={handleOpenProject} />
        )
      case "communities":
        return <CommunitiesPage />
      case "indicators":
        return <IndicatorsPage />
      case "uploads":
        return <UploadPage />
      case "visualizations":
        return <VisualizationsPage />
      case "project-workspace":
        return currentProject ? (
          <ProjectWorkspace
            projectName={currentProject.name}
            projectData={currentProject}
            onStartVisualization={handleStartVisualization}
            onBackToDashboard={handleBackToDashboard}
            onUpdateProject={handleUpdateProject}
          />
        ) : null
      case "visualization-builder":
        return <VisualizationBuilder onBack={() => setActivePage(currentProject ? "project-workspace" : "dashboard")} />
      default:
        return <DashboardPage onCreateProject={handleCreateProject} onStartVisualization={handleStartVisualization} />
    }
  }

  // Don't render header for project workspace or visualization builder
  if (activePage === "project-workspace" || activePage === "visualization-builder") {
    return <div className="min-h-screen bg-white">{renderActivePage()}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Global Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActivePage("dashboard")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image src="/savi-logo.png" alt="SAVI Logo" width={100} height={40} />
            </button>

            {/* Navigation Tabs */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActivePage("dashboard")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActivePage("projects")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "projects"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActivePage("communities")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "communities"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Communities
              </button>
              <button
                onClick={() => setActivePage("indicators")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "indicators"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Indicators
              </button>
              <button
                onClick={() => setActivePage("uploads")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "uploads"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Uploads
              </button>
              <button
                onClick={() => setActivePage("visualizations")}
                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                  activePage === "visualizations"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Visualizations
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>
      </header>

      {/* Main Content */}
      {renderActivePage()}
    </div>
  )
}

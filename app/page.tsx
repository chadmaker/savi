"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { ProjectWorkspace } from "@/components/project-workspace"
import { VisualizationBuilder } from "@/components/visualization-builder"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { ProjectsPage } from "@/components/pages/projects-page"
import { CommunitiesPage } from "@/components/pages/communities-page"
import { IndicatorsPage } from "@/components/pages/indicators-page"
import { UploadPage } from "@/components/pages/upload-page"
import { VisualizationsPage } from "@/components/pages/visualizations-page"
import type { ProjectData } from "@/components/modals/create-project-modal"
import { User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Page = "dashboard" | "projects" | "communities" | "indicators" | "upload" | "visualizations"

interface Project extends ProjectData {
  id: string
  createdDate: string
  lastModified?: string
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  const [showVisualizationBuilder, setShowVisualizationBuilder] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Marion County Housing Analysis",
      description: "Comprehensive analysis of housing trends and affordability across Marion County neighborhoods",
      visibility: "private",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: "2",
      name: "Education Outcomes Study",
      description: "Examining educational performance and resource allocation in local schools",
      visibility: "community",
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
    },
    {
      id: "3",
      name: "Transportation Equity Report",
      description: "Analysis of public transit accessibility and its impact on community development",
      visibility: "unlisted",
      createdDate: "2024-01-08",
      lastModified: "2024-01-16",
    },
  ])

  const handleCreateProject = (projectData: ProjectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
    }
    setProjects((prev) => [newProject, ...prev])
    setShowCreateModal(false)
  }

  const handleUpdateProject = (projectId: string, projectData: ProjectData) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, ...projectData, lastModified: new Date().toISOString() } : project,
      ),
    )
  }

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId)
  }

  const handleBackToDashboard = () => {
    setCurrentProject(null)
    setCurrentPage("dashboard")
    setShowVisualizationBuilder(false)
  }

  const handleStartVisualization = () => {
    setShowVisualizationBuilder(true)
  }

  const handleBackToProject = () => {
    setShowVisualizationBuilder(false)
  }

  const currentProjectData = currentProject ? projects.find((p) => p.id === currentProject) : null

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard"
      case "projects":
        return "Projects"
      case "communities":
        return "Communities"
      case "indicators":
        return "Data Indicators"
      case "upload":
        return "Data Upload"
      case "visualizations":
        return "Visualizations"
      default:
        return "Dashboard"
    }
  }

  if (showVisualizationBuilder && currentProject) {
    return (
      <div className="min-h-screen bg-white">
        <VisualizationBuilder
          projectName={currentProjectData?.name || "Untitled Project"}
          onBackToProject={handleBackToProject}
        />
      </div>
    )
  }

  if (currentProject && currentProjectData) {
    return (
      <div className="min-h-screen bg-white">
        <ProjectWorkspace
          projectName={currentProjectData.name}
          projectData={currentProjectData}
          onStartVisualization={handleStartVisualization}
          onBackToDashboard={handleBackToDashboard}
          onUpdateProject={(data) => handleUpdateProject(currentProject, data)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="#" className="flex items-center" prefetch={false}>
                <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Button
                  variant={currentPage === "dashboard" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("dashboard")}
                  className="text-sm font-medium"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === "projects" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("projects")}
                  className="text-sm font-medium"
                >
                  Projects
                </Button>
                <Button
                  variant={currentPage === "communities" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("communities")}
                  className="text-sm font-medium"
                >
                  Communities
                </Button>
                <Button
                  variant={currentPage === "indicators" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("indicators")}
                  className="text-sm font-medium"
                >
                  Data Indicators
                </Button>
                <Button
                  variant={currentPage === "upload" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("upload")}
                  className="text-sm font-medium"
                >
                  Data Upload
                </Button>
                <Button
                  variant={currentPage === "visualizations" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("visualizations")}
                  className="text-sm font-medium"
                >
                  Visualizations
                </Button>
              </nav>
            </div>

            {/* Right side - User menu and mobile menu */}
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu */}
              <div className="lg:hidden">
                <HamburgerMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-[1440px] mx-auto px-14">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Page Content */}
          {currentPage === "dashboard" && (
            <DashboardPage
              onNavigateToProjects={() => setCurrentPage("projects")}
              onCreateProject={() => setShowCreateModal(true)}
              onNavigateToCommunities={() => setCurrentPage("communities")}
              onNavigateToIndicators={() => setCurrentPage("indicators")}
              onNavigateToVisualizations={() => setCurrentPage("visualizations")}
            />
          )}

          {currentPage === "projects" && (
            <ProjectsPage
              projects={projects}
              onCreateProject={() => setShowCreateModal(true)}
              onOpenProject={handleOpenProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {currentPage === "communities" && <CommunitiesPage />}

          {currentPage === "indicators" && <IndicatorsPage />}

          {currentPage === "upload" && <UploadPage />}

          {currentPage === "visualizations" && <VisualizationsPage />}
        </div>
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}

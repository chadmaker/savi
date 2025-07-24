"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { ProjectsPage } from "@/components/pages/projects-page"
import { CommunitiesPage } from "@/components/pages/communities-page"
import { IndicatorsPage } from "@/components/pages/indicators-page"
import { VisualizationsPage } from "@/components/pages/visualizations-page"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { SelectCommunityModal } from "@/components/modals/select-community-modal"
import { SelectIndicatorsModal } from "@/components/modals/select-indicators-modal"
import { DataUploadModal } from "@/components/modals/data-upload-modal"
import { ExportModal } from "@/components/modals/export-modal"
import { ProjectWorkspace } from "@/components/project-workspace"
import { VisualizationBuilder } from "@/components/visualization-builder"
import { Folder, MapPin, BarChart3, Eye, User, ChevronDown } from "lucide-react"

type Page = "projects" | "communities" | "catalog" | "studio"
type Screen = "dashboard" | "workspace" | "visualization"

interface ProjectData {
  name: string
  description: string
  visibility: string
  relatedPopulations: string[]
  relatedTopics: string[]
  createdDate: string
  lastModified: string
}

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>("projects")
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showSelectCommunity, setShowSelectCommunity] = useState(false)
  const [showSelectIndicators, setShowSelectIndicators] = useState(false)
  const [showDataUpload, setShowDataUpload] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const navigationItems = [
    { id: "projects" as Page, label: "Data Projects", icon: Folder, color: "text-blue-600", bgColor: "bg-blue-100" },
    {
      id: "communities" as Page,
      label: "Communities",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    { id: "catalog" as Page, label: "Data Catalog", icon: BarChart3, color: "text-green-600", bgColor: "bg-green-100" },
    { id: "studio" as Page, label: "Studio", icon: Eye, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  ]

  const handleCreateProject = (projectData: ProjectData) => {
    setCurrentProject(projectData)
    setCurrentScreen("workspace")
    setShowCreateProject(false)
  }

  const handleOpenProject = (projectData: ProjectData) => {
    setCurrentProject(projectData)
    setCurrentScreen("workspace")
  }

  const handleStartVisualization = () => {
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
    setCurrentProject(null)
  }

  const handleBackToWorkspace = () => {
    setCurrentScreen("workspace")
  }

  if (currentScreen === "workspace" && currentProject) {
    return (
      <ProjectWorkspace
        projectData={currentProject}
        onStartVisualization={handleStartVisualization}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  if (currentScreen === "visualization" && currentProject) {
    return <VisualizationBuilder projectName={currentProject.name} onBackToWorkspace={handleBackToWorkspace} />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "projects":
        return <ProjectsPage onCreateProject={() => setShowCreateProject(true)} onOpenProject={handleOpenProject} />
      case "communities":
        return <CommunitiesPage onSelectCommunity={() => setShowSelectCommunity(true)} />
      case "catalog":
        return <IndicatorsPage onSelectIndicators={() => setShowSelectIndicators(true)} />
      case "studio":
        return <VisualizationsPage onAddVisualization={() => setShowExport(true)} />
      default:
        return <ProjectsPage onCreateProject={() => setShowCreateProject(true)} onOpenProject={handleOpenProject} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <HamburgerMenu />
            <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-red-400 hover:bg-red-500 text-white rounded-full px-6 py-2 h-10 flex items-center space-x-3">
                <User className="h-5 w-5" />
                <span className="font-semibold text-sm tracking-wide">PRO</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentPage === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className={`rounded-full p-2 ${item.bgColor}`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderCurrentPage()}</main>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreateProject={handleCreateProject}
      />
      <SelectCommunityModal isOpen={showSelectCommunity} onClose={() => setShowSelectCommunity(false)} />
      <SelectIndicatorsModal isOpen={showSelectIndicators} onClose={() => setShowSelectIndicators(false)} />
      <DataUploadModal isOpen={showDataUpload} onClose={() => setShowDataUpload(false)} />
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </div>
  )
}

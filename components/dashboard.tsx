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
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])

  const navigationTabs = [
    { id: "projects" as Page, label: "Data Projects", icon: Folder },
    { id: "communities" as Page, label: "Communities", icon: MapPin },
    { id: "catalog" as Page, label: "Data Catalog", icon: BarChart3 },
    { id: "studio" as Page, label: "Studio", icon: Eye },
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id)}
                  className={`flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                    currentPage === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-8">{renderCurrentPage()}</main>

      {/* Modals */}
      <CreateProjectModal
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreateProject={handleCreateProject}
      />

      <SelectCommunityModal
        open={showSelectCommunity}
        onClose={() => setShowSelectCommunity(false)}
        selectedCommunities={selectedCommunities}
        onSelectionChange={setSelectedCommunities}
      />

      <SelectIndicatorsModal
        open={showSelectIndicators}
        onClose={() => setShowSelectIndicators(false)}
        selectedIndicators={selectedIndicators}
        onSelectionChange={setSelectedIndicators}
      />

      <DataUploadModal open={showDataUpload} onClose={() => setShowDataUpload(false)} />
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </div>
  )
}

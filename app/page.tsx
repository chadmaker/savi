"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { ProjectWorkspace } from "@/components/project-workspace"
import { VisualizationBuilder } from "@/components/visualization-builder"

export type Screen = "dashboard" | "workspace" | "visualization"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [currentProject, setCurrentProject] = useState<string | null>(null)

  const handleCreateProject = (project: {
    name: string
    description: string
  }) => {
    setCurrentProject(project.name)
    setCurrentScreen("workspace")
  }

  const handleStartVisualization = () => {
    setCurrentScreen("visualization")
  }

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard")
    setCurrentProject(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {currentScreen === "dashboard" && <Dashboard onCreateProject={handleCreateProject} />}
      {currentScreen === "workspace" && currentProject && (
        <ProjectWorkspace
          projectName={currentProject}
          onStartVisualization={handleStartVisualization}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
      {currentScreen === "visualization" && currentProject && (
        <VisualizationBuilder projectName={currentProject} onBackToWorkspace={() => setCurrentScreen("workspace")} />
      )}
    </main>
  )
}

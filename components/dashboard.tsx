"use client"

import { useState } from "react"
import { ProjectWorkspace } from "./project-workspace"

interface ProjectData {
  id?: number
  name: string
  description: string
  visibility: string
  createdDate?: string
  lastModified?: string
  items?: {
    communities: number
    indicators: number
    uploads: number
    visualizations: number
  }
  starred?: boolean
}

export function Dashboard() {
  const [activePage, setActivePage] = useState<"projects" | "project-workspace" | "visualization-builder">("projects")
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [activeProjectData, setActiveProjectData] = useState<ProjectData | null>(null)

  const handleCreateProject = (newProjectData: ProjectData) => {
    const newProject = {
      ...newProjectData,
      id: projects.length + 1,
      lastModified: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      items: {
        communities: 0,
        indicators: 0,
        uploads: 0,
        visualizations: 0,
      },
      starred: false,
    }
    setProjects([...projects, newProject])
    setActiveProjectName(newProject.name)
    setActiveProjectData(newProject) // Set the active project data
    setActivePage("project-workspace")
    setShowCreateProjectModal(false)
  }

  const handleProjectSelect = (project: any) => {
    setActiveProjectName(project.name)
    setActiveProjectData(project) // Set the active project data
    setActivePage("project-workspace")
  }

  return (
    <div>
      {activePage === "projects" && (
        <div>
          <h2>Projects</h2>
          <button onClick={() => setShowCreateProjectModal(true)}>Create New Project</button>
          {projects.map((project) => (
            <div key={project.id} onClick={() => handleProjectSelect(project)}>
              {project.name}
            </div>
          ))}
        </div>
      )}

      {activePage === "project-workspace" && activeProjectName && (
        <ProjectWorkspace
          projectName={activeProjectName}
          projectData={
            activeProjectData
              ? {
                  name: activeProjectData.name,
                  description: activeProjectData.description,
                  visibility: activeProjectData.visibility,
                  createdDate: activeProjectData.createdDate,
                  lastModified: activeProjectData.lastModified,
                }
              : undefined
          }
          onStartVisualization={() => setActivePage("visualization-builder")}
          onBackToDashboard={() => {
            setActivePage("projects")
            setActiveProjectName(null)
            setActiveProjectData(null)
          }}
          onUpdateProject={(updatedData) => {
            // Logic to update project in the main list
          }}
        />
      )}

      {activePage === "visualization-builder" && (
        <div>
          <h2>Visualization Builder</h2>
          <button onClick={() => setActivePage("project-workspace")}>Back to Project Workspace</button>
        </div>
      )}
    </div>
  )
}

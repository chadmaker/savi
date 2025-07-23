"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Upload,
  User,
  BarChart3,
  Calendar,
  ExternalLink,
  Map,
  Target,
  Share2,
  MapPin,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react"
import { CreateProjectModal } from "../modals/create-project-modal"
import { DataUploadModal } from "../modals/data-upload-modal"
import type { ProjectData } from "../modals/create-project-modal"

interface DashboardPageProps {
  onCreateProject: (projectData: ProjectData) => void
  onStartVisualization: () => void
}

export function DashboardPage({ onCreateProject, onStartVisualization }: DashboardPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Sample recent activity data
  const recentActivity = [
    { id: 1, name: "Marion County Analysis", type: "Project", lastModified: "2024-01-15", action: "Open" },
    { id: 2, name: "Income Distribution Map", type: "Visualization", lastModified: "2024-01-14", action: "Open" },
    { id: 3, name: "Population Trends Chart", type: "Visualization", lastModified: "2024-01-12", action: "Open" },
    { id: 4, name: "Broad Ripple Profile", type: "Profile", lastModified: "2024-01-10", action: "Open" },
    { id: 5, name: "Housing Data Upload", type: "Project", lastModified: "2024-01-08", action: "Open" },
  ]

  // Sample indicator groups
  const indicatorGroups = [
    "Housing & Development",
    "Economic Mobility",
    "Demographics",
    "Transportation",
    "Health & Safety",
    "Education",
  ]

  const handleCreateProject = (projectData: ProjectData) => {
    onCreateProject(projectData)
    setShowCreateModal(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
                    onClick={() => setShowCreateModal(true)}
                    title="Start a new project"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-sm font-medium">Create New Project</span>
                  </Button>

                  <Button
                    className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
                    onClick={() => setShowUploadModal(true)}
                    title="Start a new data upload"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-medium">Upload Data</span>
                  </Button>

                  <Button
                    className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
                    title="Start a new custom profile"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">New Custom Profile</span>
                  </Button>

                  <Button
                    className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
                    onClick={onStartVisualization}
                    title="Start a new visualization"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm font-medium">Build Visualization</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">Project Name</th>
                        <th className="text-left p-4 font-medium text-gray-900">Type</th>
                        <th className="text-left p-4 font-medium text-gray-900">Last Modified</th>
                        <th className="text-left p-4 font-medium text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-4 font-medium text-gray-900">{item.name}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{item.type}</Badge>
                          </td>
                          <td className="p-4 text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(item.lastModified).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">
                              {item.action}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips & Coaching */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Get Up and Running</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-100 p-2 mt-1">
                      <Map className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Explore Communities</h4>
                      <p className="text-base text-gray-600">
                        Click Communities to explore or add your own geographies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-green-100 p-2 mt-1">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Organize Indicators</h4>
                      <p className="text-base text-gray-600">
                        Group your indicators under Indicators tab for easy reuse.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-purple-100 p-2 mt-1">
                      <Share2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Share Insights</h4>
                      <p className="text-base text-gray-600">
                        Use Visualizations to craft and share interactive charts.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Workflow Spotlight */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Custom Profiles</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex items-center justify-center">
                    <div className="rounded-lg bg-gray-100 p-8 w-full max-w-sm">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-base text-gray-600">
                      Define and save boundary profiles (custom counties, tracts, neighborhoods), bundle with tiles &
                      maps, then share.
                    </p>
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                      Create Custom Profile
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicator Groups Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Your Indicator Groups</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  {indicatorGroups.map((group, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-gray-100 rounded-full px-4 py-2 whitespace-nowrap"
                    >
                      <span className="text-sm font-medium text-gray-700">{group}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 whitespace-nowrap bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />

      <DataUploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  )
}

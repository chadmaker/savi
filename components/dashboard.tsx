"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { Plus, BarChart3, Users, Database, Upload, Eye, MapPin, Calendar } from 'lucide-react'

interface DashboardProps {
  onCreateProject: (project: { name: string; description: string }) => void
}

export function Dashboard({ onCreateProject }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateProject = (project: { name: string; description: string }) => {
    onCreateProject(project)
    setShowCreateModal(false)
  }

  const recentProjects = [
    {
      id: 1,
      name: "Marion County Housing Analysis",
      description: "Comprehensive analysis of housing trends and affordability",
      lastModified: "2 days ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Education Outcomes Study",
      description: "Examining educational performance across districts",
      lastModified: "1 week ago",
      status: "Draft",
    },
    {
      id: 3,
      name: "Transportation Equity Report",
      description: "Analysis of public transit accessibility",
      lastModified: "2 weeks ago",
      status: "Complete",
    },
  ]

  const quickStats = [
    { label: "Active Projects", value: "12", icon: BarChart3, color: "text-blue-600" },
    { label: "Communities", value: "8", icon: Users, color: "text-green-600" },
    { label: "Data Indicators", value: "156", icon: Database, color: "text-purple-600" },
    { label: "Visualizations", value: "24", icon: Eye, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Button variant="default" className="text-sm font-medium rounded-full">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-sm font-medium rounded-full">
                  Projects
                </Button>
                <Button variant="ghost" className="text-sm font-medium rounded-full">
                  Communities
                </Button>
                <Button variant="ghost" className="text-sm font-medium rounded-full">
                  Data Indicators
                </Button>
                <Button variant="ghost" className="text-sm font-medium rounded-full">
                  Data Upload
                </Button>
                <Button variant="ghost" className="text-sm font-medium rounded-full">
                  Visualizations
                </Button>
              </nav>
            </div>

            {/* Right side - User menu and mobile menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">John Doe</span>
              </div>

              {/* Mobile menu */}
              <div className="lg:hidden">
                <HamburgerMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John</h1>
          <p className="text-gray-600">Here's what's happening with your community data projects.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your latest community data analysis projects</CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)} size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.lastModified}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge
                          variant={
                            project.status === "Active"
                              ? "default"
                              : project.status === "Draft"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => setShowCreateModal(true)} className="w-full justify-start rounded-full bg-blue-600 hover:bg-blue-700" variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
                <Button className="w-full justify-start rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
                <Button className="w-full justify-start rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Browse Indicators
                </Button>
                <Button className="w-full justify-start rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore Communities
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Housing Analysis updated</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New visualization created</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Data indicators updated</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
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
    </div>
  )
}

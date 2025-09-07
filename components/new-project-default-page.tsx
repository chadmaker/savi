"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Edit3,
  Calendar,
  ArrowRight,
  Plus,
  Building2,
  Upload,
  UserCircle,
  BarChart3,
  Map,
  FileText,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NewProjectDefaultPageProps {
  onProjectNameChange: (name: string) => void
  onCreateProject: () => void
  onActionSelect: (actionId: string) => void
}

export function NewProjectDefaultPage({
  onProjectNameChange,
  onCreateProject,
  onActionSelect,
}: NewProjectDefaultPageProps) {
  const [projectName, setProjectName] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Set default project name with current date
  useEffect(() => {
    const today = new Date()
    const defaultName = `New Project ${today.toLocaleDateString()}`
    setProjectName(defaultName)
    onProjectNameChange(defaultName)
  }, [onProjectNameChange])

  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName)
    onProjectNameChange(newName)
  }

  const handleProjectNameSubmit = () => {
    setIsEditing(false)
    if (projectName.trim()) {
      onProjectNameChange(projectName.trim())
    }
  }

  const quickActions = [
    {
      id: "analyze-community",
      title: "Analyze a Community",
      description: "Select and explore community demographics",
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "upload-data",
      title: "Add Your Own Data",
      description: "Upload custom datasets for analysis",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: "customize-profile",
      title: "Customize a Profile",
      description: "Build custom community profiles",
      icon: <UserCircle className="h-5 w-5" />,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "create-chart",
      title: "Create a Chart or Graph",
      description: "Build visualizations from your data",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      id: "view-map",
      title: "View Data on a Map",
      description: "Explore geographic data visualizations",
      icon: <Map className="h-5 w-5" />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: "build-report",
      title: "Build a Report",
      description: "Create comprehensive analysis reports",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Image src="/pro-tools-logo.png" alt="Pro Tools Logo" width={80} height={32} />
          </div>
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search with Pro Tools AI" className="pl-10 w-full" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>User Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Bottom Row - Breadcrumb */}
        <div className="flex h-16 items-center gap-10 px-6">
          <h1 className="text-xl font-bold text-gray-800">Pro Tools</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Pro Tools</span>
            <span>›</span>
            <span className="font-medium text-gray-900">New Project</span>
            <span>›</span>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Pro Tools</h1>
          <p className="text-lg text-gray-600 mb-8">Let's get started by setting up your first project</p>

          {/* Project Name Input */}
          <Card className="max-w-md mx-auto border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Name</h3>
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Today
                </Badge>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={projectName}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleProjectNameSubmit()
                      }
                      if (e.key === "Escape") {
                        setIsEditing(false)
                      }
                    }}
                    className="text-center"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleProjectNameSubmit} className="flex-1">
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center space-x-2 p-3 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="text-gray-900 font-medium">{projectName}</span>
                  <Edit3 className="h-4 w-4 text-gray-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">What would you like to do first?</h2>
            <p className="text-gray-600">Choose an action to get started with your analysis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                onClick={() => onActionSelect(action.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>{action.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Project Button */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">Or start with an empty project and add components later</p>
            <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Plus className="h-4 w-4 mr-2" />
              Create Empty Project
            </Button>
          </div>
          <p className="text-xs text-gray-500">You can always change your project name and add more features later</p>
        </div>
      </main>
    </div>
  )
}

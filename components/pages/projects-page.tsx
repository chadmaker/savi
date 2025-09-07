"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Building2, Upload, UserCircle, Search, BarChart3, Map, FileText } from "lucide-react"
import { ActivityFeed } from "@/components/activity-feed"
import { SelectCommunityModal } from "@/components/modals/select-community-modal"
import { CommunityProfilePage } from "@/components/community-profile-page"
import { CreateReportModal } from "@/components/modals/create-report-modal"

interface ProjectsPageProps {
  onCreateProject: () => void
  onOpenProject: (projectData: any) => void
  onActionSelect?: (actionId: string) => void
}

export function ProjectsPage({ onCreateProject, onOpenProject, onActionSelect }: ProjectsPageProps) {
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [selectedCommunityForProfile, setSelectedCommunityForProfile] = useState<string>("")
  const [showReportModal, setShowReportModal] = useState(false)

  const actionCards = [
    {
      id: "new-project",
      title: "Start a New Project",
      description: "Create a new project to organize your analysis",
      icon: <Plus className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
      action: onCreateProject,
    },
    {
      id: "analyze-community",
      title: "Analyze a Community",
      description: "Select and explore community demographics",
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
      action: () => onActionSelect?.("analyze-community"),
    },
    {
      id: "upload-data",
      title: "Add Your Own Data",
      description: "Upload custom datasets for analysis",
      icon: <Upload className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
      action: () => onActionSelect?.("upload-data"),
    },
    {
      id: "customize-profile",
      title: "Customize a Profile",
      description: "Build custom community profiles",
      icon: <UserCircle className="h-6 w-6" />,
      color: "bg-orange-50 text-orange-600",
      action: () => onActionSelect?.("customize-profile"),
    },
    {
      id: "search-data",
      title: "Search Data",
      description: "Find indicators and datasets",
      icon: <Search className="h-6 w-6" />,
      color: "bg-teal-50 text-teal-600",
      action: () => onActionSelect?.("search-data"),
    },
    {
      id: "create-chart",
      title: "Create a Chart or Graph",
      description: "Build visualizations from your data",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-indigo-50 text-indigo-600",
      action: () => onActionSelect?.("create-chart"),
    },
    {
      id: "view-map",
      title: "View Data on a Map",
      description: "Explore geographic data visualizations",
      icon: <Map className="h-6 w-6" />,
      color: "bg-emerald-50 text-emerald-600",
      action: () => onActionSelect?.("view-map"),
    },
    {
      id: "build-report",
      title: "Build a Report",
      description: "Create comprehensive analysis reports",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-rose-50 text-rose-600",
      action: () => onActionSelect?.("build-report"),
    },
  ]

  const handleCommunitySelection = () => {
    if (selectedCommunities.length > 0) {
      setSelectedCommunityForProfile(selectedCommunities[0])
      setShowProfilePage(true)
      setShowCommunityModal(false)
    }
  }

  const handleBackFromProfile = () => {
    setShowProfilePage(false)
    setSelectedCommunityForProfile("")
  }

  const handleCreateReport = (reportData: any) => {
    console.log("Report created:", reportData)
  }

  if (showProfilePage && selectedCommunityForProfile) {
    return <CommunityProfilePage communityName={selectedCommunityForProfile} onBack={handleBackFromProfile} />
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Pro Tools Dashboard</h2>
          <p className="text-gray-600 mt-1">Choose an action to get started with your data analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {actionCards.map((card) => (
            <Card
              key={card.id}
              className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
              onClick={card.action}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-lg ${card.color}`}>{card.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>

      <SelectCommunityModal
        open={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        selectedCommunities={selectedCommunities}
        onSelectionChange={(communities) => {
          setSelectedCommunities(communities)
          if (communities.length > 0) {
            handleCommunitySelection()
          }
        }}
      />

      <CreateReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onCreateReport={handleCreateReport}
      />
    </div>
  )
}

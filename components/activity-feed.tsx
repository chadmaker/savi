"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Folder,
  Building2,
  Clock,
  BarChart3,
  FileText,
  Upload,
  Star,
  Download,
  Share,
  Edit,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react"
import { ViewProjectModal } from "@/components/modals/view-project-modal"
import { ViewVisualizationModal } from "@/components/modals/view-visualization-modal"
import { ViewReportModal } from "@/components/modals/view-report-modal"

type ActivityType = "project" | "community" | "visualization" | "report" | "data" | "all" | "favorites"

interface ActivityItem {
  id: string
  type: "project" | "community" | "visualization" | "report" | "data"
  title: string
  description: string
  action: string
  timestamp: string
  author: string
  status?: string
  isFavorite?: boolean
}

interface ActivityFeedProps {
  className?: string
}

export function ActivityFeed({ className = "" }: ActivityFeedProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityType>("all")
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [viewProjectModal, setViewProjectModal] = useState<{ isOpen: boolean; item: ActivityItem | null }>({
    isOpen: false,
    item: null,
  })
  const [viewVisualizationModal, setViewVisualizationModal] = useState<{ isOpen: boolean; item: ActivityItem | null }>({
    isOpen: false,
    item: null,
  })
  const [viewReportModal, setViewReportModal] = useState<{ isOpen: boolean; item: ActivityItem | null }>({
    isOpen: false,
    item: null,
  })

  const [allActivity, setAllActivity] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "project",
      title: "Marion County Housing Analysis",
      description: "Updated project with new 2024 census data",
      action: "Updated",
      timestamp: "2024-01-20T14:30:00Z",
      author: "You",
      status: "Active",
      isFavorite: true,
    },
    {
      id: "2",
      type: "visualization",
      title: "Education Trends Dashboard",
      description: "Created new bar chart visualization",
      action: "Created",
      timestamp: "2024-01-20T10:15:00Z",
      author: "You",
      isFavorite: false,
    },
    {
      id: "3",
      type: "community",
      title: "Broad Ripple",
      description: "Added community to favorites",
      action: "Favorited",
      timestamp: "2024-01-19T16:45:00Z",
      author: "You",
      isFavorite: true,
    },
    {
      id: "4",
      type: "project",
      title: "Transportation Equity Study",
      description: "Shared project with team members",
      action: "Shared",
      timestamp: "2024-01-19T13:20:00Z",
      author: "You",
      status: "Shared",
      isFavorite: false,
    },
    {
      id: "5",
      type: "visualization",
      title: "Population Demographics Map",
      description: "Published visualization to community",
      action: "Published",
      timestamp: "2024-01-18T11:30:00Z",
      author: "You",
      isFavorite: true,
    },
    {
      id: "6",
      type: "community",
      title: "Downtown Indianapolis",
      description: "Downloaded community data export",
      action: "Downloaded",
      timestamp: "2024-01-18T09:15:00Z",
      author: "You",
      isFavorite: false,
    },
    {
      id: "7",
      type: "report",
      title: "Public Health Assessment Report",
      description: "Generated comprehensive community report",
      action: "Generated",
      timestamp: "2024-01-17T15:45:00Z",
      author: "You",
      status: "Complete",
      isFavorite: true,
    },
    {
      id: "8",
      type: "data",
      title: "Census Data Upload",
      description: "Uploaded custom demographic dataset",
      action: "Uploaded",
      timestamp: "2024-01-17T12:00:00Z",
      author: "You",
      isFavorite: false,
    },
    {
      id: "9",
      type: "community",
      title: "Fountain Square",
      description: "Added new indicators to community profile",
      action: "Updated",
      timestamp: "2024-01-16T14:20:00Z",
      author: "You",
      isFavorite: false,
    },
    {
      id: "10",
      type: "project",
      title: "Environmental Justice Analysis",
      description: "Created new project from template",
      action: "Created",
      timestamp: "2024-01-16T10:30:00Z",
      author: "You",
      status: "Draft",
      isFavorite: false,
    },
    {
      id: "11",
      type: "visualization",
      title: "Crime Statistics Overview",
      description: "Updated chart with latest data",
      action: "Updated",
      timestamp: "2024-01-15T16:15:00Z",
      author: "Michael Chen",
      isFavorite: false,
    },
    {
      id: "12",
      type: "report",
      title: "Housing Market Analysis",
      description: "Exported report as PDF document",
      action: "Exported",
      timestamp: "2024-01-15T13:45:00Z",
      author: "You",
      isFavorite: false,
    },
  ])

  const toggleFavorite = (itemId: string) => {
    setAllActivity((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item)),
    )
  }

  const handleFavoriteToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly)
    if (!showFavoritesOnly) {
      setActivityFilter("all")
    }
  }

  const getActivityIcon = (type: string) => {
    const iconMap = {
      project: <Folder className="h-4 w-4 text-blue-600" />,
      community: <Building2 className="h-4 w-4 text-green-600" />,
      visualization: <BarChart3 className="h-4 w-4 text-purple-600" />,
      report: <FileText className="h-4 w-4 text-orange-600" />,
      data: <Upload className="h-4 w-4 text-teal-600" />,
    }
    return iconMap[type as keyof typeof iconMap] || <Clock className="h-4 w-4 text-gray-600" />
  }

  const getActionIcon = (action: string) => {
    const iconMap = {
      favorited: <Star className="h-3 w-3 text-yellow-500" />,
      shared: <Share className="h-3 w-3 text-blue-500" />,
      downloaded: <Download className="h-3 w-3 text-green-500" />,
      updated: <Edit className="h-3 w-3 text-orange-500" />,
    }
    return iconMap[action.toLowerCase() as keyof typeof iconMap] || null
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getTypeColor = (type: string) => {
    const colorMap = {
      project: "border-blue-200 text-blue-700 bg-blue-50",
      community: "border-green-200 text-green-700 bg-green-50",
      visualization: "border-purple-200 text-purple-700 bg-purple-50",
      report: "border-orange-200 text-orange-700 bg-orange-50",
      data: "border-teal-200 text-teal-700 bg-teal-50",
    }
    return colorMap[type as keyof typeof colorMap] || "border-gray-200 text-gray-700 bg-gray-50"
  }

  const filteredActivity = allActivity.filter((item) => {
    const typeMatch = activityFilter === "all" || item.type === activityFilter
    const favoriteMatch = !showFavoritesOnly || item.isFavorite
    return typeMatch && favoriteMatch
  })
  const displayedActivity = showAllActivity ? filteredActivity : filteredActivity.slice(0, 8)

  const handleViewItem = (item: ActivityItem) => {
    if (!item || !item.type) {
      console.error("Invalid item passed to handleViewItem:", item)
      return
    }

    switch (item.type) {
      case "project":
        setViewProjectModal({ isOpen: true, item })
        break
      case "visualization":
        setViewVisualizationModal({ isOpen: true, item })
        break
      case "report":
        setViewReportModal({ isOpen: true, item })
        break
      case "community":
        // TODO: Implement community profile navigation
        console.log("Opening community profile for:", item.title)
        break
      case "data":
        // TODO: Implement data details view
        console.log("Opening data details for:", item.title)
        break
      default:
        console.warn("No view handler for type:", item.type)
    }
  }

  const handleEditItem = (item: ActivityItem) => {
    // TODO: Implement edit functionality for each item type
    console.log("Editing item:", item.title)
  }

  const handleDeleteItem = (item: ActivityItem) => {
    // TODO: Implement delete functionality with confirmation
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setAllActivity((prev) => prev.filter((activity) => activity.id !== item.id))
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
          <p className="text-gray-600 mt-1">Your recent actions across all Pro Tools features</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showFavoritesOnly ? "default" : "ghost"}
            size="sm"
            onClick={handleFavoriteToggle}
            className={`h-8 px-3 ${
              showFavoritesOnly
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "text-gray-500 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
          >
            <Star className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
          </Button>
          <Select value={activityFilter} onValueChange={(value: ActivityType) => setActivityFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="community">Communities</SelectItem>
              <SelectItem value="visualization">Visualizations</SelectItem>
              <SelectItem value="report">Reports</SelectItem>
              <SelectItem value="data">Data Uploads</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {displayedActivity.map((activity) => (
          <Card key={activity.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleViewItem(activity)}
                        >
                          {activity.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(activity.id)}
                          className="h-6 w-6 p-0 hover:bg-yellow-50"
                        >
                          <Star
                            className={`h-3 w-3 ${
                              activity.isFavorite
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                          />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <Badge variant="outline" className={`text-xs capitalize ${getTypeColor(activity.type)}`}>
                        {activity.type}
                      </Badge>
                      {activity.status && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.status}
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleViewItem(activity)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditItem(activity)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteItem(activity)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getActionIcon(activity.action)}
                        <span className="font-medium text-blue-600">{activity.action}</span>
                      </div>
                      <span>by {activity.author}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{getRelativeTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!showAllActivity && filteredActivity.length > 8 && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setShowAllActivity(true)} className="border-gray-300 bg-transparent">
            Show All Activity ({filteredActivity.length} items)
          </Button>
        </div>
      )}

      {showAllActivity && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllActivity(false)}
            className="border-gray-300 bg-transparent"
          >
            Show Less
          </Button>
        </div>
      )}

      <ViewProjectModal
        isOpen={viewProjectModal.isOpen}
        onClose={() => setViewProjectModal({ isOpen: false, item: null })}
        project={{
          id: viewProjectModal.item?.id || "",
          title: viewProjectModal.item?.title || "",
          description: viewProjectModal.item?.description || "",
          status: viewProjectModal.item?.status || "Active",
          author: viewProjectModal.item?.author || "",
          created: "January 15, 2024",
          lastModified: "January 20, 2024",
        }}
      />

      <ViewVisualizationModal
        isOpen={viewVisualizationModal.isOpen}
        onClose={() => setViewVisualizationModal({ isOpen: false, item: null })}
        visualization={{
          id: viewVisualizationModal.item?.id || "",
          title: viewVisualizationModal.item?.title || "",
          description: viewVisualizationModal.item?.description || "",
          type: "chart",
          author: viewVisualizationModal.item?.author || "",
          created: "January 18, 2024",
          lastModified: "January 20, 2024",
        }}
      />

      <ViewReportModal
        isOpen={viewReportModal.isOpen}
        onClose={() => setViewReportModal({ isOpen: false, item: null })}
        report={{
          id: viewReportModal.item?.id || "",
          title: viewReportModal.item?.title || "",
          description: viewReportModal.item?.description || "",
          status: viewReportModal.item?.status || "Complete",
          author: viewReportModal.item?.author || "",
          created: "January 17, 2024",
          pages: 24,
        }}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Folder,
  Building2,
  Eye,
  Plus,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  Star,
  Calendar,
  Clock,
  Filter,
  Users,
  ExternalLink,
} from "lucide-react"

interface DashboardPageProps {
  onNavigateToProjects: () => void
  onCreateProject: () => void
  onNavigateToCommunities: () => void
  onNavigateToIndicators: () => void
  onNavigateToVisualizations: () => void
}

type ActivityType = "project" | "community" | "visualization" | "all"

interface ActivityItem {
  id: string
  type: "project" | "community" | "visualization"
  title: string
  description: string
  action: string
  timestamp: string
  author: string
  status?: string
}

interface Contributor {
  id: string
  name: string
  status: "SAVI Moderator" | "Analyst" | "Community User"
  projectsShared: number
  avatar: string
  profileUrl: string
}

export function DashboardPage({
  onNavigateToProjects,
  onCreateProject,
  onNavigateToCommunities,
  onNavigateToIndicators,
  onNavigateToVisualizations,
}: DashboardPageProps) {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activityFilter, setActivityFilter] = useState<ActivityType>("all")
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [showAllContributors, setShowAllContributors] = useState(false)

  const videoPlaylist = [
    { label: "Getting Started", videoId: "savi-welcome-intro", duration: "3:24" },
    { label: "Creating Projects", videoId: "savi-projects-guide", duration: "5:12" },
    { label: "Adding Communities", videoId: "savi-communities-guide", duration: "4:38" },
    { label: "Building Visualizations", videoId: "savi-visualizations-guide", duration: "6:45" },
  ]

  const allActivity: ActivityItem[] = [
    {
      id: "1",
      type: "project",
      title: "Marion County Housing Analysis",
      description: "Updated project with new 2024 census data",
      action: "Updated",
      timestamp: "2024-01-20T14:30:00Z",
      author: "You",
      status: "Active",
    },
    {
      id: "2",
      type: "visualization",
      title: "Education Trends Dashboard",
      description: "Created new bar chart visualization",
      action: "Created",
      timestamp: "2024-01-20T10:15:00Z",
      author: "You",
    },
    {
      id: "3",
      type: "community",
      title: "Broad Ripple",
      description: "Added community to favorites",
      action: "Favorited",
      timestamp: "2024-01-19T16:45:00Z",
      author: "You",
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
    },
    {
      id: "5",
      type: "visualization",
      title: "Population Demographics Map",
      description: "Published visualization to community",
      action: "Published",
      timestamp: "2024-01-18T11:30:00Z",
      author: "You",
    },
    {
      id: "6",
      type: "community",
      title: "Downtown Indianapolis",
      description: "Downloaded community data export",
      action: "Downloaded",
      timestamp: "2024-01-18T09:15:00Z",
      author: "You",
    },
    {
      id: "7",
      type: "project",
      title: "Public Health Indicators",
      description: "Collaborated on project analysis",
      action: "Collaborated",
      timestamp: "2024-01-17T15:45:00Z",
      author: "Sarah Johnson",
      status: "Collaborative",
    },
    {
      id: "8",
      type: "visualization",
      title: "Economic Development Trends",
      description: "Exported visualization as PDF",
      action: "Exported",
      timestamp: "2024-01-17T12:00:00Z",
      author: "You",
    },
    {
      id: "9",
      type: "community",
      title: "Fountain Square",
      description: "Added new indicators to community profile",
      action: "Updated",
      timestamp: "2024-01-16T14:20:00Z",
      author: "You",
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
    },
    {
      id: "11",
      type: "visualization",
      title: "Crime Statistics Overview",
      description: "Updated chart with latest data",
      action: "Updated",
      timestamp: "2024-01-15T16:15:00Z",
      author: "Michael Chen",
    },
    {
      id: "12",
      type: "community",
      title: "Meridian-Kessler",
      description: "Viewed community demographics",
      action: "Viewed",
      timestamp: "2024-01-15T13:45:00Z",
      author: "You",
    },
  ]

  const communityProjects = [
    {
      id: "1",
      name: "Indianapolis Housing Analysis",
      summary: "Comprehensive analysis of housing trends and affordability across Indianapolis neighborhoods",
      author: "Sarah Johnson",
      lastModified: "2 days ago",
      visibility: "Public",
      tags: ["Housing", "Demographics", "Economics"],
      starred: true,
    },
    {
      id: "2",
      name: "Education Outcomes Study",
      summary: "Examining educational performance and resource allocation in Marion County schools",
      author: "Michael Chen",
      lastModified: "1 week ago",
      visibility: "Community",
      tags: ["Education", "Public Policy"],
      starred: false,
    },
    {
      id: "3",
      name: "Transportation Equity Report",
      summary: "Analysis of public transit accessibility and its impact on community development",
      author: "Lisa Rodriguez",
      lastModified: "3 days ago",
      visibility: "Public",
      tags: ["Transportation", "Equity", "Urban Planning"],
      starred: false,
    },
    {
      id: "4",
      name: "Environmental Health Assessment",
      summary: "Comprehensive study of air quality and environmental factors affecting community health",
      author: "Dr. James Wilson",
      lastModified: "5 days ago",
      visibility: "Public",
      tags: ["Environment", "Health", "Policy"],
      starred: true,
    },
    {
      id: "5",
      name: "Economic Development Impact",
      summary: "Measuring the effects of recent development projects on local business and employment",
      author: "Maria Garcia",
      lastModified: "1 week ago",
      visibility: "Community",
      tags: ["Economics", "Development", "Employment"],
      starred: false,
    },
    {
      id: "6",
      name: "Youth Programs Effectiveness",
      summary: "Evaluating the impact of community youth programs on educational and social outcomes",
      author: "Robert Kim",
      lastModified: "4 days ago",
      visibility: "Public",
      tags: ["Youth", "Education", "Community"],
      starred: false,
    },
  ]

  const topContributors: Contributor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      status: "SAVI Moderator",
      projectsShared: 24,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/sarah-johnson",
    },
    {
      id: "2",
      name: "Michael Chen",
      status: "Analyst",
      projectsShared: 18,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/michael-chen",
    },
    {
      id: "3",
      name: "Lisa Rodriguez",
      status: "Community User",
      projectsShared: 15,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/lisa-rodriguez",
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      status: "Analyst",
      projectsShared: 12,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/james-wilson",
    },
    {
      id: "5",
      name: "Maria Garcia",
      status: "Community User",
      projectsShared: 11,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/maria-garcia",
    },
    {
      id: "6",
      name: "Robert Kim",
      status: "Community User",
      projectsShared: 9,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/robert-kim",
    },
    {
      id: "7",
      name: "Dr. Amanda Foster",
      status: "SAVI Moderator",
      projectsShared: 8,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/amanda-foster",
    },
    {
      id: "8",
      name: "David Thompson",
      status: "Analyst",
      projectsShared: 7,
      avatar: "/placeholder-user.jpg",
      profileUrl: "/profile/david-thompson",
    },
  ]

  const handleVideoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVideoNext = () => {
    setCurrentVideo((prev) => (prev + 1) % videoPlaylist.length)
  }

  const handleVideoSelect = (index: number) => {
    setCurrentVideo(index)
    setIsPlaying(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Folder className="h-4 w-4 text-blue-600" />
      case "community":
        return <Building2 className="h-4 w-4 text-blue-600" />
      case "visualization":
        return <Eye className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SAVI Moderator":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Analyst":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Community User":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredActivity = allActivity.filter((item) => activityFilter === "all" || item.type === activityFilter)

  const displayedActivity = showAllActivity ? filteredActivity : filteredActivity.slice(0, 6)
  const displayedContributors = showAllContributors ? topContributors : topContributors.slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      {/* Welcome Video Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Welcome to SAVI Pro</CardTitle>
          <CardDescription className="text-gray-600">
            Start here to learn how to use SAVI Pro's advanced data tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-lg font-medium mb-2">{videoPlaylist[currentVideo].label}</div>
                    <div className="text-sm text-gray-300 mb-4">{videoPlaylist[currentVideo].duration}</div>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleVideoPlay}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleVideoNext}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">Tutorial Playlist</h4>
              {videoPlaylist.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleVideoSelect(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentVideo === index
                      ? "bg-blue-50 border-blue-200 text-blue-900"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="font-medium text-sm">{video.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{video.duration}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Community Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Featured Community Projects</h2>
            <p className="text-gray-600 mt-1">Explore projects shared by the SAVI community.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {communityProjects.map((project) => (
            <Card key={project.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{project.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">{project.summary}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-500">
                    <Star className={`h-4 w-4 ${project.starred ? "fill-current text-yellow-500" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback className="text-xs">
                        {project.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.author}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Badge variant={project.visibility === "Public" ? "default" : "secondary"} className="text-xs">
                        {project.visibility}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.lastModified}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600 mt-1">Your latest actions and updates across SAVI Pro.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={activityFilter} onValueChange={(value: ActivityType) => setActivityFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activity</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="community">Communities</SelectItem>
                  <SelectItem value="visualization">Visualizations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={onNavigateToProjects} variant="outline" className="border-gray-300 bg-transparent">
                Go to Projects
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayedActivity.map((activity) => (
            <Card key={activity.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <Badge variant="outline" className="text-xs capitalize border-blue-200 text-blue-700">
                          {activity.type}
                        </Badge>
                        {activity.status && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="font-medium text-blue-600">{activity.action}</span>
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

        {!showAllActivity && filteredActivity.length > 6 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllActivity(true)}
              className="border-gray-300 bg-transparent"
            >
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
      </div>

      {/* Top Contributors Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Top Contributors</h2>
            <p className="text-gray-600 mt-1">Active community members sharing valuable insights and projects.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedContributors.map((contributor) => (
            <Card key={contributor.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-sm">
                      {contributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{contributor.name}</h3>
                    <Badge className={`text-xs mt-1 ${getStatusBadgeColor(contributor.status)}`}>
                      {contributor.status}
                    </Badge>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Projects Shared</span>
                        <span className="font-medium text-gray-900">{contributor.projectsShared}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 bg-transparent text-blue-600 hover:bg-blue-50"
                        onClick={() => window.open(contributor.profileUrl, "_blank")}
                      >
                        <Users className="h-3 w-3 mr-2" />
                        View Profile
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAllContributors && topContributors.length > 6 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllContributors(true)}
              className="border-gray-300 bg-transparent"
            >
              Show More Contributors ({topContributors.length - 6} more)
            </Button>
          </div>
        )}

        {showAllContributors && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllContributors(false)}
              className="border-gray-300 bg-transparent"
            >
              Show Less
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

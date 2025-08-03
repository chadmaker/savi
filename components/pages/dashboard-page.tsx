"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Users,
  BarChart3,
  FileText,
  Calendar,
  User,
  FolderOpen,
  Eye,
  Share2,
  Download,
  Plus,
} from "lucide-react"

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [activityFilter, setActivityFilter] = useState("all")
  const [showAllActivity, setShowAllActivity] = useState(false)

  const videoPlaylist = [
    { title: "Getting Started with SAVI", duration: "3:45", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Creating Your First Project", duration: "5:20", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Understanding Data Indicators", duration: "4:15", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Building Visualizations", duration: "6:30", thumbnail: "/placeholder.svg?height=120&width=200" },
    { title: "Sharing and Collaboration", duration: "3:55", thumbnail: "/placeholder.svg?height=120&width=200" },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "project",
      action: "created",
      title: "Marion County Health Analysis",
      user: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      timestamp: "2h ago",
      description: "New project analyzing health indicators across Marion County neighborhoods",
    },
    {
      id: 2,
      type: "visualization",
      action: "updated",
      title: "Education Outcomes Dashboard",
      user: "Mike Chen",
      avatar: "/placeholder-user.jpg",
      timestamp: "3h ago",
      description: "Updated charts with latest graduation rate data",
    },
    {
      id: 3,
      type: "community",
      action: "shared",
      title: "Broad Ripple Community Profile",
      user: "Emily Rodriguez",
      avatar: "/placeholder-user.jpg",
      timestamp: "5h ago",
      description: "Shared community analysis with local stakeholders",
    },
    {
      id: 4,
      type: "project",
      action: "viewed",
      title: "Transportation Access Study",
      user: "David Kim",
      avatar: "/placeholder-user.jpg",
      timestamp: "1d ago",
      description: "Reviewed transit accessibility metrics for downtown area",
    },
    {
      id: 5,
      type: "visualization",
      action: "downloaded",
      title: "Housing Affordability Trends",
      user: "Lisa Park",
      avatar: "/placeholder-user.jpg",
      timestamp: "1d ago",
      description: "Downloaded visualization for city council presentation",
    },
    {
      id: 6,
      type: "community",
      action: "created",
      title: "Fountain Square Analysis",
      user: "James Wilson",
      avatar: "/placeholder-user.jpg",
      timestamp: "2d ago",
      description: "Created new community profile for arts district",
    },
    {
      id: 7,
      type: "project",
      action: "updated",
      title: "Economic Development Indicators",
      user: "Maria Garcia",
      avatar: "/placeholder-user.jpg",
      timestamp: "2d ago",
      description: "Added new business growth metrics to existing project",
    },
    {
      id: 8,
      type: "visualization",
      action: "shared",
      title: "Crime Statistics Overview",
      user: "Robert Taylor",
      avatar: "/placeholder-user.jpg",
      timestamp: "3d ago",
      description: "Shared safety analysis with neighborhood association",
    },
    {
      id: 9,
      type: "community",
      action: "updated",
      title: "Mass Ave Corridor Study",
      user: "Jennifer Lee",
      avatar: "/placeholder-user.jpg",
      timestamp: "3d ago",
      description: "Updated demographic data for cultural district",
    },
    {
      id: 10,
      type: "project",
      action: "created",
      title: "Environmental Impact Assessment",
      user: "Alex Thompson",
      avatar: "/placeholder-user.jpg",
      timestamp: "4d ago",
      description: "New project tracking air quality and green space metrics",
    },
    {
      id: 11,
      type: "visualization",
      action: "viewed",
      title: "Population Growth Trends",
      user: "Rachel Brown",
      avatar: "/placeholder-user.jpg",
      timestamp: "5d ago",
      description: "Analyzed demographic shifts over past decade",
    },
    {
      id: 12,
      type: "community",
      action: "downloaded",
      title: "Downtown Development Profile",
      user: "Kevin Martinez",
      avatar: "/placeholder-user.jpg",
      timestamp: "1w ago",
      description: "Downloaded comprehensive downtown analysis report",
    },
  ]

  const featuredProjects = [
    {
      title: "Marion County Health Outcomes",
      description: "Comprehensive analysis of health indicators across all townships",
      author: "Public Health Department",
      lastUpdated: "2 days ago",
      status: "Active",
      indicators: 24,
      communities: 8,
    },
    {
      title: "Education Equity Study",
      description: "Examining educational disparities across school districts",
      author: "Education Research Team",
      lastUpdated: "1 week ago",
      status: "In Review",
      indicators: 18,
      communities: 12,
    },
    {
      title: "Housing Affordability Analysis",
      description: "Tracking housing costs and availability trends",
      author: "Housing Authority",
      lastUpdated: "3 days ago",
      status: "Active",
      indicators: 15,
      communities: 6,
    },
  ]

  const getActivityIcon = (type: string, action: string) => {
    if (action === "created") return <Plus className="h-4 w-4 text-blue-600" />
    if (action === "updated") return <FileText className="h-4 w-4 text-blue-600" />
    if (action === "shared") return <Share2 className="h-4 w-4 text-blue-600" />
    if (action === "downloaded") return <Download className="h-4 w-4 text-blue-600" />
    if (action === "viewed") return <Eye className="h-4 w-4 text-blue-600" />
    return <FileText className="h-4 w-4 text-blue-600" />
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderOpen className="h-4 w-4 text-blue-600" />
      case "community":
        return <Users className="h-4 w-4 text-blue-600" />
      case "visualization":
        return <BarChart3 className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-blue-600" />
    }
  }

  const filteredActivity = recentActivity.filter((activity) => {
    if (activityFilter === "all") return true
    return activity.type === activityFilter
  })

  const displayedActivity = showAllActivity ? filteredActivity : filteredActivity.slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sarah!</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your SAVI projects and community data.</p>
            </div>
            <Button onClick={() => onNavigate("projects")} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Welcome Video Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Getting Started with SAVI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                    <img
                      src="/placeholder.svg?height=300&width=500"
                      alt="Video thumbnail"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-16 w-16"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Video Playlist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videoPlaylist.map((video, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentVideo ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentVideo(index)}
                    >
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-12 h-8 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
              <div className="flex items-center space-x-3">
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-48 bg-white border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="project">Projects</SelectItem>
                    <SelectItem value="community">Communities</SelectItem>
                    <SelectItem value="visualization">Visualizations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-gray-900 font-medium">Activity</TableHead>
                    <TableHead className="text-gray-900 font-medium">Type</TableHead>
                    <TableHead className="text-gray-900 font-medium">User</TableHead>
                    <TableHead className="text-gray-900 font-medium">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedActivity.map((activity) => (
                    <TableRow key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type, activity.action)}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(activity.type)}
                          <Badge variant="outline" className="capitalize border-blue-200 text-blue-700">
                            {activity.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">{activity.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{activity.timestamp}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {!showAllActivity && filteredActivity.length > 10 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllActivity(true)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Show All Activity ({filteredActivity.length - 10} more)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Community Projects */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Featured Community Projects</CardTitle>
              <Button
                variant="outline"
                onClick={() => onNavigate("projects")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                View All Projects
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                        {project.title}
                      </CardTitle>
                      <Badge
                        variant={project.status === "Active" ? "default" : "secondary"}
                        className={
                          project.status === "Active"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{project.author}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{project.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span>{project.indicators} indicators</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{project.communities} communities</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

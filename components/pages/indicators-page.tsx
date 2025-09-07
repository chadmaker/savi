"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  BarChart3,
  Star,
  List,
  LayoutGrid,
  MoreHorizontal,
  Eye,
  ChevronRight,
  Upload,
  FileText,
  Lock,
  Link,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IndicatorsPageProps {
  onSelectIndicators: () => void
}

export function IndicatorsPage({ onSelectIndicators }: IndicatorsPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("list")
  const [showStarred, setShowStarred] = useState(false)
  const [filter, setFilter] = useState("all")
  const [savedIndicators, setSavedIndicators] = useState([
    {
      id: 1,
      name: "Population Age 25 to 34 With High School Diploma or Higher",
      categories: ["Education", "Attainment", "High School", "Age"],
      starred: true,
      extent: "County",
      reportingArea: "Census Tract",
      lastUpdated: "2023-10-01",
      availability: "2010",
    },
    {
      id: 2,
      name: "Median Household Income",
      categories: ["Economics", "Income"],
      starred: false,
      extent: "State",
      reportingArea: "County",
      lastUpdated: "2023-09-01",
      availability: "2010",
    },
  ])

  interface Dataset {
    id: number
    name: string
    size: string
    uploadDate: string
    visibility: "private" | "unlisted" | "community"
    records: number
    starred: boolean
  }

  const [uploadedDatasets, setUploadedDatasets] = useState<Dataset[]>([
    {
      id: 1,
      name: "Custom Demographics 2023",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      visibility: "private",
      records: 1247,
      starred: false,
    },
    {
      id: 2,
      name: "Housing Market Data",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      visibility: "unlisted",
      records: 892,
      starred: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("indicators")

  const toggleStar = (id: number) => {
    setSavedIndicators((prevIndicators) =>
      prevIndicators.map((indicator) =>
        indicator.id === id ? { ...indicator, starred: !indicator.starred } : indicator,
      ),
    )
  }

  const toggleDatasetStar = (id: number) => {
    setUploadedDatasets((prevDatasets) =>
      prevDatasets.map((dataset) => (dataset.id === id ? { ...dataset, starred: !dataset.starred } : dataset)),
    )
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="h-3 w-3" />
      case "unlisted":
        return <Link className="h-3 w-3" />
      case "community":
        return <Users className="h-3 w-3" />
      default:
        return <Lock className="h-3 w-3" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Private"
      case "unlisted":
        return "Shared"
      case "community":
        return "Community"
      default:
        return "Private"
    }
  }

  const filteredIndicators = savedIndicators
    .filter((i) => (showStarred ? i.starred : true))
    .filter((i) => (filter === "all" ? true : false)) // Placeholder for shared filter

  const filteredDatasets = uploadedDatasets
    .filter((d) => (showStarred ? d.starred : true))
    .filter((d) => {
      if (filter === "all") return true
      if (filter === "shared") return d.visibility === "unlisted" || d.visibility === "community"
      return true
    })

  return (
    <div>
      {/* Header Section */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Catalog</h2>
              <p className="text-gray-600 mt-1">
                Browse and manage data indicators and uploaded datasets. Add data to your projects to create
                visualizations.
              </p>
            </div>
          </div>
          <Button onClick={onSelectIndicators} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add to Project
          </Button>
        </div>
      </div>

      {/* Tabs for Indicators and Uploads */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="indicators">Data Indicators</TabsTrigger>
          <TabsTrigger value="uploads">Uploaded Datasets</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Available Indicators</h2>
              <div className="flex items-center space-x-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">View all</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={showStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStarred(!showStarred)}
                  className={showStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${showStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {filteredIndicators.length > 0 ? (
              viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredIndicators.map((indicator) => (
                    <div
                      key={indicator.id}
                      className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 leading-tight">{indicator.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-1 flex-shrink-0"
                            onClick={() => toggleStar(indicator.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${indicator.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {indicator.categories.map((cat) => (
                            <Badge key={cat} variant="secondary">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>Extent: {indicator.extent}</span>
                          <span>Reporting: {indicator.reportingArea}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Updated: {new Date(indicator.lastUpdated).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Metadata</DropdownMenuItem>
                                <DropdownMenuItem>Add to Project</DropdownMenuItem>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 w-12"></th>
                        <th className="text-left p-4 font-medium text-gray-900">Name</th>
                        <th className="text-left p-4 font-medium text-gray-900">Extent</th>
                        <th className="text-left p-4 font-medium text-gray-900">Reporting Area</th>
                        <th className="text-left p-4 font-medium text-gray-900">Last Updated</th>
                        <th className="text-left p-4 font-medium text-gray-900">Availability</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIndicators.map((indicator, index) => (
                        <tr key={indicator.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" onClick={() => toggleStar(indicator.id)}>
                              <Star
                                className={`h-4 w-4 ${indicator.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                              />
                            </Button>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{indicator.name}</div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              {indicator.categories.map((cat, i) => (
                                <span key={i} className="flex items-center">
                                  {cat}
                                  {i < indicator.categories.length - 1 && <ChevronRight className="h-3 w-3 mx-1" />}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{indicator.extent}</td>
                          <td className="p-4 text-gray-600">{indicator.reportingArea}</td>
                          <td className="p-4 text-gray-600">
                            {new Date(indicator.lastUpdated).toLocaleDateString("en-US", {
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 text-gray-600">{indicator.availability}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Metadata</DropdownMenuItem>
                                  <DropdownMenuItem>Add to Project</DropdownMenuItem>
                                  <DropdownMenuItem>Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>No indicators match your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="uploads">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Uploaded Datasets</h2>
              <div className="flex items-center space-x-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">View all</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={showStarred ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStarred(!showStarred)}
                  className={showStarred ? "bg-gray-900 text-white" : ""}
                >
                  <Star className={`h-4 w-4 mr-1 ${showStarred ? "fill-current text-yellow-400" : ""}`} />
                  Starred
                </Button>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {filteredDatasets.length > 0 ? (
              viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredDatasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{dataset.name}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-1"
                            onClick={() => toggleDatasetStar(dataset.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${dataset.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {getVisibilityIcon(dataset.visibility)}
                          <span>{getVisibilityLabel(dataset.visibility)}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>{dataset.size}</span>
                          <span>{dataset.records.toLocaleString()} records</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Uploaded: {new Date(dataset.uploadDate).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                <DropdownMenuItem>Add to Project</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 w-12"></th>
                        <th className="text-left p-4 font-medium text-gray-900">Dataset Name</th>
                        <th className="text-left p-4 font-medium text-gray-900">Size</th>
                        <th className="text-left p-4 font-medium text-gray-900">Records</th>
                        <th className="text-left p-4 font-medium text-gray-900">Upload Date</th>
                        <th className="text-left p-4 font-medium text-gray-900">Visibility</th>
                        <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDatasets.map((dataset, index) => (
                        <tr key={dataset.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="icon" onClick={() => toggleDatasetStar(dataset.id)}>
                              <Star
                                className={`h-4 w-4 ${dataset.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                              />
                            </Button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-gray-900">{dataset.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{dataset.size}</td>
                          <td className="p-4 text-gray-600">{dataset.records.toLocaleString()}</td>
                          <td className="p-4 text-gray-600">{new Date(dataset.uploadDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              {getVisibilityIcon(dataset.visibility)}
                              <span>{getVisibilityLabel(dataset.visibility)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                  <DropdownMenuItem>Add to Project</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Upload className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>No uploaded datasets match your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

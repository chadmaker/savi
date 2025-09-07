"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, FileText, List, LayoutGrid, Star, MoreHorizontal, Eye, Lock, Link, Users } from "lucide-react"

interface UploadPageProps {
  onUploadData: () => void
}

interface Dataset {
  id: number
  name: string
  size: string
  uploadDate: string
  visibility: "private" | "unlisted" | "community"
  records: number
  starred: boolean
}

export function UploadPage({ onUploadData }: UploadPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("list")
  const [showStarred, setShowStarred] = useState(false)
  const [filter, setFilter] = useState("all")

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

  const toggleStar = (id: number) => {
    setUploadedDatasets((prevDatasets) =>
      prevDatasets.map((dataset) => (dataset.id === id ? { ...dataset, starred: !dataset.starred } : dataset)),
    )
  }

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
            <div className="rounded-full bg-purple-100 p-4">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Uploads</h2>
              <p className="text-gray-600 mt-1">
                Import your own datasets for analysis. Upload CSV files with custom data indicators and geographic
                information.
              </p>
            </div>
          </div>
          <Button onClick={onUploadData} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>

      {/* Uploaded Datasets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Datasets</h2>
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
                        onClick={() => toggleStar(dataset.id)}
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
                            <DropdownMenuItem>Start Visualization</DropdownMenuItem>
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
                        <Button variant="ghost" size="icon" onClick={() => toggleStar(dataset.id)}>
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
                              <DropdownMenuItem>Start Visualization</DropdownMenuItem>
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
    </div>
  )
}

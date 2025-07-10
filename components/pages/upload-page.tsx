"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, FileText, Calendar, List, LayoutGrid, Star } from "lucide-react"

interface UploadPageProps {
  onUploadData: () => void
}

interface Dataset {
  id: number
  name: string
  size: string
  uploadDate: string
  status: string
  records: number
  starred: boolean
}

export function UploadPage({ onUploadData }: UploadPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)

  const [uploadedDatasets, setUploadedDatasets] = useState<Dataset[]>([
    {
      id: 1,
      name: "Custom Demographics 2023",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "Processed",
      records: 1247,
      starred: false,
    },
    {
      id: 2,
      name: "Housing Market Data",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      status: "Processing",
      records: 892,
      starred: true,
    },
    {
      id: 3,
      name: "Education Survey Results",
      size: "3.2 MB",
      uploadDate: "2024-01-08",
      status: "Processed",
      records: 2156,
      starred: false,
    },
    {
      id: 4,
      name: "Economic Indicators Q4",
      size: "1.1 MB",
      uploadDate: "2024-01-05",
      status: "Processed",
      records: 634,
      starred: true,
    },
  ])

  const getStatusColor = (status: string) => {
    return status === "Processed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const toggleStar = (id: number) => {
    setUploadedDatasets((prevDatasets) =>
      prevDatasets.map((dataset) => (dataset.id === id ? { ...dataset, starred: !dataset.starred } : dataset)),
    )
  }

  const filteredDatasets = showStarred ? uploadedDatasets.filter((dataset) => dataset.starred) : uploadedDatasets

  return (
    <div>
      {/* Header Section */}
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center mb-12">
        <div className="rounded-full bg-purple-100 p-6 mb-6">
          <Upload className="h-12 w-12 text-purple-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Upload</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Import your own datasets for analysis. Upload CSV files with your custom data indicators and geographic
          information.
        </p>
        <Button onClick={onUploadData} className="bg-purple-600 hover:bg-purple-700 text-white" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Upload Data
        </Button>
      </div>

      {/* Uploaded Datasets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Datasets</h2>
          <div className="flex items-center space-x-2">
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
            <Button
              variant={showStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarred(!showStarred)}
            >
              ⭐ Starred
            </Button>
          </div>
        </div>

        {filteredDatasets.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                          <p className="text-sm text-gray-500">
                            {dataset.size} • {dataset.records} records
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(dataset.status)}>{dataset.status}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => toggleStar(dataset.id)}>
                          <Star className={`h-4 w-4 ${dataset.starred ? "text-yellow-500" : "text-gray-400"}`} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(dataset.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Use Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Dataset Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Size</th>
                    <th className="text-left p-4 font-medium text-gray-900">Records</th>
                    <th className="text-left p-4 font-medium text-gray-900">Upload Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatasets.map((dataset, index) => (
                    <tr key={dataset.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
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
                        <Badge className={getStatusColor(dataset.status)}>{dataset.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Use Data
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleStar(dataset.id)}>
                            <Star className={`h-4 w-4 ${dataset.starred ? "text-yellow-500" : "text-gray-400"}`} />
                          </Button>
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
            <p>No uploaded datasets yet. Upload your first dataset to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

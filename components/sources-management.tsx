"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, MapPin, Eye, Trash2, Plus } from "lucide-react"

interface Dataset {
  id: string
  name: string
  type: "indicators" | "geography"
  uploadDate: string
  recordCount: number
  status: "active" | "processing" | "error"
  description: string
}

interface PreviewData {
  headers: string[]
  rows: string[][]
}

export function SourcesManagement() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "1",
      name: "Community Indicators 2024",
      type: "indicators",
      uploadDate: "2024-01-15",
      recordCount: 1247,
      status: "active",
      description: "Latest community indicators from SAVI portal",
    },
    {
      id: "2",
      name: "Marion County Geography",
      type: "geography",
      uploadDate: "2024-01-10",
      recordCount: 856,
      status: "active",
      description: "Geographic boundaries and metadata",
    },
  ])

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const [datasetType, setDatasetType] = useState<"indicators" | "geography">("indicators")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setUploadFile(file)

      // Parse CSV for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
        const rows = lines.slice(1, 6).map((line) => line.split(",").map((cell) => cell.replace(/"/g, "").trim()))

        setPreviewData({ headers, rows })
      }
      reader.readAsText(file)
    }
  }

  const handleUploadSubmit = () => {
    if (!uploadFile || !datasetName) return

    const newDataset: Dataset = {
      id: Date.now().toString(),
      name: datasetName,
      type: datasetType,
      uploadDate: new Date().toISOString().split("T")[0],
      recordCount: Math.floor(Math.random() * 1000) + 100,
      status: "processing",
      description: datasetDescription,
    }

    setDatasets((prev) => [...prev, newDataset])

    // Simulate processing
    setTimeout(() => {
      setDatasets((prev) => prev.map((d) => (d.id === newDataset.id ? { ...d, status: "active" } : d)))
    }, 2000)

    // Reset form
    setUploadFile(null)
    setPreviewData(null)
    setDatasetName("")
    setDatasetDescription("")
    setUploadModalOpen(false)
  }

  const downloadDataset = (dataset: Dataset) => {
    // Simulate download
    const csvContent = `Name,Type,Records,Status\n${dataset.name},${dataset.type},${dataset.recordCount},${dataset.status}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dataset.name.replace(/\s+/g, "_")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const deleteDataset = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sources Management</h1>
          <p className="text-muted-foreground">Upload, download, and manage your data sources</p>
        </div>
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Dataset</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataset-name">Dataset Name</Label>
                  <Input
                    id="dataset-name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="Enter dataset name..."
                  />
                </div>
                <div>
                  <Label htmlFor="dataset-type">Dataset Type</Label>
                  <select
                    id="dataset-type"
                    value={datasetType}
                    onChange={(e) => setDatasetType(e.target.value as "indicators" | "geography")}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="indicators">Indicators</option>
                    <option value="geography">Geography</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="dataset-description">Description</Label>
                <Input
                  id="dataset-description"
                  value={datasetDescription}
                  onChange={(e) => setDatasetDescription(e.target.value)}
                  placeholder="Enter dataset description..."
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Upload CSV File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              {previewData && (
                <div className="space-y-4">
                  <Tabs defaultValue={datasetType === "geography" ? "map" : "table"} className="w-full">
                    <TabsList>
                      <TabsTrigger value="table">
                        <FileText className="w-4 h-4 mr-2" />
                        Table Preview
                      </TabsTrigger>
                      {datasetType === "geography" && (
                        <TabsTrigger value="map">
                          <MapPin className="w-4 h-4 mr-2" />
                          Map Preview
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="table">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Data Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border rounded-md max-h-64 overflow-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {previewData.headers.map((header, index) => (
                                    <TableHead key={index}>{header}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {previewData.rows.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Showing first 5 rows of {uploadFile?.name}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {datasetType === "geography" && (
                      <TabsContent value="map">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Geographic Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                              <div className="text-center">
                                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">Map preview would display here</p>
                                <p className="text-sm text-muted-foreground">Geographic boundaries and data points</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadSubmit} disabled={!uploadFile || !datasetName}>
                  Upload Dataset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Datasets ({datasets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {dataset.type === "indicators" ? (
                        <FileText className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {dataset.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(dataset.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>{dataset.recordCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        dataset.status === "active"
                          ? "default"
                          : dataset.status === "processing"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {dataset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{dataset.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadDataset(dataset)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteDataset(dataset.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

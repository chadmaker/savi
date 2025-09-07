"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lock,
  Users,
  ChevronRight,
  ChevronLeft,
  Map,
  MapPin,
  Building,
  School,
  Hospital,
  ShoppingCart,
  Plus,
  X,
  BarChart3,
  Table,
  Download,
  FileText,
  Trash2,
  Edit,
} from "lucide-react"

interface CreateReportModalProps {
  open: boolean
  onClose: () => void
  onCreateReport?: (reportData: any) => void
}

interface AssetItem {
  id: string
  name: string
  type: "business" | "school" | "hospital" | "park" | "transit"
  icon: React.ReactNode
  position: { x: number; y: number }
}

interface IndicatorData {
  id: string
  name: string
  category: string
  value: string | number
  visualization: "table" | "chart"
}

export function CreateReportModal({ open, onClose, onCreateReport }: CreateReportModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [reportName, setReportName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [mapAssets, setMapAssets] = useState<AssetItem[]>([])
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorData[]>([])

  const availableCommunities = [
    "Marion County",
    "Broad Ripple",
    "Fountain Square",
    "Downtown Indianapolis",
    "Carmel",
    "Fishers",
  ]

  const availableAssets = [
    { id: "business", name: "Business District", type: "business", icon: <Building className="h-4 w-4" /> },
    { id: "school", name: "Schools", type: "school", icon: <School className="h-4 w-4" /> },
    { id: "hospital", name: "Healthcare", type: "hospital", icon: <Hospital className="h-4 w-4" /> },
    { id: "shopping", name: "Shopping Centers", type: "park", icon: <ShoppingCart className="h-4 w-4" /> },
  ]

  const availableIndicators = [
    { id: "pop", name: "Total Population", category: "Demographics", value: "34,936" },
    { id: "income", name: "Median Income", category: "Economics", value: "$52,340" },
    { id: "education", name: "Bachelor's Degree+", category: "Education", value: "42.8%" },
    { id: "housing", name: "Median Home Value", category: "Housing", value: "$185,400" },
  ]

  const steps = [
    { number: 1, title: "Report Details", description: "Basic information about your report" },
    { number: 2, title: "Select Community", description: "Choose the community to analyze" },
    { number: 3, title: "Add Map Assets", description: "Place assets on the interactive map" },
    { number: 4, title: "Select Data", description: "Choose indicators and visualizations" },
    { number: 5, title: "Review & Save", description: "Preview and finalize your report" },
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddAsset = (asset: any) => {
    const newAsset: AssetItem = {
      id: `${asset.id}-${Date.now()}`,
      name: asset.name,
      type: asset.type,
      icon: asset.icon,
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
    }
    setMapAssets([...mapAssets, newAsset])
  }

  const handleRemoveAsset = (assetId: string) => {
    setMapAssets(mapAssets.filter((asset) => asset.id !== assetId))
  }

  const handleAddIndicator = (indicator: any) => {
    const newIndicator: IndicatorData = {
      ...indicator,
      visualization: "table",
    }
    setSelectedIndicators([...selectedIndicators, newIndicator])
  }

  const handleRemoveIndicator = (indicatorId: string) => {
    setSelectedIndicators(selectedIndicators.filter((ind) => ind.id !== indicatorId))
  }

  const handleToggleVisualization = (indicatorId: string) => {
    setSelectedIndicators(
      selectedIndicators.map((ind) =>
        ind.id === indicatorId ? { ...ind, visualization: ind.visualization === "table" ? "chart" : "table" } : ind,
      ),
    )
  }

  const handleCreateReport = () => {
    const reportData = {
      name: reportName,
      description,
      visibility,
      community: selectedCommunity,
      assets: mapAssets,
      indicators: selectedIndicators,
      createdDate: new Date().toISOString(),
    }
    onCreateReport?.(reportData)
    onClose()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return reportName.trim() !== ""
      case 2:
        return selectedCommunity !== ""
      case 3:
        return true // Map assets are optional
      case 4:
        return selectedIndicators.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Community Report</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <div className="ml-2 hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-gray-400 mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Report Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="report-name" className="text-base font-medium text-gray-900">
                  Report Name *
                </Label>
                <Input
                  id="report-name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium text-gray-900">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose and scope of this report"
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">Visibility</Label>
                <RadioGroup value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      htmlFor="public"
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        visibility === "public" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="public" id="public" className="mt-1" />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Public</span>
                          </div>
                          <p className="text-sm text-gray-600">Visible to all Pro Tools users</p>
                        </div>
                      </div>
                    </label>

                    <label
                      htmlFor="private"
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        visibility === "private"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="private" id="private" className="mt-1" />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Lock className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Private</span>
                          </div>
                          <p className="text-sm text-gray-600">Only visible to you</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Select Community */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">Select Community for Analysis</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableCommunities.map((community) => (
                    <Card
                      key={community}
                      className={`cursor-pointer transition-colors ${
                        selectedCommunity === community
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCommunity(community)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{community}</div>
                            <div className="text-sm text-gray-600">Community Profile Available</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add Map Assets */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">Interactive Map - Add Assets</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Asset Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Available Assets</Label>
                    <div className="space-y-2">
                      {availableAssets.map((asset) => (
                        <Card
                          key={asset.id}
                          className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                          onClick={() => handleAddAsset(asset)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {asset.icon}
                                <span className="text-sm font-medium">{asset.name}</span>
                              </div>
                              <Plus className="h-4 w-4 text-blue-600" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Map Preview */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Map Preview</Label>
                    <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Map className="h-12 w-12 text-blue-400" />
                      </div>
                      {mapAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="absolute bg-white rounded-full p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                          style={{ left: asset.position.x, top: asset.position.y }}
                          onClick={() => handleRemoveAsset(asset.id)}
                        >
                          {asset.icon}
                        </div>
                      ))}
                    </div>
                    {mapAssets.length > 0 && (
                      <div className="mt-2">
                        <Label className="text-xs text-gray-600">Added Assets ({mapAssets.length})</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mapAssets.map((asset) => (
                            <Badge key={asset.id} variant="secondary" className="text-xs">
                              {asset.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Select Data */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Indicators */}
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-4 block">Available Indicators</Label>
                  <div className="space-y-2">
                    {availableIndicators
                      .filter((ind) => !selectedIndicators.find((sel) => sel.id === ind.id))
                      .map((indicator) => (
                        <Card
                          key={indicator.id}
                          className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                          onClick={() => handleAddIndicator(indicator)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{indicator.name}</div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {indicator.category}
                                  </Badge>
                                  <span className="text-sm text-gray-600">{indicator.value}</span>
                                </div>
                              </div>
                              <Plus className="h-4 w-4 text-blue-600" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Selected Indicators */}
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-4 block">
                    Selected Data ({selectedIndicators.length})
                  </Label>
                  {selectedIndicators.length > 0 ? (
                    <div className="space-y-2">
                      {selectedIndicators.map((indicator) => (
                        <Card key={indicator.id} className="border border-gray-200">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm">{indicator.name}</div>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveIndicator(indicator.id)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{indicator.value}</span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant={indicator.visualization === "table" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleVisualization(indicator.id)}
                                >
                                  <Table className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant={indicator.visualization === "chart" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleVisualization(indicator.id)}
                                >
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No indicators selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Save */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">Report Preview</Label>
                <Card className="border border-gray-200">
                  <CardContent className="p-6 space-y-6">
                    {/* Report Header */}
                    <div className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reportName}</h3>
                          <p className="text-gray-600 mt-1">{description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={visibility === "public" ? "default" : "secondary"}>
                              {visibility === "public" ? "Public" : "Private"}
                            </Badge>
                            <span className="text-sm text-gray-500">Community: {selectedCommunity}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Community Stats */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Basic Community Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">34,936</div>
                          <div className="text-xs text-gray-600">Population</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">8.2 sq mi</div>
                          <div className="text-xs text-gray-600">Area</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">$52,340</div>
                          <div className="text-xs text-gray-600">Median Income</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">32.1 years</div>
                          <div className="text-xs text-gray-600">Median Age</div>
                        </div>
                      </div>
                    </div>

                    {/* Map with Assets */}
                    {mapAssets.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Map with Assets</h4>
                        <div className="relative h-32 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Map className="h-8 w-8 text-blue-400" />
                          </div>
                          {mapAssets.slice(0, 3).map((asset, index) => (
                            <div
                              key={asset.id}
                              className="absolute bg-white rounded-full p-1 shadow-sm"
                              style={{ left: 20 + index * 30, top: 20 + index * 10 }}
                            >
                              {asset.icon}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mapAssets.map((asset) => (
                            <Badge key={asset.id} variant="secondary" className="text-xs">
                              {asset.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visualizations */}
                    {selectedIndicators.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Data Visualizations</h4>
                        <div className="space-y-2">
                          {selectedIndicators.map((indicator) => (
                            <div
                              key={indicator.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm">{indicator.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{indicator.value}</span>
                                {indicator.visualization === "table" ? (
                                  <Table className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <BarChart3 className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={currentStep === 1 ? onClose : handlePrevious} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

          <div className="flex space-x-2">
            {currentStep === 5 ? (
              <>
                <Button variant="outline" onClick={handleCreateReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
                <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export (PDF/Doc)
                </Button>
              </>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="bg-blue-600 hover:bg-blue-700">
                {currentStep === 4 ? "Review Report" : "Continue"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

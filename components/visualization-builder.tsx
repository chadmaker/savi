"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Map,
  BarChart3,
  Table,
  User,
  Download,
  Share,
  ChevronRight,
  ChevronLeft,
  Plus,
  Save,
} from "lucide-react"
import { ExportModal } from "./modals/export-modal"
import type { ProjectData } from "./modals/create-project-modal"

interface VisualizationBuilderProps {
  projectName: string
  projectData?: ProjectData
  onBackToWorkspace: () => void
}

export function VisualizationBuilder({ projectName, projectData, onBackToWorkspace }: VisualizationBuilderProps) {
  const [activeView, setActiveView] = useState<"map" | "chart" | "table" | "profile">("map")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveItemName, setSaveItemName] = useState("")
  const [saveItemDescription, setSaveItemDescription] = useState("")
  const [fromYear, setFromYear] = useState("2020")
  const [toYear, setToYear] = useState("2023")
  const [normalization, setNormalization] = useState("count")

  const viewTabs = [
    { id: "map", label: "Map", icon: Map },
    { id: "chart", label: "Chart", icon: BarChart3 },
    { id: "table", label: "Table", icon: Table },
    { id: "profile", label: "Profile", icon: User },
  ]

  const sampleCommunities = ["Marion County", "Broad Ripple", "Fountain Square"]
  const sampleIndicators = ["Population", "Median Income", "Education Attainment"]
  const sampleDatasets = ["Custom Demographics 2023", "Housing Market Data"]

  const years = Array.from({ length: 11 }, (_, i) => (2015 + i).toString())

  const handleSaveToProject = () => {
    setSaveItemName(`${activeView.charAt(0).toUpperCase() + activeView.slice(1)} - ${new Date().toLocaleDateString()}`)
    setSaveItemDescription("")
    setShowSaveModal(true)
  }

  const handleSaveConfirm = () => {
    // Save logic here
    console.log("Saving:", { name: saveItemName, description: saveItemDescription, type: activeView })
    setShowSaveModal(false)
    setSaveItemName("")
    setSaveItemDescription("")
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToWorkspace}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Left Sidebar Controls */}
      <div
        className={`fixed top-16 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
          sidebarCollapsed ? "w-12" : "w-80"
        }`}
      >
        <div className="p-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mb-4">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          {!sidebarCollapsed && (
            <div className="space-y-6">
              {/* Communities Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Communities</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communities" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCommunities.map((community) => (
                      <SelectItem key={community} value={community}>
                        {community}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Add Community
                </Button>
              </div>

              {/* Indicators Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Indicators</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select indicators" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleIndicators.map((indicator) => (
                      <SelectItem key={indicator} value={indicator}>
                        {indicator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Add Indicator
                </Button>
              </div>

              {/* Data Sets Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Data Sets</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select datasets" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleDatasets.map((dataset) => (
                      <SelectItem key={dataset} value={dataset}>
                        {dataset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Upload Data
                </Button>
              </div>

              {/* Time Series */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Time Series</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">From</Label>
                    <Select value={fromYear} onValueChange={setFromYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">To</Label>
                    <Select value={toYear} onValueChange={setToYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Normalization */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Normalization</h3>
                <Select value={normalization} onValueChange={setNormalization}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="percent-population">% of Population</SelectItem>
                    <SelectItem value="percent-total">% of Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 pt-16 transition-all duration-300 ${sidebarCollapsed ? "ml-12" : "ml-80"}`}>
        {/* Visualization Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex space-x-8 px-6">
            {viewTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium ${
                    activeView === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Strip */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Viewing: {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </span>
            </div>
            <Button onClick={handleSaveToProject} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save to Project
            </Button>
          </div>
        </div>

        {/* Visualization Content */}
        <div className="p-6">
          {activeView === "map" && (
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map View</h3>
                    <p className="text-gray-500">Displaying selected communities and indicators</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-medium text-gray-700">Marion County</div>
                        <div className="text-blue-600">Population: 964,582</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="font-medium text-gray-700">Broad Ripple</div>
                        <div className="text-green-600">Median Income: $52,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeView === "chart" && (
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Data Visualization</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chart Visualization</h3>
                    <p className="text-gray-500">Interactive charts and graphs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeView === "table" && (
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Community</th>
                        <th className="text-left p-2">Population</th>
                        <th className="text-left p-2">Median Income</th>
                        <th className="text-left p-2">Education Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Marion County</td>
                        <td className="p-2">964,582</td>
                        <td className="p-2">$45,000</td>
                        <td className="p-2">85%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Broad Ripple</td>
                        <td className="p-2">12,500</td>
                        <td className="p-2">$52,000</td>
                        <td className="p-2">92%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Fountain Square</td>
                        <td className="p-2">8,200</td>
                        <td className="p-2">$48,000</td>
                        <td className="p-2">88%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeView === "profile" && (
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Community Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Demographics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Population</span>
                        <span className="font-medium">964,582</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Median Age</span>
                        <span className="font-medium">34.2 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Households</span>
                        <span className="font-medium">387,183</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Data Summaries */}
                  {projectData && (
                    <div>
                      <h3 className="font-semibold mb-4">Related Data Summaries</h3>
                      {projectData.relatedTopics?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Topic Insights</h4>
                          <div className="space-y-2">
                            {projectData.relatedTopics.slice(0, 3).map((topic) => (
                              <div key={topic} className="text-sm">
                                <span className="font-medium">{topic}:</span>
                                <span className="text-gray-600 ml-2">
                                  {topic === "Housing" && "Median home value: $145,000"}
                                  {topic === "Education" && "High school graduation: 87%"}
                                  {topic === "Health" && "Life expectancy: 76.2 years"}
                                  {!["Housing", "Education", "Health"].includes(topic) && "Data available"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {projectData.relatedPopulations?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Population Breakdown</h4>
                          <div className="space-y-2">
                            {projectData.relatedPopulations.slice(0, 3).map((population) => (
                              <div key={population} className="text-sm">
                                <span className="font-medium">{population}:</span>
                                <span className="text-gray-600 ml-2">
                                  {population === "African Americans" && "28.5% of population"}
                                  {population === "Working Age" && "62.1% of population"}
                                  {population === "Youth" && "24.3% of population"}
                                  {!["African Americans", "Working Age", "Youth"].includes(population) &&
                                    "Data available"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="save-name">Name *</Label>
              <Input
                id="save-name"
                value={saveItemName}
                onChange={(e) => setSaveItemName(e.target.value)}
                placeholder="Enter name for this visualization"
              />
            </div>
            <div>
              <Label htmlFor="save-description">Description (Optional)</Label>
              <Textarea
                id="save-description"
                value={saveItemDescription}
                onChange={(e) => setSaveItemDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfirm} disabled={!saveItemName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ExportModal open={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  )
}

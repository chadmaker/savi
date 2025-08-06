"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, Map, PieChart, LineChart, Download, Share, Settings } from 'lucide-react'

interface VisualizationBuilderProps {
  projectName: string
  onBackToWorkspace: () => void
}

export function VisualizationBuilder({ projectName, onBackToWorkspace }: VisualizationBuilderProps) {
  const [selectedVisualization, setSelectedVisualization] = useState<string>("bar-chart")
  const [selectedData, setSelectedData] = useState<string>("")
  const [selectedGeography, setSelectedGeography] = useState<string>("")

  const visualizationTypes = [
    {
      id: "bar-chart",
      name: "Bar Chart",
      icon: BarChart3,
      description: "Compare values across categories"
    },
    {
      id: "line-chart",
      name: "Line Chart",
      icon: LineChart,
      description: "Show trends over time"
    },
    {
      id: "pie-chart",
      name: "Pie Chart",
      icon: PieChart,
      description: "Show proportions of a whole"
    },
    {
      id: "map",
      name: "Map",
      icon: Map,
      description: "Display geographic data"
    }
  ]

  const dataOptions = [
    { id: "median-income", name: "Median Household Income" },
    { id: "population-density", name: "Population Density" },
    { id: "unemployment-rate", name: "Unemployment Rate" },
    { id: "housing-cost", name: "Housing Cost Burden" }
  ]

  const geographyOptions = [
    { id: "marion-county", name: "Marion County" },
    { id: "neighborhoods", name: "All Neighborhoods" },
    { id: "census-tracts", name: "Census Tracts" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBackToWorkspace}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Visualization Builder</h1>
                <p className="text-sm text-gray-500">{projectName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualization Type</CardTitle>
                <CardDescription>Choose how to display your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {visualizationTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVisualization === type.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedVisualization(type.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">{type.name}</p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Configuration</CardTitle>
                <CardDescription>Select your data and geography</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Data Indicator
                  </label>
                  <Select value={selectedData} onValueChange={setSelectedData}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Geography
                  </label>
                  <Select value={selectedGeography} onValueChange={setSelectedGeography}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                    <SelectContent>
                      {geographyOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={!selectedData || !selectedGeography}
                >
                  Generate Visualization
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Preview */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Your visualization will appear here once you configure the settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {selectedData && selectedGeography ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const SelectedIcon = visualizationTypes.find(t => t.id === selectedVisualization)?.icon || BarChart3
                          return <SelectedIcon className="h-8 w-8 text-blue-600" />
                        })()}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {visualizationTypes.find(t => t.id === selectedVisualization)?.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Showing {dataOptions.find(d => d.id === selectedData)?.name} for{' '}
                        {geographyOptions.find(g => g.id === selectedGeography)?.name}
                      </p>
                      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Visualization preview would appear here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Select data indicator and geography to preview your visualization
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

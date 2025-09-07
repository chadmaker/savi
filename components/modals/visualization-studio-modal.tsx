"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  BarChart3,
  Table,
  PieChart,
  TreePine,
  TrendingUp,
  Users,
  ScatterChartIcon as Scatter3D,
  Zap,
} from "lucide-react"

interface VisualizationStudioModalProps {
  isOpen: boolean
  onClose: () => void
}

const geographies = ["Marion County", "Broad Ripple", "Downtown Indianapolis", "Fountain Square", "Mass Ave"]
const indicators = ["Population", "Median Income", "Education Level", "Crime Rate", "Housing Cost", "Employment Rate"]
const years = ["2018", "2019", "2020", "2021", "2022", "2023"]

export default function VisualizationStudioModal({ isOpen, onClose }: VisualizationStudioModalProps) {
  const [activeTab, setActiveTab] = useState("compare-indicators")
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>(["Marion County"])
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["Median Income"])
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedYears, setSelectedYears] = useState<string[]>(["2020", "2021", "2022", "2023"])
  const [visualizationType, setVisualizationType] = useState("map")
  const [specialtyVizType, setSpecialtyVizType] = useState("tree-map")
  const [brushingEnabled, setBrushingEnabled] = useState(true)

  const handleGeographyToggle = (geography: string, multiSelect = true) => {
    if (multiSelect) {
      setSelectedGeographies((prev) =>
        prev.includes(geography) ? prev.filter((g) => g !== geography) : [...prev, geography],
      )
    } else {
      setSelectedGeographies([geography])
    }
  }

  const handleIndicatorToggle = (indicator: string, multiSelect = true) => {
    if (multiSelect) {
      setSelectedIndicators((prev) =>
        prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator],
      )
    } else {
      setSelectedIndicators([indicator])
    }
  }

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  const VisualizationTypeButton = ({
    type,
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    type: string
    icon: any
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  )

  const renderCompareIndicatorsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Geographies (Multi-select)</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
            {geographies.map((geo) => (
              <div key={geo} className="flex items-center space-x-2">
                <Checkbox
                  id={`geo-${geo}`}
                  checked={selectedGeographies.includes(geo)}
                  onCheckedChange={() => handleGeographyToggle(geo)}
                />
                <Label htmlFor={`geo-${geo}`} className="text-sm">
                  {geo}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Indicator (Single)</Label>
          <Select value={selectedIndicators[0]} onValueChange={(value) => setSelectedIndicators([value])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((indicator) => (
                <SelectItem key={indicator} value={indicator}>
                  {indicator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
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

      <div>
        <Label className="text-sm font-medium mb-3 block">Visualization Type</Label>
        <div className="flex flex-wrap gap-2">
          <VisualizationTypeButton
            type="map"
            icon={MapPin}
            label="Interactive Map"
            isActive={visualizationType === "map"}
            onClick={() => setVisualizationType("map")}
          />
          <VisualizationTypeButton
            type="bar"
            icon={BarChart3}
            label="Bar Chart"
            isActive={visualizationType === "bar"}
            onClick={() => setVisualizationType("bar")}
          />
          <VisualizationTypeButton
            type="table"
            icon={Table}
            label="Table"
            isActive={visualizationType === "table"}
            onClick={() => setVisualizationType("table")}
          />
        </div>
      </div>

      {(visualizationType === "bar" || visualizationType === "table") && (
        <div className="flex items-center space-x-2">
          <Checkbox id="brushing-compare" checked={brushingEnabled} onCheckedChange={setBrushingEnabled} />
          <Label htmlFor="brushing-compare" className="text-sm">
            Enable Brushing & Linking between Map and Bar Chart
          </Label>
        </div>
      )}
    </div>
  )

  const renderCommunitySnapshotTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Geography (Single)</Label>
          <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {geographies.map((geo) => (
                <SelectItem key={geo} value={geo}>
                  {geo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Indicators (Multi-select)</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
            {indicators.map((indicator) => (
              <div key={indicator} className="flex items-center space-x-2">
                <Checkbox
                  id={`ind-${indicator}`}
                  checked={selectedIndicators.includes(indicator)}
                  onCheckedChange={() => handleIndicatorToggle(indicator)}
                />
                <Label htmlFor={`ind-${indicator}`} className="text-sm">
                  {indicator}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
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

      <div>
        <Label className="text-sm font-medium mb-3 block">Visualization Type</Label>
        <div className="flex flex-wrap gap-2">
          <VisualizationTypeButton
            type="bar"
            icon={BarChart3}
            label="Bar Chart"
            isActive={visualizationType === "bar"}
            onClick={() => setVisualizationType("bar")}
          />
          <VisualizationTypeButton
            type="pie"
            icon={PieChart}
            label="Pie Chart"
            isActive={visualizationType === "pie"}
            onClick={() => setVisualizationType("pie")}
          />
          <VisualizationTypeButton
            type="table"
            icon={Table}
            label="Table"
            isActive={visualizationType === "table"}
            onClick={() => setVisualizationType("table")}
          />
          <VisualizationTypeButton
            type="treemap"
            icon={TreePine}
            label="Tree Map"
            isActive={visualizationType === "treemap"}
            onClick={() => setVisualizationType("treemap")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="brushing-snapshot" checked={brushingEnabled} onCheckedChange={setBrushingEnabled} />
        <Label htmlFor="brushing-snapshot" className="text-sm">
          Enable Brushing & Linking between visualizations
        </Label>
      </div>
    </div>
  )

  const renderTrendsOverTimeTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Geography (Single)</Label>
          <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {geographies.map((geo) => (
                <SelectItem key={geo} value={geo}>
                  {geo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Indicator (Single)</Label>
          <Select value={selectedIndicators[0]} onValueChange={(value) => setSelectedIndicators([value])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((indicator) => (
                <SelectItem key={indicator} value={indicator}>
                  {indicator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Years (Multi-select)</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
            {years.map((year) => (
              <div key={year} className="flex items-center space-x-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() => handleYearToggle(year)}
                />
                <Label htmlFor={`year-${year}`} className="text-sm">
                  {year}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Visualization Type</Label>
        <div className="flex flex-wrap gap-2">
          <VisualizationTypeButton
            type="line"
            icon={TrendingUp}
            label="Line Chart"
            isActive={visualizationType === "line"}
            onClick={() => setVisualizationType("line")}
          />
          <VisualizationTypeButton
            type="bar"
            icon={BarChart3}
            label="Bar Chart"
            isActive={visualizationType === "bar"}
            onClick={() => setVisualizationType("bar")}
          />
          <VisualizationTypeButton
            type="table"
            icon={Table}
            label="Table"
            isActive={visualizationType === "table"}
            onClick={() => setVisualizationType("table")}
          />
          <VisualizationTypeButton
            type="map"
            icon={MapPin}
            label="Map"
            isActive={visualizationType === "map"}
            onClick={() => setVisualizationType("map")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="brushing-trends" checked={brushingEnabled} onCheckedChange={setBrushingEnabled} />
        <Label htmlFor="brushing-trends" className="text-sm">
          Enable Brushing & Linking between Line and Bar Chart
        </Label>
      </div>
    </div>
  )

  const renderPopulationPyramidTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Geography (Single)</Label>
          <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {geographies.map((geo) => (
                <SelectItem key={geo} value={geo}>
                  {geo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
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
          <Label className="text-sm font-medium mb-2 block">Demographic Indicator</Label>
          <Select value="age-gender" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age-gender">Age/Gender Distribution</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Visualization Type</Label>
        <div className="flex flex-wrap gap-2">
          <VisualizationTypeButton
            type="pyramid"
            icon={Users}
            label="Population Pyramid"
            isActive={visualizationType === "pyramid"}
            onClick={() => setVisualizationType("pyramid")}
          />
          <VisualizationTypeButton
            type="bar"
            icon={BarChart3}
            label="Bar Chart"
            isActive={visualizationType === "bar"}
            onClick={() => setVisualizationType("bar")}
          />
          <VisualizationTypeButton
            type="table"
            icon={Table}
            label="Table"
            isActive={visualizationType === "table"}
            onClick={() => setVisualizationType("table")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="brushing-pyramid" checked={brushingEnabled} onCheckedChange={setBrushingEnabled} />
        <Label htmlFor="brushing-pyramid" className="text-sm">
          Enable Brushing & Linking between Pyramid and Bar Chart
        </Label>
      </div>
    </div>
  )

  const renderSpecialtyVisualizationsTab = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Specialty Visualization Type</Label>
        <div className="flex flex-wrap gap-2">
          <VisualizationTypeButton
            type="tree-map"
            icon={TreePine}
            label="Tree Map"
            isActive={specialtyVizType === "tree-map"}
            onClick={() => setSpecialtyVizType("tree-map")}
          />
          <VisualizationTypeButton
            type="heat-map"
            icon={Zap}
            label="Heat Map"
            isActive={specialtyVizType === "heat-map"}
            onClick={() => setSpecialtyVizType("heat-map")}
          />
          <VisualizationTypeButton
            type="scatter-plot"
            icon={Scatter3D}
            label="Scatter Plot"
            isActive={specialtyVizType === "scatter-plot"}
            onClick={() => setSpecialtyVizType("scatter-plot")}
          />
          <VisualizationTypeButton
            type="bubble-chart"
            icon={Scatter3D}
            label="Bubble Chart"
            isActive={specialtyVizType === "bubble-chart"}
            onClick={() => setSpecialtyVizType("bubble-chart")}
          />
        </div>
      </div>

      {specialtyVizType === "tree-map" && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Geography</Label>
            <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {geographies.map((geo) => (
                  <SelectItem key={geo} value={geo}>
                    {geo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Hierarchical Indicator</Label>
            <Select value="budget-allocations" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget-allocations">Budget Allocations</SelectItem>
                <SelectItem value="age-groups">Age Groups</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {specialtyVizType === "heat-map" && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Indicator</Label>
            <Select value="crime-rate" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crime-rate">Crime Rates</SelectItem>
                <SelectItem value="population-density">Population Density</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Geographies (Multi-select)</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
              {geographies.map((geo) => (
                <div key={geo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`heat-geo-${geo}`}
                    checked={selectedGeographies.includes(geo)}
                    onCheckedChange={() => handleGeographyToggle(geo)}
                  />
                  <Label htmlFor={`heat-geo-${geo}`} className="text-sm">
                    {geo}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
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
      )}

      {specialtyVizType === "scatter-plot" && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">X-Axis Indicator</Label>
            <Select value="median-income" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="median-income">Median Income</SelectItem>
                <SelectItem value="education-level">Education Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Y-Axis Indicator</Label>
            <Select value="education-level" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education-level">Education Level</SelectItem>
                <SelectItem value="median-income">Median Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Geography</Label>
            <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {geographies.map((geo) => (
                  <SelectItem key={geo} value={geo}>
                    {geo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {specialtyVizType === "bubble-chart" && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">X-Axis Indicator</Label>
            <Select value="median-income" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="median-income">Median Income</SelectItem>
                <SelectItem value="education-level">Education Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Y-Axis Indicator</Label>
            <Select value="education-level" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education-level">Education Level</SelectItem>
                <SelectItem value="population">Population</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Bubble Size Indicator</Label>
            <Select value="population" onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="population">Population</SelectItem>
                <SelectItem value="housing-cost">Housing Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Geography</Label>
            <Select value={selectedGeographies[0]} onValueChange={(value) => setSelectedGeographies([value])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {geographies.map((geo) => (
                  <SelectItem key={geo} value={geo}>
                    {geo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox id="brushing-specialty" checked={brushingEnabled} onCheckedChange={setBrushingEnabled} />
        <Label htmlFor="brushing-specialty" className="text-sm">
          Enable Brushing & Linking between visualizations
        </Label>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1280px] max-w-[1280px] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Visualization Studio</DialogTitle>
        </DialogHeader>

        {/* Full-width tabs under title */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="compare-indicators" className="text-sm py-3">
              Compare Indicators
            </TabsTrigger>
            <TabsTrigger value="community-snapshot" className="text-sm py-3">
              Community Snapshot
            </TabsTrigger>
            <TabsTrigger value="trends-over-time" className="text-sm py-3">
              Trends Over Time
            </TabsTrigger>
            <TabsTrigger value="population-pyramid" className="text-sm py-3">
              Population Pyramid
            </TabsTrigger>
            <TabsTrigger value="specialty-visualizations" className="text-sm py-3">
              Specialty Visualizations
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Left Panel - Configuration */}
            <div className="w-96 flex-shrink-0 overflow-y-auto">
              <TabsContent value="compare-indicators" className="space-y-4 mt-0">
                {renderCompareIndicatorsTab()}
              </TabsContent>

              <TabsContent value="community-snapshot" className="space-y-4 mt-0">
                {renderCommunitySnapshotTab()}
              </TabsContent>

              <TabsContent value="trends-over-time" className="space-y-4 mt-0">
                {renderTrendsOverTimeTab()}
              </TabsContent>

              <TabsContent value="population-pyramid" className="space-y-4 mt-0">
                {renderPopulationPyramidTab()}
              </TabsContent>

              <TabsContent value="specialty-visualizations" className="space-y-4 mt-0">
                {renderSpecialtyVisualizationsTab()}
              </TabsContent>
            </div>

            {/* Right Panel - Visualization Preview */}
            <div className="flex-1 flex flex-col bg-gray-50 rounded-lg border">
              <div className="p-4 border-b bg-white rounded-t-lg">
                <h3 className="text-lg font-semibold text-gray-900">Visualization Preview</h3>
                <p className="text-sm text-gray-600">
                  {activeTab === "compare-indicators" && "Comparing indicators across selected geographies"}
                  {activeTab === "community-snapshot" && "Community overview with multiple indicators"}
                  {activeTab === "trends-over-time" && "Trend analysis over selected time period"}
                  {activeTab === "population-pyramid" && "Population demographic breakdown"}
                  {activeTab === "specialty-visualizations" && `${specialtyVizType.replace("-", " ")} visualization`}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    {activeTab === "compare-indicators" && <MapPin className="w-12 h-12 text-blue-600" />}
                    {activeTab === "community-snapshot" && <BarChart3 className="w-12 h-12 text-blue-600" />}
                    {activeTab === "trends-over-time" && <TrendingUp className="w-12 h-12 text-blue-600" />}
                    {activeTab === "population-pyramid" && <Users className="w-12 h-12 text-blue-600" />}
                    {activeTab === "specialty-visualizations" && <Scatter3D className="w-12 h-12 text-blue-600" />}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-gray-700">
                      {visualizationType === "map" && "Interactive Map"}
                      {visualizationType === "bar" && "Bar Chart"}
                      {visualizationType === "line" && "Line Chart"}
                      {visualizationType === "pie" && "Pie Chart"}
                      {visualizationType === "table" && "Data Table"}
                      {visualizationType === "treemap" && "Tree Map"}
                      {visualizationType === "pyramid" && "Population Pyramid"}
                      {activeTab === "specialty-visualizations" &&
                        specialtyVizType
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                    </h4>
                    <p className="text-gray-500 max-w-md">
                      Your visualization will appear here once you configure the parameters and click "Generate Preview"
                    </p>
                  </div>

                  {/* Sample Data Preview */}
                  <div className="mt-8 p-4 bg-white rounded-lg border max-w-md">
                    <h5 className="font-medium text-gray-700 mb-2">Sample Data</h5>
                    <div className="space-y-1 text-sm">
                      {selectedGeographies.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{selectedGeographies[0]}:</span>
                          <span className="font-medium">
                            {selectedIndicators[0] === "Population" && "964,582"}
                            {selectedIndicators[0] === "Median Income" && "$52,000"}
                            {selectedIndicators[0] === "Education Level" && "85.2%"}
                            {selectedIndicators[0] === "Crime Rate" && "4.2/1000"}
                            {selectedIndicators[0] === "Housing Cost" && "$1,200"}
                            {selectedIndicators[0] === "Employment Rate" && "92.1%"}
                          </span>
                        </div>
                      )}
                      {selectedGeographies.includes("Broad Ripple") && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Broad Ripple:</span>
                          <span className="font-medium">
                            {selectedIndicators[0] === "Population" && "12,450"}
                            {selectedIndicators[0] === "Median Income" && "$68,500"}
                            {selectedIndicators[0] === "Education Level" && "91.8%"}
                            {selectedIndicators[0] === "Crime Rate" && "2.1/1000"}
                            {selectedIndicators[0] === "Housing Cost" && "$1,450"}
                            {selectedIndicators[0] === "Employment Rate" && "94.7%"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-4">Generate Preview</Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs>

        <div className="flex justify-between items-center p-6 border-t bg-white flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {selectedGeographies.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Geographies:</span>
                {selectedGeographies.map((geo) => (
                  <Badge key={geo} variant="secondary" className="text-xs">
                    {geo}
                  </Badge>
                ))}
              </div>
            )}
            {selectedIndicators.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Indicators:</span>
                {selectedIndicators.map((indicator) => (
                  <Badge key={indicator} variant="secondary" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            onClick={() => {
              // Handle save visualization logic here
              console.log("Saving visualization...", {
                tab: activeTab,
                geographies: selectedGeographies,
                indicators: selectedIndicators,
                year: selectedYear,
                years: selectedYears,
                visualizationType,
                specialtyVizType,
                brushingEnabled,
              })
            }}
          >
            Save Visualization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

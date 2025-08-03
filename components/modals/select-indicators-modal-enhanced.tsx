"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Star,
  X,
  Calendar,
  Database,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronRight,
} from "lucide-react"
import { realIndicators, filterOptionsReal, type RealIndicator } from "@/data/real-indicators"
import { cn } from "@/lib/utils"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators: initialSelected,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [indicators, setIndicators] = useState<RealIndicator[]>(realIndicators)
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "topic" | "updated">("relevance")
  const [groupBy, setGroupBy] = useState<"none" | "topics" | "subtopics" | "sources">("none")
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null)

  // Filter options
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDataRange, setSelectedDataRange] = useState("All Years")
  const [selectedCommunity, setSelectedCommunity] = useState("All Region")
  const [selectedReportingArea, setSelectedReportingArea] = useState("All Reporting Areas")
  const [selectedDataSource, setSelectedDataSource] = useState("All Data Sources")

  // Get active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{ label: string; value: string; type: string }> = []

    if (selectedCategory !== "All Categories") {
      chips.push({ label: selectedCategory, value: selectedCategory, type: "category" })
    }
    if (selectedDataRange !== "All Years") {
      chips.push({ label: selectedDataRange, value: selectedDataRange, type: "dataRange" })
    }
    if (selectedCommunity !== "All Region") {
      chips.push({ label: selectedCommunity, value: selectedCommunity, type: "community" })
    }
    if (selectedReportingArea !== "All Reporting Areas") {
      chips.push({ label: selectedReportingArea, value: selectedReportingArea, type: "reportingArea" })
    }
    if (selectedDataSource !== "All Data Sources") {
      chips.push({ label: selectedDataSource, value: selectedDataSource, type: "dataSource" })
    }

    return chips
  }, [selectedCategory, selectedDataRange, selectedCommunity, selectedReportingArea, selectedDataSource])

  const filteredIndicators = useMemo(() => {
    const filtered = indicators.filter((indicator) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === "" ||
        indicator.name.toLowerCase().includes(searchLower) ||
        indicator.topic.toLowerCase().includes(searchLower) ||
        indicator.subtopic.toLowerCase().includes(searchLower)

      // Apply category filter
      const matchesCategory = selectedCategory === "All Categories" || indicator.topic === selectedCategory

      // Apply data source filter
      const matchesSource = selectedDataSource === "All Data Sources" || indicator.source === selectedDataSource

      // Apply reporting area filter
      const matchesReportingArea =
        selectedReportingArea === "All Reporting Areas" || indicator.reportingLevel === selectedReportingArea

      return matchesSearch && matchesCategory && matchesSource && matchesReportingArea
    })

    // Sort results
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "topic":
        filtered.sort((a, b) => a.topic.localeCompare(b.topic))
        break
      case "updated":
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "relevance":
      default:
        filtered.sort((a, b) => {
          if (a.starred && !b.starred) return -1
          if (!a.starred && b.starred) return 1
          return 0
        })
        break
    }

    return filtered
  }, [searchTerm, indicators, sortBy, selectedCategory, selectedDataSource, selectedReportingArea])

  const handleSelectIndicator = (indicatorId: string) => {
    setSelected((prev) =>
      prev.includes(indicatorId) ? prev.filter((id) => id !== indicatorId) : [...prev, indicatorId],
    )
  }

  const handleToggleStar = (indicatorId: string) => {
    setIndicators((prev) => prev.map((ind) => (ind.id === indicatorId ? { ...ind, starred: !ind.starred } : ind)))
  }

  const handleConfirm = () => {
    onSelectionChange(selected)
    onClose()
  }

  const removeFilterChip = (type: string) => {
    switch (type) {
      case "category":
        setSelectedCategory("All Categories")
        break
      case "dataRange":
        setSelectedDataRange("All Years")
        break
      case "community":
        setSelectedCommunity("All Region")
        break
      case "reportingArea":
        setSelectedReportingArea("All Reporting Areas")
        break
      case "dataSource":
        setSelectedDataSource("All Data Sources")
        break
    }
  }

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      default:
        return <Minus className="h-4 w-4 text-blue-600" />
    }
  }

  const IndicatorCard = ({ indicator }: { indicator: RealIndicator }) => {
    const isSelected = selected.includes(indicator.id)
    const isExpanded = expandedIndicator === indicator.id

    return (
      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors mb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 mt-1 flex-shrink-0"
              onClick={() => handleToggleStar(indicator.id)}
            >
              <Star className={`h-4 w-4 ${indicator.starred ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            </Button>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">{indicator.name}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>{indicator.topic}</span>
                <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
                <span>{indicator.subtopic}</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Database className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.source}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.reportingLevel}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.availability}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleSelectIndicator(indicator.id)}
              className={cn("min-w-[80px]", isSelected && "bg-blue-600 hover:bg-blue-700")}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
              className="h-8 w-8"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-sm mb-2">Topic Classification</h5>
                <div className="space-x-2">
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {indicator.topic}
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {indicator.subtopic}
                  </Badge>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Data Details</h5>
                <div className="flex items-center text-sm">
                  <TrendIcon trend={indicator.trend} />
                  <span className="ml-2 text-gray-600">
                    {indicator.trend === "up" ? "Increasing" : indicator.trend === "down" ? "Decreasing" : "Stable"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="font-medium">Source:</span> {indicator.source}
              </div>
              <div>
                <span className="font-medium">Availability:</span> {indicator.availability}
              </div>
              <div>
                <span className="font-medium">Reporting Level:</span> {indicator.reportingLevel}
              </div>
              <div className="col-span-3">
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(indicator.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[1280px] w-[95vw] max-w-[95vw] h-[100vh] max-h-[100vh] flex flex-col p-0 m-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-semibold">Select Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="px-6 py-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search indicators with SAVI AI"
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-100 px-6 py-4 flex-shrink-0">
            <div className="mb-3">
              <span className="text-xs text-gray-600 mb-2 block">Refine results</span>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    {filterOptionsReal.topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDataRange} onValueChange={setSelectedDataRange}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Years">All Years</SelectItem>
                    <SelectItem value="2020-2024">2020-2024</SelectItem>
                    <SelectItem value="2015-2023">2015-2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Region">All Region</SelectItem>
                    <SelectItem value="Marion County">Marion County</SelectItem>
                    <SelectItem value="Broad Ripple">Broad Ripple</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedReportingArea} onValueChange={setSelectedReportingArea}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Reporting Areas">All Reporting Areas</SelectItem>
                    {filterOptionsReal.reportingLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Data Sources">All Data Sources</SelectItem>
                    {filterOptionsReal.sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilterChips.map((chip) => (
                  <Badge
                    key={`${chip.type}-${chip.value}`}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {chip.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeFilterChip(chip.type)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="results" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0">
                <TabsList>
                  <TabsTrigger value="results" className="flex items-center space-x-2">
                    <span>Results</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {filteredIndicators.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="selected" className="flex items-center space-x-2">
                    <span>Selected Indicators</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selected.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="updated">Updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Group:</span>
                    <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="topics">Topics</SelectItem>
                        <SelectItem value="subtopics">Subtopics</SelectItem>
                        <SelectItem value="sources">Sources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <TabsContent value="results" className="flex-1 overflow-hidden m-0 p-0">
                <ScrollArea className="h-full w-full">
                  <div className="p-6">
                    {filteredIndicators.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">No indicators found matching your criteria</div>
                    ) : (
                      <div className="space-y-0">
                        {filteredIndicators.map((indicator) => (
                          <IndicatorCard key={indicator.id} indicator={indicator} />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="selected" className="flex-1 overflow-hidden m-0 p-0">
                <ScrollArea className="h-full w-full">
                  <div className="p-6">
                    {selected.length > 0 ? (
                      <div className="space-y-0">
                        {indicators
                          .filter((indicator) => selected.includes(indicator.id))
                          .map((indicator) => (
                            <IndicatorCard key={indicator.id} indicator={indicator} />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">No indicators selected</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {selected.length > 0 && `${selected.length} Indicator${selected.length !== 1 ? "s" : ""} selected`}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm Selection ({selected.length})
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

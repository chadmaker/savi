"use client"

import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  Star,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Info,
  ChevronRight,
  X,
  Calendar,
  Database,
  MapPin,
  BarChart3,
} from "lucide-react"
import { realIndicators, filterOptionsReal, type RealIndicator } from "@/data/real-indicators"
import { cn } from "@/lib/utils"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString())

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators: initialSelected,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [indicators, setIndicators] = useState<RealIndicator[]>(realIndicators)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    topics: [],
    subtopics: [],
    sources: [],
    reportingLevels: [],
  })
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all")
  const [groupBy, setGroupBy] = useState<"none" | "topics" | "sources" | "subtopics">("none")
  const [sortBy, setSortBy] = useState<"name" | "topic" | "lastUpdated" | "relevance">("relevance")
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2025])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Real-time search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 2) {
      const suggestions = indicators
        .filter(
          (i) =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.subtopic.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 5)
        .map((i) => i.name)
      setSearchSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm, indicators])

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      const currentCategoryFilters = newFilters[category] || []
      if (currentCategoryFilters.includes(value)) {
        newFilters[category] = currentCategoryFilters.filter((item) => item !== value)
      } else {
        newFilters[category] = [...currentCategoryFilters, value]
      }
      return newFilters
    })
  }

  const removeFilter = (category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({ topics: [], subtopics: [], sources: [], reportingLevels: [] })
    setSearchTerm("")
    setYearRange([2010, 2025])
  }

  const handleCategoryClick = (category: string) => {
    setSearchTerm(category)
    setShowSuggestions(false)
  }

  const filteredIndicators = useMemo(() => {
    const filtered = indicators.filter((indicator) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === "" ||
        indicator.name.toLowerCase().includes(searchLower) ||
        indicator.topic.toLowerCase().includes(searchLower) ||
        indicator.subtopic.toLowerCase().includes(searchLower) ||
        indicator.source.toLowerCase().includes(searchLower)

      const matchesFilters =
        (activeFilters.topics.length === 0 || activeFilters.topics.includes(indicator.topic)) &&
        (activeFilters.subtopics.length === 0 || activeFilters.subtopics.includes(indicator.subtopic)) &&
        (activeFilters.sources.length === 0 || activeFilters.sources.includes(indicator.source)) &&
        (activeFilters.reportingLevels.length === 0 || activeFilters.reportingLevels.includes(indicator.reportingLevel))

      // Year range filter
      const availabilityYears = indicator.availability.split("-").map((y) => Number.parseInt(y.trim()))
      const matchesYearRange = availabilityYears.some((year) => year >= yearRange[0] && year <= yearRange[1])

      return matchesSearch && matchesFilters && matchesYearRange
    })

    // Sort results
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "topic":
        filtered.sort((a, b) => a.topic.localeCompare(b.topic))
        break
      case "lastUpdated":
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "relevance":
        // Sort by starred first, then by search relevance
        filtered.sort((a, b) => {
          if (a.starred && !b.starred) return -1
          if (!a.starred && b.starred) return 1
          if (searchTerm) {
            const aRelevance = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
            const bRelevance = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
            return bRelevance - aRelevance
          }
          return 0
        })
        break
    }

    return filtered
  }, [searchTerm, activeFilters, indicators, yearRange, sortBy])

  const selectedIndicatorsData = useMemo(() => {
    return indicators.filter((indicator) => selected.includes(indicator.id))
  }, [selected, indicators])

  const getFilterCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      topics: {},
      subtopics: {},
      sources: {},
      reportingLevels: {},
    }

    indicators.forEach((indicator) => {
      counts.topics[indicator.topic] = (counts.topics[indicator.topic] || 0) + 1
      counts.subtopics[indicator.subtopic] = (counts.subtopics[indicator.subtopic] || 0) + 1
      counts.sources[indicator.source] = (counts.sources[indicator.source] || 0) + 1
      counts.reportingLevels[indicator.reportingLevel] = (counts.reportingLevels[indicator.reportingLevel] || 0) + 1
    })
    return counts
  }, [indicators])

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0)
  }, [activeFilters])

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

  const TrendIcon = ({ trend, className }: { trend: "up" | "down" | "neutral"; className?: string }) => {
    const getTooltipText = (trend: "up" | "down" | "neutral") => {
      switch (trend) {
        case "up":
          return "Trending upward compared to state average"
        case "down":
          return "Trending downward compared to state average"
        default:
          return "Stable trend compared to state average"
      }
    }

    switch (trend) {
      case "up":
        return (
          <div className={cn("flex items-center text-green-600", className)} title={getTooltipText(trend)}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Increasing</span>
          </div>
        )
      case "down":
        return (
          <div className={cn("flex items-center text-red-600", className)} title={getTooltipText(trend)}>
            <TrendingDown className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Decreasing</span>
          </div>
        )
      default:
        return (
          <div className={cn("flex items-center text-gray-500", className)} title={getTooltipText(trend)}>
            <Minus className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Stable</span>
          </div>
        )
    }
  }

  const IndicatorCard = ({
    indicator,
    onSelect,
    onStarToggle,
    onCategoryClick,
    isSelected,
    selectedCommunity,
  }: {
    indicator: RealIndicator
    onSelect: (id: string) => void
    onStarToggle: (id: string) => void
    onCategoryClick: (category: string) => void
    isSelected: boolean
    selectedCommunity: string
  }) => {
    const [isMetaVisible, setIsMetaVisible] = useState(false)

    return (
      <div
        className={cn(
          "border rounded-lg p-4 flex flex-col space-y-4 hover:bg-gray-50 transition-all duration-200",
          isSelected && "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200",
        )}
      >
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start space-x-4 flex-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => onStarToggle(indicator.id)}>
              <Star
                className={`h-5 w-5 transition-colors ${indicator.starred ? "text-yellow-400 fill-current" : "text-gray-400 hover:text-yellow-300"}`}
              />
            </Button>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 leading-tight mb-1">{indicator.name}</h4>
              <div className="text-sm text-gray-500 flex items-center flex-wrap gap-1">
                <button
                  onClick={() => onCategoryClick(indicator.topic)}
                  className="hover:underline text-gray-600 hover:text-gray-800 font-medium"
                >
                  {indicator.topic}
                </button>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <button
                  onClick={() => onCategoryClick(indicator.subtopic)}
                  className="hover:underline text-gray-500 hover:text-gray-700"
                >
                  {indicator.subtopic}
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Database className="h-3 w-3 mr-1" />
                  {indicator.source}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {indicator.reportingLevel}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {indicator.availability}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(indicator.id)}
                className={cn("w-28 transition-all", isSelected && "bg-blue-600 hover:bg-blue-700 shadow-md")}
              >
                {isSelected ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {isSelected ? "Selected" : "Select"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMetaVisible(!isMetaVisible)}
                className={cn(isMetaVisible && "bg-blue-100 text-blue-600")}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-5">{selectedCommunity !== "all" && <TrendIcon trend={indicator.trend} />}</div>
          </div>
        </div>
        {isMetaVisible && (
          <div className="pl-12 pr-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 rounded-b-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-medium text-sm mb-2 text-gray-700">Topic Classification</h5>
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    {indicator.topic}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-1">
                    {indicator.subtopic}
                  </Badge>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2 text-gray-700">Data Details</h5>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Trend: <TrendIcon trend={indicator.trend} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-700">Source: </span>
                  <span>{indicator.source}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Availability: </span>
                  <span>{indicator.availability}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Reporting Level: </span>
                  <span>{indicator.reportingLevel}</span>
                </div>
                <div className="col-span-3">
                  <span className="font-medium text-gray-700">Last Updated: </span>
                  <span>{new Date(indicator.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const groupedIndicators = useMemo(() => {
    if (groupBy === "none") {
      return { "All Indicators": filteredIndicators }
    } else if (groupBy === "topics") {
      const grouped: Record<string, RealIndicator[]> = {}
      filteredIndicators.forEach((indicator) => {
        const group = indicator.topic
        if (!grouped[group]) grouped[group] = []
        grouped[group].push(indicator)
      })
      return grouped
    } else if (groupBy === "sources") {
      const grouped: Record<string, RealIndicator[]> = {}
      filteredIndicators.forEach((indicator) => {
        const group = indicator.source
        if (!grouped[group]) grouped[group] = []
        grouped[group].push(indicator)
      })
      return grouped
    } else if (groupBy === "subtopics") {
      const grouped: Record<string, RealIndicator[]> = {}
      filteredIndicators.forEach((indicator) => {
        const group = indicator.subtopic
        if (!grouped[group]) grouped[group] = []
        grouped[group].push(indicator)
      })
      return grouped
    }
    return { "All Indicators": filteredIndicators }
  }, [filteredIndicators, groupBy])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Enhanced Filters Sidebar */}
          <aside className="w-1/4 max-w-xs border-r overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </h3>
              <Button variant="ghost" size="sm" onClick={clearAllFilters} disabled={activeFilterCount === 0}>
                Clear all
              </Button>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["reportingLevels", "advanced", "community", "topics", "subtopics", "sources"]}
            >
              <AccordionItem value="reportingLevels">
                <AccordionTrigger>Reporting Levels ({filterOptionsReal.reportingLevels.length})</AccordionTrigger>
                <AccordionContent>
                  {filterOptionsReal.reportingLevels.map((item) => (
                    <div key={item} className="flex items-center justify-between space-x-2 p-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${item}`}
                          checked={activeFilters.reportingLevels.includes(item)}
                          onCheckedChange={() => handleFilterChange("reportingLevels", item)}
                        />
                        <label htmlFor={`level-${item}`} className="text-sm font-medium leading-none">
                          {item}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{getFilterCounts.reportingLevels[item] || 0}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advanced">
                <AccordionTrigger>Advanced Filters</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Availability Range</label>
                    <div className="px-2">
                      <Slider
                        value={yearRange}
                        onValueChange={(value) => setYearRange(value as [number, number])}
                        min={2000}
                        max={2025}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="community">
                <AccordionTrigger>Target Community</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All areas</SelectItem>
                      <SelectItem value="marion">Marion County</SelectItem>
                      <SelectItem value="broad-ripple">Broad Ripple</SelectItem>
                      <SelectItem value="fountain-square">Fountain Square</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="topics">
                <AccordionTrigger>Topics ({filterOptionsReal.topics.length})</AccordionTrigger>
                <AccordionContent className="max-h-48 overflow-y-auto">
                  {filterOptionsReal.topics.map((item) => (
                    <div key={item} className="flex items-center justify-between space-x-2 p-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`topic-${item}`}
                          checked={activeFilters.topics.includes(item)}
                          onCheckedChange={() => handleFilterChange("topics", item)}
                        />
                        <label htmlFor={`topic-${item}`} className="text-sm font-medium leading-none">
                          {item}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{getFilterCounts.topics[item] || 0}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="subtopics">
                <AccordionTrigger>Subtopics ({filterOptionsReal.subtopics.length})</AccordionTrigger>
                <AccordionContent className="max-h-48 overflow-y-auto">
                  {filterOptionsReal.subtopics.map((item) => (
                    <div key={item} className="flex items-center justify-between space-x-2 p-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`subtopic-${item}`}
                          checked={activeFilters.subtopics.includes(item)}
                          onCheckedChange={() => handleFilterChange("subtopics", item)}
                        />
                        <label htmlFor={`subtopic-${item}`} className="text-sm font-medium leading-none">
                          {item}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{getFilterCounts.subtopics[item] || 0}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sources">
                <AccordionTrigger>Data Sources ({filterOptionsReal.sources.length})</AccordionTrigger>
                <AccordionContent>
                  {filterOptionsReal.sources.map((item) => (
                    <div key={item} className="flex items-center justify-between space-x-2 p-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${item}`}
                          checked={activeFilters.sources.includes(item)}
                          onCheckedChange={() => handleFilterChange("sources", item)}
                        />
                        <label htmlFor={`source-${item}`} className="text-sm font-medium leading-none">
                          {item}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{getFilterCounts.sources[item] || 0}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([category, values]) =>
                    values.map((value) => (
                      <Badge key={`${category}-${value}`} variant="secondary" className="flex items-center gap-1">
                        {value}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFilter(category, value)}
                        />
                      </Badge>
                    )),
                  )}
                </div>
              </div>
            )}

            <Tabs defaultValue="results" className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between p-4 border-b">
                <TabsList className="justify-start">
                  <TabsTrigger value="results" className="flex items-center space-x-2">
                    <span>Results</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {filteredIndicators.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="selected" className="flex items-center space-x-2">
                    <span>Selected Indicators</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selected.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="lastUpdated">Updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Group:</span>
                    <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                      <SelectTrigger className="w-32">
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

              <TabsContent value="results" className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search indicators by name, topic, or source..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => {
                            setSearchTerm(suggestion)
                            setShowSuggestions(false)
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredIndicators.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No indicators found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search terms or filters to find more indicators.
                    </p>
                    {activeFilterCount > 0 && (
                      <Button variant="outline" onClick={clearAllFilters}>
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedIndicators).map(([groupName, groupIndicators]) => (
                      <div key={groupName}>
                        {groupBy !== "none" && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center">
                            {groupName}
                            <Badge variant="outline" className="ml-2">
                              {groupIndicators.length}
                            </Badge>
                          </h3>
                        )}
                        <div className="space-y-4">
                          {groupIndicators.map((indicator) => (
                            <IndicatorCard
                              key={indicator.id}
                              indicator={indicator}
                              onSelect={handleSelectIndicator}
                              onStarToggle={handleToggleStar}
                              onCategoryClick={handleCategoryClick}
                              isSelected={selected.includes(indicator.id)}
                              selectedCommunity={selectedCommunity}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="selected" className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedIndicatorsData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Selected Indicators ({selectedIndicatorsData.length})
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected([])}
                        disabled={selected.length === 0}
                      >
                        Clear All
                      </Button>
                    </div>
                    {selectedIndicatorsData.map((indicator) => (
                      <IndicatorCard
                        key={indicator.id}
                        indicator={indicator}
                        onSelect={handleSelectIndicator}
                        onStarToggle={handleToggleStar}
                        onCategoryClick={handleCategoryClick}
                        isSelected={selected.includes(indicator.id)}
                        selectedCommunity={selectedCommunity}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Plus className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No indicators selected</h3>
                    <p className="text-gray-600">
                      Select indicators from the Results tab to review them here before confirming.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <DialogFooter className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {selected.length > 0 && (
                <span>
                  {selected.length} indicator{selected.length !== 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className={cn(
                  "transition-all",
                  selected.length > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed",
                )}
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

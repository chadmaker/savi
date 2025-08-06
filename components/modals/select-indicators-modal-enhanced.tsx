"use client"

import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Star, X, Calendar, Database, MapPin, TrendingUp, TrendingDown, Minus, Info, ChevronRight, ChevronDown, ChevronUp, Filter, Eye, Plus, BarChart3, Sparkles, Clock, Globe, FileText, ExternalLink } from 'lucide-react'
import { realIndicators, filterOptionsReal, type RealIndicator } from "@/data/real-indicators"
import { cn } from "@/lib/utils"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

// AI Search Suggestions
const AI_SEARCH_SUGGESTIONS = [
  "Median household income by census tract in Marion County",
  "Education attainment rates since 2020",
  "Population density by census tract",
  "Housing cost burden normalized per capita",
  "Crime rates by neighborhood",
  "Healthcare access indicators",
  "Employment rates by demographic",
  "Environmental quality measures",
]

const RECENT_SEARCHES = [
  "Median Income by Census Tract in Indiana, 2023",
  "Education attainment rates for Marion County since 2020",
  "Population density by census tract",
]

// Hierarchical Categories
const HIERARCHICAL_CATEGORIES = {
  "Economic Mobility": {
    "Income": {
      "Household Income": ["Median", "Mean", "Distribution"],
      "Individual Income": ["Per Capita", "By Age Group", "By Gender"],
    },
    "Employment": {
      "Employment Rate": ["Overall", "By Industry", "By Education"],
      "Unemployment": ["Rate", "Duration", "Benefits"],
    },
    "Business Development": {
      "Small Business": ["Growth Rate", "Ownership", "Revenue"],
      "Entrepreneurship": ["Startup Rate", "Success Rate", "Investment"],
    },
  },
  "Education": {
    "K-12 Education": {
      "Achievement": ["Test Scores", "Graduation Rate", "College Readiness"],
      "Resources": ["Funding", "Teacher Quality", "Infrastructure"],
    },
    "Higher Education": {
      "Enrollment": ["College Enrollment", "Completion Rate", "Debt"],
      "Access": ["Affordability", "Geographic Access", "Support Services"],
    },
    "Adult Education": {
      "Literacy": ["Basic Literacy", "Digital Literacy", "Financial Literacy"],
      "Training": ["Job Training", "Certification Programs", "Skills Development"],
    },
  },
  "Health": {
    "Physical Health": {
      "Chronic Conditions": ["Diabetes", "Heart Disease", "Obesity"],
      "Preventive Care": ["Screenings", "Vaccinations", "Check-ups"],
    },
    "Mental Health": {
      "Access": ["Provider Ratio", "Wait Times", "Insurance Coverage"],
      "Outcomes": ["Depression Rates", "Suicide Rates", "Treatment Success"],
    },
    "Child Health": {
      "Development": ["Birth Weight", "Immunizations", "Nutrition"],
      "Safety": ["Injury Rates", "Environmental Hazards", "Abuse Prevention"],
    },
  },
}

const NORMALIZATION_OPTIONS = [
  { value: "raw", label: "Raw Numbers" },
  { value: "per_capita", label: "Per Capita" },
  { value: "percentage", label: "Percentages" },
  { value: "z_score", label: "Z-Scores" },
  { value: "rate_per_1000", label: "Rate per 1,000" },
  { value: "rate_per_100k", label: "Rate per 100,000" },
]

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators: initialSelected,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [indicators, setIndicators] = useState<RealIndicator[]>(realIndicators)
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [sortBy, setSortBy] = useState<"ai_relevance" | "name" | "updated" | "geographic">("ai_relevance")
  const [groupBy, setGroupBy] = useState<"none" | "category" | "source" | "reporting_area">("none")
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({})
  const [expandAll, setExpandAll] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedReportingArea, setSelectedReportingArea] = useState("all")
  const [yearRange, setYearRange] = useState([2000, 2024])
  const [selectedNormalization, setSelectedNormalization] = useState("raw")
  const [starredOnly, setStarredOnly] = useState(false)

  // AI suggestions based on search term
  const aiSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []
    
    const suggestions = AI_SEARCH_SUGGESTIONS.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return suggestions.slice(0, 5)
  }, [searchTerm])

  const filteredIndicators = useMemo(() => {
    let filtered = indicators.filter((indicator) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === "" ||
        indicator.name.toLowerCase().includes(searchLower) ||
        indicator.topic.toLowerCase().includes(searchLower) ||
        indicator.subtopic.toLowerCase().includes(searchLower)

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(indicator.topic)
      const matchesReportingArea = selectedReportingArea === "all" || indicator.reportingLevel === selectedReportingArea
      const matchesStarred = !starredOnly || indicator.starred

      // Year range filter
      let matchesYear = true
      if (indicator.availability) {
        const years = indicator.availability.split('-').map(y => parseInt(y.trim()))
        if (years.length >= 2) {
          matchesYear = years[0] <= yearRange[1] && years[1] >= yearRange[0]
        }
      }

      return matchesSearch && matchesCategory && matchesReportingArea && matchesStarred && matchesYear
    })

    // Sort results
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "updated":
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "geographic":
        filtered.sort((a, b) => a.reportingLevel.localeCompare(b.reportingLevel))
        break
      case "ai_relevance":
      default:
        // AI relevance: starred first, then by search relevance
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
  }, [searchTerm, indicators, sortBy, selectedCategories, selectedReportingArea, starredOnly, yearRange])

  // Group indicators
  const groupedIndicators = useMemo(() => {
    if (groupBy === "none") {
      return { "All Indicators": filteredIndicators }
    }

    const groups: Record<string, RealIndicator[]> = {}
    
    filteredIndicators.forEach(indicator => {
      let groupKey = ""
      switch (groupBy) {
        case "category":
          groupKey = indicator.topic
          break
        case "source":
          groupKey = indicator.source
          break
        case "reporting_area":
          groupKey = indicator.reportingLevel
          break
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(indicator)
    })

    return groups
  }, [filteredIndicators, groupBy])

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

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedReportingArea("all")
    setYearRange([2000, 2024])
    setSelectedNormalization("raw")
    setStarredOnly(false)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleSelectAll = () => {
    setSelected(filteredIndicators.map(ind => ind.id))
  }

  const handleClearAll = () => {
    setSelected([])
  }

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const IndicatorCard = ({ indicator }: { indicator: RealIndicator }) => {
    const isSelected = selected.includes(indicator.id)
    const isExpanded = expandedIndicator === indicator.id

    return (
      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors mb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleSelectIndicator(indicator.id)}
              className="mt-1"
            />
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
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {indicator.topic}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {indicator.source}
                </Badge>
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
                <div className="flex items-center">
                  <TrendIcon trend={indicator.trend} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
              className="text-xs"
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Description</h5>
                <p className="text-sm text-gray-600">
                  Comprehensive analysis of {indicator.name.toLowerCase()} across different geographic areas and time periods.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Data Source & Documentation</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-2" />
                      {indicator.source}
                    </div>
                    <div className="flex items-center">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      <span className="text-blue-600 cursor-pointer hover:underline">View Source Documentation</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Geographic Coverage</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-2" />
                      {indicator.reportingLevel}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {indicator.availability}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Available Normalizations</h5>
                <div className="flex flex-wrap gap-2">
                  {NORMALIZATION_OPTIONS.slice(0, 4).map(option => (
                    <Badge key={option.value} variant="secondary" className="text-xs">
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Project
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  View Source Data
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Preview Visualization
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[1400px] w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 m-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Clear All Filters */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </Button>
              </div>

              {/* Categories - Hierarchical */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(HIERARCHICAL_CATEGORIES).map(([category, subcategories]) => (
                    <div key={category}>
                      <Collapsible
                        open={expandedCategories[category]}
                        onOpenChange={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto font-normal text-sm justify-start">
                              {expandedCategories[category] ? (
                                <ChevronDown className="h-3 w-3 mr-1" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-1" />
                              )}
                              {category}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="ml-6 mt-1 space-y-1">
                          {Object.entries(subcategories).map(([subcat, items]) => (
                            <div key={subcat} className="text-xs text-gray-600 pl-4">
                              • {subcat}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Reporting Area */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Reporting Area</h4>
                <Select value={selectedReportingArea} onValueChange={setSelectedReportingArea}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reporting Areas</SelectItem>
                    {filterOptionsReal.reportingLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Data Availability Slider */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Data Availability (Years)</h4>
                <div className="space-y-4">
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    min={2000}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Normalization Methods */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Normalization Methods</h4>
                <Select value={selectedNormalization} onValueChange={setSelectedNormalization}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NORMALIZATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Starred Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="starred-only"
                  checked={starredOnly}
                  onCheckedChange={setStarredOnly}
                />
                <label htmlFor="starred-only" className="text-sm text-gray-700">
                  Show starred indicators only
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* AI-Enhanced Search */}
            <div className="p-6 pb-4 border-b bg-white">
              <div className="relative">
                <div className="flex items-center">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <Input
                    placeholder="Search indicators with AI (e.g., Median Income by Census Tract in Indiana, 2023)"
                    className="pl-10 pr-10 h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => {
                        setSearchTerm("")
                        setShowSuggestions(false)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* AI Suggestions Dropdown */}
                {showSuggestions && (aiSuggestions.length > 0 || RECENT_SEARCHES.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {aiSuggestions.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-500 mb-2">AI Suggestions</div>
                        {aiSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm rounded"
                            onClick={() => {
                              setSearchTerm(suggestion)
                              setShowSuggestions(false)
                            }}
                          >
                            <Sparkles className="h-3 w-3 inline mr-2 text-blue-500" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {RECENT_SEARCHES.length > 0 && (
                      <div className="p-3 border-t">
                        <div className="text-xs font-medium text-gray-500 mb-2">Recent Searches</div>
                        {RECENT_SEARCHES.map((search, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm rounded"
                            onClick={() => {
                              setSearchTerm(search)
                              setShowSuggestions(false)
                            }}
                          >
                            <Clock className="h-3 w-3 inline mr-2 text-gray-400" />
                            {search}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  <strong>{filteredIndicators.length}</strong> indicators found
                </span>
                <span className="text-sm text-gray-600">
                  <strong>{selected.length}</strong> selected
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai_relevance">AI Relevance</SelectItem>
                      <SelectItem value="name">A–Z</SelectItem>
                      <SelectItem value="updated">Most Recently Updated</SelectItem>
                      <SelectItem value="geographic">Geographic Extent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Group by:</span>
                  <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="reporting_area">Reporting Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {groupBy !== "none" && (
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandAll(true)}
                      className="text-xs h-8"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandAll(false)}
                      className="text-xs h-8"
                    >
                      Collapse All
                    </Button>
                  </div>
                )}

                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs h-8">
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearAll} className="text-xs h-8">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  {filteredIndicators.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No indicators found</h3>
                      <p>Try adjusting your search terms or filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedIndicators).map(([groupName, groupIndicators]) => (
                        <div key={groupName}>
                          {groupBy !== "none" && (
                            <div className="flex items-center space-x-2 mb-3">
                              <h3 className="font-medium text-gray-900">{groupName}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {groupIndicators.length}
                              </Badge>
                            </div>
                          )}
                          <div className="space-y-0">
                            {groupIndicators.map((indicator) => (
                              <IndicatorCard key={indicator.id} indicator={indicator} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {selected.length > 0 && `${selected.length} indicator${selected.length !== 1 ? "s" : ""} selected`}
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
                Add Selected Indicators ({selected.length})
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

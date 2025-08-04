"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { realIndicators } from "@/data/real-indicators"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

interface Indicator {
  id: string
  name: string
  description: string
  categories: string[]
  extent: string
  reportingArea: string
  lastUpdated: string
  availability?: string
  source: string
}

const CATEGORY_OPTIONS = [
  "Demographics",
  "Economics",
  "Education",
  "Health",
  "Housing",
  "Transportation",
  "Environment",
  "Safety",
  "Arts & Culture",
  "Civic Engagement",
  "Infrastructure",
  "Employment",
  "Social Services",
]

const REGION_OPTIONS = [
  { value: "all", label: "All Regions" },
  { value: "marion-county", label: "Marion County" },
  { value: "indianapolis", label: "Indianapolis" },
  { value: "metro-area", label: "Indianapolis Metro Area" },
  { value: "indiana", label: "Indiana" },
  { value: "midwest", label: "Midwest Region" },
  { value: "national", label: "National" },
]

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [yearRange, setYearRange] = useState([2010, 2024])
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [filteredIndicators, setFilteredIndicators] = useState<Indicator[]>([])

  // Convert real indicators data to our format
  const indicators: Indicator[] = realIndicators.map((indicator, index) => ({
    id: indicator.id || `indicator-${index}`,
    name: indicator.name,
    description: indicator.description || `Analysis of ${indicator.name.toLowerCase()}`,
    categories: indicator.categories || ["Demographics"],
    extent: indicator.extent || "County",
    reportingArea: indicator.reportingArea || "Census Tract",
    lastUpdated: indicator.lastUpdated || "2023-01-01",
    availability: indicator.availability,
    source: indicator.source || "American Community Survey",
  }))

  useEffect(() => {
    let filtered = indicators

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (indicator) =>
          indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((indicator) => indicator.categories.some((cat) => selectedCategories.includes(cat)))
    }

    // Region filter (simplified - in real app would filter by actual geographic coverage)
    if (selectedRegion !== "all") {
      // For demo purposes, we'll keep all indicators but in real app would filter by region
      filtered = filtered
    }

    // Year range filter - safely handle availability field
    let matchesYearRange = true
    filtered = filtered.filter((indicator) => {
      if (indicator.availability && typeof indicator.availability === "string") {
        const availabilityYears = indicator.availability
          .split("-")
          .map((y) => {
            const year = Number.parseInt(y.trim())
            return isNaN(year) ? null : year
          })
          .filter((year) => year !== null) as number[]

        if (availabilityYears.length > 0) {
          matchesYearRange = availabilityYears.some((year) => year >= yearRange[0] && year <= yearRange[1])
        }
      }
      return matchesYearRange
    })

    setFilteredIndicators(filtered)
  }, [searchTerm, selectedCategories, selectedRegion, yearRange])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleIndicatorToggle = (indicatorId: string) => {
    const newSelection = selectedIndicators.includes(indicatorId)
      ? selectedIndicators.filter((id) => id !== indicatorId)
      : [...selectedIndicators, indicatorId]
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    const allIds = filteredIndicators.map((indicator) => indicator.id)
    onSelectionChange(allIds)
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const clearFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "search":
        setSearchTerm("")
        break
      case "category":
        if (value) {
          setSelectedCategories((prev) => prev.filter((c) => c !== value))
        } else {
          setSelectedCategories([])
        }
        break
      case "region":
        setSelectedRegion("all")
        break
      case "year":
        setYearRange([2010, 2024])
        break
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategories.length > 0) count += selectedCategories.length
    if (selectedRegion !== "all") count++
    if (yearRange[0] !== 2010 || yearRange[1] !== 2024) count++
    return count
  }

  const selectedRegionLabel = REGION_OPTIONS.find((r) => r.value === selectedRegion)?.label || "All Regions"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search indicators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => clearFilter("search")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">Active Filters ({getActiveFiltersCount()})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategories([])
                      setSelectedRegion("all")
                      setYearRange([2010, 2024])
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchTerm}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("search")} />
                    </Badge>
                  )}
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("category", category)} />
                    </Badge>
                  ))}
                  {selectedRegion !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedRegionLabel}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("region")} />
                    </Badge>
                  )}
                  {(yearRange[0] !== 2010 || yearRange[1] !== 2024) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {yearRange[0]}-{yearRange[1]}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("year")} />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {CATEGORY_OPTIONS.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* All Years */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">All Years</h3>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    min={2000}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* All Region */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">All Region</h3>
              <Collapsible open={isRegionOpen} onOpenChange={setIsRegionOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {selectedRegionLabel}
                    {isRegionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 border rounded-md p-2 bg-white">
                    {REGION_OPTIONS.map((region) => (
                      <div key={region.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={region.value}
                          checked={selectedRegion === region.value}
                          onCheckedChange={() => setSelectedRegion(region.value)}
                        />
                        <label htmlFor={region.value} className="text-sm text-gray-700 cursor-pointer">
                          {region.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{filteredIndicators.length} indicators found</span>
                <span className="text-sm text-gray-600">{selectedIndicators.length} selected</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {filteredIndicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedIndicators.includes(indicator.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleIndicatorToggle(indicator.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedIndicators.includes(indicator.id)}
                        onChange={() => handleIndicatorToggle(indicator.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{indicator.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{indicator.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {indicator.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Extent: {indicator.extent}</span>
                          <span>Updated: {new Date(indicator.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          <span className="text-sm text-gray-600">{selectedIndicators.length} indicators selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Add Selected Indicators
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

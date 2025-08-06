"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, X, Filter, Calendar, MapPin, ChevronDown, FileText, Star } from 'lucide-react'
import { realIndicators } from "@/data/real-indicators"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

const categories = [
  "Demographics",
  "Economics",
  "Education",
  "Health",
  "Housing",
  "Transportation",
  "Environment",
  "Public Safety",
  "Arts & Culture",
  "Civic Engagement",
  "Infrastructure",
  "Social Services",
  "Technology",
]

const regions = [
  { value: "state", label: "State" },
  { value: "county", label: "County" },
  { value: "school-corp", label: "School Corp" },
  { value: "block-group", label: "Block Group" },
  { value: "census-tract", label: "Census Tract" },
]

// Mock data sources for demonstration
const getDataSource = (indicatorId: string) => {
  const sources = [
    "U.S. Census",
    "American Community Survey",
    "Department of Education",
    "Bureau of Labor Statistics",
    "CDC",
    "FBI Crime Data",
    "EPA",
    "HUD",
  ]
  return sources[indicatorId.length % sources.length]
}

const getReportingLevel = (indicatorId: string) => {
  const levels = ["Census Tract", "Block Group", "School District", "County", "State"]
  return levels[indicatorId.length % levels.length]
}

const getSubcategory = (category: string) => {
  const subcategories: { [key: string]: string[] } = {
    "Demographics": ["Population", "Age Distribution", "Race and Ethnicity"],
    "Economics": ["Income", "Employment", "Economic Status"],
    "Education": ["Educational Attainment", "School Performance", "Access"],
    "Health": ["Health Outcomes", "Access to Care", "Behavioral Health"],
    "Housing": ["Housing Quality", "Affordability", "Availability"],
    "Transportation": ["Access", "Infrastructure", "Safety"],
    "Environment": ["Air Quality", "Water Quality", "Green Space"],
    "Public Safety": ["Crime Rates", "Emergency Services", "Community Safety"],
    "Arts & Culture": ["Cultural Assets", "Participation", "Access"],
    "Civic Engagement": ["Voting", "Community Participation", "Government"],
    "Infrastructure": ["Utilities", "Communications", "Transportation"],
    "Social Services": ["Support Services", "Access", "Quality"],
    "Technology": ["Digital Access", "Infrastructure", "Adoption"],
  }
  const subs = subcategories[category] || ["General"]
  return subs[Math.floor(Math.random() * subs.length)]
}

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [yearRange, setYearRange] = useState([2010, 2024])
  const [selectedRegion, setSelectedRegion] = useState("state")
  const [tempSelectedIndicators, setTempSelectedIndicators] = useState<string[]>(selectedIndicators)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const filteredIndicators = useMemo(() => {
    return realIndicators.filter((indicator) => {
      // Search term filter
      const matchesSearch =
        indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (indicator.category && indicator.category.toLowerCase().includes(searchTerm.toLowerCase()))

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 || (indicator.category && selectedCategories.includes(indicator.category))

      // Year range filter - safely handle availability field
      let matchesYearRange = true
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

      // Region filter (simplified for demo)
      const matchesRegion = true // All indicators available for all regions in demo

      return matchesSearch && matchesCategory && matchesYearRange && matchesRegion
    })
  }, [searchTerm, selectedCategories, yearRange, selectedRegion])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleIndicatorToggle = (indicatorId: string) => {
    setTempSelectedIndicators((prev) => {
      const isSelected = prev.includes(indicatorId)
      if (isSelected) {
        return prev.filter((id) => id !== indicatorId)
      } else {
        return [...prev, indicatorId]
      }
    })
  }

  const handleSelectAll = () => {
    setTempSelectedIndicators(filteredIndicators.map((indicator) => indicator.id))
  }

  const handleClearAll = () => {
    setTempSelectedIndicators([])
  }

  const handleApply = () => {
    onSelectionChange(tempSelectedIndicators)
    onClose()
  }

  const handleCancel = () => {
    setTempSelectedIndicators(selectedIndicators)
    onClose()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setYearRange([2010, 2024])
    setSelectedRegion("state")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Indicators</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search with AI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Region Filter - Updated options */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Reporting Level
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reporting level" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories Filter - Multi-select dropdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Categories</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories([])}
                  className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </Button>
              </div>
              <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoriesOpen}
                    className="w-full justify-between"
                  >
                    {selectedCategories.length === 0
                      ? "Select categories..."
                      : `${selectedCategories.length} selected`}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-48">
                        {categories.map((category) => (
                          <CommandItem
                            key={category}
                            onSelect={() => handleCategoryToggle(category)}
                          >
                            <Checkbox
                              checked={selectedCategories.includes(category)}
                              className="mr-2"
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                      <button onClick={() => handleCategoryToggle(category)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Year Range Filter - Dual handle slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data Years
                </label>
                <span className="text-xs text-gray-500">
                  {yearRange[0]} - {yearRange[1]}
                </span>
              </div>
              <div className="px-2">
                <Slider
                  value={yearRange}
                  onValueChange={setYearRange}
                  min={2000}
                  max={2024}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2000</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full bg-transparent"
              disabled={
                !searchTerm &&
                selectedCategories.length === 0 &&
                yearRange[0] === 2010 &&
                yearRange[1] === 2024 &&
                selectedRegion === "state"
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>

          <Separator orientation="vertical" className="h-full" />

          {/* Results */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Results Header */}
            <div className="flex-shrink-0 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">
                  {filteredIndicators.length} indicator{filteredIndicators.length !== 1 ? "s" : ""} found
                </h3>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                        <button onClick={() => handleCategoryToggle(category)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{tempSelectedIndicators.length} selected</span>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Results List */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {filteredIndicators.map((indicator) => {
                  const isSelected = tempSelectedIndicators.includes(indicator.id)
                  const dataSource = getDataSource(indicator.id)
                  const reportingLevel = getReportingLevel(indicator.id)
                  const subcategory = indicator.category ? getSubcategory(indicator.category) : ""
                  
                  return (
                    <div
                      key={indicator.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleIndicatorToggle(indicator.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleIndicatorToggle(indicator.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          {/* Header with star and title */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 leading-tight">{indicator.name}</h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm" className="text-xs">
                                View
                              </Button>
                              <Button variant="ghost" size="sm" className="p-1">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Category and subcategory */}
                          {indicator.category && (
                            <div className="text-sm text-gray-600 mb-3">
                              {indicator.category} › {subcategory}
                            </div>
                          )}

                          {/* Metadata tags */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {/* Data Source */}
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{dataSource}</span>
                            </div>
                            
                            {/* Reporting Level */}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{reportingLevel}</span>
                            </div>
                            
                            {/* Data Availability */}
                            {indicator.availability && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{indicator.availability}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {tempSelectedIndicators.length} indicator{tempSelectedIndicators.length !== 1 ? "s" : ""} selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={tempSelectedIndicators.length === 0}>
              Apply Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

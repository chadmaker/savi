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
import { Search, X, Filter, Calendar, MapPin } from "lucide-react"
import { realIndicators } from "@/data/real-indicators"

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
  { value: "all", label: "All Regions" },
  { value: "marion-county", label: "Marion County" },
  { value: "indianapolis", label: "Indianapolis" },
  {
    value: "neighborhoods",
    label: "Neighborhoods",
    children: [
      { value: "broad-ripple", label: "Broad Ripple" },
      { value: "fountain-square", label: "Fountain Square" },
      { value: "mass-ave", label: "Mass Ave" },
      { value: "downtown", label: "Downtown" },
    ],
  },
  {
    value: "townships",
    label: "Townships",
    children: [
      { value: "center-township", label: "Center Township" },
      { value: "lawrence-township", label: "Lawrence Township" },
      { value: "pike-township", label: "Pike Township" },
      { value: "washington-township", label: "Washington Township" },
    ],
  },
  {
    value: "school-districts",
    label: "School Districts",
    children: [
      { value: "ips", label: "Indianapolis Public Schools" },
      { value: "lawrence-township-schools", label: "Lawrence Township Schools" },
      { value: "pike-township-schools", label: "Pike Township Schools" },
    ],
  },
]

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [yearRange, setYearRange] = useState([2010, 2024])
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [tempSelectedIndicators, setTempSelectedIndicators] = useState<string[]>(selectedIndicators)

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
      const matchesRegion = selectedRegion === "all" || true // All indicators available for all regions in demo

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
    setSelectedRegion("all")
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
                  placeholder="Search by name, description, or category..."
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

            {/* Categories Filter */}
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
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Year Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  All Years
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

            {/* Region Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                All Region
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <div key={region.value}>
                      <SelectItem value={region.value}>{region.label}</SelectItem>
                      {region.children && (
                        <div className="ml-4">
                          {region.children.map((child) => (
                            <SelectItem key={child.value} value={child.value} className="text-sm">
                              {child.label}
                            </SelectItem>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>
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
                selectedRegion === "all"
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
              <div className="space-y-2">
                {filteredIndicators.map((indicator) => {
                  const isSelected = tempSelectedIndicators.includes(indicator.id)
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
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-4">
                              {indicator.category && (
                                <Badge variant="outline" className="text-xs">
                                  {indicator.category}
                                </Badge>
                              )}
                              {indicator.availability && (
                                <span className="text-xs text-gray-500">{indicator.availability}</span>
                              )}
                            </div>
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

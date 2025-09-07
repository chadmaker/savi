"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X, Calendar, MapPin, Building2 } from "lucide-react"
import { realIndicators } from "@/data/real-indicators"

interface SelectIndicatorsModalEnhancedProps {
  isOpen: boolean
  onClose: () => void
  onSelectIndicators: (indicators: any[]) => void
  selectedIndicators?: any[]
}

export function SelectIndicatorsModalEnhanced({
  isOpen,
  onClose,
  onSelectIndicators,
  selectedIndicators = [],
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedReportingLevels, setSelectedReportingLevels] = useState<string[]>([])
  const [yearRange, setYearRange] = useState<number[]>([2000, 2024])
  const [tempSelectedIndicators, setTempSelectedIndicators] = useState<string[]>(
    selectedIndicators.map((ind) => ind.id),
  )

  // Get unique values for filters
  const uniqueTopics = useMemo(() => {
    const topics = new Set<string>()
    realIndicators.forEach((indicator) => {
      if (indicator.topic) topics.add(indicator.topic)
      if (indicator.subtopic) topics.add(indicator.subtopic)
    })
    return Array.from(topics).sort()
  }, [])

  const uniqueSources = useMemo(() => {
    const sources = new Set<string>()
    realIndicators.forEach((indicator) => {
      if (indicator.source) sources.add(indicator.source)
    })
    return Array.from(sources).sort()
  }, [])

  const uniqueReportingLevels = useMemo(() => {
    const levels = new Set<string>()
    realIndicators.forEach((indicator) => {
      if (indicator.reportingLevel) levels.add(indicator.reportingLevel)
    })
    return Array.from(levels).sort()
  }, [])

  // Enhanced search function with relevance scoring
  const filteredIndicators = useMemo(() => {
    let filtered = realIndicators

    // Apply search filter with enhanced matching
    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/)

      filtered = filtered.filter((indicator) => {
        const searchableText = [
          indicator.name,
          indicator.topic,
          indicator.subtopic,
          indicator.description,
          indicator.source,
          indicator.reportingLevel,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        // Check if any search word matches any part of the searchable text
        return searchWords.some((word) => searchableText.includes(word))
      })

      // Sort by relevance
      filtered.sort((a, b) => {
        const getRelevanceScore = (indicator: any) => {
          let score = 0
          const searchableFields = {
            name: indicator.name?.toLowerCase() || "",
            topic: indicator.topic?.toLowerCase() || "",
            subtopic: indicator.subtopic?.toLowerCase() || "",
            description: indicator.description?.toLowerCase() || "",
            source: indicator.source?.toLowerCase() || "",
            reportingLevel: indicator.reportingLevel?.toLowerCase() || "",
          }

          searchWords.forEach((word) => {
            // Higher scores for matches in more important fields
            if (searchableFields.name.includes(word)) score += 10
            if (searchableFields.topic.includes(word)) score += 8
            if (searchableFields.subtopic.includes(word)) score += 6
            if (searchableFields.description.includes(word)) score += 4
            if (searchableFields.source.includes(word)) score += 2
            if (searchableFields.reportingLevel.includes(word)) score += 1
          })

          return score
        }

        return getRelevanceScore(b) - getRelevanceScore(a)
      })
    }

    // Apply other filters
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(
        (indicator) => selectedTopics.includes(indicator.topic) || selectedTopics.includes(indicator.subtopic),
      )
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter((indicator) => selectedSources.includes(indicator.source))
    }

    if (selectedReportingLevels.length > 0) {
      filtered = filtered.filter((indicator) => selectedReportingLevels.includes(indicator.reportingLevel))
    }

    // Apply year range filter
    filtered = filtered.filter((indicator) => {
      if (!indicator.yearRange) return true
      const [indicatorStart, indicatorEnd] = indicator.yearRange
      return indicatorEnd >= yearRange[0] && indicatorStart <= yearRange[1]
    })

    return filtered
  }, [searchTerm, selectedTopics, selectedSources, selectedReportingLevels, yearRange])

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSourceToggle = (source: string) => {
    setSelectedSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  const handleReportingLevelToggle = (level: string) => {
    setSelectedReportingLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const handleIndicatorToggle = (indicatorId: string) => {
    setTempSelectedIndicators((prev) =>
      prev.includes(indicatorId) ? prev.filter((id) => id !== indicatorId) : [...prev, indicatorId],
    )
  }

  const handleSelectAll = () => {
    const allVisibleIds = filteredIndicators.map((ind) => ind.id)
    setTempSelectedIndicators((prev) => {
      const newSelection = [...new Set([...prev, ...allVisibleIds])]
      return newSelection
    })
  }

  const handleDeselectAll = () => {
    const visibleIds = new Set(filteredIndicators.map((ind) => ind.id))
    setTempSelectedIndicators((prev) => prev.filter((id) => !visibleIds.has(id)))
  }

  const handleApply = () => {
    const selectedIndicatorObjects = realIndicators.filter((ind) => tempSelectedIndicators.includes(ind.id))
    onSelectIndicators(selectedIndicatorObjects)
    onClose()
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedTopics([])
    setSelectedSources([])
    setSelectedReportingLevels([])
    setYearRange([2000, 2024])
  }

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    selectedTopics.length +
    selectedSources.length +
    selectedReportingLevels.length +
    (yearRange[0] !== 2000 || yearRange[1] !== 2024 ? 1 : 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Filter Panel - 3 columns width */}
          <div className="w-96 border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear All ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search indicators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Topics Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Topics</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueTopics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`topic-${topic}`}
                          checked={selectedTopics.includes(topic)}
                          onCheckedChange={() => handleTopicToggle(topic)}
                        />
                        <label htmlFor={`topic-${topic}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                          {topic}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Data Sources Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueSources.map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={`source-${source}`}
                          checked={selectedSources.includes(source)}
                          onCheckedChange={() => handleSourceToggle(source)}
                        />
                        <label htmlFor={`source-${source}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                          {source}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Reporting Level Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Reporting Level</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-reporting-levels"
                        checked={selectedReportingLevels.length === 0}
                        onCheckedChange={() => setSelectedReportingLevels([])}
                      />
                      <label htmlFor="all-reporting-levels" className="text-sm text-gray-700 cursor-pointer">
                        All Reporting Levels
                      </label>
                    </div>
                    {uniqueReportingLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level}`}
                          checked={selectedReportingLevels.includes(level)}
                          onCheckedChange={() => handleReportingLevelToggle(level)}
                        />
                        <label htmlFor={`level-${level}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Data Availability Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Availability (Years)</h4>
                  <div className="px-2">
                    <Slider
                      value={yearRange}
                      onValueChange={setYearRange}
                      min={2000}
                      max={2024}
                      step={1}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Results Panel - 9 columns width */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Available Indicators ({filteredIndicators.length})</h3>
                  <p className="text-sm text-gray-600 mt-1">{tempSelectedIndicators.length} selected</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All Visible
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Deselect All Visible
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchTerm}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                    </Badge>
                  )}
                  {selectedTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleTopicToggle(topic)} />
                    </Badge>
                  ))}
                  {selectedSources.map((source) => (
                    <Badge key={source} variant="secondary" className="flex items-center gap-1">
                      {source}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleSourceToggle(source)} />
                    </Badge>
                  ))}
                  {selectedReportingLevels.map((level) => (
                    <Badge key={level} variant="secondary" className="flex items-center gap-1">
                      {level}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleReportingLevelToggle(level)} />
                    </Badge>
                  ))}
                  {(yearRange[0] !== 2000 || yearRange[1] !== 2024) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Years: {yearRange[0]}-{yearRange[1]}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setYearRange([2000, 2024])} />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredIndicators.map((indicator) => (
                  <Card
                    key={indicator.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      tempSelectedIndicators.includes(indicator.id)
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleIndicatorToggle(indicator.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium text-gray-900 mb-1">{indicator.name}</CardTitle>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {indicator.topic}
                            </Badge>
                            {indicator.subtopic && (
                              <Badge variant="secondary" className="text-xs">
                                {indicator.subtopic}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Checkbox
                          checked={tempSelectedIndicators.includes(indicator.id)}
                          onChange={() => handleIndicatorToggle(indicator.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {indicator.description}
                      </CardDescription>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Building2 className="h-3 w-3 mr-1" />
                          <span>{indicator.source}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{indicator.reportingLevel}</span>
                        </div>
                        {indicator.yearRange && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {indicator.yearRange[0]} - {indicator.yearRange[1]}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIndicators.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No indicators found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters to find relevant indicators.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t bg-white">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">{tempSelectedIndicators.length} indicator(s) selected</div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={tempSelectedIndicators.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Selection ({tempSelectedIndicators.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

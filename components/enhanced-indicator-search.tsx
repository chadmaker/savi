"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Search, Filter, ChevronDown, ChevronRight, FileText, X } from "lucide-react"

interface RealIndicator {
  id: string
  topic: string
  category: string
  tile: string
  indicator: string
  source: string
  lastUpdated: string
  value: number
  reportingArea: string
  availability: string
  description: string
  notes: string
}

interface EnhancedIndicatorSearchProps {
  indicators: RealIndicator[]
  selectedIndicators: string[]
  onSelectionChange: (selectedIds: string[]) => void
}

export function EnhancedIndicatorSearch({
  indicators,
  selectedIndicators,
  onSelectionChange,
}: EnhancedIndicatorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [tileFilter, setTileFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Get unique values for filters
  const filterOptions = useMemo(
    () => ({
      topics: [...new Set(indicators.map((i) => i.topic))].sort(),
      categories: [...new Set(indicators.map((i) => i.category))].sort(),
      tiles: [...new Set(indicators.map((i) => i.tile))].sort(),
      sources: [...new Set(indicators.map((i) => i.source))].sort(),
    }),
    [indicators],
  )

  // Filter indicators based on all criteria
  const filteredIndicators = useMemo(() => {
    return indicators.filter((indicator) => {
      const matchesSearch =
        indicator.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.tile.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTopic = topicFilter === "all" || indicator.topic === topicFilter
      const matchesCategory = categoryFilter === "all" || indicator.category === categoryFilter
      const matchesTile = tileFilter === "all" || indicator.tile === tileFilter
      const matchesSource = sourceFilter === "all" || indicator.source === sourceFilter

      return matchesSearch && matchesTopic && matchesCategory && matchesTile && matchesSource
    })
  }, [indicators, searchTerm, topicFilter, categoryFilter, tileFilter, sourceFilter])

  // Group filtered indicators by topic for hierarchical display
  const groupedIndicators = useMemo(() => {
    const groups: Record<string, RealIndicator[]> = {}
    filteredIndicators.forEach((indicator) => {
      if (!groups[indicator.topic]) {
        groups[indicator.topic] = []
      }
      groups[indicator.topic].push(indicator)
    })
    return groups
  }, [filteredIndicators])

  const handleSelectIndicator = (id: string, checked: boolean) => {
    const newSelection = checked ? [...selectedIndicators, id] : selectedIndicators.filter((i) => i !== id)
    onSelectionChange(newSelection)
  }

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? filteredIndicators.map((i) => i.id) : [])
  }

  const handleSelectTopic = (topic: string, checked: boolean) => {
    const topicIndicators = groupedIndicators[topic] || []
    const topicIds = topicIndicators.map((i) => i.id)

    if (checked) {
      const newSelection = [...new Set([...selectedIndicators, ...topicIds])]
      onSelectionChange(newSelection)
    } else {
      const newSelection = selectedIndicators.filter((id) => !topicIds.includes(id))
      onSelectionChange(newSelection)
    }
  }

  const toggleTopicExpansion = (topic: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topic)) {
        newSet.delete(topic)
      } else {
        newSet.add(topic)
      }
      return newSet
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setTopicFilter("all")
    setCategoryFilter("all")
    setTileFilter("all")
    setSourceFilter("all")
  }

  const activeFiltersCount = [topicFilter, categoryFilter, tileFilter, sourceFilter].filter(
    (filter) => filter !== "all",
  ).length

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Indicators ({filteredIndicators.length})
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </CardTitle>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search indicators, topics, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <CollapsibleContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {filterOptions.topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {filterOptions.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Tile</label>
                <Select value={tileFilter} onValueChange={setTileFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiles</SelectItem>
                    {filterOptions.tiles.map((tile) => (
                      <SelectItem key={tile} value={tile}>
                        {tile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Source</label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {filterOptions.sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>

      <CardContent>
        {/* Selection Controls */}
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={
                selectedIndicators.length === 0
                  ? false
                  : selectedIndicators.length === filteredIndicators.length
                    ? true
                    : "indeterminate"
              }
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
            />
            <label className="text-sm font-medium">Select All ({filteredIndicators.length})</label>
          </div>
          {selectedIndicators.length > 0 && <Badge variant="secondary">{selectedIndicators.length} selected</Badge>}
        </div>

        {/* Hierarchical Indicator List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(groupedIndicators).map(([topic, topicIndicators]) => {
            const topicIds = topicIndicators.map((i) => i.id)
            const selectedInTopic = topicIds.filter((id) => selectedIndicators.includes(id)).length
            const isTopicExpanded = expandedTopics.has(topic)

            return (
              <div key={topic} className="border rounded-lg">
                <div className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="flex items-center space-x-2 flex-1">
                    <Checkbox
                      checked={
                        selectedInTopic === 0 ? false : selectedInTopic === topicIds.length ? true : "indeterminate"
                      }
                      onCheckedChange={(checked) => handleSelectTopic(topic, checked === true)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTopicExpansion(topic)}
                      className="p-0 h-auto"
                    >
                      {isTopicExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{topic}</div>
                      <div className="text-xs text-muted-foreground">
                        {topicIndicators.length} indicators
                        {selectedInTopic > 0 && ` • ${selectedInTopic} selected`}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {topicIndicators.length}
                  </Badge>
                </div>

                {isTopicExpanded && (
                  <div className="border-t bg-muted/25">
                    {topicIndicators.map((indicator) => (
                      <div key={indicator.id} className="flex items-start space-x-2 p-3 pl-12 hover:bg-background/50">
                        <Checkbox
                          checked={selectedIndicators.includes(indicator.id)}
                          onCheckedChange={(checked) => handleSelectIndicator(indicator.id, checked as boolean)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{indicator.indicator}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {indicator.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {indicator.tile}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {indicator.source} • Updated {new Date(indicator.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {Object.keys(groupedIndicators).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No indicators found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

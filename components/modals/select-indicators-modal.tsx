"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Star, Plus, TrendingUp, TrendingDown, Minus, Check, Info, ChevronRight } from "lucide-react"
import { sampleIndicators as initialIndicators, type Indicator } from "@/data/indicators"
import { cn } from "@/lib/utils"

interface SelectIndicatorsModalProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

const filterOptions = {
  populations: [
    "African Americans",
    "Asians",
    "Hispanics and Latinos",
    "Older Adults",
    "Working Age",
    "Working Poor",
    "Youth",
  ],
  topics: [
    "Basic Needs",
    "Community Development",
    "Crime and Safety",
    "Demographic",
    "Early Care and Learning",
    "Economic Mobility",
    "Economy",
    "Education",
    "Environment",
    "Equity",
    "Food Access",
    "Health",
    "Housing",
    "Poverty and Income",
  ],
  reportingLevels: ["State", "County", "County Subdivision", "Census Tract", "Block Group", "Census Block"],
  sources: ["U.S. Census", "CDC", "Indiana DOE", "EPA", "Indiana DOH", "BLS"],
}

const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString())

export function SelectIndicatorsModal({
  open,
  onClose,
  selectedIndicators: initialSelected,
  onSelectionChange,
}: SelectIndicatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    populations: [],
    topics: [],
    reportingLevels: [],
    sources: [],
  })
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all")

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

  const clearAllFilters = () => {
    setActiveFilters({ populations: [], topics: [], reportingLevels: [], sources: [] })
  }

  const handleCategoryClick = (category: string) => {
    setSearchTerm(category)
  }

  const filteredIndicators = useMemo(() => {
    return indicators.filter((indicator) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === "" ||
        indicator.name.toLowerCase().includes(searchLower) ||
        indicator.description.toLowerCase().includes(searchLower) ||
        indicator.categories.some((c) => c.toLowerCase().includes(searchLower))

      const matchesFilters =
        (activeFilters.populations.length === 0 ||
          indicator.populations.some((p) => activeFilters.populations.includes(p))) &&
        (activeFilters.topics.length === 0 || activeFilters.topics.includes(indicator.topic)) &&
        (activeFilters.reportingLevels.length === 0 ||
          activeFilters.reportingLevels.includes(indicator.reportingArea)) &&
        (activeFilters.sources.length === 0 || activeFilters.sources.includes(indicator.source))

      return matchesSearch && matchesFilters
    })
  }, [searchTerm, activeFilters, indicators])

  const selectedIndicatorsData = useMemo(() => {
    return indicators.filter((indicator) => selected.includes(indicator.id))
  }, [selected, indicators])

  const getFilterCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      populations: {},
      topics: {},
      reportingLevels: {},
      sources: {},
    }

    indicators.forEach((indicator) => {
      indicator.populations.forEach((p) => {
        counts.populations[p] = (counts.populations[p] || 0) + 1
      })
      counts.topics[indicator.topic] = (counts.topics[indicator.topic] || 0) + 1
      counts.reportingLevels[indicator.reportingArea] = (counts.reportingLevels[indicator.reportingArea] || 0) + 1
      counts.sources[indicator.source] = (counts.sources[indicator.source] || 0) + 1
    })
    return counts
  }, [indicators])

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

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-gray-400" />
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
    indicator: Indicator
    onSelect: (id: string) => void
    onStarToggle: (id: string) => void
    onCategoryClick: (category: string) => void
    isSelected: boolean
    selectedCommunity: string
  }) => {
    const [isMetaVisible, setIsMetaVisible] = useState(false)

    return (
      <div className="border rounded-lg p-4 flex flex-col space-y-4 hover:bg-gray-50">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start space-x-4 flex-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => onStarToggle(indicator.id)}>
              <Star className={`h-5 w-5 ${indicator.starred ? "text-yellow-400 fill-current" : "text-gray-400"}`} />
            </Button>
            <div className="flex-1">
              <h4 className="font-semibold">{indicator.name}</h4>
              <div className="text-sm text-gray-600 flex items-center flex-wrap mt-1">
                {indicator.categories.map((cat, i) => (
                  <span key={i} className="flex items-center">
                    <button
                      onClick={() => onCategoryClick(cat)}
                      className="hover:underline text-blue-600 hover:text-blue-800"
                    >
                      {cat}
                    </button>
                    {i < indicator.categories.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelect(indicator.id)}
                className="w-28"
              >
                {isSelected ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {isSelected ? "Selected" : "Select"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMetaVisible(!isMetaVisible)}>
                <Info className={cn("h-4 w-4", isMetaVisible ? "text-blue-600" : "text-gray-500")} />
              </Button>
            </div>
            <div className="h-5">{selectedCommunity !== "all" && <TrendIcon trend={indicator.trend} />}</div>
          </div>
        </div>
        {isMetaVisible && (
          <div className="pl-12 pr-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Topic</h5>
                <Badge variant="secondary">{indicator.topic}</Badge>
              </div>
              <div>
                <h5 className="font-semibold text-sm mb-2">Populations</h5>
                <div className="flex flex-wrap gap-1">
                  {indicator.populations.length > 0 ? (
                    indicator.populations.map((p) => (
                      <Badge key={p} variant="secondary">
                        {p}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Source: </span>
                  <span>{indicator.source}</span>
                </div>
                <div>
                  <span className="font-semibold">Availability: </span>
                  <span>{indicator.years}</span>
                </div>
                <div>
                  <span className="font-semibold">Reporting Level: </span>
                  <span>{indicator.reportingArea}</span>
                </div>
                <div>
                  <span className="font-semibold">Last Updated: </span>
                  <span>{new Date(indicator.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg">Select Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Filters Sidebar */}
          <aside className="w-1/4 max-w-xs border-r overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
            <Accordion
              type="multiple"
              defaultValue={["community", "populations", "topics", "reportingLevels", "sources"]}
            >
              <AccordionItem value="community">
                <AccordionTrigger>Community</AccordionTrigger>
                <AccordionContent>
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All areas</SelectItem>
                      <SelectItem value="marion">Marion County</SelectItem>
                      <SelectItem value="broad-ripple">Broad Ripple</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="availability">
                <AccordionTrigger>Data Availability</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="populations">
                <AccordionTrigger>Populations</AccordionTrigger>
                <AccordionContent>
                  {filterOptions.populations.map((item) => (
                    <div key={item} className="flex items-center justify-between space-x-2 p-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`pop-${item}`}
                          checked={activeFilters.populations.includes(item)}
                          onCheckedChange={() => handleFilterChange("populations", item)}
                        />
                        <label htmlFor={`pop-${item}`} className="text-sm font-medium leading-none">
                          {item}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">{getFilterCounts.populations[item] || 0}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="topics">
                <AccordionTrigger>Topics</AccordionTrigger>
                <AccordionContent>
                  {filterOptions.topics.map((item) => (
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
              <AccordionItem value="reportingLevels">
                <AccordionTrigger>Reporting Level</AccordionTrigger>
                <AccordionContent>
                  {filterOptions.reportingLevels.map((item) => (
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
              <AccordionItem value="sources">
                <AccordionTrigger>Sources</AccordionTrigger>
                <AccordionContent>
                  {filterOptions.sources.map((item) => (
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
            <Tabs defaultValue="results" className="flex-1 flex flex-col min-h-0">
              <TabsList className="mx-4 justify-start">
                <TabsTrigger value="results" className="flex items-center space-x-2">
                  <span>Results</span>
                  <Badge variant="secondary">{filteredIndicators.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="selected" className="flex items-center space-x-2">
                  <span>Selected Indicators</span>
                  <Badge variant="secondary">{selected.length}</Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search results by keyword..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {filteredIndicators.map((indicator) => (
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
              </TabsContent>
              <TabsContent value="selected" className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedIndicatorsData.length > 0 ? (
                  selectedIndicatorsData.map((indicator) => (
                    <IndicatorCard
                      key={indicator.id}
                      indicator={indicator}
                      onSelect={handleSelectIndicator}
                      onStarToggle={handleToggleStar}
                      onCategoryClick={handleCategoryClick}
                      isSelected={selected.includes(indicator.id)}
                      selectedCommunity={selectedCommunity}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-10">No indicators selected.</div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Selection ({selected.length})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

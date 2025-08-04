"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Star,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Home,
  GraduationCap,
  Heart,
  Car,
  Building,
  Zap,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Indicator {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  source: string
  timeRange: string
  geography: string[]
  starred?: boolean
  trending?: boolean
  new?: boolean
}

interface SelectIndicatorsModalProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

const mockIndicators: Indicator[] = [
  {
    id: "1",
    name: "Median Household Income",
    description: "The median income of households in the area",
    category: "Economics",
    subcategory: "Income",
    source: "American Community Survey",
    timeRange: "2018-2022",
    geography: ["County", "Township", "Census Tract"],
    starred: true,
    trending: true,
  },
  {
    id: "2",
    name: "Population Density",
    description: "Number of people per square mile",
    category: "Demographics",
    subcategory: "Population",
    source: "U.S. Census Bureau",
    timeRange: "2020",
    geography: ["County", "Township", "Census Tract", "Block Group"],
    starred: false,
  },
  {
    id: "3",
    name: "Unemployment Rate",
    description: "Percentage of labor force that is unemployed",
    category: "Economics",
    subcategory: "Employment",
    source: "Bureau of Labor Statistics",
    timeRange: "2023",
    geography: ["County", "Township"],
    starred: true,
  },
  {
    id: "4",
    name: "High School Graduation Rate",
    description: "Percentage of students graduating from high school",
    category: "Education",
    subcategory: "Achievement",
    source: "Indiana Department of Education",
    timeRange: "2022-2023",
    geography: ["School District"],
    starred: false,
    new: true,
  },
  {
    id: "5",
    name: "Housing Cost Burden",
    description: "Percentage of households spending >30% of income on housing",
    category: "Housing",
    subcategory: "Affordability",
    source: "American Community Survey",
    timeRange: "2018-2022",
    geography: ["County", "Township", "Census Tract"],
    starred: false,
    trending: true,
  },
  {
    id: "6",
    name: "Life Expectancy",
    description: "Average number of years a person is expected to live",
    category: "Health",
    subcategory: "Outcomes",
    source: "CDC",
    timeRange: "2018-2020",
    geography: ["County", "Census Tract"],
    starred: true,
  },
]

const categoryIcons = {
  Demographics: Users,
  Economics: DollarSign,
  Housing: Home,
  Education: GraduationCap,
  Health: Heart,
  Transportation: Car,
  Environment: Building,
  Infrastructure: Zap,
}

export function SelectIndicatorsModal({
  open,
  onClose,
  selectedIndicators,
  onSelectionChange,
}: SelectIndicatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [indicators, setIndicators] = useState<Indicator[]>(mockIndicators)

  const categories = Array.from(new Set(indicators.map((indicator) => indicator.category)))
  const sources = Array.from(new Set(indicators.map((indicator) => indicator.source)))

  const filteredIndicators = indicators.filter((indicator) => {
    const matchesSearch =
      indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indicator.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || indicator.category === selectedCategory
    const matchesSource = selectedSource === "all" || indicator.source === selectedSource
    const matchesStarred = !showStarredOnly || indicator.starred

    return matchesSearch && matchesCategory && matchesSource && matchesStarred
  })

  const handleIndicatorToggle = (indicatorId: string) => {
    const newSelection = selectedIndicators.includes(indicatorId)
      ? selectedIndicators.filter((id) => id !== indicatorId)
      : [...selectedIndicators, indicatorId]

    onSelectionChange(newSelection)
  }

  const handleStarToggle = (indicatorId: string) => {
    setIndicators((prev) =>
      prev.map((indicator) =>
        indicator.id === indicatorId ? { ...indicator, starred: !indicator.starred } : indicator,
      ),
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredIndicators.map((indicator) => indicator.id)
    onSelectionChange(allFilteredIds)
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || BarChart3
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showStarredOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowStarredOnly(!showStarredOnly)}
              >
                <Star className={`h-4 w-4 mr-1 ${showStarredOnly ? "fill-current" : ""}`} />
                Starred
              </Button>
            </div>
          </div>

          {/* Selection Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedIndicators.length} of {filteredIndicators.length} indicators selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Indicators List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredIndicators.map((indicator) => (
                <div key={indicator.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedIndicators.includes(indicator.id)}
                    onCheckedChange={() => handleIndicatorToggle(indicator.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                          {indicator.trending && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                          {indicator.new && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{indicator.description}</p>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(indicator.category)}
                            <span>{indicator.category}</span>
                          </div>
                          <span>•</span>
                          <span>{indicator.source}</span>
                          <span>•</span>
                          <span>{indicator.timeRange}</span>
                          <span>•</span>
                          <span>{indicator.geography.join(", ")}</span>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => handleStarToggle(indicator.id)} className="ml-2">
                        <Star
                          className={`h-4 w-4 ${indicator.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Add Selected Indicators ({selectedIndicators.length})</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

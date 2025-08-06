"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BarChart3, Users, DollarSign, Home, GraduationCap, Heart } from 'lucide-react'

interface Indicator {
  id: string
  name: string
  category: string
  description: string
  timeRange: string
  source: string
}

interface SelectIndicatorsModalProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

export function SelectIndicatorsModal({ open, onClose, selectedIndicators, onSelectionChange }: SelectIndicatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIndicators)
  const [activeCategory, setActiveCategory] = useState("all")

  const indicators: Indicator[] = [
    {
      id: "median-income",
      name: "Median Household Income",
      category: "Economics",
      description: "The middle value of household income distribution",
      timeRange: "2010-2023",
      source: "American Community Survey"
    },
    {
      id: "population-density",
      name: "Population Density",
      category: "Demographics",
      description: "Number of people per square mile",
      timeRange: "2010-2023",
      source: "US Census Bureau"
    },
    {
      id: "unemployment-rate",
      name: "Unemployment Rate",
      category: "Economics",
      description: "Percentage of labor force that is unemployed",
      timeRange: "2010-2023",
      source: "Bureau of Labor Statistics"
    },
    {
      id: "housing-cost-burden",
      name: "Housing Cost Burden",
      category: "Housing",
      description: "Percentage of income spent on housing costs",
      timeRange: "2010-2023",
      source: "American Community Survey"
    },
    {
      id: "educational-attainment",
      name: "Educational Attainment",
      category: "Education",
      description: "Percentage with bachelor's degree or higher",
      timeRange: "2010-2023",
      source: "American Community Survey"
    },
    {
      id: "life-expectancy",
      name: "Life Expectancy",
      category: "Health",
      description: "Average number of years a person is expected to live",
      timeRange: "2010-2020",
      source: "CDC"
    },
    {
      id: "poverty-rate",
      name: "Poverty Rate",
      category: "Economics",
      description: "Percentage of population below poverty line",
      timeRange: "2010-2023",
      source: "American Community Survey"
    },
    {
      id: "homeownership-rate",
      name: "Homeownership Rate",
      category: "Housing",
      description: "Percentage of housing units that are owner-occupied",
      timeRange: "2010-2023",
      source: "American Community Survey"
    }
  ]

  const categories = [
    { id: "all", name: "All Categories", icon: BarChart3 },
    { id: "Demographics", name: "Demographics", icon: Users },
    { id: "Economics", name: "Economics", icon: DollarSign },
    { id: "Housing", name: "Housing", icon: Home },
    { id: "Education", name: "Education", icon: GraduationCap },
    { id: "Health", name: "Health", icon: Heart }
  ]

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || indicator.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleToggleIndicator = (indicatorId: string) => {
    const indicatorName = indicators.find(i => i.id === indicatorId)?.name
    if (!indicatorName) return

    if (tempSelected.includes(indicatorName)) {
      setTempSelected(tempSelected.filter(id => id !== indicatorName))
    } else {
      setTempSelected([...tempSelected, indicatorName])
    }
  }

  const handleSelect = () => {
    onSelectionChange(tempSelected)
    onClose()
  }

  const handleClose = () => {
    setTempSelected(selectedIndicators)
    setSearchTerm("")
    setActiveCategory("all")
    onClose()
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || BarChart3
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Data Indicators</DialogTitle>
          <DialogDescription>
            Choose the data points you want to analyze. You can select multiple indicators from different categories.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Count */}
          {tempSelected.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-blue-600">
                {tempSelected.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTempSelected([])}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    <Icon className="h-3 w-3 mr-1" />
                    {category.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {filteredIndicators.map((indicator) => {
                    const isSelected = tempSelected.includes(indicator.name)
                    const Icon = getCategoryIcon(indicator.category)
                    
                    return (
                      <div
                        key={indicator.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleToggleIndicator(indicator.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleIndicator(indicator.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <h3 className="font-medium text-gray-900">{indicator.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {indicator.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{indicator.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Time Range: {indicator.timeRange}</span>
                              <span>Source: {indicator.source}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredIndicators.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No indicators found matching your search.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select {tempSelected.length} Indicator{tempSelected.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

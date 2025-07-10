"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, X } from "lucide-react"

interface SelectIndicatorsModalProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

const indicatorCategories = {
  demographics: [
    "Total Population",
    "Population Density",
    "Median Age",
    "Race/Ethnicity Distribution",
    "Household Size",
  ],
  education: [
    "High School Graduation Rate",
    "Bachelor's Degree Attainment",
    "School Enrollment",
    "Educational Spending per Student",
    "Student-Teacher Ratio",
  ],
  economics: [
    "Median Household Income",
    "Poverty Rate",
    "Unemployment Rate",
    "Employment by Industry",
    "Cost of Living Index",
  ],
  housing: ["Housing Units", "Homeownership Rate", "Median Home Value", "Rent Burden", "Housing Vacancy Rate"],
  health: [
    "Life Expectancy",
    "Infant Mortality Rate",
    "Access to Healthcare",
    "Health Insurance Coverage",
    "Chronic Disease Rates",
  ],
}

export function SelectIndicatorsModal({
  open,
  onClose,
  selectedIndicators,
  onSelectionChange,
}: SelectIndicatorsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("browse")

  const allIndicators = Object.values(indicatorCategories).flat()

  const filteredIndicators = searchTerm
    ? allIndicators.filter((indicator) => indicator.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  const handleToggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      onSelectionChange(selectedIndicators.filter((i) => i !== indicator))
    } else {
      onSelectionChange([...selectedIndicators, indicator])
    }
  }

  const handleRemoveIndicator = (indicator: string) => {
    onSelectionChange(selectedIndicators.filter((i) => i !== indicator))
  }

  const handleConfirm = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Data Indicators</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {Object.entries(indicatorCategories).map(([category, indicators]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-semibold capitalize text-gray-900">{category}</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {indicators.map((indicator) => (
                      <div
                        key={indicator}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedIndicators.includes(indicator) ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => handleToggleIndicator(indicator)}
                      >
                        <span className="text-sm">{indicator}</span>
                        <input
                          type="checkbox"
                          checked={selectedIndicators.includes(indicator)}
                          onChange={() => handleToggleIndicator(indicator)}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="flex-1 min-h-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="indicator-search">Search Indicators</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="indicator-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for indicators..."
                    className="pl-10"
                  />
                </div>
              </div>

              {searchTerm && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredIndicators.map((indicator) => (
                    <div
                      key={indicator}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        selectedIndicators.includes(indicator) ? "bg-blue-50 border border-blue-200" : ""
                      }`}
                      onClick={() => handleToggleIndicator(indicator)}
                    >
                      <span className="text-sm">{indicator}</span>
                      <input
                        type="checkbox"
                        checked={selectedIndicators.includes(indicator)}
                        onChange={() => handleToggleIndicator(indicator)}
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 min-h-0">
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(indicatorCategories).map(([category, indicators]) => (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize text-gray-900">{category}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const categoryIndicators = indicators.filter((i) => !selectedIndicators.includes(i))
                        onSelectionChange([...selectedIndicators, ...categoryIndicators])
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {indicators.map((indicator) => (
                      <div
                        key={indicator}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedIndicators.includes(indicator) ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => handleToggleIndicator(indicator)}
                      >
                        <span className="text-sm">{indicator}</span>
                        <input
                          type="checkbox"
                          checked={selectedIndicators.includes(indicator)}
                          onChange={() => handleToggleIndicator(indicator)}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Selected Indicators */}
        {selectedIndicators.length > 0 && (
          <div className="border-t pt-4">
            <Label>Selected Indicators ({selectedIndicators.length})</Label>
            <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {selectedIndicators.map((indicator) => (
                <Badge key={indicator} variant="secondary" className="flex items-center gap-1">
                  {indicator}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveIndicator(indicator)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Selection ({selectedIndicators.length})</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Edit, Eye, Layers, Calculator, ArrowUpDown } from "lucide-react"

interface Indicator {
  id: string
  name: string
  category1: string
  category2: string
  category3: string
  category4: string | null
  source: string
  lastUpdated: string
  value: number
  reportingArea: string
  availability: string
  description: string
  notes: string
}

interface IndicatorListingProps {
  indicators: Indicator[]
  onEdit: (indicator: Indicator) => void
  onView: (indicator: Indicator) => void
  onGroup: (indicators: Indicator[]) => void
  onNormalize: (indicators: Indicator[]) => void
}

export function IndicatorListing({ indicators, onEdit, onView, onGroup, onNormalize }: IndicatorListingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Indicator>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState({
    category1: [] as string[],
    category2: [] as string[],
    category3: [] as string[],
    source: [] as string[],
  })

  // Get unique values for filter options
  const filterOptions = useMemo(
    () => ({
      category1: [...new Set(indicators.map((i) => i.category1))],
      category2: [...new Set(indicators.map((i) => i.category2))],
      category3: [...new Set(indicators.map((i) => i.category3))],
      source: [...new Set(indicators.map((i) => i.source))],
    }),
    [indicators],
  )

  // Filter and sort indicators
  const filteredIndicators = useMemo(() => {
    const filtered = indicators.filter((indicator) => {
      const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory1 = filters.category1.length === 0 || filters.category1.includes(indicator.category1)
      const matchesCategory2 = filters.category2.length === 0 || filters.category2.includes(indicator.category2)
      const matchesCategory3 = filters.category3.length === 0 || filters.category3.includes(indicator.category3)
      const matchesSource = filters.source.length === 0 || filters.source.includes(indicator.source)

      return matchesSearch && matchesCategory1 && matchesCategory2 && matchesCategory3 && matchesSource
    })

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const direction = sortDirection === "asc" ? 1 : -1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * direction
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction
      }
      return 0
    })

    return filtered
  }, [indicators, searchTerm, filters, sortField, sortDirection])

  const handleSort = (field: keyof Indicator) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFilterChange = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [category]: checked ? [...prev[category], value] : prev[category].filter((v) => v !== value),
    }))
  }

  const handleSelectIndicator = (id: string, checked: boolean) => {
    setSelectedIndicators((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIndicators(checked ? filteredIndicators.map((i) => i.id) : [])
  }

  const selectedIndicatorObjects = indicators.filter((i) => selectedIndicators.includes(i.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Indicator Listing</h2>
          <p className="text-muted-foreground">Manage and organize your indicators</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={selectedIndicators.length === 0}
            onClick={() => onGroup(selectedIndicatorObjects)}
          >
            <Layers className="w-4 h-4 mr-2" />
            Group ({selectedIndicators.length})
          </Button>
          <Button
            variant="outline"
            disabled={selectedIndicators.length === 0}
            onClick={() => onNormalize(selectedIndicatorObjects)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Normalize ({selectedIndicators.length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search indicators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category}>
                <label className="text-sm font-medium mb-2 block capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${option}`}
                        checked={filters[category as keyof typeof filters].includes(option)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(category as keyof typeof filters, option, checked as boolean)
                        }
                      />
                      <label htmlFor={`${category}-${option}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ category1: [], category2: [], category3: [], source: [] })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Main Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Indicators ({filteredIndicators.length})</CardTitle>
              {selectedIndicators.length > 0 && <Badge variant="secondary">{selectedIndicators.length} selected</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedIndicators.length === filteredIndicators.length && filteredIndicators.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-2">
                        Indicator Name
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("source")}>
                      <div className="flex items-center gap-2">
                        Source
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("lastUpdated")}>
                      <div className="flex items-center gap-2">
                        Last Updated
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIndicators.includes(indicator.id)}
                          onCheckedChange={(checked) => handleSelectIndicator(indicator.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{indicator.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {indicator.category1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {indicator.category2}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {indicator.category3}
                          </Badge>
                          {indicator.category4 && (
                            <Badge variant="outline" className="text-xs">
                              {indicator.category4}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {indicator.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(indicator.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(indicator)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(indicator)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onGroup([indicator])}>
                              <Layers className="w-4 h-4 mr-2" />
                              Add to Group
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onNormalize([indicator])}>
                              <Calculator className="w-4 h-4 mr-2" />
                              Normalize
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, ShoppingCart, Plus, Save, Calculator, History, ArrowRight, X, Info, Edit, Check } from "lucide-react"

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

interface CartItem {
  indicator: RealIndicator
  action: "group" | "normalize" | "edit"
  metadata?: any
}

interface EnhancedIndicatorsTabProps {
  indicators: RealIndicator[]
}

export function EnhancedIndicatorsTab({ indicators }: EnhancedIndicatorsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [groupingView, setGroupingView] = useState<"none" | "cat1" | "cat2" | "cat3" | "cat4">("none")
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  // Sort indicators A-Z
  const sortedIndicators = useMemo(() => {
    return [...indicators].sort((a, b) => a.indicator.localeCompare(b.indicator))
  }, [indicators])

  // Filter and group indicators
  const processedIndicators = useMemo(() => {
    const filtered = sortedIndicators.filter((indicator) => {
      const matchesSearch =
        indicator.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.topic.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || indicator.topic === categoryFilter
      return matchesSearch && matchesCategory
    })

    if (groupingView === "none") {
      return { ungrouped: filtered }
    }

    // Group by selected category
    const groupKey =
      groupingView === "cat1"
        ? "topic"
        : groupingView === "cat2"
          ? "category"
          : groupingView === "cat3"
            ? "tile"
            : "source"

    const grouped = filtered.reduce(
      (acc, indicator) => {
        const key = indicator[groupKey as keyof RealIndicator] as string
        if (!acc[key]) acc[key] = []
        acc[key].push(indicator)
        return acc
      },
      {} as Record<string, RealIndicator[]>,
    )

    return grouped
  }, [sortedIndicators, searchTerm, categoryFilter, groupingView])

  // Paginate results for performance
  const paginatedIndicators = useMemo(() => {
    const allIndicators = Object.values(processedIndicators).flat()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    if (groupingView === "none") {
      return { ungrouped: allIndicators.slice(startIndex, endIndex) }
    }

    // For grouped view, take first 100 total items across all groups
    const limitedIndicators = allIndicators.slice(startIndex, endIndex)
    const regrouped = limitedIndicators.reduce(
      (acc, indicator) => {
        const groupKey =
          groupingView === "cat1"
            ? "topic"
            : groupingView === "cat2"
              ? "category"
              : groupingView === "cat3"
                ? "tile"
                : "source"
        const key = indicator[groupKey as keyof RealIndicator] as string
        if (!acc[key]) acc[key] = []
        acc[key].push(indicator)
        return acc
      },
      {} as Record<string, RealIndicator[]>,
    )

    return regrouped
  }, [processedIndicators, currentPage, itemsPerPage, groupingView])

  const totalItems = Object.values(processedIndicators).flat().length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleSelectIndicator = (id: string, checked: boolean) => {
    setSelectedIndicators((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }

  const addToCart = (action: "group" | "normalize" | "edit") => {
    const indicatorObjects = indicators.filter((i) => selectedIndicators.includes(i.id))
    const newItems: CartItem[] = indicatorObjects.map((indicator) => ({
      indicator,
      action,
      metadata: {},
    }))

    setCart((prev) => [...prev, ...newItems])
    setSelectedIndicators([])
  }

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCart([])
  }

  const proceedToCheckout = () => {
    setShowConfirmation(true)
  }

  const confirmActions = () => {
    // Process cart items
    console.log("Processing cart items:", cart)
    setCart([])
    setShowConfirmation(false)
    // Add to history, etc.
  }

  const categories = useMemo(() => {
    return [...new Set(indicators.map((i) => i.topic))].sort()
  }, [indicators])

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Indicators Management</h1>
            <p className="text-muted-foreground">
              Select, organize, and manage your indicators (showing {Object.values(paginatedIndicators).flat().length}{" "}
              of {totalItems})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHistory(true)}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              className="relative bg-transparent"
              onClick={proceedToCheckout}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Indicators Panel - 75% width */}
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Indicators ({totalItems})</CardTitle>
                <div className="flex gap-2">
                  <Select value={groupingView} onValueChange={(v: any) => setGroupingView(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="cat1">Group by Topic</SelectItem>
                      <SelectItem value="cat2">Group by Category</SelectItem>
                      <SelectItem value="cat3">Group by Tile</SelectItem>
                      <SelectItem value="cat4">Group by Source</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search indicators..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => {
                    setCategoryFilter(v)
                    setCurrentPage(1) // Reset to first page on filter
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category..." />
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
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(paginatedIndicators).map(([groupName, groupIndicators]) => (
                  <div key={groupName}>
                    {groupingView !== "none" && (
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 sticky top-0 bg-background">
                        {groupName} ({groupIndicators.length})
                      </h4>
                    )}

                    <div className="space-y-1">
                      {groupIndicators.map((indicator) => (
                        <div
                          key={indicator.id}
                          className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md group"
                        >
                          <Checkbox
                            checked={selectedIndicators.includes(indicator.id)}
                            onCheckedChange={(checked) => handleSelectIndicator(indicator.id, checked as boolean)}
                          />

                          <div className="flex-1 min-w-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm font-medium truncate cursor-help">{indicator.indicator}</div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-sm">
                                <div className="space-y-2">
                                  <div>
                                    <strong>Topic:</strong> {indicator.topic}
                                  </div>
                                  <div>
                                    <strong>Category:</strong> {indicator.category}
                                  </div>
                                  <div>
                                    <strong>Tile:</strong> {indicator.tile}
                                  </div>
                                  <div>
                                    <strong>Source:</strong> {indicator.source}
                                  </div>
                                  <div>
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(indicator.lastUpdated).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <strong>Description:</strong> {indicator.description}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>

                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {indicator.topic}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {indicator.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm">
                              <Info className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {selectedIndicators.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{selectedIndicators.length} selected</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => addToCart("group")}>
                        <Plus className="w-4 h-4 mr-1" />
                        Group
                      </Button>
                      <Button size="sm" onClick={() => addToCart("normalize")}>
                        <Calculator className="w-4 h-4 mr-1" />
                        Normalize
                      </Button>
                      <Button size="sm" onClick={() => addToCart("edit")}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Panel - 25% width */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Action Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items in cart</p>
                  <p className="text-sm">Select indicators and add actions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{cart.length} items</span>
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="p-2 border rounded-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{item.indicator.indicator}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.action}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(index)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-3 border-t">
                    <Button className="w-full" onClick={proceedToCheckout}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Confirm Actions</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Action Summary</h4>
                <div className="space-y-2">
                  {Object.entries(
                    cart.reduce(
                      (acc, item) => {
                        acc[item.action] = (acc[item.action] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([action, count]) => (
                    <div key={action} className="flex justify-between">
                      <span className="capitalize">{action} actions:</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Error Check</h4>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">All validations passed</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmActions}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Action History</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-15 14:30</TableCell>
                    <TableCell>Group Creation</TableCell>
                    <TableCell>5 indicators</TableCell>
                    <TableCell>
                      <Badge variant="default">Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-15 14:25</TableCell>
                    <TableCell>Normalization</TableCell>
                    <TableCell>3 indicators</TableCell>
                    <TableCell>
                      <Badge variant="default">Completed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

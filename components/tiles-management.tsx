"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye, Save } from "lucide-react"

interface Tile {
  id: string
  label: string
  category: string
  groupTheme: string
  keywords: string[]
  metadataIndicatorId: string
  topicSortedGeographies: string[]
  suppressDisplay: boolean
  isDefault: boolean
  missingDataMessage: string
  visualizations: Visualization[]
  createdDate: string
  lastModified: string
}

interface Visualization {
  id: string
  type:
    | "single_value"
    | "table"
    | "line_geography"
    | "line_indicator"
    | "jenks_map"
    | "bar_geography"
    | "vbar_indicator"
    | "single_value_indexed"
    | "index_map"
  title: string
  config: any
  order: number
}

const VISUALIZATION_TYPES = [
  { value: "single_value", label: "Single Value", description: "One value per tile, most recent data year" },
  { value: "table", label: "Table/Dashboard List", description: "Count/rate columns with footnote visibility" },
  { value: "line_geography", label: "Line by Geography", description: "Geographic trend lines" },
  { value: "line_indicator", label: "Line by Indicator", description: "Limited to 4 visible indicators" },
  { value: "jenks_map", label: "Jenks Map", description: "Smallest geography with available data" },
  { value: "bar_geography", label: "Bar by Geography", description: "Single/multiple geography, switches to donut" },
  { value: "vbar_indicator", label: "Vbar by Indicator", description: "Unlimited indicators, auto-resize labels" },
  { value: "single_value_indexed", label: "Single Value Indexed", description: "Displays indexed text vs numeric" },
  { value: "index_map", label: "Index Map", description: "Maps index rather than raw values" },
]

export function TilesManagement() {
  const [tiles, setTiles] = useState<Tile[]>([
    {
      id: "1",
      label: "Population Demographics Overview",
      category: "Demographics",
      groupTheme: "Population",
      keywords: ["population", "demographics", "total"],
      metadataIndicatorId: "pop_total",
      topicSortedGeographies: ["County", "Township", "Census Tract"],
      suppressDisplay: false,
      isDefault: true,
      missingDataMessage: "Data available for Marion County and townships",
      visualizations: [],
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTile, setEditingTile] = useState<Tile | null>(null)
  const [newTile, setNewTile] = useState<Partial<Tile>>({
    label: "",
    category: "",
    groupTheme: "",
    keywords: [],
    metadataIndicatorId: "",
    topicSortedGeographies: [],
    suppressDisplay: false,
    isDefault: false,
    missingDataMessage: "",
    visualizations: [],
  })

  const [newVisualization, setNewVisualization] = useState<Partial<Visualization>>({
    type: "single_value",
    title: "",
    config: {},
    order: 1,
  })

  const handleCreateTile = () => {
    const tile: Tile = {
      id: Date.now().toString(),
      label: newTile.label || "",
      category: newTile.category || "",
      groupTheme: newTile.groupTheme || "",
      keywords: newTile.keywords || [],
      metadataIndicatorId: newTile.metadataIndicatorId || "",
      topicSortedGeographies: newTile.topicSortedGeographies || [],
      suppressDisplay: newTile.suppressDisplay || false,
      isDefault: newTile.isDefault || false,
      missingDataMessage: newTile.missingDataMessage || "",
      visualizations: newTile.visualizations || [],
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setTiles((prev) => [...prev, tile])
    setNewTile({
      label: "",
      category: "",
      groupTheme: "",
      keywords: [],
      metadataIndicatorId: "",
      topicSortedGeographies: [],
      suppressDisplay: false,
      isDefault: false,
      missingDataMessage: "",
      visualizations: [],
    })
    setShowCreateModal(false)
  }

  const handleAddVisualization = (tileId: string) => {
    const visualization: Visualization = {
      id: Date.now().toString(),
      type: newVisualization.type as any,
      title: newVisualization.title || "",
      config: newVisualization.config || {},
      order: newVisualization.order || 1,
    }

    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === tileId ? { ...tile, visualizations: [...tile.visualizations, visualization] } : tile,
      ),
    )

    setNewVisualization({
      type: "single_value",
      title: "",
      config: {},
      order: 1,
    })
  }

  const deleteTile = (id: string) => {
    setTiles((prev) => prev.filter((t) => t.id !== id))
  }

  const categories = ["Demographics", "Economy", "Education", "Health", "Housing", "Safety", "Transportation"]
  const groupThemes = ["Population", "Income", "Poverty", "Employment", "Housing", "Health", "Education"]
  const geographies = ["State", "County", "Township", "Census Tract", "Block Group", "Neighborhood"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tiles Management</h1>
          <p className="text-muted-foreground">Create and manage tiles with visualizations</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Tile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Tile</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties">Tile Properties</TabsTrigger>
                <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tile-label">Tile Label (max 34 chars)</Label>
                    <Input
                      id="tile-label"
                      value={newTile.label}
                      onChange={(e) => setNewTile((prev) => ({ ...prev, label: e.target.value.slice(0, 34) }))}
                      placeholder="Enter tile label..."
                      maxLength={34}
                    />
                    <div className="text-xs text-muted-foreground mt-1">{newTile.label?.length || 0}/34 characters</div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTile.category}
                      onValueChange={(v) => setNewTile((prev) => ({ ...prev, category: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="group-theme">Group Theme</Label>
                    <Select
                      value={newTile.groupTheme}
                      onValueChange={(v) => setNewTile((prev) => ({ ...prev, groupTheme: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme..." />
                      </SelectTrigger>
                      <SelectContent>
                        {groupThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="metadata-indicator">Metadata Indicator ID</Label>
                    <Input
                      id="metadata-indicator"
                      value={newTile.metadataIndicatorId}
                      onChange={(e) => setNewTile((prev) => ({ ...prev, metadataIndicatorId: e.target.value }))}
                      placeholder="Select indicator for About info..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={newTile.keywords?.join(", ")}
                    onChange={(e) =>
                      setNewTile((prev) => ({ ...prev, keywords: e.target.value.split(",").map((k) => k.trim()) }))
                    }
                    placeholder="Enter keywords for search..."
                  />
                </div>

                <div>
                  <Label>Topic Sorted Geographies</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {geographies.map((geo) => (
                      <div key={geo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`geo-${geo}`}
                          checked={newTile.topicSortedGeographies?.includes(geo)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewTile((prev) => ({
                                ...prev,
                                topicSortedGeographies: [...(prev.topicSortedGeographies || []), geo],
                              }))
                            } else {
                              setNewTile((prev) => ({
                                ...prev,
                                topicSortedGeographies: prev.topicSortedGeographies?.filter((g) => g !== geo),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`geo-${geo}`} className="text-sm">
                          {geo}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="suppress-display"
                      checked={newTile.suppressDisplay}
                      onCheckedChange={(checked) =>
                        setNewTile((prev) => ({ ...prev, suppressDisplay: checked as boolean }))
                      }
                    />
                    <Label htmlFor="suppress-display">Suppress Display</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-default"
                      checked={newTile.isDefault}
                      onCheckedChange={(checked) => setNewTile((prev) => ({ ...prev, isDefault: checked as boolean }))}
                    />
                    <Label htmlFor="is-default">Is Default Tile</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="missing-data-message">Missing Data Message</Label>
                  <Textarea
                    id="missing-data-message"
                    value={newTile.missingDataMessage}
                    onChange={(e) => setNewTile((prev) => ({ ...prev, missingDataMessage: e.target.value }))}
                    placeholder="Specify which geographies have data..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="visualizations" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Add Visualization</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="viz-type">Visualization Type</Label>
                      <Select
                        value={newVisualization.type}
                        onValueChange={(v) => setNewVisualization((prev) => ({ ...prev, type: v as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VISUALIZATION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="viz-title">Title</Label>
                      <Input
                        id="viz-title"
                        value={newVisualization.title}
                        onChange={(e) => setNewVisualization((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter visualization title..."
                      />
                    </div>
                  </div>

                  <Button
                    className="mt-4"
                    onClick={() => handleAddVisualization("new")}
                    disabled={!newVisualization.title}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Visualization
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Visualizations</h4>
                  {(newTile.visualizations || []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">No visualizations added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {newTile.visualizations?.map((viz, index) => (
                        <div key={viz.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <div className="font-medium text-sm">{viz.title}</div>
                            <Badge variant="outline" className="text-xs">
                              {VISUALIZATION_TYPES.find((t) => t.value === viz.type)?.label}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <strong>Visualization Rules:</strong>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Single Value is required and appears at top</li>
                    <li>• Maximum 3 additional visualizations (excluding maps)</li>
                    <li>• Only 2 "Line by Indicator" visualizations allowed</li>
                    <li>• Bar by Geography switches to donut automatically based on data</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTile} disabled={!newTile.label}>
                <Save className="w-4 h-4 mr-2" />
                Create Tile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Tiles ({tiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Visualizations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiles.map((tile) => (
                <TableRow key={tile.id}>
                  <TableCell className="font-medium">{tile.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tile.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tile.groupTheme}</Badge>
                  </TableCell>
                  <TableCell>{tile.visualizations.length}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {tile.isDefault && <Badge variant="default">Default</Badge>}
                      {tile.suppressDisplay && <Badge variant="destructive">Suppressed</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(tile.lastModified).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingTile(tile)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTile(tile.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

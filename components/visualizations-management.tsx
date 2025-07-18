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
import { Plus, Edit, Trash2, Eye, Save, BarChart3, LineChart, Map, TrendingUp } from "lucide-react"

interface VisualizationDefinition {
  id: string
  name: string
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
  description: string
  config: {
    dataType?: "count" | "rate" | "percentage" | "index"
    geographyLevel?: string
    indicatorLimit?: number
    displayFormat?: string
    colorScheme?: string
    showFootnote?: boolean
    indexMapping?: Record<string, string>
    parentGeographies?: string[]
    includeBoundary?: boolean
  }
  constraints: {
    maxIndicators?: number
    requiredDataType?: string[]
    geographyRequirements?: string[]
  }
  createdDate: string
  lastModified: string
  isActive: boolean
}

const VISUALIZATION_CONFIGS = {
  single_value: {
    icon: TrendingUp,
    description: "Single value display with most recent data year",
    defaultConfig: { dataType: "count", displayFormat: "numeric" },
    constraints: { maxIndicators: 1 },
  },
  table: {
    icon: BarChart3,
    description: "Table/Dashboard list with count/rate columns and footnotes",
    defaultConfig: { showFootnote: true, dataType: "count" },
    constraints: { maxIndicators: 10 },
  },
  line_geography: {
    icon: LineChart,
    description: "Line chart showing trends by geography",
    defaultConfig: { geographyLevel: "county", colorScheme: "blue" },
    constraints: { maxIndicators: 5 },
  },
  line_indicator: {
    icon: LineChart,
    description: "Line chart by indicator (max 4 visible, shows top 4)",
    defaultConfig: { indicatorLimit: 4, colorScheme: "multi" },
    constraints: { maxIndicators: 4 },
  },
  jenks_map: {
    icon: Map,
    description: "Jenks classification map using smallest available geography",
    defaultConfig: { geographyLevel: "tract", colorScheme: "sequential" },
    constraints: { maxIndicators: 1, geographyRequirements: ["geometry"] },
  },
  bar_geography: {
    icon: BarChart3,
    description: "Bar chart by geography (switches to donut for single geography)",
    defaultConfig: { parentGeographies: ["county", "state"], includeBoundary: true },
    constraints: { maxIndicators: 1 },
  },
  vbar_indicator: {
    icon: BarChart3,
    description: "Vertical bar chart by indicator (unlimited, auto-resize labels)",
    defaultConfig: { displayFormat: "auto-resize" },
    constraints: {},
  },
  single_value_indexed: {
    icon: TrendingUp,
    description: "Single value showing indexed text instead of numeric value",
    defaultConfig: { dataType: "index", displayFormat: "text" },
    constraints: { maxIndicators: 1, requiredDataType: ["index"] },
  },
  index_map: {
    icon: Map,
    description: "Map displaying index values rather than raw data",
    defaultConfig: { dataType: "index", colorScheme: "categorical" },
    constraints: { maxIndicators: 1, requiredDataType: ["index"] },
  },
}

export function VisualizationsManagement() {
  const [visualizations, setVisualizations] = useState<VisualizationDefinition[]>([
    {
      id: "1",
      name: "Population Single Value",
      type: "single_value",
      description: "Display total population count",
      config: {
        dataType: "count",
        displayFormat: "numeric",
      },
      constraints: {
        maxIndicators: 1,
      },
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
      isActive: true,
    },
    {
      id: "2",
      name: "Demographics Table",
      type: "table",
      description: "Demographic breakdown table with footnotes",
      config: {
        showFootnote: true,
        dataType: "count",
      },
      constraints: {
        maxIndicators: 10,
      },
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
      isActive: true,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingViz, setEditingViz] = useState<VisualizationDefinition | null>(null)
  const [newViz, setNewViz] = useState<Partial<VisualizationDefinition>>({
    name: "",
    type: "single_value",
    description: "",
    config: {},
    constraints: {},
    isActive: true,
  })

  const handleCreateVisualization = () => {
    const vizType = newViz.type!
    const config = VISUALIZATION_CONFIGS[vizType]

    const visualization: VisualizationDefinition = {
      id: Date.now().toString(),
      name: newViz.name || "",
      type: vizType,
      description: newViz.description || "",
      config: { ...config.defaultConfig, ...newViz.config },
      constraints: { ...config.constraints, ...newViz.constraints },
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      isActive: newViz.isActive || true,
    }

    setVisualizations((prev) => [...prev, visualization])
    setNewViz({
      name: "",
      type: "single_value",
      description: "",
      config: {},
      constraints: {},
      isActive: true,
    })
    setShowCreateModal(false)
  }

  const deleteVisualization = (id: string) => {
    setVisualizations((prev) => prev.filter((v) => v.id !== id))
  }

  const toggleActive = (id: string) => {
    setVisualizations((prev) => prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visualizations Management</h1>
          <p className="text-muted-foreground">Define and manage visualization types and configurations</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Visualization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Visualization Definition</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="viz-name">Visualization Name</Label>
                    <Input
                      id="viz-name"
                      value={newViz.name}
                      onChange={(e) => setNewViz((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter visualization name..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="viz-type">Visualization Type</Label>
                    <Select
                      value={newViz.type}
                      onValueChange={(v) =>
                        setNewViz((prev) => ({
                          ...prev,
                          type: v as any,
                          config: VISUALIZATION_CONFIGS[v as keyof typeof VISUALIZATION_CONFIGS].defaultConfig,
                          constraints: VISUALIZATION_CONFIGS[v as keyof typeof VISUALIZATION_CONFIGS].constraints,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VISUALIZATION_CONFIGS).map(([key, config]) => {
                          const Icon = config.icon
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">
                                    {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{config.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="viz-description">Description</Label>
                  <Textarea
                    id="viz-description"
                    value={newViz.description}
                    onChange={(e) => setNewViz((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this visualization..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-active"
                    checked={newViz.isActive}
                    onCheckedChange={(checked) => setNewViz((prev) => ({ ...prev, isActive: checked as boolean }))}
                  />
                  <Label htmlFor="is-active">Active (available for use)</Label>
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Configuration Options</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="data-type">Data Type</Label>
                      <Select
                        value={newViz.config?.dataType}
                        onValueChange={(v) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, dataType: v as any },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select data type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="rate">Rate</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="index">Index</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="geography-level">Geography Level</Label>
                      <Select
                        value={newViz.config?.geographyLevel}
                        onValueChange={(v) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, geographyLevel: v },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select geography..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="state">State</SelectItem>
                          <SelectItem value="county">County</SelectItem>
                          <SelectItem value="township">Township</SelectItem>
                          <SelectItem value="tract">Census Tract</SelectItem>
                          <SelectItem value="block">Block Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="color-scheme">Color Scheme</Label>
                      <Select
                        value={newViz.config?.colorScheme}
                        onValueChange={(v) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, colorScheme: v },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select colors..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="multi">Multi-color</SelectItem>
                          <SelectItem value="sequential">Sequential</SelectItem>
                          <SelectItem value="categorical">Categorical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="display-format">Display Format</Label>
                      <Select
                        value={newViz.config?.displayFormat}
                        onValueChange={(v) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, displayFormat: v },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="auto-resize">Auto-resize</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-footnote"
                        checked={newViz.config?.showFootnote}
                        onCheckedChange={(checked) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, showFootnote: checked as boolean },
                          }))
                        }
                      />
                      <Label htmlFor="show-footnote">Show Footnote</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-boundary"
                        checked={newViz.config?.includeBoundary}
                        onCheckedChange={(checked) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, includeBoundary: checked as boolean },
                          }))
                        }
                      />
                      <Label htmlFor="include-boundary">Include Boundary</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="constraints" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Usage Constraints</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-indicators">Maximum Indicators</Label>
                      <Input
                        id="max-indicators"
                        type="number"
                        value={newViz.constraints?.maxIndicators || ""}
                        onChange={(e) =>
                          setNewViz((prev) => ({
                            ...prev,
                            constraints: {
                              ...prev.constraints,
                              maxIndicators: Number.parseInt(e.target.value) || undefined,
                            },
                          }))
                        }
                        placeholder="No limit"
                      />
                    </div>

                    <div>
                      <Label htmlFor="indicator-limit">Indicator Display Limit</Label>
                      <Input
                        id="indicator-limit"
                        type="number"
                        value={newViz.config?.indicatorLimit || ""}
                        onChange={(e) =>
                          setNewViz((prev) => ({
                            ...prev,
                            config: { ...prev.config, indicatorLimit: Number.parseInt(e.target.value) || undefined },
                          }))
                        }
                        placeholder="No limit"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Required Data Types</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {["count", "rate", "percentage", "index"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`req-${type}`}
                            checked={newViz.constraints?.requiredDataType?.includes(type)}
                            onCheckedChange={(checked) => {
                              const current = newViz.constraints?.requiredDataType || []
                              const updated = checked ? [...current, type] : current.filter((t) => t !== type)
                              setNewViz((prev) => ({
                                ...prev,
                                constraints: { ...prev.constraints, requiredDataType: updated },
                              }))
                            }}
                          />
                          <Label htmlFor={`req-${type}`} className="text-sm capitalize">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <strong>Constraint Notes:</strong>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Line by Indicator limited to 4 visible indicators (shows top 4)</li>
                    <li>• Bar by Geography switches to donut for single geography automatically</li>
                    <li>• Jenks and Index maps require geometry data</li>
                    <li>• Single Value and Indexed types limited to 1 indicator</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateVisualization} disabled={!newViz.name}>
                <Save className="w-4 h-4 mr-2" />
                Create Visualization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visualizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visualization Definitions ({visualizations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Max Indicators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visualizations.map((viz) => {
                const config = VISUALIZATION_CONFIGS[viz.type]
                const Icon = config.icon
                return (
                  <TableRow key={viz.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {viz.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {viz.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{viz.config.dataType || "Any"}</Badge>
                    </TableCell>
                    <TableCell>{viz.constraints.maxIndicators || "Unlimited"}</TableCell>
                    <TableCell>
                      <Badge variant={viz.isActive ? "default" : "secondary"}>
                        {viz.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(viz.lastModified).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingViz(viz)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(viz.id)}>
                          {viz.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteVisualization(viz.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

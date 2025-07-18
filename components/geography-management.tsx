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
import { Plus, Edit, Trash2, MapPin, Save, Link } from "lucide-react"

interface Geography {
  id: string
  name: string
  geographyId: string
  level: "state" | "county" | "township" | "tract" | "block_group" | "neighborhood"
  parentId?: string
  parentName?: string
  childrenIds: string[]
  geometry?: string
  esriConnection?: string
  isDefaultComparison: boolean
  isPeerGeography: boolean
  isNavigable: boolean
  population?: number
  area?: number
  createdDate: string
  lastModified: string
}

const GEOGRAPHY_LEVELS = [
  { value: "state", label: "State", order: 1 },
  { value: "county", label: "County", order: 2 },
  { value: "township", label: "Township", order: 3 },
  { value: "tract", label: "Census Tract", order: 4 },
  { value: "block_group", label: "Block Group", order: 5 },
  { value: "neighborhood", label: "Neighborhood", order: 6 },
]

export function GeographyManagement() {
  const [geographies, setGeographies] = useState<Geography[]>([
    {
      id: "1",
      name: "Indiana",
      geographyId: "IN",
      level: "state",
      childrenIds: ["2"],
      isDefaultComparison: true,
      isPeerGeography: false,
      isNavigable: true,
      population: 6785528,
      area: 36420,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "Marion County",
      geographyId: "18097",
      level: "county",
      parentId: "1",
      parentName: "Indiana",
      childrenIds: ["3", "4"],
      isDefaultComparison: true,
      isPeerGeography: false,
      isNavigable: true,
      population: 971822,
      area: 396,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
    {
      id: "3",
      name: "Center Township",
      geographyId: "1809714",
      level: "township",
      parentId: "2",
      parentName: "Marion County",
      childrenIds: [],
      isDefaultComparison: false,
      isPeerGeography: true,
      isNavigable: true,
      population: 142787,
      area: 32,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGeo, setEditingGeo] = useState<Geography | null>(null)
  const [newGeo, setNewGeo] = useState<Partial<Geography>>({
    name: "",
    geographyId: "",
    level: "county",
    parentId: "",
    childrenIds: [],
    isDefaultComparison: false,
    isPeerGeography: false,
    isNavigable: true,
  })

  const handleCreateGeography = () => {
    const geography: Geography = {
      id: Date.now().toString(),
      name: newGeo.name || "",
      geographyId: newGeo.geographyId || "",
      level: newGeo.level as any,
      parentId: newGeo.parentId,
      parentName: newGeo.parentId ? geographies.find((g) => g.id === newGeo.parentId)?.name : undefined,
      childrenIds: [],
      geometry: newGeo.geometry,
      esriConnection: newGeo.esriConnection,
      isDefaultComparison: newGeo.isDefaultComparison || false,
      isPeerGeography: newGeo.isPeerGeography || false,
      isNavigable: newGeo.isNavigable || true,
      population: newGeo.population,
      area: newGeo.area,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    // Update parent's children if applicable
    if (geography.parentId) {
      setGeographies((prev) =>
        prev.map((g) => (g.id === geography.parentId ? { ...g, childrenIds: [...g.childrenIds, geography.id] } : g)),
      )
    }

    setGeographies((prev) => [...prev, geography])
    setNewGeo({
      name: "",
      geographyId: "",
      level: "county",
      parentId: "",
      childrenIds: [],
      isDefaultComparison: false,
      isPeerGeography: false,
      isNavigable: true,
    })
    setShowCreateModal(false)
  }

  const deleteGeography = (id: string) => {
    const geo = geographies.find((g) => g.id === id)
    if (geo?.parentId) {
      // Remove from parent's children
      setGeographies((prev) =>
        prev.map((g) => (g.id === geo.parentId ? { ...g, childrenIds: g.childrenIds.filter((cid) => cid !== id) } : g)),
      )
    }
    setGeographies((prev) => prev.filter((g) => g.id !== id))
  }

  const toggleProperty = (id: string, property: "isDefaultComparison" | "isPeerGeography" | "isNavigable") => {
    setGeographies((prev) => prev.map((g) => (g.id === id ? { ...g, [property]: !g[property] } : g)))
  }

  const getAvailableParents = (level: string) => {
    const currentLevelOrder = GEOGRAPHY_LEVELS.find((l) => l.value === level)?.order || 0
    return geographies.filter((g) => {
      const geoLevelOrder = GEOGRAPHY_LEVELS.find((l) => l.value === g.level)?.order || 0
      return geoLevelOrder < currentLevelOrder
    })
  }

  const getHierarchyPath = (geo: Geography): string => {
    if (!geo.parentId) return geo.name
    const parent = geographies.find((g) => g.id === geo.parentId)
    return parent ? `${getHierarchyPath(parent)} > ${geo.name}` : geo.name
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Geography Management</h1>
          <p className="text-muted-foreground">Manage Indiana geographies and their relationships</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Geography
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Geography</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="geo-name">Geography Name</Label>
                  <Input
                    id="geo-name"
                    value={newGeo.name}
                    onChange={(e) => setNewGeo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter geography name..."
                  />
                </div>

                <div>
                  <Label htmlFor="geo-id">Geography ID</Label>
                  <Input
                    id="geo-id"
                    value={newGeo.geographyId}
                    onChange={(e) => setNewGeo((prev) => ({ ...prev, geographyId: e.target.value }))}
                    placeholder="Enter FIPS or unique ID..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="geo-level">Geography Level</Label>
                  <Select
                    value={newGeo.level}
                    onValueChange={(v) => setNewGeo((prev) => ({ ...prev, level: v as any, parentId: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GEOGRAPHY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parent-geo">Parent Geography</Label>
                  <Select
                    value={newGeo.parentId || "none"}
                    onValueChange={(v) => setNewGeo((prev) => ({ ...prev, parentId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent</SelectItem>
                      {getAvailableParents(newGeo.level!).map((geo) => (
                        <SelectItem key={geo.id} value={geo.id}>
                          {geo.name} ({geo.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="population">Population</Label>
                  <Input
                    id="population"
                    type="number"
                    value={newGeo.population || ""}
                    onChange={(e) =>
                      setNewGeo((prev) => ({ ...prev, population: Number.parseInt(e.target.value) || undefined }))
                    }
                    placeholder="Enter population..."
                  />
                </div>

                <div>
                  <Label htmlFor="area">Area (sq mi)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={newGeo.area || ""}
                    onChange={(e) =>
                      setNewGeo((prev) => ({ ...prev, area: Number.parseFloat(e.target.value) || undefined }))
                    }
                    placeholder="Enter area..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="esri-connection">ESRI Connection</Label>
                <Input
                  id="esri-connection"
                  value={newGeo.esriConnection || ""}
                  onChange={(e) => setNewGeo((prev) => ({ ...prev, esriConnection: e.target.value }))}
                  placeholder="Enter ESRI service URL..."
                />
              </div>

              <div className="space-y-2">
                <Label>Geography Properties</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="default-comparison"
                      checked={newGeo.isDefaultComparison}
                      onCheckedChange={(checked) =>
                        setNewGeo((prev) => ({ ...prev, isDefaultComparison: checked as boolean }))
                      }
                    />
                    <Label htmlFor="default-comparison">Default Comparison Geography</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="peer-geography"
                      checked={newGeo.isPeerGeography}
                      onCheckedChange={(checked) =>
                        setNewGeo((prev) => ({ ...prev, isPeerGeography: checked as boolean }))
                      }
                    />
                    <Label htmlFor="peer-geography">Peer Geography</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="navigable"
                      checked={newGeo.isNavigable}
                      onCheckedChange={(checked) => setNewGeo((prev) => ({ ...prev, isNavigable: checked as boolean }))}
                    />
                    <Label htmlFor="navigable">Navigable (parent/child relationships)</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGeography} disabled={!newGeo.name || !newGeo.geographyId}>
                <Save className="w-4 h-4 mr-2" />
                Add Geography
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Geography Table */}
      <Card>
        <CardHeader>
          <CardTitle>Indiana Geographies ({geographies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Hierarchy</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Children</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geographies
                .sort((a, b) => {
                  const aOrder = GEOGRAPHY_LEVELS.find((l) => l.value === a.level)?.order || 0
                  const bOrder = GEOGRAPHY_LEVELS.find((l) => l.value === b.level)?.order || 0
                  if (aOrder !== bOrder) return aOrder - bOrder
                  return a.name.localeCompare(b.name)
                })
                .map((geo) => (
                  <TableRow key={geo.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {geo.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{geo.geographyId}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{GEOGRAPHY_LEVELS.find((l) => l.value === geo.level)?.label}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm text-muted-foreground">{getHierarchyPath(geo)}</div>
                    </TableCell>
                    <TableCell>{geo.population?.toLocaleString() || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {geo.isDefaultComparison && (
                          <Badge variant="default" className="text-xs">
                            Default
                          </Badge>
                        )}
                        {geo.isPeerGeography && (
                          <Badge variant="secondary" className="text-xs">
                            Peer
                          </Badge>
                        )}
                        {geo.isNavigable && (
                          <Badge variant="outline" className="text-xs">
                            Navigable
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{geo.childrenIds.length}</span>
                        {geo.childrenIds.length > 0 && <Link className="w-3 h-3" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingGeo(geo)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteGeography(geo.id)}>
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

      {/* Geography Hierarchy Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Geography Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {geographies
              .filter((g) => !g.parentId)
              .map((rootGeo) => (
                <GeographyHierarchyNode key={rootGeo.id} geography={rootGeo} allGeographies={geographies} level={0} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GeographyHierarchyNode({
  geography,
  allGeographies,
  level,
}: {
  geography: Geography
  allGeographies: Geography[]
  level: number
}) {
  const children = allGeographies.filter((g) => g.parentId === geography.id)
  const indent = level * 24

  return (
    <div>
      <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md" style={{ marginLeft: `${indent}px` }}>
        <MapPin className="w-4 h-4" />
        <span className="font-medium">{geography.name}</span>
        <Badge variant="outline" className="text-xs">
          {GEOGRAPHY_LEVELS.find((l) => l.value === geography.level)?.label}
        </Badge>
        {geography.population && (
          <span className="text-sm text-muted-foreground">({geography.population.toLocaleString()})</span>
        )}
      </div>
      {children.map((child) => (
        <GeographyHierarchyNode key={child.id} geography={child} allGeographies={allGeographies} level={level + 1} />
      ))}
    </div>
  )
}

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
import { Plus, Edit, Trash2, Globe, MapPin, Save, Eye, Users, BookOpen, Target, X } from "lucide-react"

interface Geography {
  id: string
  name: string
  geographyId: string
  level: "state" | "county" | "township" | "tract" | "block_group" | "neighborhood"
  parentId?: string
  parentName?: string
  childrenIds: string[]
  population?: number
  area?: number
}

interface Region {
  id: string
  name: string
  description: string
  type: "multi_state" | "metro" | "custom"
  geographyIds: string[]
  profiles: RegionProfile[]
  isActive: boolean
  createdDate: string
  lastModified: string
}

interface RegionProfile {
  id: string
  name: string
  type: "community" | "topic" | "population"
  description: string
  categories: ProfileCategory[]
  isActive: boolean
}

interface ProfileCategory {
  id: string
  name: string
  description: string
  indicators: string[]
  tiles: string[]
  visualizations: string[]
  order: number
  content?: string
}

const REGION_TYPES = [
  { value: "multi_state", label: "Multi-State Region", description: "Cross-state regional collections" },
  { value: "metro", label: "Metropolitan Area", description: "Metro areas spanning multiple counties" },
  { value: "custom", label: "Custom Region", description: "User-defined geographic collections" },
]

const PROFILE_TYPES = [
  { value: "community", label: "Community Profile", icon: Users, description: "Geographic community profiles" },
  { value: "topic", label: "Topic Profile", icon: BookOpen, description: "Subject-specific profiles" },
  { value: "population", label: "Population Profile", icon: Target, description: "Demographic group profiles" },
]

interface RegionsManagementProps {
  geographies: Geography[]
}

export function RegionsManagement({ geographies }: RegionsManagementProps) {
  const [regions, setRegions] = useState<Region[]>([
    {
      id: "1",
      name: "Indiana & Neighboring States",
      description: "Indiana plus 5 neighboring states for regional comparison",
      type: "multi_state",
      geographyIds: ["1"], // Indiana state ID
      profiles: [
        {
          id: "1",
          name: "Regional Economic Overview",
          type: "topic",
          description: "Economic indicators across the multi-state region",
          categories: [
            {
              id: "1",
              name: "Employment",
              description: "Regional employment metrics",
              indicators: ["unemployment_rate", "job_growth"],
              tiles: ["employment_tile", "job_growth_tile"],
              visualizations: ["line_geography", "jenks_map"],
              order: 1,
              content: "Employment trends across the regional area",
            },
          ],
          isActive: true,
        },
      ],
      isActive: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "Indianapolis Metro",
      description: "11 central Indiana counties comprising the Indianapolis metropolitan area",
      type: "metro",
      geographyIds: ["2"], // Marion County and others would be added
      profiles: [
        {
          id: "2",
          name: "Metro Community Profile",
          type: "community",
          description: "Comprehensive metro area community indicators",
          categories: [
            {
              id: "2",
              name: "Demographics",
              description: "Metro population characteristics",
              indicators: ["population", "age_distribution", "race_ethnicity"],
              tiles: ["population_tile", "demographics_tile"],
              visualizations: ["single_value", "bar_geography"],
              order: 1,
            },
            {
              id: "3",
              name: "Transportation",
              description: "Metro transportation and mobility",
              indicators: ["commute_time", "transit_usage"],
              tiles: ["transportation_tile"],
              visualizations: ["jenks_map", "line_geography"],
              order: 2,
            },
          ],
          isActive: true,
        },
      ],
      isActive: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
    {
      id: "3",
      name: "Evansville Metro",
      description: "Southern Indiana counties in the Evansville metropolitan area",
      type: "metro",
      geographyIds: [], // Would include Vanderburgh, Warrick, etc.
      profiles: [
        {
          id: "3",
          name: "Southern Indiana Profile",
          type: "community",
          description: "Community profile for southern Indiana metro",
          categories: [
            {
              id: "4",
              name: "Economy",
              description: "Economic indicators for southern region",
              indicators: ["median_income", "poverty_rate"],
              tiles: ["income_tile", "poverty_tile"],
              visualizations: ["single_value", "table"],
              order: 1,
            },
          ],
          isActive: true,
        },
      ],
      isActive: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<{ regionId: string; profile?: RegionProfile } | null>(null)

  const [newRegion, setNewRegion] = useState<Partial<Region>>({
    name: "",
    description: "",
    type: "metro",
    geographyIds: [],
    profiles: [],
    isActive: true,
  })

  const [newProfile, setNewProfile] = useState<Partial<RegionProfile>>({
    name: "",
    type: "community",
    description: "",
    categories: [],
    isActive: true,
  })

  const [newCategory, setNewCategory] = useState<Partial<ProfileCategory>>({
    name: "",
    description: "",
    indicators: [],
    tiles: [],
    visualizations: [],
    order: 1,
    content: "",
  })

  const handleCreateRegion = () => {
    const region: Region = {
      id: Date.now().toString(),
      name: newRegion.name || "",
      description: newRegion.description || "",
      type: newRegion.type as any,
      geographyIds: newRegion.geographyIds || [],
      profiles: [],
      isActive: newRegion.isActive || true,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setRegions((prev) => [...prev, region])
    setNewRegion({
      name: "",
      description: "",
      type: "metro",
      geographyIds: [],
      profiles: [],
      isActive: true,
    })
    setShowCreateModal(false)
  }

  const handleCreateProfile = () => {
    if (!editingProfile?.regionId) return

    const profile: RegionProfile = {
      id: Date.now().toString(),
      name: newProfile.name || "",
      type: newProfile.type as any,
      description: newProfile.description || "",
      categories: newProfile.categories || [],
      isActive: newProfile.isActive || true,
    }

    setRegions((prev) =>
      prev.map((region) =>
        region.id === editingProfile.regionId ? { ...region, profiles: [...region.profiles, profile] } : region,
      ),
    )

    setNewProfile({
      name: "",
      type: "community",
      description: "",
      categories: [],
      isActive: true,
    })
    setEditingProfile(null)
    setShowProfileModal(false)
  }

  const handleAddCategory = () => {
    const category: ProfileCategory = {
      id: Date.now().toString(),
      name: newCategory.name || "",
      description: newCategory.description || "",
      indicators: newCategory.indicators || [],
      tiles: newCategory.tiles || [],
      visualizations: newCategory.visualizations || [],
      order: newCategory.order || 1,
      content: newCategory.content || "",
    }

    setNewProfile((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), category],
    }))

    setNewCategory({
      name: "",
      description: "",
      indicators: [],
      tiles: [],
      visualizations: [],
      order: 1,
      content: "",
    })
  }

  const deleteRegion = (id: string) => {
    setRegions((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleRegionActive = (id: string) => {
    setRegions((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  const getRegionGeographies = (region: Region) => {
    return geographies.filter((geo) => region.geographyIds.includes(geo.id))
  }

  const getTotalPopulation = (region: Region) => {
    return getRegionGeographies(region).reduce((sum, geo) => sum + (geo.population || 0), 0)
  }

  const getRegionTypeConfig = (type: string) => {
    return REGION_TYPES.find((t) => t.value === type) || REGION_TYPES[0]
  }

  const getProfileTypeConfig = (type: string) => {
    return PROFILE_TYPES.find((t) => t.value === type) || PROFILE_TYPES[0]
  }

  // Mock data for indicators, tiles, and visualizations
  const availableIndicators = [
    "population",
    "unemployment_rate",
    "job_growth",
    "median_income",
    "poverty_rate",
    "age_distribution",
    "race_ethnicity",
    "commute_time",
    "transit_usage",
  ]

  const availableTiles = [
    "population_tile",
    "employment_tile",
    "job_growth_tile",
    "demographics_tile",
    "income_tile",
    "poverty_tile",
    "transportation_tile",
  ]

  const availableVisualizations = [
    "single_value",
    "table",
    "line_geography",
    "line_indicator",
    "jenks_map",
    "bar_geography",
    "vbar_indicator",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Regional Collections</h2>
          <p className="text-muted-foreground">Manage multi-geography regions and their specialized profiles</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Region
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Region</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region-name">Region Name</Label>
                  <Input
                    id="region-name"
                    value={newRegion.name}
                    onChange={(e) => setNewRegion((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Indianapolis Metro"
                  />
                </div>

                <div>
                  <Label htmlFor="region-type">Region Type</Label>
                  <Select
                    value={newRegion.type}
                    onValueChange={(v) => setNewRegion((prev) => ({ ...prev, type: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGION_TYPES.map((type) => (
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
              </div>

              <div>
                <Label htmlFor="region-description">Description</Label>
                <Textarea
                  id="region-description"
                  value={newRegion.description}
                  onChange={(e) => setNewRegion((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this regional collection..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Select Geographies</Label>
                <div className="mt-2 max-h-64 overflow-y-auto border rounded-md p-3">
                  <div className="space-y-2">
                    {geographies.map((geo) => (
                      <div key={geo.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`geo-${geo.id}`}
                          checked={newRegion.geographyIds?.includes(geo.id)}
                          onCheckedChange={(checked) => {
                            const current = newRegion.geographyIds || []
                            const updated = checked ? [...current, geo.id] : current.filter((id) => id !== geo.id)
                            setNewRegion((prev) => ({ ...prev, geographyIds: updated }))
                          }}
                        />
                        <Label htmlFor={`geo-${geo.id}`} className="flex items-center gap-2 cursor-pointer">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{geo.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {geo.level}
                          </Badge>
                          {geo.population && (
                            <span className="text-xs text-muted-foreground">({geo.population.toLocaleString()})</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {newRegion.geographyIds?.length || 0} geographies selected
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRegion} disabled={!newRegion.name || !newRegion.geographyIds?.length}>
                <Save className="w-4 h-4 mr-2" />
                Create Region
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Regions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Collections ({regions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Geographies</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Profiles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => {
                const typeConfig = getRegionTypeConfig(region.type)
                const regionGeographies = getRegionGeographies(region)
                const totalPopulation = getTotalPopulation(region)

                return (
                  <TableRow key={region.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {region.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeConfig.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{regionGeographies.length}</span>
                        <div className="flex flex-wrap gap-1">
                          {regionGeographies.slice(0, 2).map((geo) => (
                            <Badge key={geo.id} variant="secondary" className="text-xs">
                              {geo.name}
                            </Badge>
                          ))}
                          {regionGeographies.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{regionGeographies.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{totalPopulation > 0 ? totalPopulation.toLocaleString() : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{region.profiles.length}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProfile({ regionId: region.id })
                            setShowProfileModal(true)
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={region.isActive ? "default" : "secondary"}>
                        {region.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingRegion(region)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleRegionActive(region.id)}>
                          {region.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteRegion(region.id)}>
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

      {/* Region Details */}
      {regions.map((region) => (
        <Card key={`details-${region.id}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {region.name} - Profiles ({region.profiles.length})
              </CardTitle>
              <Button
                onClick={() => {
                  setEditingProfile({ regionId: region.id })
                  setShowProfileModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {region.profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No profiles created for this region yet</p>
                <p className="text-sm">Add profiles to define data categories and visualizations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {region.profiles.map((profile) => {
                  const profileTypeConfig = getProfileTypeConfig(profile.type)
                  const Icon = profileTypeConfig.icon

                  return (
                    <div key={profile.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{profile.name}</span>
                          <Badge variant="outline">{profileTypeConfig.label}</Badge>
                          <Badge variant={profile.isActive ? "default" : "secondary"}>
                            {profile.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Categories ({profile.categories.length})</h5>
                        {profile.categories.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No categories defined</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {profile.categories
                              .sort((a, b) => a.order - b.order)
                              .map((category) => (
                                <div key={category.id} className="p-2 bg-muted rounded text-xs">
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-muted-foreground">{category.description}</div>
                                  <div className="flex gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {category.indicators.length} indicators
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {category.tiles.length} tiles
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {category.visualizations.length} viz
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Profile Creation Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Region Profile</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input
                    id="profile-name"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Regional Economic Profile"
                  />
                </div>

                <div>
                  <Label htmlFor="profile-type">Profile Type</Label>
                  <Select
                    value={newProfile.type}
                    onValueChange={(v) => setNewProfile((prev) => ({ ...prev, type: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFILE_TYPES.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
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
                <Label htmlFor="profile-description">Description</Label>
                <Textarea
                  id="profile-description"
                  value={newProfile.description}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this profile..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Add Category</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Employment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category-order">Display Order</Label>
                    <Input
                      id="category-order"
                      type="number"
                      value={newCategory.order}
                      onChange={(e) =>
                        setNewCategory((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 1 }))
                      }
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="category-description">Description</Label>
                  <Input
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>Indicators</Label>
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                      {availableIndicators.map((indicator) => (
                        <div key={indicator} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ind-${indicator}`}
                            checked={newCategory.indicators?.includes(indicator)}
                            onCheckedChange={(checked) => {
                              const current = newCategory.indicators || []
                              const updated = checked ? [...current, indicator] : current.filter((i) => i !== indicator)
                              setNewCategory((prev) => ({ ...prev, indicators: updated }))
                            }}
                          />
                          <Label htmlFor={`ind-${indicator}`} className="text-xs">
                            {indicator.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Tiles</Label>
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                      {availableTiles.map((tile) => (
                        <div key={tile} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tile-${tile}`}
                            checked={newCategory.tiles?.includes(tile)}
                            onCheckedChange={(checked) => {
                              const current = newCategory.tiles || []
                              const updated = checked ? [...current, tile] : current.filter((t) => t !== tile)
                              setNewCategory((prev) => ({ ...prev, tiles: updated }))
                            }}
                          />
                          <Label htmlFor={`tile-${tile}`} className="text-xs">
                            {tile.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Visualizations</Label>
                    <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                      {availableVisualizations.map((viz) => (
                        <div key={viz} className="flex items-center space-x-2">
                          <Checkbox
                            id={`viz-${viz}`}
                            checked={newCategory.visualizations?.includes(viz)}
                            onCheckedChange={(checked) => {
                              const current = newCategory.visualizations || []
                              const updated = checked ? [...current, viz] : current.filter((v) => v !== viz)
                              setNewCategory((prev) => ({ ...prev, visualizations: updated }))
                            }}
                          />
                          <Label htmlFor={`viz-${viz}`} className="text-xs">
                            {viz.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="mt-4" onClick={handleAddCategory} disabled={!newCategory.name}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Current Categories</h4>
                {(newProfile.categories || []).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No categories added yet</p>
                ) : (
                  <div className="space-y-2">
                    {newProfile.categories
                      ?.sort((a, b) => a.order - b.order)
                      .map((category) => (
                        <div key={category.id} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">{category.description}</div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {category.indicators.length} indicators
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {category.tiles.length} tiles
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {category.visualizations.length} viz
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewProfile((prev) => ({
                                  ...prev,
                                  categories: prev.categories?.filter((c) => c.id !== category.id),
                                }))
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowProfileModal(false)
                setEditingProfile(null)
                setNewProfile({
                  name: "",
                  type: "community",
                  description: "",
                  categories: [],
                  isActive: true,
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProfile} disabled={!newProfile.name}>
              <Save className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Users, BookOpen, Target, Save, Eye } from "lucide-react"

interface Profile {
  id: string
  name: string
  type: "community" | "topic" | "population"
  description: string
  categories: ProfileCategory[]
  isActive: boolean
  createdDate: string
  lastModified: string
}

interface ProfileCategory {
  id: string
  name: string
  description: string
  tiles: string[]
  visualizations: string[]
  order: number
  content?: string
}

const PROFILE_TYPES = [
  { value: "community", label: "Community Profile", icon: Users, description: "Geographic community profiles" },
  {
    value: "topic",
    label: "Topic Profile",
    icon: BookOpen,
    description: "Subject-specific profiles (e.g., Education)",
  },
  { value: "population", label: "Population Profile", icon: Target, description: "Demographic group profiles" },
]

export function ProfilesManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "1",
      name: "Education Profile",
      type: "topic",
      description: "Educational indicators and outcomes",
      categories: [
        {
          id: "1",
          name: "Educational Attainment",
          description: "Degrees and certifications",
          tiles: ["edu_bachelors", "edu_high_school"],
          visualizations: ["single_value", "table"],
          order: 1,
          content: "Educational attainment levels in the community",
        },
        {
          id: "2",
          name: "School Performance",
          description: "K-12 school metrics",
          tiles: ["school_scores", "graduation_rate"],
          visualizations: ["line_geography", "bar_geography"],
          order: 2,
          content: "Performance indicators for local schools",
        },
      ],
      isActive: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "Marion County Community",
      type: "community",
      description: "Comprehensive community overview",
      categories: [
        {
          id: "3",
          name: "Demographics",
          description: "Population characteristics",
          tiles: ["population", "age_distribution"],
          visualizations: ["single_value", "jenks_map"],
          order: 1,
        },
      ],
      isActive: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({
    name: "",
    type: "community",
    description: "",
    categories: [],
    isActive: true,
  })

  const [newCategory, setNewCategory] = useState<Partial<ProfileCategory>>({
    name: "",
    description: "",
    tiles: [],
    visualizations: [],
    order: 1,
    content: "",
  })

  const handleCreateProfile = () => {
    const profile: Profile = {
      id: Date.now().toString(),
      name: newProfile.name || "",
      type: newProfile.type as any,
      description: newProfile.description || "",
      categories: newProfile.categories || [],
      isActive: newProfile.isActive || true,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setProfiles((prev) => [...prev, profile])
    setNewProfile({
      name: "",
      type: "community",
      description: "",
      categories: [],
      isActive: true,
    })
    setShowCreateModal(false)
  }

  const handleAddCategory = (profileId: string) => {
    const category: ProfileCategory = {
      id: Date.now().toString(),
      name: newCategory.name || "",
      description: newCategory.description || "",
      tiles: newCategory.tiles || [],
      visualizations: newCategory.visualizations || [],
      order: newCategory.order || 1,
      content: newCategory.content || "",
    }

    if (profileId === "new") {
      setNewProfile((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), category],
      }))
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, categories: [...p.categories, category] } : p)),
      )
    }

    setNewCategory({
      name: "",
      description: "",
      tiles: [],
      visualizations: [],
      order: 1,
      content: "",
    })
  }

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = (id: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const getProfileTypeConfig = (type: string) => {
    return PROFILE_TYPES.find((t) => t.value === type) || PROFILE_TYPES[0]
  }

  // Mock data for tiles and visualizations
  const availableTiles = [
    "population",
    "age_distribution",
    "edu_bachelors",
    "edu_high_school",
    "school_scores",
    "graduation_rate",
    "poverty_rate",
    "income_median",
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
          <h1 className="text-3xl font-bold">Profiles Management</h1>
          <p className="text-muted-foreground">Create and manage community, topic, and population profiles</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
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
                      placeholder="Enter profile name..."
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

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Profile Type Guidelines</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <strong>Community:</strong> Geographic profiles showing all aspects of a place
                    </div>
                    <div>
                      <strong>Topic:</strong> Subject-focused profiles (Education, Health, Economy)
                    </div>
                    <div>
                      <strong>Population:</strong> Demographic group profiles (Seniors, Youth, etc.)
                    </div>
                  </div>
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
                        placeholder="e.g., Educational Attainment"
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
                      placeholder="Brief description of this category"
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="category-content">Content/Copy</Label>
                    <Textarea
                      id="category-content"
                      value={newCategory.content}
                      onChange={(e) => setNewCategory((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Profile-specific content for this category..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Assigned Tiles</Label>
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                        {availableTiles.map((tile) => (
                          <div key={tile} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`tile-${tile}`}
                              checked={newCategory.tiles?.includes(tile)}
                              onChange={(e) => {
                                const tiles = newCategory.tiles || []
                                const updated = e.target.checked ? [...tiles, tile] : tiles.filter((t) => t !== tile)
                                setNewCategory((prev) => ({ ...prev, tiles: updated }))
                              }}
                            />
                            <Label htmlFor={`tile-${tile}`} className="text-sm">
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
                            <input
                              type="checkbox"
                              id={`viz-${viz}`}
                              checked={newCategory.visualizations?.includes(viz)}
                              onChange={(e) => {
                                const visualizations = newCategory.visualizations || []
                                const updated = e.target.checked
                                  ? [...visualizations, viz]
                                  : visualizations.filter((v) => v !== viz)
                                setNewCategory((prev) => ({ ...prev, visualizations: updated }))
                              }}
                            />
                            <Label htmlFor={`viz-${viz}`} className="text-sm">
                              {viz.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="mt-4" onClick={() => handleAddCategory("new")} disabled={!newCategory.name}>
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
                        .map((category, index) => (
                          <div key={category.id} className="p-3 border rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-muted-foreground">{category.description}</div>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {category.tiles.length} tiles
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {category.visualizations.length} visualizations
                                  </Badge>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
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
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
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

      {/* Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Templates ({profiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => {
                const typeConfig = getProfileTypeConfig(profile.type)
                const Icon = typeConfig.icon
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {profile.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeConfig.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{profile.categories.length}</span>
                        <div className="flex flex-wrap gap-1">
                          {profile.categories.slice(0, 2).map((cat) => (
                            <Badge key={cat.id} variant="secondary" className="text-xs">
                              {cat.name}
                            </Badge>
                          ))}
                          {profile.categories.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{profile.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.isActive ? "default" : "secondary"}>
                        {profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(profile.lastModified).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingProfile(profile)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(profile.id)}>
                          {profile.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteProfile(profile.id)}>
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

"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, Search, Folder, FolderOpen, FileText, Trash2, Edit, ChevronRight, ChevronDown } from "lucide-react"

interface Indicator {
  id: string
  name: string
  category1: string
  category2: string
  category3: string
  category4: string | null
}

interface Group {
  id: string
  name: string
  level: number
  parent?: string
  indicators: string[]
  children: string[]
  expanded?: boolean
}

interface IndicatorGroupingProps {
  indicators: Indicator[]
  groups: Group[]
  onUpdateGroups: (groups: Group[]) => void
}

export function IndicatorGrouping({ indicators, groups, onUpdateGroups }: IndicatorGroupingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedParentGroup, setSelectedParentGroup] = useState<string>("")

  // Get ungrouped indicators
  const groupedIndicatorIds = new Set(groups.flatMap((g) => g.indicators))
  const ungroupedIndicators = indicators.filter((i) => !groupedIndicatorIds.has(i.id))

  // Filter ungrouped indicators by search
  const filteredUngroupedIndicators = ungroupedIndicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const { source, destination, draggableId } = result

      // Handle moving indicators to groups
      if (destination.droppableId.startsWith("group-")) {
        const groupId = destination.droppableId.replace("group-", "")
        const updatedGroups = groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              indicators: [...group.indicators, draggableId],
            }
          }
          return group
        })
        onUpdateGroups(updatedGroups)
      }

      // Handle reordering within groups
      if (source.droppableId === destination.droppableId && source.droppableId.startsWith("group-")) {
        const groupId = source.droppableId.replace("group-", "")
        const updatedGroups = groups.map((group) => {
          if (group.id === groupId) {
            const newIndicators = Array.from(group.indicators)
            const [reorderedItem] = newIndicators.splice(source.index, 1)
            newIndicators.splice(destination.index, 0, reorderedItem)
            return {
              ...group,
              indicators: newIndicators,
            }
          }
          return group
        })
        onUpdateGroups(updatedGroups)
      }
    },
    [groups, onUpdateGroups],
  )

  const createNewGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      level: selectedParentGroup ? (groups.find((g) => g.id === selectedParentGroup)?.level || 0) + 1 : selectedLevel,
      parent: selectedParentGroup || undefined,
      indicators: [],
      children: [],
    }

    // Update parent group's children if applicable
    const updatedGroups = selectedParentGroup
      ? groups.map((group) =>
          group.id === selectedParentGroup ? { ...group, children: [...group.children, newGroup.id] } : group,
        )
      : groups

    onUpdateGroups([...updatedGroups, newGroup])
    setNewGroupName("")
    setSelectedParentGroup("")
  }

  const deleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((g) => g.id !== groupId)
    onUpdateGroups(updatedGroups)
  }

  const removeIndicatorFromGroup = (groupId: string, indicatorId: string) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, indicators: group.indicators.filter((id) => id !== indicatorId) } : group,
    )
    onUpdateGroups(updatedGroups)
  }

  const renderGroupHierarchy = (parentId?: string, level = 1) => {
    const childGroups = groups.filter((g) => g.parent === parentId)

    return childGroups.map((group) => (
      <div key={group.id} className="space-y-2">
        <Droppable droppableId={`group-${group.id}`}>
          {(provided, snapshot) => (
            <Card
              className={`ml-${(level - 1) * 4} transition-colors ${
                snapshot.isDraggingOver ? "bg-blue-50 border-blue-300" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleGroupExpansion(group.id)}>
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    {expandedGroups.has(group.id) ? (
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Folder className="w-4 h-4 text-blue-600" />
                    )}
                    <CardTitle className="text-sm">{group.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Level {group.level}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {group.indicators.length} indicators
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteGroup(group.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedGroups.has(group.id) && (
                <CardContent
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-md p-2"
                >
                  <div className="space-y-2">
                    {group.indicators.map((indicatorId, index) => {
                      const indicator = indicators.find((i) => i.id === indicatorId)
                      if (!indicator) return null

                      return (
                        <Draggable key={indicatorId} draggableId={indicatorId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-2 bg-white border rounded-md shadow-sm ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">{indicator.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {indicator.category1}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeIndicatorFromGroup(group.id, indicatorId)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                    {group.indicators.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-8">
                        Drag indicators here to add them to this group
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </Droppable>

        {/* Render child groups recursively */}
        {renderGroupHierarchy(group.id, level + 1)}
      </div>
    ))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Indicator Grouping</h2>
            <p className="text-muted-foreground">Organize indicators into hierarchical groups</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Group Name</label>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Parent Group (Optional)</label>
                  <Select value={selectedParentGroup} onValueChange={setSelectedParentGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent group..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Top Level)</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} (Level {group.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!selectedParentGroup && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Level</label>
                    <Select
                      value={selectedLevel.toString()}
                      onValueChange={(v) => setSelectedLevel(Number.parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={createNewGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ungrouped Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ungrouped Indicators ({filteredUngroupedIndicators.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search indicators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="ungrouped-indicators">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 max-h-96 overflow-y-auto"
                  >
                    {filteredUngroupedIndicators.map((indicator, index) => (
                      <Draggable key={indicator.id} draggableId={indicator.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-md bg-white cursor-move ${
                              snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{indicator.name}</div>
                                <div className="flex gap-1 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {indicator.category1}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {indicator.category2}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Group Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Group Hierarchy ({groups.length} groups)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {groups.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No groups created yet. Create your first group to get started.
                  </div>
                ) : (
                  renderGroupHierarchy()
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DragDropContext>
  )
}

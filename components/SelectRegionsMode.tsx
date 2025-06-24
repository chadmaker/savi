"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Check, Edit3, Square, Pentagon, Circle, Trash2 } from "lucide-react"
import type { BrowseNode, GeographyArea, BrowseCategory, DrawShape } from "../types/geography"

interface SelectRegionsModeProps {
  browseCategory: BrowseCategory
  browseTree: BrowseNode[]
  onCategoryChange: (category: BrowseCategory) => void
  onSelectArea: (area: GeographyArea) => void
  selectedAreas: GeographyArea[]
  isDrawMode: boolean
  onToggleDrawMode: () => void
  activeDrawTool: string | null
  onSetActiveDrawTool: (tool: string | null) => void
  onAddShape: (shape: DrawShape) => void
  onClearAllShapes: () => void
  drawnShapes: DrawShape[]
}

const categoryLabels: Record<BrowseCategory, string> = {
  counties: "Counties",
  metro: "Metro Areas",
  zip: "ZIP Codes",
  school: "School Districts",
  township: "Townships",
  neighborhood: "Neighborhoods",
}

export function SelectRegionsMode({
  browseCategory,
  browseTree,
  onCategoryChange,
  onSelectArea,
  selectedAreas,
  isDrawMode,
  onToggleDrawMode,
  activeDrawTool,
  onSetActiveDrawTool,
  onAddShape,
  onClearAllShapes,
  drawnShapes,
}: SelectRegionsModeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["indiana-" + browseCategory]))

  const selectedIds = new Set(selectedAreas.map((a) => a.id))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const handleSelectNode = (node: BrowseNode) => {
    const area: GeographyArea = {
      id: node.id,
      name: node.name,
      type: node.type as any,
    }
    onSelectArea(area)
  }

  const handleToolClick = (toolId: string) => {
    if (activeDrawTool === toolId) {
      onSetActiveDrawTool(null)
    } else {
      onSetActiveDrawTool(toolId)
      // Simulate drawing a shape after a short delay
      setTimeout(() => {
        const newShape: DrawShape = {
          id: `shape-${Date.now()}`,
          type: toolId as any,
          coordinates: [
            [0, 0],
            [1, 1],
          ], // Mock coordinates
          name: `Custom ${toolId.charAt(0).toUpperCase() + toolId.slice(1)} ${drawnShapes.length + 1}`,
        }
        onAddShape(newShape)
        onSetActiveDrawTool(null)
      }, 1000)
    }
  }

  const renderNode = (node: BrowseNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedIds.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isSelectable = !hasChildren || depth > 0
    const isIndianaRoot = depth === 0 && node.name === "Indiana"

    // For Indiana root node, check if all children are selected
    const allChildrenSelected =
      isIndianaRoot && hasChildren && node.children!.every((child) => selectedIds.has(child.id))

    const handleSelectAllChildren = () => {
      if (isIndianaRoot && hasChildren) {
        if (allChildrenSelected) {
          // Deselect all children
          node.children!.forEach((child) => {
            const area: GeographyArea = {
              id: child.id,
              name: child.name,
              type: child.type as any,
            }
            // Remove from selection (this will need to be handled by parent component)
          })
        } else {
          // Select all children
          node.children!.forEach((child) => {
            const area: GeographyArea = {
              id: child.id,
              name: child.name,
              type: child.type as any,
            }
            onSelectArea(area)
          })
        }
      }
    }

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {hasChildren && (
            <button onClick={() => toggleNode(node.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-5 h-5"></div>}

          {(isSelectable || isIndianaRoot) && (
            <button
              onClick={isIndianaRoot ? handleSelectAllChildren : () => handleSelectNode(node)}
              className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                isSelected || allChildrenSelected
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              {(isSelected || allChildrenSelected) && <Check className="w-3 h-3" />}
            </button>
          )}
          {!isSelectable && !isIndianaRoot && <div className="w-4 h-4"></div>}

          <span className="text-sm text-gray-700 flex-1">{node.name}</span>
          <span className="text-xs text-gray-500 capitalize">{node.type}</span>
        </div>

        {isExpanded && hasChildren && <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Browse by:</label>
        <select
          value={browseCategory}
          onChange={(e) => onCategoryChange(e.target.value as BrowseCategory)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {(Object.keys(categoryLabels) as BrowseCategory[]).map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </select>
      </div>

      {/* Draw Mode Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Select Regions</h4>
        <button
          onClick={onToggleDrawMode}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
            isDrawMode ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Draw
        </button>
      </div>

      {/* Draw Tools (when draw mode is active) */}
      {isDrawMode && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rectangle", name: "Rectangle", icon: Square },
              { id: "polygon", name: "Polygon", icon: Pentagon },
              { id: "circle", name: "Circle", icon: Circle },
            ].map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border transition-colors ${
                    activeDrawTool === tool.id
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tool.name}</span>
                </button>
              )
            })}
          </div>
          <button
            onClick={onClearAllShapes}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full justify-center transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Shapes
          </button>
        </div>
      )}

      {/* Browse Tree */}
      <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
        {browseTree.map((node) => renderNode(node))}
      </div>
    </div>
  )
}

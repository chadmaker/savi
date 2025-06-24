"use client"

import { useState } from "react"

import { ChevronRight, ChevronDown, Check } from "lucide-react"
import type { BrowseNode, GeographyArea, BrowseCategory } from "../types/geography"
import { indianaBrowseData } from "../data/mockData"

interface BrowseModeProps {
  browseCategory: BrowseCategory
  onCategoryChange: (category: BrowseCategory) => void
  onSelectArea: (area: GeographyArea) => void
  selectedAreas: GeographyArea[]
}

const categoryLabels: Record<BrowseCategory, string> = {
  counties: "Counties",
  metro: "Metro Areas",
  zip: "ZIP Codes",
  school: "School Districts",
  township: "Townships",
  neighborhood: "Neighborhoods",
}

export function BrowseMode({ browseCategory, onCategoryChange, onSelectArea, selectedAreas }: BrowseModeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["indiana-" + browseCategory]))

  const currentTree = indianaBrowseData[browseCategory] || []
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

  const handleCategoryChange = (category: BrowseCategory) => {
    onCategoryChange(category)
    setExpandedNodes(new Set(["indiana-" + category]))
  }

  const handleSelectNode = (node: BrowseNode) => {
    const area: GeographyArea = {
      id: node.id,
      name: node.name,
      type: node.type as any,
    }
    onSelectArea(area)
  }

  const renderNode = (node: BrowseNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedIds.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isSelectable = !hasChildren || depth > 0 // Don't allow selecting root Indiana node

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren && (
            <button onClick={() => toggleNode(node.id)} className="p-0.5 hover:bg-gray-200 rounded">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-4 h-4"></div>}

          {isSelectable && (
            <button
              onClick={() => handleSelectNode(node)}
              className={`w-4 h-4 border rounded flex items-center justify-center ${
                isSelected ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 hover:border-teal-400"
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
            </button>
          )}
          {!isSelectable && <div className="w-4 h-4"></div>}

          <span className="text-sm text-gray-700 flex-1">{node.name}</span>
          <span className="text-xs text-gray-500 capitalize">{node.type}</span>
        </div>

        {isExpanded && hasChildren && <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Picker */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Browse by:</h4>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(categoryLabels) as BrowseCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                browseCategory === category
                  ? "bg-teal-100 border-teal-300 text-teal-700"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Instructions</h4>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Choose a category to browse. Expand IN ▶ your category ▶ subregions. Check up to 5 items; uncheck to remove.
          </p>
        </div>
      </div>

      {/* Dynamic Tree */}
      <div className="border border-gray-200 rounded-md max-h-80 overflow-y-auto">
        {currentTree.map((node) => renderNode(node))}
      </div>

      {/* Selection Count */}
      {selectedAreas.length > 0 && (
        <div className="text-sm text-gray-600">
          {selectedAreas.length} of 5 selected from {categoryLabels[browseCategory].toLowerCase()}
        </div>
      )}
    </div>
  )
}

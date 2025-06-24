"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Check, Search, X } from "lucide-react"
import type { BrowseNode, GeographyArea, BrowseCategory } from "../types/geography"

interface SelectModeProps {
  browseCategory: BrowseCategory
  browseTree: BrowseNode[]
  onCategoryChange: (category: BrowseCategory) => void
  onSelectArea: (area: GeographyArea) => void
  selectedAreas: GeographyArea[]
  onClearAll: () => void
  onRemoveArea: (id: string) => void
}

const categoryLabels: Record<BrowseCategory, string> = {
  counties: "Counties",
  metro: "Metro Areas",
  zip: "ZIP Codes",
  school: "School Districts",
  township: "Townships",
  neighborhood: "Neighborhoods",
}

export function SelectMode({
  browseCategory,
  browseTree,
  onCategoryChange,
  onSelectArea,
  selectedAreas,
  onClearAll,
  onRemoveArea,
}: SelectModeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["indiana-" + browseCategory]))
  const [treeSearchQuery, setTreeSearchQuery] = useState("")

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

  const filterNodes = (nodes: BrowseNode[], query: string): BrowseNode[] => {
    if (!query) return nodes

    return nodes
      .map((node) => {
        const matchesQuery = node.name.toLowerCase().includes(query.toLowerCase())
        const filteredChildren = node.children ? filterNodes(node.children, query) : []

        if (matchesQuery || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          }
        }
        return null
      })
      .filter(Boolean) as BrowseNode[]
  }

  const filteredTree = filterNodes(browseTree, treeSearchQuery)

  const renderNode = (node: BrowseNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedIds.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
          {hasChildren && (
            <button onClick={() => toggleNode(node.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-5 h-5"></div>}

          <button
            onClick={() => handleSelectNode(node)}
            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
              isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
          </button>

          <span className="text-sm text-gray-700 flex-1">{node.name}</span>
          <span className="text-xs text-gray-500 capitalize">{node.type}</span>
        </div>

        {isExpanded && hasChildren && <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>}
      </div>
    )
  }

  // Get the children of Indiana node directly
  const directNodes = filteredTree.length > 0 && filteredTree[0].children ? filteredTree[0].children : []

  return (
    <div className="space-y-6">
      {/* Boundary View Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Boundary view:</label>
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

      {/* Selected Regions List */}
      {selectedAreas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Selected</h4>
            <button onClick={onClearAll} className="text-xs text-gray-500 hover:text-red-600 transition-colors">
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {selectedAreas.map((area) => (
              <div
                key={area.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-900">{area.name}</span>
                <button
                  onClick={() => onRemoveArea(area.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tree Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search within tree..."
          value={treeSearchQuery}
          onChange={(e) => setTreeSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Browse Tree */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">All {categoryLabels[browseCategory]}</span>
          <button
            onClick={() => {
              const allSelected = directNodes.every((node) => selectedIds.has(node.id))
              if (allSelected) {
                directNodes.forEach((node) => onRemoveArea(node.id))
              } else {
                directNodes.forEach((node) => {
                  const area: GeographyArea = { id: node.id, name: node.name, type: node.type as any }
                  onSelectArea(area)
                })
              }
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {directNodes.every((node) => selectedIds.has(node.id)) ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
          {directNodes.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  )
}

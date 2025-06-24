"use client"

import { Pentagon, Circle, X, Hand, MousePointer } from "lucide-react"
import type { DrawShape, GeographyArea, BrowseCategory } from "../types/geography"

interface DrawModeProps {
  drawnShapes: DrawShape[]
  activeDrawTool: string | null
  onSetActiveDrawTool: (tool: string | null) => void
  onClearAllShapes: () => void
  onAddShape: (shape: DrawShape) => void
  selectedAreas: GeographyArea[]
  onClearAll: () => void
  onRemoveArea: (id: string) => void
  browseCategory: BrowseCategory
  onCategoryChange: (category: BrowseCategory) => void
}

const categoryLabels: Record<BrowseCategory, string> = {
  counties: "Counties",
  metro: "Metro Areas",
  zip: "ZIP Codes",
  school: "School Districts",
  township: "Townships",
  neighborhood: "Neighborhoods",
}

export function DrawMode({
  drawnShapes,
  activeDrawTool,
  onSetActiveDrawTool,
  onClearAllShapes,
  onAddShape,
  selectedAreas,
  onClearAll,
  onRemoveArea,
  browseCategory,
  onCategoryChange,
}: DrawModeProps) {
  const tools = [
    { id: "toggle", name: "Map Toggle", icon: MousePointer },
    { id: "rectangle", name: "Freehand", icon: Hand },
    { id: "polygon", name: "Connect Dots", icon: Pentagon },
    { id: "circle", name: "Radius", icon: Circle },
  ]

  const handleToolClick = (toolId: string) => {
    if (activeDrawTool === toolId) {
      onSetActiveDrawTool(null)
    } else {
      onSetActiveDrawTool(toolId)
      // Simulate drawing a shape after a short delay (except for toggle)
      if (toolId !== "toggle") {
        setTimeout(() => {
          const newShape: DrawShape = {
            id: `shape-${Date.now()}`,
            type: toolId as any,
            coordinates: [
              [0, 0],
              [1, 1],
            ], // Mock coordinates
            name: `${toolId.charAt(0).toUpperCase() + toolId.slice(1)} ${drawnShapes.length + 1}`,
          }
          onAddShape(newShape)
          onSetActiveDrawTool(null)
        }, 1000)
      }
    }
  }

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

      {/* Map Tools */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Map Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-lg border transition-colors ${
                  activeDrawTool === tool.id
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tool.name}</span>
              </button>
            )
          })}
        </div>
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

      {/* Drawn Shapes List */}
      {drawnShapes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Drawn Shapes</h4>
          <div className="space-y-1">
            {drawnShapes.map((shape) => (
              <div key={shape.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{shape.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDrawTool && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {activeDrawTool === "toggle" ? (
            <p className="text-sm text-blue-700">Click boundaries on the map to toggle selection...</p>
          ) : (
            <p className="text-sm text-blue-700">Click and drag on the map to draw a {activeDrawTool}...</p>
          )}
        </div>
      )}
    </div>
  )
}

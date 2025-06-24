"use client"

import { ToggleLeft, ToggleRight } from "lucide-react"
import type { MapLayer, GeographyArea } from "../types/geography"

interface MapToggleModeProps {
  mapLayers: MapLayer[]
  mapToggleSelection: GeographyArea | null
  onToggleLayer: (layerId: string) => void
  onSelectBoundary: (boundary: GeographyArea) => void
}

export function MapToggleMode({ mapLayers, mapToggleSelection, onToggleLayer, onSelectBoundary }: MapToggleModeProps) {
  const enabledLayers = mapLayers.filter((l) => l.enabled)
  const hasEnabledLayer = enabledLayers.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Boundary Layers</h4>
        <div className="space-y-3">
          {mapLayers.map((layer) => (
            <div key={layer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{layer.name}</span>
                <span className="text-xs text-gray-500">({layer.boundaries.length} available)</span>
              </div>
              <button onClick={() => onToggleLayer(layer.id)} className="flex items-center gap-2">
                {layer.enabled ? (
                  <ToggleRight className="w-5 h-5 text-teal-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Instructions</h4>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Toggle exactly one layer ON, then click its boundary on the map to select it. Selecting another boundary or
            layer will automatically clear your prior choice.
          </p>
        </div>
      </div>

      {mapToggleSelection && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected from Map (1 of 1)</h4>
          <div className="px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-teal-800">{mapToggleSelection.name}</span>
                <span className="text-xs text-teal-600 ml-2 capitalize">({mapToggleSelection.type})</span>
              </div>
              <button
                onClick={() => onSelectBoundary(mapToggleSelection)}
                className="text-xs text-teal-700 hover:text-teal-900 underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

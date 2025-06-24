"use client"

import { useState } from "react"
import type { GeographyArea } from "../types/geography"

interface MapViewProps {
  committedAreas: GeographyArea[]
  draftAreas: GeographyArea[]
  onBoundaryClick?: (boundary: GeographyArea) => void
}

export function MapView({ committedAreas, draftAreas, onBoundaryClick }: MapViewProps) {
  const [hoveredBoundary, setHoveredBoundary] = useState<string | null>(null)

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-200 relative overflow-hidden">
      {/* Simulated base map */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300"></div>
        {/* Base map features */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-6 bg-indigo-200 rounded opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/4 w-6 h-10 bg-purple-200 rounded opacity-60"></div>
      </div>

      {/* Committed areas (solid blue) */}
      {committedAreas.map((area, index) => (
        <div
          key={area.id}
          className="absolute bg-blue-500 opacity-80 rounded-lg border-2 border-blue-600 cursor-pointer transition-all hover:scale-105"
          style={{
            top: `${20 + index * 15}%`,
            left: `${30 + index * 10}%`,
            width: "80px",
            height: "60px",
          }}
          onClick={() => onBoundaryClick?.(area)}
          onMouseEnter={() => setHoveredBoundary(area.id)}
          onMouseLeave={() => setHoveredBoundary(null)}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded shadow-sm">
            {area.name.split(",")[0]}
          </div>
          {hoveredBoundary === area.id && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
              Click to deselect
            </div>
          )}
        </div>
      ))}

      {/* Draft areas (semi-transparent blue) */}
      {draftAreas.map((area, index) => (
        <div
          key={area.id}
          className="absolute bg-blue-300 opacity-60 rounded-lg border-2 border-blue-400 border-dashed cursor-pointer transition-all hover:scale-105"
          style={{
            top: `${40 + index * 12}%`,
            right: `${20 + index * 8}%`,
            width: "70px",
            height: "50px",
          }}
          onClick={() => onBoundaryClick?.(area)}
          onMouseEnter={() => setHoveredBoundary(area.id)}
          onMouseLeave={() => setHoveredBoundary(null)}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow-sm">
            {area.name.split(",")[0]}
          </div>
          {hoveredBoundary === area.id && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
              Click to select
            </div>
          )}
        </div>
      ))}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
        ESRI Base Map
      </div>
    </div>
  )
}

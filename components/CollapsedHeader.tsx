"use client"

import { X, ChevronDown } from "lucide-react"
import type { GeographyArea } from "../types/geography"

interface CollapsedHeaderProps {
  areas: GeographyArea[]
  onRemoveArea: (id: string) => void
  onExpand: () => void
  savedCommunityName?: string | null
}

export function CollapsedHeader({ areas, onRemoveArea, onExpand, savedCommunityName }: CollapsedHeaderProps) {
  const maxDisplayAreas = 2 // Show max 2 areas before truncating
  const displayAreas = areas.slice(0, maxDisplayAreas)
  const remainingCount = areas.length - maxDisplayAreas
  const canAddMore = areas.length < 5
  const hasCommunity = areas.length > 0

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex-1">
        {/* Header Label */}
        <div className="mb-2">
          <span className="text-base font-semibold text-gray-700">Active Community</span>
        </div>

        {/* Pin, Chips, and Button Row */}
        <div className="flex flex-wrap items-center gap-2">
          {displayAreas.length === 0 ? (
            <button
              onClick={onExpand}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50 transition-colors"
            >
              Add Community
            </button>
          ) : (
            <>
              {savedCommunityName ? (
                // Show saved community name as a single chip
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-800 text-sm rounded-full border border-green-200">
                  <span>{savedCommunityName}</span>
                  <button
                    onClick={() => {
                      // Clear all areas when removing saved community
                      areas.forEach((area) => onRemoveArea(area.id))
                    }}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                // Show individual area chips
                <>
                  {displayAreas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-800 text-sm rounded-full border border-blue-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{area.name}</span>
                      <button
                        onClick={() => onRemoveArea(area.id)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {remainingCount > 0 && (
                    <button
                      onClick={onExpand}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {remainingCount} more
                    </button>
                  )}
                </>
              )}

              {canAddMore && (
                <div className="group relative">
                  <button
                    onClick={onExpand}
                    className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Change Community
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3x wider map thumbnail */}
      <div className="w-60 h-20 bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center">
        <div className="w-56 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {areas.length > 0 ? (
            <div className="absolute inset-0">
              {areas.slice(0, 3).map((area, index) => (
                <div
                  key={area.id}
                  className="absolute bg-blue-500 opacity-70 rounded"
                  style={{
                    top: `${10 + index * 8}%`,
                    left: `${15 + index * 10}%`,
                    width: `${30 + index * 5}%`,
                    height: `${25 + index * 5}%`,
                  }}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs text-blue-700">Map</span>
          )}
        </div>
      </div>
    </div>
  )
}

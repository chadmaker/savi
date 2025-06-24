"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, MapPin, Hash, Building, X } from "lucide-react"
import type { GeographyArea, RecentSelection } from "../types/geography"

interface SearchModeProps {
  searchQuery: string
  searchResults: GeographyArea[]
  onSearch: (query: string) => void
  onSelectArea: (area: GeographyArea) => void
  selectedAreas: GeographyArea[]
  recentSelections: RecentSelection[]
  onClearAll: () => void
  onRemoveArea: (id: string) => void
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "county":
      return <MapPin className="w-4 h-4" />
    case "zip":
      return <Hash className="w-4 h-4" />
    case "school":
      return <Building className="w-4 h-4" />
    default:
      return <MapPin className="w-4 h-4" />
  }
}

const groupResultsByType = (results: GeographyArea[]) => {
  const groups: Record<string, GeographyArea[]> = {}
  const typeOrder = ["state", "metro", "county", "city", "zip", "school", "township", "neighborhood"]

  results.forEach((result) => {
    const type = result.type
    if (!groups[type]) groups[type] = []
    groups[type].push(result)
  })

  return typeOrder
    .filter((type) => groups[type])
    .map((type) => ({
      type,
      label:
        type === "metro"
          ? "Metro Areas"
          : type === "zip"
            ? "ZIP Codes"
            : `${type.charAt(0).toUpperCase() + type.slice(1)}s`,
      results: groups[type],
    }))
}

export function SearchMode({
  searchQuery,
  searchResults,
  onSearch,
  onSelectArea,
  selectedAreas,
  recentSelections,
  onClearAll,
  onRemoveArea,
}: SearchModeProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [showRecommended, setShowRecommended] = useState(true)

  const defaultRecommendedAreas: GeographyArea[] = [
    { id: "indiana-state", name: "Indiana State", type: "state", hierarchyPath: "United States ▶ State" },
    { id: "indianapolis-metro-rec", name: "Indianapolis Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
    { id: "evansville-metro-rec", name: "Evansville Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
    { id: "marion-county-rec", name: "Marion County", type: "county", hierarchyPath: "Indiana ▶ County" },
  ]

  // Combine recent searches with default recommendations, removing duplicates
  const recommendedAreas = useMemo(() => {
    const recentAreas = recentSelections.slice(0, 3).map((r) => r.area)
    const combined = [...recentAreas, ...defaultRecommendedAreas]
    const seen = new Set()
    return combined
      .filter((area) => {
        const key = area.name.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 6)
  }, [recentSelections])

  const hasRecentSearches = recentSelections.length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = recentSelections.length + searchResults.length
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      if (selectedIndex < recentSelections.length) {
        onSelectArea(recentSelections[selectedIndex].area)
      } else {
        onSelectArea(searchResults[selectedIndex - recentSelections.length])
      }
      onSearch("")
      setSelectedIndex(-1)
    }
  }

  const groupedResults = groupResultsByType(searchResults)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="City, ZIP, County, School District…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
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
                <div className="flex items-center gap-2">
                  {getTypeIcon(area.type)}
                  <span className="text-sm text-gray-900">{area.name}</span>
                </div>
                <button
                  onClick={() => onRemoveArea(area.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
              <span className="text-sm">Search to add another region</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Areas */}
      {showRecommended && searchQuery.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">{hasRecentSearches ? "Recent & Popular" : "Popular"}</h4>
            <button
              onClick={() => setShowRecommended(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recommendedAreas.map((area, index) => {
              const isRecent = index < recentSelections.length && hasRecentSearches
              const getBoundaryChip = (type: string) => {
                const chipStyles = "text-xs px-2 py-0.5 rounded-full"
                switch (type) {
                  case "state":
                    return <span className={`${chipStyles} bg-purple-100 text-purple-700`}>State</span>
                  case "metro":
                    return <span className={`${chipStyles} bg-blue-100 text-blue-700`}>Metro</span>
                  case "county":
                    return <span className={`${chipStyles} bg-green-100 text-green-700`}>County</span>
                  default:
                    return <span className={`${chipStyles} bg-gray-100 text-gray-700`}>{type}</span>
                }
              }

              return (
                <button
                  key={area.id}
                  onClick={() => onSelectArea(area)}
                  className="flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{area.name}</span>
                      {getBoundaryChip(area.type)}
                      {isRecent && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Recent</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery.length > 0 && (recentSelections.length > 0 || searchResults.length > 0) && (
        <div className="border border-gray-200 rounded-lg shadow-sm max-h-60 overflow-y-auto">
          {/* Recent Results */}
          {recentSelections.length > 0 && searchQuery.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Recent</span>
              </div>
              {recentSelections.slice(0, 3).map((recent, index) => (
                <button
                  key={recent.area.id}
                  onClick={() => {
                    onSelectArea(recent.area)
                    onSearch("")
                    setSelectedIndex(-1)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="text-gray-500">{getTypeIcon(recent.area.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{recent.area.name}</div>
                    <div className="text-xs text-gray-500">{recent.area.hierarchyPath}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Grouped Results */}
          {groupedResults.map((group) => (
            <div key={group.type}>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{group.label}</span>
              </div>
              {group.results.map((result, index) => {
                const globalIndex = recentSelections.length + searchResults.indexOf(result)
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      onSelectArea(result)
                      onSearch("")
                      setSelectedIndex(-1)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      globalIndex === selectedIndex ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="text-gray-500">{getTypeIcon(result.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.hierarchyPath}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

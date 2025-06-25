"use client"

import { useState, useCallback, useMemo } from "react"
import { X, ChevronDown, Search, MapPin, Hash, Building, RotateCcw } from "lucide-react"

// Types
interface GeographyArea {
  id: string
  name: string
  type:
    | "state"
    | "metro"
    | "county"
    | "city"
    | "zip"
    | "tract"
    | "blockgroup"
    | "school"
    | "township"
    | "neighborhood"
    | "drawn"
  geometry?: any
  hierarchyPath?: string
  coordinates?: number[][]
  selected?: boolean
}

interface DrawShape {
  id: string
  type: "rectangle" | "polygon" | "circle"
  coordinates: number[][]
  name: string
}

interface SavedCommunity {
  id: string
  name: string
  date: string
  project: string
  notes?: string
  geoId?: number
  areas: GeographyArea[]
  thumbnail: string
  type: string
  starred?: boolean
  population?: number
}

interface BrowseNode {
  id: string
  name: string
  type: string
  children?: BrowseNode[]
  selected?: boolean
  expanded?: boolean
  geometry?: number[][]
}

interface RecentSelection {
  area: GeographyArea
  timestamp: number
}

type SelectorMode = "search" | "select" | "draw" | "saved"
type BrowseCategory = "counties" | "metro" | "zip" | "school" | "township" | "neighborhood"

// Mock Data
const mockSearchResults: GeographyArea[] = [
  { id: "in-state", name: "Indiana", type: "state", hierarchyPath: "United States ▶ State" },
  { id: "indy-metro", name: "Indianapolis Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
  {
    id: "central-in-township",
    name: "Central Indiana Township",
    type: "township",
    hierarchyPath: "Marion County ▶ Township",
  },
  { id: "ips", name: "Indianapolis Public Schools", type: "school", hierarchyPath: "Marion County ▶ School District" },
  { id: "indianapolis", name: "Indianapolis", type: "city", hierarchyPath: "Marion County, IN ▶ City" },
  { id: "46240", name: "46240", type: "zip", hierarchyPath: "Indianapolis, IN ▶ ZIP Code" },
  { id: "46220", name: "46220", type: "zip", hierarchyPath: "Indianapolis, IN ▶ ZIP Code" },
  { id: "hamilton-county", name: "Hamilton County", type: "county", hierarchyPath: "Indiana ▶ County" },
  { id: "marion-county", name: "Marion County", type: "county", hierarchyPath: "Indiana ▶ County" },
]

const indianaBrowseData: Record<BrowseCategory, BrowseNode[]> = {
  counties: [
    {
      id: "indiana-counties",
      name: "Indiana",
      type: "state",
      children: [
        { id: "marion-county-browse", name: "Marion County", type: "county" },
        { id: "hamilton-county-browse", name: "Hamilton County", type: "county" },
        { id: "hendricks-county-browse", name: "Hendricks County", type: "county" },
        { id: "johnson-county-browse", name: "Johnson County", type: "county" },
      ],
    },
  ],
  metro: [
    {
      id: "indiana-metro",
      name: "Indiana",
      type: "state",
      children: [
        { id: "indianapolis-metro", name: "Indianapolis-Carmel-Anderson", type: "metro" },
        { id: "south-bend-metro", name: "South Bend-Mishawaka", type: "metro" },
        { id: "fort-wayne-metro", name: "Fort Wayne", type: "metro" },
        { id: "evansville-metro", name: "Evansville", type: "metro" },
      ],
    },
  ],
  zip: [
    {
      id: "indiana-zip",
      name: "Indiana",
      type: "state",
      children: [
        { id: "46201", name: "46201", type: "zip" },
        { id: "46202", name: "46202", type: "zip" },
        { id: "46220", name: "46220", type: "zip" },
        { id: "46240", name: "46240", type: "zip" },
      ],
    },
  ],
  school: [
    {
      id: "indiana-school",
      name: "Indiana",
      type: "state",
      children: [
        { id: "ips-browse", name: "Indianapolis Public Schools", type: "school" },
        { id: "warren-schools", name: "Warren Township Schools", type: "school" },
        { id: "carmel-schools", name: "Carmel Clay Schools", type: "school" },
      ],
    },
  ],
  township: [
    {
      id: "indiana-township",
      name: "Indiana",
      type: "state",
      children: [
        { id: "center-township", name: "Center Township", type: "township" },
        { id: "warren-township", name: "Warren Township", type: "township" },
        { id: "lawrence-township", name: "Lawrence Township", type: "township" },
      ],
    },
  ],
  neighborhood: [
    {
      id: "indiana-neighborhood",
      name: "Indiana",
      type: "state",
      children: [
        { id: "broad-ripple", name: "Broad Ripple", type: "neighborhood" },
        { id: "fountain-square", name: "Fountain Square", type: "neighborhood" },
        { id: "mass-ave", name: "Mass Ave", type: "neighborhood" },
      ],
    },
  ],
}

const mockProjects = ["Housing Analysis", "Transportation Study", "Economic Development", "Education Planning"]

const mockSavedCommunities: SavedCommunity[] = [
  {
    id: "community-1",
    name: "Central Indianapolis Metro",
    date: "2024-01-15",
    project: "Housing Analysis",
    population: 2100000,
    type: "Metro",
    starred: true,
    thumbnail: "metro-thumbnail",
    areas: [{ id: "indy-metro", name: "Indianapolis Metro", type: "metro" }],
  },
  {
    id: "community-2",
    name: "North Side Schools District",
    date: "2024-01-10",
    project: "Education Planning",
    population: 45000,
    type: "School",
    thumbnail: "school-thumbnail",
    areas: [{ id: "ips", name: "Indianapolis Public Schools", type: "school" }],
  },
]

// Utility functions
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

const categoryLabels: Record<BrowseCategory, string> = {
  counties: "Counties",
  metro: "Metro Areas",
  zip: "ZIP Codes",
  school: "School Districts",
  township: "Townships",
  neighborhood: "Neighborhoods",
}

// Main Hook
function useGeographySelector() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentMode, setCurrentMode] = useState<SelectorMode>("search")
  const [committedAreas, setCommittedAreas] = useState<GeographyArea[]>([
    { id: "marion-initial", name: "Marion County, IN", type: "county" },
  ])
  const [draftAreas, setDraftAreas] = useState<GeographyArea[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GeographyArea[]>([])
  const [drawnShapes, setDrawnShapes] = useState<DrawShape[]>([])
  const [browseTree, setBrowseTree] = useState<BrowseNode[]>(indianaBrowseData.metro)
  const [activeDrawTool, setActiveDrawTool] = useState<string | null>(null)
  const [browseCategory, setBrowseCategory] = useState<BrowseCategory>("metro")
  const [savedCommunities, setSavedCommunities] = useState<SavedCommunity[]>(mockSavedCommunities)
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [recentSelections, setRecentSelections] = useState<RecentSelection[]>([])
  const [lastSavedCommunityName, setLastSavedCommunityName] = useState<string | null>(null)

  const allAreas = useMemo(() => [...committedAreas, ...draftAreas], [committedAreas, draftAreas])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const filtered = mockSearchResults.filter((result) => result.name.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(filtered.slice(0, 20))
    } else {
      setSearchResults([])
    }
  }, [])

  const addDraftArea = useCallback(
    (area: GeographyArea) => {
      setDraftAreas((prev) => {
        const exists = prev.find((a) => a.id === area.id) || committedAreas.find((a) => a.id === area.id)
        if (exists) return prev
        if (prev.length + committedAreas.length >= 5) return prev

        setRecentSelections((recent) => {
          const filtered = recent.filter((r) => r.area.name.toLowerCase() !== area.name.toLowerCase())
          return [{ area, timestamp: Date.now() }, ...filtered].slice(0, 5)
        })

        return [...prev, area]
      })
    },
    [committedAreas],
  )

  const removeAreaById = useCallback(
    (id: string) => {
      const inDrafts = draftAreas.find((a) => a.id === id)
      if (inDrafts) {
        setDraftAreas((prev) => prev.filter((a) => a.id !== id))
      } else {
        setCommittedAreas((prev) => prev.filter((a) => a.id !== id))
      }
    },
    [draftAreas],
  )

  const resetMap = useCallback(() => {
    setCommittedAreas([])
    setDraftAreas([{ id: "indianapolis-metro", name: "Indianapolis-Carmel-Anderson", type: "metro" }])
    setBrowseCategory("metro")
    setBrowseTree(indianaBrowseData.metro)
  }, [])

  const applyChanges = useCallback(() => {
    setCommittedAreas((prev) => [...prev, ...draftAreas])
    setDraftAreas([])
    setIsExpanded(false)
    setSearchQuery("")
    setSearchResults([])
  }, [draftAreas])

  const cancelChanges = useCallback(() => {
    setDraftAreas([])
    setDrawnShapes([])
    setIsExpanded(false)
    setSearchQuery("")
    setSearchResults([])
  }, [])

  const clearAllAreas = useCallback(() => {
    setDraftAreas([])
    setCommittedAreas([])
  }, [])

  const handleCategoryChange = useCallback((category: BrowseCategory) => {
    setBrowseCategory(category)
    setBrowseTree(indianaBrowseData[category] || [])
  }, [])

  return {
    isExpanded,
    setIsExpanded,
    currentMode,
    setCurrentMode,
    committedAreas,
    draftAreas,
    allAreas,
    searchQuery,
    searchResults,
    drawnShapes,
    browseTree,
    activeDrawTool,
    setActiveDrawTool,
    handleSearch,
    addDraftArea,
    removeAreaById,
    resetMap,
    applyChanges,
    cancelChanges,
    clearAllAreas,
    browseCategory,
    setBrowseCategory: handleCategoryChange,
    savedCommunities,
    selectedCommunities,
    showSaveModal,
    setShowSaveModal,
    recentSelections,
    lastSavedCommunityName,
    setLastSavedCommunityName,
  }
}

// Components
function CollapsedHeader({
  areas,
  onRemoveArea,
  onExpand,
  savedCommunityName,
}: {
  areas: GeographyArea[]
  onRemoveArea: (id: string) => void
  onExpand: () => void
  savedCommunityName?: string | null
}) {
  const maxDisplayAreas = 2
  const displayAreas = areas.slice(0, maxDisplayAreas)
  const remainingCount = areas.length - maxDisplayAreas
  const canAddMore = areas.length < 5

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex-1">
        <div className="mb-2">
          <span className="text-base font-semibold text-gray-700">Active Community</span>
        </div>
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
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-800 text-sm rounded-full border border-green-200">
                  <span>{savedCommunityName}</span>
                  <button
                    onClick={() => areas.forEach((area) => onRemoveArea(area.id))}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
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
                <button
                  onClick={onExpand}
                  className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
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

function SearchMode({
  searchQuery,
  searchResults,
  onSearch,
  onSelectArea,
  selectedAreas,
  recentSelections,
  onClearAll,
  onRemoveArea,
}: {
  searchQuery: string
  searchResults: GeographyArea[]
  onSearch: (query: string) => void
  onSelectArea: (area: GeographyArea) => void
  selectedAreas: GeographyArea[]
  recentSelections: RecentSelection[]
  onClearAll: () => void
  onRemoveArea: (id: string) => void
}) {
  const defaultRecommendedAreas: GeographyArea[] = [
    { id: "indiana-state", name: "Indiana State", type: "state", hierarchyPath: "United States ▶ State" },
    { id: "indianapolis-metro-rec", name: "Indianapolis Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
    { id: "evansville-metro-rec", name: "Evansville Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
    { id: "marion-county-rec", name: "Marion County", type: "county", hierarchyPath: "Indiana ▶ County" },
  ]

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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="City, ZIP, County, School District…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

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

      {searchQuery.length === 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Popular</h4>
          <div className="grid grid-cols-1 gap-2">
            {recommendedAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => onSelectArea(area)}
                className="flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{area.name}</span>
                    {getBoundaryChip(area.type)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchQuery.length > 0 && searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-lg shadow-sm max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onSelectArea(result)
                onSearch("")
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="text-gray-500">{getTypeIcon(result.type)}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{result.name}</div>
                <div className="text-xs text-gray-500">{result.hierarchyPath}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MapView({ committedAreas, draftAreas }: { committedAreas: GeographyArea[]; draftAreas: GeographyArea[] }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300"></div>
      </div>
      {committedAreas.map((area, index) => (
        <div
          key={area.id}
          className="absolute bg-blue-500 opacity-80 rounded-lg border-2 border-blue-600"
          style={{
            top: `${20 + index * 15}%`,
            left: `${30 + index * 10}%`,
            width: "80px",
            height: "60px",
          }}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded shadow-sm">
            {area.name.split(",")[0]}
          </div>
        </div>
      ))}
      {draftAreas.map((area, index) => (
        <div
          key={area.id}
          className="absolute bg-blue-300 opacity-60 rounded-lg border-2 border-blue-400 border-dashed"
          style={{
            top: `${40 + index * 12}%`,
            right: `${20 + index * 8}%`,
            width: "70px",
            height: "50px",
          }}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow-sm">
            {area.name.split(",")[0]}
          </div>
        </div>
      ))}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
        ESRI Base Map
      </div>
    </div>
  )
}

// Main Component
export default function SaviGeographySelector() {
  const {
    isExpanded,
    setIsExpanded,
    currentMode,
    setCurrentMode,
    committedAreas,
    draftAreas,
    allAreas,
    searchQuery,
    searchResults,
    handleSearch,
    addDraftArea,
    removeAreaById,
    resetMap,
    applyChanges,
    cancelChanges,
    clearAllAreas,
    recentSelections,
    lastSavedCommunityName,
    setLastSavedCommunityName,
  } = useGeographySelector()

  const handleRemoveArea = (id: string) => {
    removeAreaById(id)
    if (committedAreas.length === 1) {
      setLastSavedCommunityName(null)
    }
  }

  if (!isExpanded) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <CollapsedHeader
          areas={committedAreas}
          onRemoveArea={handleRemoveArea}
          onExpand={() => setIsExpanded(true)}
          savedCommunityName={lastSavedCommunityName}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[700px] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Community Selector</h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-6">
          {[
            { id: "search" as const, name: "Search" },
            { id: "select" as const, name: "Browse" },
            { id: "draw" as const, name: "Map Tools" },
            { id: "saved" as const, name: "Saved" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentMode === mode.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            {currentMode === "search" && (
              <SearchMode
                searchQuery={searchQuery}
                searchResults={searchResults}
                onSearch={handleSearch}
                onSelectArea={addDraftArea}
                selectedAreas={allAreas}
                recentSelections={recentSelections}
                onClearAll={clearAllAreas}
                onRemoveArea={removeAreaById}
              />
            )}
            {currentMode !== "search" && (
              <div className="text-center py-8 text-gray-500">
                <p>{currentMode} mode coming soon...</p>
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            <MapView committedAreas={committedAreas} draftAreas={draftAreas} />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={cancelChanges}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={resetMap}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Map
            </button>
            <button
              onClick={applyChanges}
              disabled={draftAreas.length === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Make Active
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

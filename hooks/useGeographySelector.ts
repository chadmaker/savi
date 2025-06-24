"use client"

import { useState, useCallback, useMemo } from "react"
import type {
  GeographyArea,
  DrawShape,
  BrowseNode,
  SelectorMode,
  BrowseCategory,
  SavedCommunity,
  RecentSelection,
} from "../types/geography"
import { mockSearchResults, indianaBrowseData, mockProjects, mockSavedCommunities } from "../data/mockData"

export function useGeographySelector() {
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
  const [isDrawMode, setIsDrawMode] = useState(false)
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

        // Add to recent selections (avoid duplicates by name)
        setRecentSelections((recent) => {
          const filtered = recent.filter((r) => r.area.name.toLowerCase() !== area.name.toLowerCase())
          return [{ area, timestamp: Date.now() }, ...filtered].slice(0, 5)
        })

        return [...prev, area]
      })
    },
    [committedAreas],
  )

  const removeDraftArea = useCallback((id: string) => {
    setDraftAreas((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const removeCommittedArea = useCallback((id: string) => {
    setCommittedAreas((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const removeAreaById = useCallback(
    (id: string) => {
      const inDrafts = draftAreas.find((a) => a.id === id)
      if (inDrafts) {
        removeDraftArea(id)
      } else {
        removeCommittedArea(id)
      }
    },
    [draftAreas, removeDraftArea, removeCommittedArea],
  )

  const resetMap = useCallback(() => {
    setCommittedAreas([])
    setDraftAreas([{ id: "indianapolis-metro", name: "Indianapolis-Carmel-Anderson", type: "metro" }])
    setBrowseCategory("metro")
    setBrowseTree(indianaBrowseData.metro)
    // Keep the current mode active instead of switching to selectregions
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
    setIsDrawMode(false)
  }, [])

  const addDrawnShape = useCallback(
    (shape: DrawShape) => {
      setDrawnShapes((prev) => [...prev, shape])
      const area: GeographyArea = {
        id: shape.id,
        name: shape.name,
        type: "drawn",
        geometry: shape.coordinates,
      }
      addDraftArea(area)
    },
    [addDraftArea],
  )

  const clearAllShapes = useCallback(() => {
    setDrawnShapes([])
    setDraftAreas((prev) => prev.filter((a) => a.type !== "drawn"))
  }, [])

  const saveCommunity = useCallback(
    (name: string, project: string, notes: string, isFavorite: boolean) => {
      const newCommunity: SavedCommunity = {
        id: `community-${Date.now()}`,
        name,
        date: new Date().toISOString().split("T")[0],
        project,
        notes,
        areas: [...allAreas],
        thumbnail: `thumbnail-${Date.now()}`,
        type: allAreas[0]?.type || "Mixed",
        starred: isFavorite,
        geoId: Math.floor(Math.random() * 9000000000) + 1000000000, // 10-digit random number
      }
      setSavedCommunities((prev) => [newCommunity, ...prev])
      setShowSaveModal(false)

      // Apply changes and close the expanded panel
      setCommittedAreas((prev) => [...prev, ...draftAreas])
      setDraftAreas([])
      setIsExpanded(false)
      setSearchQuery("")
      setSearchResults([])

      // Store the saved community name for display
      setLastSavedCommunityName(name)
    },
    [allAreas, draftAreas],
  )

  const toggleCommunitySelection = useCallback((communityId: string) => {
    setSelectedCommunities((prev) => {
      if (prev.includes(communityId)) {
        return prev.filter((id) => id !== communityId)
      } else if (prev.length < 5) {
        return [...prev, communityId]
      }
      return prev
    })
  }, [])

  const applySavedCommunities = useCallback(() => {
    const communities = savedCommunities.filter((c) => selectedCommunities.includes(c.id))
    const areas = communities.flatMap((c) => c.areas)
    setCommittedAreas(areas.slice(0, 5))
    setSelectedCommunities([])
    setIsExpanded(false)

    // Store the first selected community name for display
    if (communities.length > 0) {
      setLastSavedCommunityName(communities[0].name)
    }
  }, [savedCommunities, selectedCommunities])

  const handleCategoryChange = useCallback((category: BrowseCategory) => {
    setBrowseCategory(category)
    setBrowseTree(indianaBrowseData[category] || [])
  }, [])

  const clearAllAreas = useCallback(() => {
    setDraftAreas([])
    setCommittedAreas([])
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
    removeDraftArea,
    removeCommittedArea,
    removeAreaById,
    resetMap,
    applyChanges,
    cancelChanges,
    addDrawnShape,
    clearAllShapes,
    setBrowseTree,
    browseCategory,
    setBrowseCategory: handleCategoryChange,
    savedCommunities,
    selectedCommunities,
    showSaveModal,
    setShowSaveModal,
    saveCommunity,
    toggleCommunitySelection,
    applySavedCommunities,
    isDrawMode,
    setIsDrawMode,
    mockProjects,
    recentSelections,
    clearAllAreas,
    lastSavedCommunityName,
    setLastSavedCommunityName,
  }
}

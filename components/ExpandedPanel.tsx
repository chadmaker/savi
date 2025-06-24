"use client"

import { X, RotateCcw, Save } from "lucide-react"
import type {
  SelectorMode,
  GeographyArea,
  DrawShape,
  BrowseNode,
  BrowseCategory,
  SavedCommunity,
  RecentSelection,
} from "../types/geography"
import { SearchMode } from "./SearchMode"
import { SelectMode } from "./SelectMode"
import { DrawMode } from "./DrawMode"
import { SavedMode } from "./SavedMode"
import { MapView } from "./MapView"
import { SaveCommunityModal } from "./SaveCommunityModal"

interface ExpandedPanelProps {
  isOpen: boolean
  currentMode: SelectorMode
  onModeChange: (mode: SelectorMode) => void
  onClose: () => void
  committedAreas: GeographyArea[]
  draftAreas: GeographyArea[]
  allAreas: GeographyArea[]
  searchQuery: string
  searchResults: GeographyArea[]
  drawnShapes: DrawShape[]
  browseTree: BrowseNode[]
  activeDrawTool: string | null
  onSearch: (query: string) => void
  onSelectArea: (area: GeographyArea) => void
  onSetActiveDrawTool: (tool: string | null) => void
  onClearAllShapes: () => void
  onAddShape: (shape: DrawShape) => void
  onUpdateTree: (tree: BrowseNode[]) => void
  onApply: () => void
  onCancel: () => void
  onResetMap: () => void
  browseCategory: BrowseCategory
  onCategoryChange: (category: BrowseCategory) => void
  savedCommunities: SavedCommunity[]
  selectedCommunities: string[]
  onToggleCommunitySelection: (communityId: string) => void
  onApplySavedCommunities: () => void
  showSaveModal: boolean
  onShowSaveModal: () => void
  onCloseSaveModal: () => void
  onSaveCommunity: (name: string, project: string, population: number) => void
  projects: string[]
  isDrawMode: boolean
  onToggleDrawMode: () => void
  recentSelections: RecentSelection[]
  onClearAll: () => void
  onRemoveArea: (id: string) => void
}

export function ExpandedPanel({
  isOpen,
  currentMode,
  onModeChange,
  onClose,
  committedAreas,
  draftAreas,
  allAreas,
  searchQuery,
  searchResults,
  drawnShapes,
  browseTree,
  activeDrawTool,
  onSearch,
  onSelectArea,
  onSetActiveDrawTool,
  onClearAllShapes,
  onAddShape,
  onUpdateTree,
  onApply,
  onCancel,
  onResetMap,
  browseCategory,
  onCategoryChange,
  savedCommunities,
  selectedCommunities,
  onToggleCommunitySelection,
  onApplySavedCommunities,
  showSaveModal,
  onShowSaveModal,
  onCloseSaveModal,
  onSaveCommunity,
  projects,
  isDrawMode,
  onToggleDrawMode,
  recentSelections,
  onClearAll,
  onRemoveArea,
}: ExpandedPanelProps) {
  if (!isOpen) return null

  const modes = [
    { id: "search" as const, name: "Search" },
    { id: "select" as const, name: "Browse" },
    { id: "draw" as const, name: "Map Tools" },
    { id: "saved" as const, name: "Saved" },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[700px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Community Selector</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
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

          {/* Content */}
          {currentMode === "saved" ? (
            // Saved tab - full width, no map
            <div className="flex-1 p-6 overflow-hidden">
              <SavedMode
                savedCommunities={savedCommunities}
                selectedCommunities={selectedCommunities}
                onToggleSelection={onToggleCommunitySelection}
              />
            </div>
          ) : (
            // Other tabs - split pane with map
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
                {currentMode === "search" && (
                  <SearchMode
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                    onSearch={onSearch}
                    onSelectArea={onSelectArea}
                    selectedAreas={allAreas}
                    recentSelections={recentSelections}
                    onClearAll={onClearAll}
                    onRemoveArea={onRemoveArea}
                  />
                )}
                {currentMode === "select" && (
                  <SelectMode
                    browseCategory={browseCategory}
                    browseTree={browseTree}
                    onCategoryChange={onCategoryChange}
                    onSelectArea={onSelectArea}
                    selectedAreas={draftAreas.filter((area) => area.type !== "drawn")}
                    onClearAll={onClearAll}
                    onRemoveArea={onRemoveArea}
                  />
                )}
                {currentMode === "draw" && (
                  <DrawMode
                    drawnShapes={drawnShapes}
                    activeDrawTool={activeDrawTool}
                    onSetActiveDrawTool={onSetActiveDrawTool}
                    onClearAllShapes={onClearAllShapes}
                    onAddShape={onAddShape}
                    selectedAreas={allAreas}
                    onClearAll={onClearAll}
                    onRemoveArea={onRemoveArea}
                    browseCategory={browseCategory}
                    onCategoryChange={onCategoryChange}
                  />
                )}
              </div>

              {/* Right Map Pane */}
              <div className="flex-1 p-6">
                <MapView committedAreas={committedAreas} draftAreas={draftAreas} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {(currentMode === "search" || currentMode === "select" || currentMode === "draw") && (
                <>
                  <button
                    onClick={onResetMap}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Map
                  </button>
                  <button
                    onClick={onShowSaveModal}
                    disabled={allAreas.length === 0}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save this community
                  </button>
                </>
              )}

              <div className="group relative">
                <button
                  onClick={currentMode === "saved" ? onApplySavedCommunities : onApply}
                  disabled={currentMode === "saved" ? selectedCommunities.length === 0 : draftAreas.length === 0}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Make Active
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Make this your active community across SAVI tools.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SaveCommunityModal
        isOpen={showSaveModal}
        onClose={onCloseSaveModal}
        onSave={onSaveCommunity}
        areas={allAreas}
        projects={projects}
      />
    </>
  )
}

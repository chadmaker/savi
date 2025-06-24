"use client"

import { useGeographySelector } from "./hooks/useGeographySelector"
import { CollapsedHeader } from "./components/CollapsedHeader"
import { ExpandedPanel } from "./components/ExpandedPanel"

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
    addDrawnShape,
    clearAllShapes,
    setBrowseTree,
    browseCategory,
    setBrowseCategory,
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
  } = useGeographySelector()

  const handleRemoveArea = (id: string) => {
    removeAreaById(id)
    // If all areas are removed, clear the saved community name
    if (committedAreas.length === 1) {
      setLastSavedCommunityName(null)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <CollapsedHeader
        areas={committedAreas}
        onRemoveArea={handleRemoveArea}
        onExpand={() => setIsExpanded(true)}
        savedCommunityName={lastSavedCommunityName}
      />

      <ExpandedPanel
        isOpen={isExpanded}
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onClose={() => setIsExpanded(false)}
        committedAreas={committedAreas}
        draftAreas={draftAreas}
        allAreas={allAreas}
        searchQuery={searchQuery}
        searchResults={searchResults}
        drawnShapes={drawnShapes}
        browseTree={browseTree}
        activeDrawTool={activeDrawTool}
        onSearch={handleSearch}
        onSelectArea={addDraftArea}
        onSetActiveDrawTool={setActiveDrawTool}
        onClearAllShapes={clearAllShapes}
        onAddShape={addDrawnShape}
        onUpdateTree={setBrowseTree}
        onApply={applyChanges}
        onCancel={cancelChanges}
        onResetMap={resetMap}
        browseCategory={browseCategory}
        onCategoryChange={setBrowseCategory}
        savedCommunities={savedCommunities}
        selectedCommunities={selectedCommunities}
        onToggleCommunitySelection={toggleCommunitySelection}
        onApplySavedCommunities={applySavedCommunities}
        showSaveModal={showSaveModal}
        onShowSaveModal={() => setShowSaveModal(true)}
        onCloseSaveModal={() => setShowSaveModal(false)}
        onSaveCommunity={saveCommunity}
        projects={mockProjects}
        isDrawMode={isDrawMode}
        onToggleDrawMode={() => setIsDrawMode(!isDrawMode)}
        recentSelections={recentSelections}
        onClearAll={clearAllAreas}
        onRemoveArea={removeAreaById}
      />

      {/* Enhanced Demo Instructions */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Demo Flow:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Search: Pick "Indiana" and "Indianapolis Metro"</li>
            <li>• Select Regions: Switch to Counties, check Marion</li>
            <li>• Draw: Click map pencil, draw custom polygon</li>
            <li>• Reset Map: Clear all, return to Metro Areas</li>
            <li>• Save: Name it "Central Indy", assign project</li>
            <li>• Saved: Filter by type, multi-select cards</li>
          </ul>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">v2.2 Features:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Three-tab workflow (Search, Select Regions, Saved)</li>
            <li>• In-mode Draw from Select Regions tab</li>
            <li>• Reset Map clears all + returns to Metro Areas</li>
            <li>• Save Community with metadata capture</li>
            <li>• Tile-based Saved view with filters</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

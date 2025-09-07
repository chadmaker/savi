"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Map } from "lucide-react"

interface SelectCommunityModalProps {
  open: boolean
  onClose: () => void
  selectedCommunities: string[]
  onSelectionChange: (communities: string[]) => void
}

const availableCommunities = [
  { id: "marion-county", name: "Marion County", type: "County" },
  { id: "broad-ripple", name: "Broad Ripple", type: "Neighborhood" },
  { id: "fountain-square", name: "Fountain Square", type: "Neighborhood" },
  { id: "downtown", name: "Downtown Indianapolis", type: "District" },
  { id: "carmel", name: "Carmel", type: "City" },
  { id: "fishers", name: "Fishers", type: "City" },
  { id: "noblesville", name: "Noblesville", type: "City" },
  { id: "westfield", name: "Westfield", type: "City" },
]

export function SelectCommunityModal({
  open,
  onClose,
  selectedCommunities,
  onSelectionChange,
}: SelectCommunityModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredCommunities = availableCommunities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || community.type.toLowerCase() === filterType
    return matchesSearch && matchesFilter
  })

  const handleToggleCommunity = (communityName: string) => {
    if (selectedCommunities.includes(communityName)) {
      onSelectionChange(selectedCommunities.filter((c) => c !== communityName))
    } else {
      onSelectionChange([...selectedCommunities, communityName])
    }
  }

  const handleRemoveCommunity = (communityName: string) => {
    onSelectionChange(selectedCommunities.filter((c) => c !== communityName))
  }

  const handleConfirm = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Community (Geography)</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Panel - Controls */}
          <div className="w-1/2 space-y-4">
            <div>
              <Label htmlFor="search">Search Communities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search communities..."
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="county">County</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="neighborhood">Neighborhood</SelectItem>
                  <SelectItem value="district">District</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-h-0">
              <Label>Available Communities</Label>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                {filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                      selectedCommunities.includes(community.name) ? "bg-blue-50 border border-blue-200" : ""
                    }`}
                    onClick={() => handleToggleCommunity(community.name)}
                  >
                    <div>
                      <div className="font-medium">{community.name}</div>
                      <div className="text-sm text-gray-500">{community.type}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCommunities.includes(community.name)}
                      onChange={() => handleToggleCommunity(community.name)}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="w-1/2">
            <Label>Interactive Map</Label>
            <div className="mt-2 h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Interactive map selection</p>
                <p className="text-gray-500 text-xs">Click on areas to select</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Communities */}
        {selectedCommunities.length > 0 && (
          <div className="border-t pt-4">
            <Label>Selected Communities ({selectedCommunities.length})</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCommunities.map((community) => (
                <Badge key={community} variant="secondary" className="flex items-center gap-1">
                  {community}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveCommunity(community)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Selection ({selectedCommunities.length})</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

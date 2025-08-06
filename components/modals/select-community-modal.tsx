"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin } from 'lucide-react'

interface Community {
  id: string
  name: string
  type: string
  population: string
  description: string
}

interface SelectCommunityModalProps {
  open: boolean
  onClose: () => void
  onSelectCommunity: (community: string) => void
  selectedCommunity: string | null
}

export function SelectCommunityModal({ open, onClose, onSelectCommunity, selectedCommunity }: SelectCommunityModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tempSelected, setTempSelected] = useState<string | null>(selectedCommunity)

  const communities: Community[] = [
    {
      id: "marion-county",
      name: "Marion County",
      type: "County",
      population: "964,582",
      description: "The most populous county in Indiana, containing Indianapolis"
    },
    {
      id: "broad-ripple",
      name: "Broad Ripple",
      type: "Neighborhood",
      population: "12,500",
      description: "Arts and entertainment district in Indianapolis"
    },
    {
      id: "fountain-square",
      name: "Fountain Square",
      type: "Neighborhood",
      population: "8,200",
      description: "Historic cultural district southeast of downtown Indianapolis"
    },
    {
      id: "downtown-indy",
      name: "Downtown Indianapolis",
      type: "District",
      population: "15,400",
      description: "Central business district and urban core"
    },
    {
      id: "carmel",
      name: "Carmel",
      type: "City",
      population: "99,757",
      description: "Suburban city north of Indianapolis"
    },
    {
      id: "fishers",
      name: "Fishers",
      type: "City",
      population: "95,310",
      description: "Fast-growing suburban city northeast of Indianapolis"
    }
  ]

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = () => {
    if (tempSelected) {
      const community = communities.find(c => c.id === tempSelected)
      if (community) {
        onSelectCommunity(community.name)
      }
    }
    onClose()
  }

  const handleClose = () => {
    setTempSelected(selectedCommunity)
    setSearchTerm("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Community</DialogTitle>
          <DialogDescription>
            Choose a geographic area for your analysis. You can select counties, cities, neighborhoods, or districts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Community List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  tempSelected === community.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setTempSelected(community.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium text-gray-900">{community.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {community.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                    <p className="text-xs text-gray-500">Population: {community.population}</p>
                  </div>
                  {tempSelected === community.id && (
                    <div className="ml-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No communities found matching your search.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!tempSelected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

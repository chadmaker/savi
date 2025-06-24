"use client"

import { useState } from "react"
import { Calendar, Users, Tag, Star, Search } from "lucide-react"
import type { SavedCommunity } from "../types/geography"

interface SavedModeProps {
  savedCommunities: SavedCommunity[]
  selectedCommunities: string[]
  onToggleSelection: (communityId: string) => void
}

export function SavedMode({ savedCommunities, selectedCommunities, onToggleSelection }: SavedModeProps) {
  const [filter, setFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const projects = Array.from(new Set(savedCommunities.map((c) => c.project)))
  const types = Array.from(new Set(savedCommunities.map((c) => c.type)))

  const filteredCommunities = savedCommunities.filter((community) => {
    if (filter === "saved" && !community.starred) return false
    if (projectFilter !== "all" && community.project !== projectFilter) return false
    if (typeFilter !== "all" && community.type !== typeFilter) return false
    if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`
    }
    return population.toString()
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters on same line */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search within saved..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilter(filter === "saved" ? "all" : "saved")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            filter === "saved"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Starred
        </button>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredCommunities.map((community) => {
          const isSelected = selectedCommunities.includes(community.id)
          return (
            <div
              key={community.id}
              onClick={() => onToggleSelection(community.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {/* Thumbnail */}
              <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-12 bg-blue-500 opacity-70 rounded"></div>
                  <div className="absolute top-2 right-2 w-8 h-6 bg-blue-600 opacity-60 rounded"></div>
                </div>
                {community.starred && (
                  <div className="absolute top-2 left-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{community.name}</h4>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(community.date)}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Tag className="w-3 h-3" />
                  <span>{community.project}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{formatPopulation(community.population)} people</span>
                </div>

                <div className="text-xs text-blue-600 font-medium">{community.type}</div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No communities found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Map, Star, List, LayoutGrid, MoreHorizontal, Eye } from "lucide-react"

interface CommunitiesPageProps {
  onSelectCommunity: () => void
}

export function CommunitiesPage({ onSelectCommunity }: CommunitiesPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)
  const [filter, setFilter] = useState("all")
  const [savedCommunities, setSavedCommunities] = useState([
    { id: 1, name: "Marion County", type: "County", starred: true, lastUsed: "2024-01-15", population: "964,582" },
    { id: 2, name: "Broad Ripple", type: "Neighborhood", starred: false, lastUsed: "2024-01-12", population: "12,500" },
    {
      id: 3,
      name: "Fountain Square",
      type: "Neighborhood",
      starred: true,
      lastUsed: "2024-01-10",
      population: "8,200",
    },
    {
      id: 4,
      name: "Downtown Indianapolis",
      type: "District",
      starred: false,
      lastUsed: "2024-01-08",
      population: "15,400",
    },
  ])

  const toggleStarred = (id: number) => {
    setSavedCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === id ? { ...community, starred: !community.starred } : community,
      ),
    )
  }

  const filteredCommunities = savedCommunities
    .filter((c) => (showStarred ? c.starred : true))
    .filter((c) => (filter === "all" ? true : false)) // Placeholder for shared filter logic

  return (
    <div>
      {/* Header Section */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-4">
              <Map className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Communities</h2>
              <p className="text-gray-600 mt-1">
                Select geographic areas for your analysis including counties, cities, and neighborhoods.
              </p>
            </div>
          </div>
          <Button onClick={onSelectCommunity} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Community
          </Button>
        </div>
      </div>

      {/* Saved Communities */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Communities</h2>
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">View all</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarred(!showStarred)}
              className={showStarred ? "bg-gray-900 text-white" : ""}
            >
              <Star className={`h-4 w-4 mr-1 ${showStarred ? "fill-current text-yellow-400" : ""}`} />
              Starred
            </Button>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredCommunities.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{community.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-1"
                        onClick={() => toggleStarred(community.id)}
                      >
                        <Star
                          className={`h-4 w-4 ${community.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                    <Badge variant="secondary">{community.type}</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Population: {community.population}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Last used: {new Date(community.lastUsed).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Start Visualization</DropdownMenuItem>
                            <DropdownMenuItem>New Profile</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 w-12"></th>
                    <th className="text-left p-4 font-medium text-gray-900">Community Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">Population</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Used</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunities.map((community, index) => (
                    <tr key={community.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => toggleStarred(community.id)}>
                          <Star
                            className={`h-4 w-4 ${community.starred ? "fill-current text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{community.name}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{community.type}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{community.population}</td>
                      <td className="p-4 text-gray-600">{new Date(community.lastUsed).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                              <DropdownMenuItem>Start Visualization</DropdownMenuItem>
                              <DropdownMenuItem>New Profile</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Map className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>No saved communities match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

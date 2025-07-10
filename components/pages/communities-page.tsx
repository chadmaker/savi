"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Map, Star, List, LayoutGrid, Calendar } from "lucide-react"

interface CommunitiesPageProps {
  onSelectCommunity: () => void
}

export function CommunitiesPage({ onSelectCommunity }: CommunitiesPageProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showStarred, setShowStarred] = useState(false)
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

  const filteredCommunities = showStarred ? savedCommunities.filter((community) => community.starred) : savedCommunities

  return (
    <div>
      {/* Header Section */}
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center mb-12">
        <div className="rounded-full bg-blue-100 p-6 mb-6">
          <Map className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Communities</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Explore and select geographic areas for your analysis. Browse communities, neighborhoods, and regions.
        </p>
        <Button onClick={onSelectCommunity} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Explore Communities
        </Button>
      </div>

      {/* Saved Communities */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Saved Communities</h2>
          <div className="flex items-center space-x-2">
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
            <Button
              variant={showStarred ? "default" : "outline"}
              size="sm"
              onClick={() => setShowStarred(!showStarred)}
            >
              ⭐ Starred
            </Button>
          </div>
        </div>

        {filteredCommunities.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((community) => (
                <Card key={community.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{community.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {community.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleStarred(community.id)}>
                        <Star
                          className={`h-4 w-4 ${community.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Population: {community.population}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(community.lastUsed).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Community Name</th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">Population</th>
                    <th className="text-left p-4 font-medium text-gray-900">Last Used</th>
                    <th className="text-left p-4 font-medium text-gray-900">Starred</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunities.map((community, index) => (
                    <tr key={community.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-gray-900">{community.name}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{community.type}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{community.population}</td>
                      <td className="p-4 text-gray-600">{new Date(community.lastUsed).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => toggleStarred(community.id)}>
                          <Star
                            className={`h-4 w-4 ${community.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
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
            <p>No saved communities yet. Explore communities to save your favorites.</p>
          </div>
        )}
      </div>
    </div>
  )
}

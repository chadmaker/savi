"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, X, Search, Home, Share2 } from "lucide-react"

export default function EducationProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Topics")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("Education")

  // Data from the CSV file
  const data = {
    Topics: [
      "Basic Needs",
      "Community Development",
      "Crime and Safety",
      "Early Care and Learning",
      "Economic Mobility",
      "Economy",
      "Education",
      "Environment",
      "Equity",
      "Food Access",
      "Health",
      "Housing",
      "Poverty and Income",
      "Demographics",
    ],
    Populations: [
      "African Americans",
      "Asians",
      "Hispanics and Latinos",
      "Older Adults",
      "Working Age",
      "Working Poor",
      "Youth",
    ],
    Metros: [
      "Anderson",
      "Bloomington",
      "Columbus",
      "Elkhart-Goshen",
      "Evansville",
      "Fort Wayne",
      "Indianapolis-Carmel-Anderson",
      "Kokomo",
      "Lafayette-West Lafayette",
      "Michigan City-La Porte",
      "Muncie",
      "South Bend-Mishawaka",
      "Terre Haute",
    ],
    Counties: [
      "Adams",
      "Allen",
      "Bartholomew",
      "Benton",
      "Blackford",
      "Boone",
      "Brown",
      "Carroll",
      "Cass",
      "Clark",
      "Clay",
      "Clinton",
      "Crawford",
      "Daviess",
      "Dearborn",
      "Decatur",
      "DeKalb",
      "Delaware",
      "Dubois",
      "Elkhart",
      "Fayette",
      "Floyd",
      "Fountain",
      "Franklin",
      "Fulton",
      "Gibson",
      "Grant",
      "Greene",
      "Hamilton",
      "Hancock",
      "Harrison",
      "Hendricks",
      "Henry",
      "Howard",
      "Huntington",
      "Jackson",
      "Jasper",
      "Jay",
      "Jefferson",
      "Jennings",
      "Johnson",
      "Knox",
      "Kosciusko",
      "Lake",
      "LaPorte",
      "Lawrence",
      "Madison",
      "Marion",
      "Marshall",
      "Martin",
      "Miami",
      "Monroe",
      "Montgomery",
      "Morgan",
      "Newton",
      "Noble",
      "Ohio",
      "Orange",
      "Owen",
      "Parke",
      "Perry",
      "Pike",
      "Porter",
      "Posey",
      "Putnam",
      "Randolph",
      "Ripley",
      "Rush",
      "Scott",
      "Shelby",
      "Spencer",
      "St. Joseph",
      "Starke",
      "Steuben",
      "Sullivan",
      "Switzerland",
      "Tippecanoe",
      "Tipton",
      "Union",
      "Vanderburgh",
      "Vermillion",
      "Vigo",
      "Wabash",
      "Warren",
      "Warrick",
      "Washington",
      "Wayne",
      "Wells",
      "White",
      "Whitley",
    ],
    Neighborhoods: [
      "Acton",
      "Airport",
      "Allisonville",
      "Ameriplex",
      "Arlington Woods",
      "Augusta / New Augusta",
      "Beech Grove",
      "Brendonwood",
      "Broad Ripple",
      "Butler-Tarkington / Rocky Ripple",
      "Camby",
      "Canterbury–Chatard",
      "Castleton",
      "Chapel Hill–Ben Davis",
      "Christian Park",
      "Clearwater",
      "Clermont",
      "College Park",
      "Crooked Creek",
      "Crown Hill",
      "Crows Nest",
      "Delaware Trails",
      "Devington",
      "Devon",
      "Devonshire",
      "Downtown",
      "Eagle Creek",
      "Eagledale",
      "Eastgate",
      "East Warren",
      "Eastside",
      "Edgewood",
      "Fairgrounds",
      "Far Eastside",
      "Five Points",
      "Forest Manor",
      "Fountain Square",
      "Gallaudet",
      "Garden City",
      "Garfield Park",
      "Geist",
      "Glendale",
      "Glenns Valley",
      "Hill Valley",
      "Homecroft",
      "I-65 / South Emerson",
      "I-69 / Fall Creek",
      "International Marketplace",
      "Irvington",
      "Key Meadows",
      "Keystone at the Crossing",
      "Lawrence",
      "Lawrence–Fort Ben–Oaklandon",
      "Linden Wood",
      "Mapleton-Fall Creek",
      "Marian–Cold Springs",
      "Mars Hill",
      "Martindale-Brightwood",
      "Maywood",
      "Meadows",
      "Meridian Hills / Williams Creek",
      "Meridian-Kessler",
      "Millersville",
      "Near Eastside",
      "Near Northwest – Riverside",
      "Near Northside",
      "Near Southeast",
      "Near Southside",
      "Near Westside",
      "New Bethel",
      "Nora / Far Northside",
      "North Central",
      "North Perry",
      "Northwest High School",
      "Park 100",
      "Park Fletcher",
      "Poplar Grove",
      "Ravenswood",
      "Raymond Park",
      "Snacks / Guion Creek",
      "South Franklin",
      "South Perry",
      "Southdale",
      "Southeast",
      "Southeast Warren",
      "Southern Dunes",
      "Southport",
      "Speedway",
      "St. Vincent / Greenbriar",
      "Stout Field",
      "Sunshine Gardens",
      "Traders Point",
      "University Heights",
      "Valley Mills",
      "Wanamaker",
      "West Indianapolis",
      "West Newton",
      "Wynnedale / Spring Hill",
    ],
  }

  const tabs = ["Topics", "Populations", "Metros", "Counties", "Neighborhoods"]

  const filteredItems = useMemo(() => {
    const items = data[activeTab as keyof typeof data] || []
    if (!searchQuery) return items
    return items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [activeTab, searchQuery])

  const handleItemClick = (item: string) => {
    console.log(`Selected ${activeTab}: ${item}`)
    setSelectedProfile(item)
    setIsMenuOpen(false)
    setSearchQuery("")
  }

  const getDisplayItems = () => {
    // Show 8 items as cards (2 rows of 4), then list the rest
    const cardItems = filteredItems.slice(0, 8)
    const remainingItems = filteredItems.slice(8)

    return { cardItems, remainingItems }
  }

  const { cardItems, remainingItems } = getDisplayItems()

  // Determine current category based on selected profile
  const getCurrentCategory = () => {
    for (const [category, items] of Object.entries(data)) {
      if (items.includes(selectedProfile)) {
        return category
      }
    }
    return "Topics" // Default fallback
  }

  const currentCategory = getCurrentCategory()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Home className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm">
              <Button
                variant="ghost"
                className="text-gray-900 hover:text-blue-600 px-2 py-1 h-auto font-medium underline decoration-2 underline-offset-4"
                onClick={() => {
                  setActiveTab(currentCategory)
                  setIsMenuOpen(true)
                }}
              >
                {currentCategory}
              </Button>

              <ChevronRight className="h-4 w-4 text-gray-400" />

              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 px-2 py-1 h-auto font-medium"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {selectedProfile}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </nav>
          </div>

          <Button variant="ghost" size="sm" className="p-2">
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)} />
          <div
            className="absolute top-16 left-4 right-4 z-50 bg-white rounded-lg shadow-xl border max-w-5xl mx-auto overflow-hidden"
            style={{ maxHeight: "85vh" }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Select a Profile</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close <X className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b">
              <div className="flex items-center space-x-6 px-4 overflow-x-auto">
                {/* Themes Section */}
                <span className="text-xs font-light text-gray-400 whitespace-nowrap uppercase tracking-wide">
                  THEMES
                </span>

                <button
                  onClick={() => {
                    setActiveTab("Topics")
                    setSearchQuery("")
                  }}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "Topics"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Topics
                </button>

                <button
                  onClick={() => {
                    setActiveTab("Populations")
                    setSearchQuery("")
                  }}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "Populations"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Populations
                </button>

                {/* Divider */}
                <div className="text-gray-400 py-3">|</div>

                {/* Communities Section */}
                <span className="text-xs font-light text-gray-400 whitespace-nowrap uppercase tracking-wide">
                  COMMUNITIES
                </span>

                <button
                  onClick={() => {
                    setActiveTab("Metros")
                    setSearchQuery("")
                  }}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "Metros"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Metros
                </button>

                <button
                  onClick={() => {
                    setActiveTab("Counties")
                    setSearchQuery("")
                  }}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "Counties"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Counties
                </button>

                <button
                  onClick={() => {
                    setActiveTab("Neighborhoods")
                    setSearchQuery("")
                  }}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "Neighborhoods"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Neighborhoods
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 200px)" }}>
              <div className="p-4">
                {/* Card Items - Two Rows of 4 */}
                {cardItems.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {cardItems.map((item) => {
                        const isCurrentProfile = item === selectedProfile
                        return (
                          <Card
                            key={item}
                            className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 min-h-[60px] ${
                              isCurrentProfile ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200"
                            }`}
                            onClick={() => handleItemClick(item)}
                          >
                            <CardContent className="p-3 flex items-center justify-center text-center h-full">
                              <div
                                className={`text-sm font-medium leading-tight ${
                                  isCurrentProfile ? "text-blue-900" : "text-gray-700"
                                }`}
                              >
                                {item}
                                {isCurrentProfile && <span className="text-blue-600 ml-2">(current)</span>}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Remaining Items List */}
                {remainingItems.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-3 pb-2 border-b border-gray-200">
                      More {activeTab} ({remainingItems.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                      {remainingItems.map((item) => {
                        const isCurrentProfile = item === selectedProfile
                        return (
                          <button
                            key={item}
                            onClick={() => handleItemClick(item)}
                            className={`text-left text-sm p-3 rounded transition-colors border-b border-gray-100 last:border-b-0 ${
                              isCurrentProfile
                                ? "text-blue-900 bg-blue-50 font-medium"
                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {item}
                            {isCurrentProfile && <span className="text-blue-600 ml-2">(current)</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">
                      No {activeTab.toLowerCase()} found matching "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">SAVI Profile Menu</h1>
              <p className="text-gray-600 mb-4">
                Updated interface with breadcrumb navigation showing the current category and selected profile. The
                breadcrumb allows easy navigation between categories and profile selection.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm">
                  <strong>Current Selection:</strong> {selectedProfile} ({currentCategory})
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Breadcrumb Features:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Home icon for navigation</li>
                    <li>• Category breadcrumb (clickable, underlined)</li>
                    <li>• Current profile with dropdown arrow</li>
                    <li>• Share button on the right</li>
                    <li>• Automatic category detection</li>
                    <li>• Clean, minimal design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Counts:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Topics: {data.Topics.length} items</li>
                    <li>• Populations: {data.Populations.length} items</li>
                    <li>• Metros: {data.Metros.length} items</li>
                    <li>• Counties: {data.Counties.length} items</li>
                    <li>• Neighborhoods: {data.Neighborhoods.length} items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

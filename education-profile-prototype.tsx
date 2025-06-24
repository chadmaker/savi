"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

export default function EducationProfilePrototype() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastSelected, setLastSelected] = useState<{ type: string; item: string } | null>(null)

  const populations = ["Older Adults", "Working Poor", "Youth", "Hispanics and Latinos", "Asians", "African Americans"]

  const topics = [
    "Economic Mobility",
    "Basic Needs",
    "Food Access",
    "Community Development",
    "Health",
    "Crime and Safety",
    "Education",
    "Environment",
    "Equity",
    "Economy",
    "Poverty and Income",
    "Demographics",
  ]

  const handleItemClick = (type: string, item: string) => {
    console.log(`Selected ${type}: ${item}`)
    setLastSelected({ type, item })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-medium">Education</h1>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                <div className="p-4">
                  {/* Populations Section */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-blue-600 mb-3">Populations</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {populations.map((population) => (
                        <Card
                          key={population}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-gray-200"
                          onClick={() => handleItemClick("Population", population)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="text-xs font-medium text-gray-700">{population}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Topics Section */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-600 mb-3">Topics</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {topics.map((topic) => (
                        <Card
                          key={topic}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-gray-200"
                          onClick={() => handleItemClick("Topic", topic)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="text-xs font-medium text-gray-700">{topic}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Education Profile Prototype</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This prototype demonstrates the Vue component design. Click the dropdown arrow in the header to explore
                different populations and topics.
              </p>

              {lastSelected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm">
                    <strong>Last Selected:</strong> {lastSelected.type} - {lastSelected.item}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">(Check console for logged output)</div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Design Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Compact header with profile name</li>
                  <li>• Icon button opens dropdown menu</li>
                  <li>• Two clearly labeled sections</li>
                  <li>• Clickable card items with hover effects</li>
                  <li>• Responsive grid layout</li>
                  <li>• Console logging on item selection</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Click overlay to close menu */}
      {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}
    </div>
  )
}

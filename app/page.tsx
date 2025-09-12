"use client"

import { useState } from "react"
import { IndicatorSelector } from "@/components/indicator-selector"

export default function Home() {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])

  const handleSelectionChange = (indicators: string[]) => {
    setSelectedIndicators(indicators)
    console.log("Selected indicators:", indicators)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Indicator Selector</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Data Indicators</h2>
            <p className="text-gray-600 mb-4">
              Choose from 100 available indicators across multiple categories including Demographics, Economics,
              Education, Health, Housing, Transportation, Environment, and more.
            </p>

            <IndicatorSelector selectedIndicators={selectedIndicators} onSelectionChange={handleSelectionChange} />
          </div>

          {selectedIndicators.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Selected Indicators ({selectedIndicators.length})</h3>
              <div className="text-sm text-blue-700">{selectedIndicators.join(", ")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

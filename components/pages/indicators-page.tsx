"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const IndicatorsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <div>
      <h1>Data Catalog</h1> {/* Updated page title */}
      <Tabs
        value={String(selectedTab)}
        onValueChange={(value) => handleChange(new Event(""), Number.parseInt(value))}
        aria-label="data-catalog-tabs"
      >
        <TabsList>
          <TabsTrigger value="0">Indicators</TabsTrigger>
          <TabsTrigger value="1">Uploads</TabsTrigger>
        </TabsList>
        <TabsContent value="0">{/* Indicators List Content */}</TabsContent>
        <TabsContent value="1">{/* Uploads Content */}</TabsContent>
      </Tabs>
    </div>
  )
}

export default IndicatorsPage

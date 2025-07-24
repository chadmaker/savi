"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, Tab } from "@mui/material"
import IndicatorsList from "../indicators/IndicatorsList"
import UploadForm from "../uploads/UploadForm" // Assuming this component exists

const IndicatorsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <div>
      <h1>Data Catalog</h1> {/* Updated page title */}
      <Tabs value={selectedTab} onChange={handleChange} aria-label="data-catalog-tabs">
        <Tab label="Indicators" />
        <Tab label="Uploads" /> {/* Added Uploads tab */}
      </Tabs>
      {selectedTab === 0 && (
        <div>
          <IndicatorsList />
        </div>
      )}
      {selectedTab === 1 && (
        <div>
          <UploadForm /> {/* Included upload functionality */}
        </div>
      )}
    </div>
  )
}

export default IndicatorsPage

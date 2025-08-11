"use client"

import * as React from "react"
import SaviProfilePickerModal, { type SaviProfileItem } from "@/components/savi-profile-picker-modal"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Share2 } from "lucide-react"

const data: SaviProfileItem[] = [
  // Overview
  {
    id: "overview",
    label: "Community Profile",
    type: "overview",
    iconKey: "grid-2x2",
    description: "Summary view of the selected community.",
    indicators: ["Population", "Economy", "Health"],
  },

  // Populations (7)
  { id: "african-americans", label: "African Americans", type: "population", iconKey: "users" },
  { id: "asians", label: "Asians", type: "population", iconKey: "user-circle" },
  { id: "hispanics-latinos", label: "Hispanics and Latinos", type: "population", iconKey: "users-round" }, // chosen to keep icons unique
  { id: "older-adults", label: "Older Adults", type: "population", iconKey: "user-round" },
  { id: "working-age", label: "Working Age", type: "population", iconKey: "briefcase" },
  { id: "working-poor", label: "Working Poor", type: "population", iconKey: "wallet" },
  { id: "youth", label: "Youth", type: "population", iconKey: "bike" },

  // Topics (14)
  { id: "basic-needs", label: "Basic Needs", type: "topic", iconKey: "lifebuoy" },
  { id: "community-development", label: "Community Development", type: "topic", iconKey: "handshake" },
  { id: "crime-and-safety", label: "Crime and Safety", type: "topic", iconKey: "shield-check" },
  { id: "demographic", label: "Demographic", type: "topic", iconKey: "pie-chart" },
  { id: "early-care-learning", label: "Early Care and Learning", type: "topic", iconKey: "book-open" },
  { id: "economic-mobility", label: "Economic Mobility", type: "topic", iconKey: "trending-up" },
  { id: "economy", label: "Economy", type: "topic", iconKey: "banknote" },
  { id: "education", label: "Education", type: "topic", iconKey: "graduation-cap" },
  { id: "environment", label: "Environment", type: "topic", iconKey: "leaf" },
  { id: "equity", label: "Equity", type: "topic", iconKey: "scale" },
  { id: "food-access", label: "Food Access", type: "topic", iconKey: "utensils" },
  { id: "health", label: "Health", type: "topic", iconKey: "heart-pulse" },
  { id: "housing", label: "Housing", type: "topic", iconKey: "home" },
  { id: "poverty-income", label: "Poverty and Income", type: "topic", iconKey: "coins" },
]

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SaviProfileItem | null>(data.find((d) => d.id === "education") ?? null)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* App container: 1440px max width, 80px side padding (grid-aligned) */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        {/* Breadcrumb header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Home">
              <Home className="h-5 w-5 text-gray-600" />
            </Button>
            <button className="text-base font-semibold underline underline-offset-4">
              {selected?.type === "population" ? "Populations" : selected?.type === "overview" ? "Overview" : "Topics"}
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 px-2 py-1 h-auto font-medium"
              onClick={() => setOpen(true)}
              aria-label="Open profile picker"
            >
              {selected?.label ?? "Select profile"}
            </Button>
          </div>
          <Button variant="ghost" size="icon" aria-label="Share">
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Content placeholder */}
        <div className="py-12">
          <p className="text-sm text-muted-foreground">Open the modal to pick a profile.</p>
          <div className="mt-6">
            <Button onClick={() => setOpen(true)}>Open Profile Picker</Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SaviProfilePickerModal
        open={open}
        onOpenChange={setOpen}
        items={data}
        defaultSelectedId={selected?.id}
        onConfirm={(item) => setSelected(item)}
        title="Select a Profile"
      />
    </main>
  )
}

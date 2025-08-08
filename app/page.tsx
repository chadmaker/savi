"use client"

import * as React from "react"
import SaviProfilePickerModal, {
  type SaviProfileItem,
} from "@/components/savi-profile-picker-modal"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Share2 } from 'lucide-react'

const data: SaviProfileItem[] = [
  {
    id: "overview",
    label: "Community Profile",
    type: "overview",
    description: "Summary view of the selected community.",
    indicators: ["Population", "Economy", "Health"],
    icon: "overview-icon",
  },
  {
    id: "african-american",
    label: "African American",
    type: "population",
    description: "Demographic profile for African American residents.",
    indicators: ["Population size", "Median income", "Education attainment"],
    icon: "population-icon",
  },
  {
    id: "older-adults",
    label: "Older Adults",
    type: "population",
    description: "Population aged 65+ and related indicators.",
    indicators: ["Population", "Health coverage", "Poverty rate"],
    icon: "population-icon",
  },
  {
    id: "working-poor",
    label: "Working Poor",
    type: "population",
    description: "Employed individuals near the poverty threshold.",
    indicators: ["Wages", "Benefits", "Cost burden"],
    icon: "population-icon",
  },
  {
    id: "education",
    label: "Education",
    type: "topic",
    description: "Outcomes and indicators for education systems.",
    indicators: ["Graduation rate", "Test scores", "Student-teacher ratio"],
    icon: "education-icon",
  },
  {
    id: "economy",
    label: "Economy",
    type: "topic",
    description: "Economic indicators such as jobs, wages, and GDP.",
    indicators: ["Employment", "Wages", "GDP"],
    icon: "education-icon",
  },
  {
    id: "health",
    label: "Health",
    type: "topic",
    description: "Population health outcomes and access to care.",
    indicators: ["Life expectancy", "Insurance", "Chronic disease"],
    icon: "education-icon",
  },
]

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SaviProfileItem | null>(
    data.find((d) => d.id === "education") ?? null
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* App container: 1440px max width, 80px side padding (grid-aligned) */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        {/* Breadcrumb header with “Topics > {Selected}” */}
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
          <p className="text-sm text-muted-foreground">
            Content for the active profile view goes here. Use the breadcrumb or the button below to open the modal.
          </p>
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

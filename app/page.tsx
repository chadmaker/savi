"use client"

import * as React from "react"
import SaviProfilePickerModal, { type SaviProfileItem } from "@/components/savi-profile-picker-modal"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Share2 } from "lucide-react"

const data: SaviProfileItem[] = [
  {
    id: "overview",
    label: "Community Profile",
    type: "overview",
    description: "Summary view of the selected community.",
    indicators: ["Population", "Economy", "Health"],
    icon: "overview-icon",
  },
  // Populations (7)
  {
    id: "african-americans",
    label: "African Americans",
    type: "population",
    icon: "population-icon",
    description: "Demographic profile for African American residents.",
    indicators: ["Population size", "Median income", "Education attainment"],
  },
  {
    id: "asians",
    label: "Asians",
    type: "population",
    icon: "population-icon",
    description: "Demographic profile for Asian residents.",
    indicators: ["Population size", "Median income", "Education attainment"],
  },
  {
    id: "hispanics-latinos",
    label: "Hispanics and Latinos",
    type: "population",
    icon: "population-icon",
    description: "Demographic profile for Hispanic and Latino residents.",
    indicators: ["Population size", "Median income", "Education attainment"],
  },
  {
    id: "older-adults",
    label: "Older Adults",
    type: "population",
    icon: "population-icon",
    description: "Population aged 65+ and related indicators.",
    indicators: ["Population", "Health coverage", "Poverty rate"],
  },
  {
    id: "working-age",
    label: "Working Age",
    type: "population",
    icon: "population-icon",
    description: "Population in typical working-age ranges.",
    indicators: ["Employment", "Income", "Education"],
  },
  {
    id: "working-poor",
    label: "Working Poor",
    type: "population",
    icon: "population-icon",
    description: "Employed individuals near the poverty threshold.",
    indicators: ["Wages", "Benefits", "Cost burden"],
  },
  {
    id: "youth",
    label: "Youth",
    type: "population",
    icon: "population-icon",
    description: "Child and adolescent population and outcomes.",
    indicators: ["Enrollment", "Health", "Safety"],
  },

  // Topics (14) — note "Demographic" singular as shown
  {
    id: "basic-needs",
    label: "Basic Needs",
    type: "topic",
    icon: "education-icon",
    description: "Fundamental needs like food, shelter, and utilities.",
    indicators: ["Food insecurity", "Housing cost burden", "Utilities assistance"],
  },
  {
    id: "community-development",
    label: "Community Development",
    type: "topic",
    icon: "education-icon",
    description: "Built environment, civic assets, and neighborhood vitality.",
    indicators: ["Investments", "Civic spaces", "Small business"],
  },
  {
    id: "crime-and-safety",
    label: "Crime and Safety",
    type: "topic",
    icon: "education-icon",
    description: "Public safety and justice indicators.",
    indicators: ["Violent crime", "Property crime", "Clearance rate"],
  },
  {
    id: "demographic",
    label: "Demographic",
    type: "topic",
    icon: "education-icon",
    description: "Population composition and changes.",
    indicators: ["Age", "Race/ethnicity", "Migration"],
  },
  {
    id: "early-care-learning",
    label: "Early Care and Learning",
    type: "topic",
    icon: "education-icon",
    description: "Early childhood education and care.",
    indicators: ["Pre-K access", "Childcare capacity", "Quality ratings"],
  },
  {
    id: "economic-mobility",
    label: "Economic Mobility",
    type: "topic",
    icon: "education-icon",
    description: "Ability of individuals and families to move up the economic ladder.",
    indicators: ["Income growth", "Upward mobility", "Wealth"],
  },
  {
    id: "economy",
    label: "Economy",
    type: "topic",
    icon: "education-icon",
    description: "Regional economic performance indicators.",
    indicators: ["Employment", "Wages", "GDP"],
  },
  {
    id: "education",
    label: "Education",
    type: "topic",
    icon: "education-icon",
    description: "Outcomes and indicators for education systems.",
    indicators: ["Graduation rate", "Test scores", "Student-teacher ratio"],
  },
  {
    id: "environment",
    label: "Environment",
    type: "topic",
    icon: "education-icon",
    description: "Environmental quality and resilience.",
    indicators: ["Air quality", "Green space", "Resilience"],
  },
  {
    id: "equity",
    label: "Equity",
    type: "topic",
    icon: "education-icon",
    description: "Disparities and equitable outcomes across groups.",
    indicators: ["Gaps by race", "Gaps by income", "Access"],
  },
  {
    id: "food-access",
    label: "Food Access",
    type: "topic",
    icon: "education-icon",
    description: "Availability and affordability of nutritious food.",
    indicators: ["Grocery proximity", "SNAP participation", "Food deserts"],
  },
  {
    id: "health",
    label: "Health",
    type: "topic",
    icon: "education-icon",
    description: "Population health outcomes and access to care.",
    indicators: ["Life expectancy", "Insurance", "Chronic disease"],
  },
  {
    id: "housing",
    label: "Housing",
    type: "topic",
    icon: "education-icon",
    description: "Housing availability, affordability, and stability.",
    indicators: ["Rent burden", "Vacancy", "Homeownership"],
  },
  {
    id: "poverty-income",
    label: "Poverty and Income",
    type: "topic",
    icon: "education-icon",
    description: "Income distribution and poverty indicators.",
    indicators: ["Poverty rate", "Median income", "ALICE"],
  },
]

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SaviProfileItem | null>(data.find((d) => d.id === "education") ?? null)

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

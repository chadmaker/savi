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
    description: "Summary view bringing together people, place, and systems for the selected community.",
    indicators: ["Population", "Economy", "Health"],
  },

  // Populations (7) — descriptions taken or adapted from provided images
  {
    id: "african-americans",
    label: "African Americans",
    type: "population",
    iconKey: "users",
    description: "Population, economy, education, and health for African American residents.",
    indicators: ["Population size", "Median income", "Educational attainment"],
  },
  {
    id: "asians",
    label: "Asians",
    type: "population",
    iconKey: "user-circle",
    description: "Population trends, language and culture, education outcomes, and economic participation.",
    indicators: ["Population growth", "College attainment", "Household income"],
  },
  {
    id: "hispanics-latinos",
    label: "Hispanics and Latinos",
    type: "population",
    iconKey: "users-round",
    description: "Immigration, economy, housing, and culture.",
    indicators: ["Migration status", "Employment", "Housing cost burden"],
  },
  {
    id: "older-adults",
    label: "Older Adults",
    type: "population",
    iconKey: "user-round",
    description: "Demographics, income, health, and services for older residents.",
    indicators: ["65+ population", "Health coverage", "Poverty rate"],
  },
  {
    id: "working-age",
    label: "Working Age",
    type: "population",
    iconKey: "briefcase",
    description: "Demographics, economics, and more for adults 18–64.",
    indicators: ["Labor force", "Commuting", "Earnings"],
  },
  {
    id: "working-poor",
    label: "Working Poor",
    type: "population",
    iconKey: "wallet",
    description: "Characteristics, needs, and assets of low‑income residents.",
    indicators: ["ALICE threshold", "Wages", "Cost burden"],
  },
  {
    id: "youth",
    label: "Youth",
    type: "population",
    iconKey: "bike",
    description: "Demographics, family structure, education, and health.",
    indicators: ["Enrollment", "Family structure", "Health coverage"],
  },

  // Topics (14) — descriptions matched to provided images
  {
    id: "economic-mobility",
    label: "Economic Mobility",
    type: "topic",
    iconKey: "trending-up",
    description:
      "Measures of educational success, social capital, employment, income, and safe and affordable housing.",
    indicators: ["Education outcomes", "Employment", "Income growth"],
  },
  {
    id: "basic-needs",
    label: "Basic Needs",
    type: "topic",
    iconKey: "lifebuoy",
    description:
      "Measures of income, housing, and food access based on United Way of Central Indiana’s Basic Needs Fund.",
    indicators: ["Food insecurity", "Housing cost burden", "Utilities assistance"],
  },
  {
    id: "early-care-learning",
    label: "Early Care and Learning",
    type: "topic",
    iconKey: "book-open",
    description: "Population and school demographics alongside measures of educational success.",
    indicators: ["Pre‑K access", "Childcare capacity", "Quality ratings"],
  },
  {
    id: "housing",
    label: "Housing",
    type: "topic",
    iconKey: "home",
    description: "Overall statistics along with economic influences and housing insecurity measures.",
    indicators: ["Rent burden", "Vacancy", "Homeownership"],
  },
  {
    id: "food-access",
    label: "Food Access",
    type: "topic",
    iconKey: "utensils",
    description: "Access to healthy foods by demographic groups and transportation modes.",
    indicators: ["Grocery proximity", "Transit access", "SNAP participation"],
  },
  {
    id: "community-development",
    label: "Community Development",
    type: "topic",
    iconKey: "handshake",
    description: "Neighborhood characteristics, housing, market conditions, and assets.",
    indicators: ["Investment", "Small business", "Civic spaces"],
  },
  {
    id: "health",
    label: "Health",
    type: "topic",
    iconKey: "heart-pulse",
    description: "Social determinants of health, health care, and health outcomes.",
    indicators: ["Life expectancy", "Insurance rate", "Chronic disease"],
  },
  {
    id: "crime-and-safety",
    label: "Crime and Safety",
    type: "topic",
    iconKey: "shield-check",
    description: "Socioeconomic factors related to crime, crime rates, and public safety assets.",
    indicators: ["Violent crime", "Property crime", "Clearance rate"],
  },
  {
    id: "poverty-income",
    label: "Poverty and Income",
    type: "topic",
    iconKey: "coins",
    description: "Causes and impacts of poverty, populations affected, and poverty alleviation measures.",
    indicators: ["Poverty rate", "Median income", "ALICE households"],
  },
  {
    id: "equity",
    label: "Equity",
    type: "topic",
    iconKey: "scale",
    description: "Equity in education, health, housing, and economics.",
    indicators: ["Racial gaps", "Income gaps", "Access to services"],
  },
  {
    id: "education",
    label: "Education",
    type: "topic",
    iconKey: "graduation-cap",
    description: "School demographics and outcomes alongside educational attainment and employment outcomes.",
    indicators: ["Graduation rate", "Test scores", "Student‑teacher ratio"],
  },
  {
    id: "demographic",
    label: "Demographic",
    type: "topic",
    iconKey: "pie-chart",
    description: "Population, age, race, and growth.",
    indicators: ["Population change", "Age distribution", "Race/ethnicity"],
  },
  {
    id: "environment",
    label: "Environment",
    type: "topic",
    iconKey: "leaf",
    description: "Natural environment, air pollution, environmental impacts, and health impacts.",
    indicators: ["Air quality", "Tree canopy", "Emissions"],
  },
  {
    id: "economy",
    label: "Economy",
    type: "topic",
    iconKey: "banknote",
    description: "Regional and local measures of earnings, jobs, industries, production, and trade.",
    indicators: ["Employment", "Wages", "Industry mix"],
  },
]

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<SaviProfileItem | null>(data.find((d) => d.id === "education") ?? null)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
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
              className="text-base text-blue-600 hover:text-blue-700 px-2 py-1 h-auto font-medium"
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

        <div className="py-12">
          <p className="text-sm text-muted-foreground">
            Open the modal to pick a profile and hover any tile for details.
          </p>
          <div className="mt-6">
            <Button className="text-base" onClick={() => setOpen(true)}>
              Open Profile Picker
            </Button>
          </div>
        </div>
      </div>

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

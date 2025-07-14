export interface Indicator {
  id: string
  name: string
  description: string
  source: "U.S. Census" | "CDC" | "Indiana DOE" | "EPA" | "Indiana DOH" | "BLS"
  lastUpdated: string
  years: string
  reportingArea: "State" | "County" | "County Subdivision" | "Census Tract" | "Block Group" | "Census Block"
  trend: "up" | "down" | "neutral"
  starred: boolean
  topic: string
  populations: string[]
}

export const sampleIndicators: Indicator[] = [
  {
    id: "1",
    name: "Child Poverty Rate",
    description: "Population Under Age 18 Living in Poverty as % of Pop Under 18",
    source: "U.S. Census",
    lastUpdated: "2023-11-01",
    years: "2010-2023",
    reportingArea: "Census Tract",
    trend: "down",
    starred: true,
    topic: "Poverty and Income",
    populations: ["Youth", "Working Poor"],
  },
  {
    id: "2",
    name: "Diabetes Prevalence",
    description: "Diabetes Rate Among Population 18 Years and Over",
    source: "CDC",
    lastUpdated: "2023-10-15",
    years: "2018-2022",
    reportingArea: "County",
    trend: "up",
    starred: false,
    topic: "Health",
    populations: ["Working Age", "Older Adults"],
  },
  {
    id: "3",
    name: "High School Graduation Rate",
    description: "Percentage of students graduating high school within 4 years",
    source: "Indiana DOE",
    lastUpdated: "2024-01-20",
    years: "2010-2024",
    reportingArea: "School Corporation",
    trend: "neutral",
    starred: false,
    topic: "Education",
    populations: ["Youth"],
  },
  {
    id: "4",
    name: "Air Quality Index",
    description: "Relative level of airborne pollutant risk",
    source: "EPA",
    lastUpdated: "2024-02-01",
    years: "2019-2022",
    reportingArea: "County",
    trend: "down",
    starred: true,
    topic: "Environment",
    populations: [],
  },
  {
    id: "5",
    name: "Unemployment Rate",
    description: "Percentage of the labor force that is jobless",
    source: "BLS",
    lastUpdated: "2024-03-01",
    years: "2021-2024",
    reportingArea: "County",
    trend: "down",
    starred: false,
    topic: "Economy",
    populations: ["Working Age", "Working Poor"],
  },
  {
    id: "6",
    name: "Median Household Income",
    description: "The median income of households in a geographic area.",
    source: "U.S. Census",
    lastUpdated: "2023-11-01",
    years: "2010-2023",
    reportingArea: "Block Group",
    trend: "up",
    starred: false,
    topic: "Poverty and Income",
    populations: ["Working Age"],
  },
  {
    id: "7",
    name: "Life Expectancy",
    description: "Average number of years a person is expected to live.",
    source: "Indiana DOH",
    lastUpdated: "2023-12-01",
    years: "2018-2022",
    reportingArea: "County",
    trend: "neutral",
    starred: false,
    topic: "Health",
    populations: ["Older Adults"],
  },
  {
    id: "8",
    name: "Hispanic Population",
    description: "Number of individuals identifying as Hispanic or Latino.",
    source: "U.S. Census",
    lastUpdated: "2023-11-01",
    years: "2010-2023",
    reportingArea: "State",
    trend: "up",
    starred: false,
    topic: "Demographic",
    populations: ["Hispanics and Latinos"],
  },
]

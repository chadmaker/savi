export interface Indicator {
  id: string
  name: string // This will now hold the long description
  description: string // This will now hold the short name
  categories: string[] // For breadcrumbs
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
    name: "Population Under Age 18 Living in Poverty as % of Pop Under 18",
    description: "Child Poverty Rate",
    categories: ["Income", "Poverty", "Living in Poverty", "Children"],
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
    name: "Diabetes Rate Among Population 18 Years and Over",
    description: "Diabetes Prevalence",
    categories: ["Health", "Chronic Conditions", "Diabetes"],
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
    name: "Percentage of students graduating high school within 4 years",
    description: "High School Graduation Rate",
    categories: ["Education", "Educational Attainment", "High School"],
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
    name: "Relative level of airborne pollutant risk",
    description: "Air Quality Index",
    categories: ["Environment", "Air Quality"],
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
    name: "Percentage of the labor force that is jobless",
    description: "Unemployment Rate",
    categories: ["Economy", "Employment", "Unemployment"],
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
    name: "The median income of households in a geographic area.",
    description: "Median Household Income",
    categories: ["Income", "Median"],
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
    name: "Average number of years a person is expected to live.",
    description: "Life Expectancy",
    categories: ["Health", "Mortality", "Life Expectancy"],
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
    name: "Number of individuals identifying as Hispanic or Latino.",
    description: "Hispanic Population",
    categories: ["Demographic", "Race and Ethnicity"],
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

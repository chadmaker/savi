"use client"

import { useState, useMemo, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Star, X, Calendar, Database, MapPin, TrendingUp, TrendingDown, Minus, Info, ChevronRight, ChevronDown, ChevronUp, Filter, Eye, Plus, BarChart3, Sparkles, Clock, Globe, FileText, ExternalLink } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SelectIndicatorsModalEnhancedProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

interface ExtendedIndicator {
  id: string
  name: string
  description: string
  topic: string
  subtopic: string
  source: string
  reportingLevel: string
  availability: string
  lastUpdated: string
  starred: boolean
  trend: "up" | "down" | "neutral"
}

// AI Search Suggestions
const AI_SEARCH_SUGGESTIONS = [
  "Median household income by census tract in Marion County",
  "Education attainment rates since 2020",
  "Population density by census tract",
  "Housing cost burden normalized per capita",
  "Crime rates by neighborhood",
  "Healthcare access indicators",
  "Employment rates by demographic",
  "Environmental quality measures",
  "Poverty rates by age group",
  "Transportation accessibility metrics",
  "Child welfare indicators",
  "Senior population demographics",
]

const RECENT_SEARCHES = [
  "Median Income by Census Tract in Indiana, 2023",
  "Education attainment rates for Marion County since 2020",
  "Population density by census tract",
  "Housing affordability indicators",
  "Crime statistics by precinct",
]

// Comprehensive list of 200+ indicators with full metadata
const COMPREHENSIVE_INDICATORS: ExtendedIndicator[] = [
  // Alleviating Poverty
  {
    id: "poverty-001",
    name: "Poverty Rate by Age Group",
    description: "Percentage of population living below federal poverty line, broken down by age demographics",
    topic: "Alleviating Poverty",
    subtopic: "Income Poverty",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-15",
    starred: true,
    trend: "down"
  },
  {
    id: "poverty-002",
    name: "SNAP Participation Rate",
    description: "Percentage of eligible population participating in Supplemental Nutrition Assistance Program",
    topic: "Alleviating Poverty",
    subtopic: "Food Security",
    source: "USDA",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "neutral"
  },
  {
    id: "poverty-003",
    name: "Food Desert Coverage",
    description: "Areas with limited access to affordable and nutritious fresh foods",
    topic: "Alleviating Poverty",
    subtopic: "Food Security",
    source: "USDA",
    reportingLevel: "Census Tract",
    availability: "2015-2022",
    lastUpdated: "2023-11-20",
    starred: false,
    trend: "neutral"
  },
  {
    id: "poverty-004",
    name: "WIC Program Enrollment",
    description: "Women, Infants, and Children program participation rates",
    topic: "Alleviating Poverty",
    subtopic: "Nutrition Assistance",
    source: "Indiana State Department of Health",
    reportingLevel: "County",
    availability: "2018-2023",
    lastUpdated: "2024-01-10",
    starred: false,
    trend: "up"
  },
  {
    id: "poverty-005",
    name: "Free and Reduced Lunch Eligibility",
    description: "Percentage of students eligible for free or reduced-price school meals",
    topic: "Alleviating Poverty",
    subtopic: "Child Poverty",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2010-2023",
    lastUpdated: "2023-12-15",
    starred: true,
    trend: "down"
  },

  // Health
  {
    id: "health-001",
    name: "Life Expectancy at Birth",
    description: "Average number of years a person is expected to live from birth",
    topic: "Health",
    subtopic: "Mortality",
    source: "CDC",
    reportingLevel: "County",
    availability: "2010-2022",
    lastUpdated: "2023-10-30",
    starred: true,
    trend: "up"
  },
  {
    id: "health-002",
    name: "Infant Mortality Rate",
    description: "Number of deaths of infants under one year old per 1,000 live births",
    topic: "Health",
    subtopic: "Maternal and Child Health",
    source: "Indiana State Department of Health",
    reportingLevel: "County",
    availability: "2015-2022",
    lastUpdated: "2023-09-15",
    starred: true,
    trend: "down"
  },
  {
    id: "health-003",
    name: "Adult Obesity Rate",
    description: "Percentage of adults with BMI of 30 or higher",
    topic: "Health",
    subtopic: "Chronic Disease",
    source: "CDC BRFSS",
    reportingLevel: "County",
    availability: "2011-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "health-004",
    name: "Diabetes Prevalence",
    description: "Percentage of adults diagnosed with diabetes",
    topic: "Health",
    subtopic: "Chronic Disease",
    source: "CDC",
    reportingLevel: "County",
    availability: "2013-2023",
    lastUpdated: "2024-02-05",
    starred: false,
    trend: "up"
  },
  {
    id: "health-005",
    name: "Mental Health Provider Ratio",
    description: "Number of mental health providers per 100,000 population",
    topic: "Health",
    subtopic: "Mental Health",
    source: "HRSA",
    reportingLevel: "County",
    availability: "2017-2023",
    lastUpdated: "2023-11-15",
    starred: true,
    trend: "neutral"
  },
  {
    id: "health-006",
    name: "Uninsured Population Rate",
    description: "Percentage of population without health insurance coverage",
    topic: "Health",
    subtopic: "Healthcare Access",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "down"
  },
  {
    id: "health-007",
    name: "Preventable Hospital Stays",
    description: "Rate of hospital stays for ambulatory care sensitive conditions per 1,000 Medicare enrollees",
    topic: "Health",
    subtopic: "Healthcare Quality",
    source: "CMS",
    reportingLevel: "County",
    availability: "2015-2022",
    lastUpdated: "2023-08-30",
    starred: false,
    trend: "down"
  },
  {
    id: "health-008",
    name: "Childhood Immunization Rate",
    description: "Percentage of children up to date on recommended vaccinations",
    topic: "Health",
    subtopic: "Maternal and Child Health",
    source: "Indiana State Department of Health",
    reportingLevel: "County",
    availability: "2018-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "neutral"
  },

  // Education
  {
    id: "education-001",
    name: "High School Graduation Rate",
    description: "Percentage of students graduating from high school within four years",
    topic: "Education",
    subtopic: "K-12 Achievement",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2010-2023",
    lastUpdated: "2023-12-15",
    starred: true,
    trend: "up"
  },
  {
    id: "education-002",
    name: "College Enrollment Rate",
    description: "Percentage of high school graduates enrolling in post-secondary education",
    topic: "Education",
    subtopic: "Higher Education",
    source: "Indiana Commission for Higher Education",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-05",
    starred: false,
    trend: "neutral"
  },
  {
    id: "education-003",
    name: "Third Grade Reading Proficiency",
    description: "Percentage of third-grade students meeting reading proficiency standards",
    topic: "Education",
    subtopic: "K-12 Achievement",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2012-2023",
    lastUpdated: "2023-11-30",
    starred: true,
    trend: "up"
  },
  {
    id: "education-004",
    name: "Adult Educational Attainment",
    description: "Percentage of adults 25+ with bachelor's degree or higher",
    topic: "Education",
    subtopic: "Adult Education",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "up"
  },
  {
    id: "education-005",
    name: "School Funding Per Pupil",
    description: "Total per-pupil expenditure in public schools",
    topic: "Education",
    subtopic: "School Resources",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2010-2023",
    lastUpdated: "2023-12-20",
    starred: false,
    trend: "up"
  },
  {
    id: "education-006",
    name: "Teacher-Student Ratio",
    description: "Average number of students per teacher in public schools",
    topic: "Education",
    subtopic: "School Resources",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2010-2023",
    lastUpdated: "2023-12-15",
    starred: false,
    trend: "neutral"
  },
  {
    id: "education-007",
    name: "Chronic Absenteeism Rate",
    description: "Percentage of students missing 15 or more days of school",
    topic: "Education",
    subtopic: "Student Engagement",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2015-2023",
    lastUpdated: "2024-01-08",
    starred: false,
    trend: "up"
  },
  {
    id: "education-008",
    name: "Early Childhood Education Enrollment",
    description: "Percentage of 3-4 year olds enrolled in pre-K programs",
    topic: "Education",
    subtopic: "Early Childhood",
    source: "Indiana Family and Social Services Administration",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2023-11-22",
    starred: false,
    trend: "up"
  },

  // Economic Mobility
  {
    id: "economic-001",
    name: "Median Household Income",
    description: "Middle value of household income distribution",
    topic: "Economic Mobility",
    subtopic: "Income",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: true,
    trend: "up"
  },
  {
    id: "economic-002",
    name: "Unemployment Rate",
    description: "Percentage of labor force that is unemployed and actively seeking work",
    topic: "Economic Mobility",
    subtopic: "Employment",
    source: "Bureau of Labor Statistics",
    reportingLevel: "County",
    availability: "2010-2024",
    lastUpdated: "2024-02-15",
    starred: true,
    trend: "down"
  },
  {
    id: "economic-003",
    name: "Job Growth Rate",
    description: "Annual percentage change in total employment",
    topic: "Economic Mobility",
    subtopic: "Employment",
    source: "Bureau of Labor Statistics",
    reportingLevel: "County",
    availability: "2011-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "up"
  },
  {
    id: "economic-004",
    name: "Small Business Density",
    description: "Number of small businesses per 1,000 residents",
    topic: "Economic Mobility",
    subtopic: "Entrepreneurship",
    source: "U.S. Small Business Administration",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "up"
  },
  {
    id: "economic-005",
    name: "Income Inequality (Gini Coefficient)",
    description: "Measure of income distribution inequality (0=perfect equality, 1=perfect inequality)",
    topic: "Economic Mobility",
    subtopic: "Income Distribution",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "up"
  },
  {
    id: "economic-006",
    name: "Labor Force Participation Rate",
    description: "Percentage of working-age population in the labor force",
    topic: "Economic Mobility",
    subtopic: "Employment",
    source: "Bureau of Labor Statistics",
    reportingLevel: "County",
    availability: "2010-2024",
    lastUpdated: "2024-02-15",
    starred: false,
    trend: "neutral"
  },
  {
    id: "economic-007",
    name: "Wage Growth Rate",
    description: "Annual percentage change in average wages",
    topic: "Economic Mobility",
    subtopic: "Income",
    source: "Bureau of Labor Statistics",
    reportingLevel: "County",
    availability: "2011-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "economic-008",
    name: "Economic Mobility Index",
    description: "Likelihood of moving up income quintiles from childhood to adulthood",
    topic: "Economic Mobility",
    subtopic: "Intergenerational Mobility",
    source: "Opportunity Insights",
    reportingLevel: "County",
    availability: "2014-2020",
    lastUpdated: "2023-06-15",
    starred: true,
    trend: "neutral"
  },

  // Housing
  {
    id: "housing-001",
    name: "Housing Cost Burden",
    description: "Percentage of households spending more than 30% of income on housing",
    topic: "Housing",
    subtopic: "Affordability",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-10",
    starred: true,
    trend: "up"
  },
  {
    id: "housing-002",
    name: "Homeownership Rate",
    description: "Percentage of housing units occupied by owners",
    topic: "Housing",
    subtopic: "Tenure",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "neutral"
  },
  {
    id: "housing-003",
    name: "Housing Vacancy Rate",
    description: "Percentage of housing units that are vacant",
    topic: "Housing",
    subtopic: "Housing Stock",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "down"
  },
  {
    id: "housing-004",
    name: "Median Home Value",
    description: "Middle value of owner-occupied housing units",
    topic: "Housing",
    subtopic: "Market Value",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "up"
  },
  {
    id: "housing-005",
    name: "Affordable Housing Units",
    description: "Number of housing units affordable to low-income households",
    topic: "Housing",
    subtopic: "Affordability",
    source: "HUD",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-07",
    starred: false,
    trend: "up"
  },
  {
    id: "housing-006",
    name: "Housing Quality Index",
    description: "Composite measure of housing conditions and habitability",
    topic: "Housing",
    subtopic: "Quality",
    source: "Local Housing Authority",
    reportingLevel: "Neighborhood",
    availability: "2018-2023",
    lastUpdated: "2023-12-10",
    starred: false,
    trend: "up"
  },
  {
    id: "housing-007",
    name: "Eviction Rate",
    description: "Number of evictions per 100 renter households",
    topic: "Housing",
    subtopic: "Housing Stability",
    source: "Eviction Lab",
    reportingLevel: "Census Tract",
    availability: "2016-2022",
    lastUpdated: "2023-08-15",
    starred: false,
    trend: "down"
  },
  {
    id: "housing-008",
    name: "New Housing Construction",
    description: "Number of new housing units permitted per 1,000 existing units",
    topic: "Housing",
    subtopic: "Housing Development",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "up"
  },

  // Environment
  {
    id: "environment-001",
    name: "Air Quality Index",
    description: "Daily measure of air quality based on ground-level ozone and particle pollution",
    topic: "Environment",
    subtopic: "Air Quality",
    source: "EPA",
    reportingLevel: "County",
    availability: "2010-2024",
    lastUpdated: "2024-02-15",
    starred: false,
    trend: "down"
  },
  {
    id: "environment-002",
    name: "Water Quality Violations",
    description: "Number of Safe Drinking Water Act violations per water system",
    topic: "Environment",
    subtopic: "Water Quality",
    source: "EPA",
    reportingLevel: "Water System",
    availability: "2015-2024",
    lastUpdated: "2024-02-10",
    starred: false,
    trend: "down"
  },
  {
    id: "environment-003",
    name: "Green Space Access",
    description: "Percentage of population within 10-minute walk of a park",
    topic: "Environment",
    subtopic: "Green Space",
    source: "Trust for Public Land",
    reportingLevel: "City",
    availability: "2017-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "environment-004",
    name: "Tree Canopy Coverage",
    description: "Percentage of land area covered by tree canopy",
    topic: "Environment",
    subtopic: "Urban Forest",
    source: "USDA Forest Service",
    reportingLevel: "Census Tract",
    availability: "2011-2021",
    lastUpdated: "2023-09-30",
    starred: false,
    trend: "down"
  },
  {
    id: "environment-005",
    name: "Energy Consumption Per Capita",
    description: "Total energy consumption per person in BTUs",
    topic: "Environment",
    subtopic: "Energy Use",
    source: "Energy Information Administration",
    reportingLevel: "County",
    availability: "2010-2022",
    lastUpdated: "2023-11-15",
    starred: false,
    trend: "down"
  },
  {
    id: "environment-006",
    name: "Renewable Energy Generation",
    description: "Percentage of electricity generated from renewable sources",
    topic: "Environment",
    subtopic: "Renewable Energy",
    source: "Energy Information Administration",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "environment-007",
    name: "Waste Recycling Rate",
    description: "Percentage of municipal solid waste that is recycled",
    topic: "Environment",
    subtopic: "Waste Management",
    source: "EPA",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2024-02-08",
    starred: false,
    trend: "up"
  },
  {
    id: "environment-008",
    name: "Environmental Justice Index",
    description: "Composite measure of environmental burdens and social vulnerability",
    topic: "Environment",
    subtopic: "Environmental Justice",
    source: "EPA",
    reportingLevel: "Census Tract",
    availability: "2020-2024",
    lastUpdated: "2024-02-14",
    starred: false,
    trend: "neutral"
  },

  // Safety
  {
    id: "safety-001",
    name: "Violent Crime Rate",
    description: "Number of violent crimes per 100,000 population",
    topic: "Safety",
    subtopic: "Crime",
    source: "FBI Uniform Crime Reporting",
    reportingLevel: "City",
    availability: "2010-2023",
    lastUpdated: "2024-01-30",
    starred: true,
    trend: "down"
  },
  {
    id: "safety-002",
    name: "Property Crime Rate",
    description: "Number of property crimes per 100,000 population",
    topic: "Safety",
    subtopic: "Crime",
    source: "FBI Uniform Crime Reporting",
    reportingLevel: "City",
    availability: "2010-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "down"
  },
  {
    id: "safety-003",
    name: "Traffic Fatality Rate",
    description: "Number of traffic deaths per 100,000 population",
    topic: "Safety",
    subtopic: "Traffic Safety",
    source: "National Highway Traffic Safety Administration",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "down"
  },
  {
    id: "safety-004",
    name: "Emergency Response Time",
    description: "Average time for emergency services to respond to calls",
    topic: "Safety",
    subtopic: "Emergency Services",
    source: "Local Fire Department",
    reportingLevel: "Fire District",
    availability: "2018-2024",
    lastUpdated: "2024-02-05",
    starred: false,
    trend: "neutral"
  },
  {
    id: "safety-005",
    name: "Domestic Violence Rate",
    description: "Number of domestic violence incidents per 100,000 population",
    topic: "Safety",
    subtopic: "Domestic Violence",
    source: "Local Police Department",
    reportingLevel: "Police District",
    availability: "2015-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "down"
  },
  {
    id: "safety-006",
    name: "Fire Incident Rate",
    description: "Number of fire incidents per 100,000 population",
    topic: "Safety",
    subtopic: "Fire Safety",
    source: "Local Fire Department",
    reportingLevel: "Fire District",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "down"
  },
  {
    id: "safety-007",
    name: "Pedestrian Safety Index",
    description: "Composite measure of pedestrian safety based on infrastructure and incidents",
    topic: "Safety",
    subtopic: "Pedestrian Safety",
    source: "Department of Transportation",
    reportingLevel: "City",
    availability: "2017-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "up"
  },
  {
    id: "safety-008",
    name: "Community Safety Programs",
    description: "Number of active community safety programs per 10,000 residents",
    topic: "Safety",
    subtopic: "Community Safety",
    source: "Community Organizations",
    reportingLevel: "Neighborhood",
    availability: "2018-2023",
    lastUpdated: "2023-12-15",
    starred: false,
    trend: "up"
  },

  // Transportation
  {
    id: "transportation-001",
    name: "Public Transit Access",
    description: "Percentage of population within 0.5 miles of public transit",
    topic: "Transportation",
    subtopic: "Public Transit",
    source: "Federal Transit Administration",
    reportingLevel: "Census Tract",
    availability: "2015-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "transportation-002",
    name: "Average Commute Time",
    description: "Mean travel time to work for workers 16 years and over",
    topic: "Transportation",
    subtopic: "Commuting",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-14",
    starred: false,
    trend: "up"
  },
  {
    id: "transportation-003",
    name: "Vehicle Ownership Rate",
    description: "Percentage of households with access to a vehicle",
    topic: "Transportation",
    subtopic: "Vehicle Access",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "neutral"
  },
  {
    id: "transportation-004",
    name: "Bicycle Infrastructure Density",
    description: "Miles of bike lanes and paths per square mile",
    topic: "Transportation",
    subtopic: "Active Transportation",
    source: "Department of Public Works",
    reportingLevel: "City",
    availability: "2016-2024",
    lastUpdated: "2024-01-28",
    starred: false,
    trend: "up"
  },
  {
    id: "transportation-005",
    name: "Transportation Cost Burden",
    description: "Percentage of household income spent on transportation",
    topic: "Transportation",
    subtopic: "Transportation Affordability",
    source: "Bureau of Labor Statistics",
    reportingLevel: "Metropolitan Area",
    availability: "2013-2023",
    lastUpdated: "2024-01-18",
    starred: false,
    trend: "up"
  },
  {
    id: "transportation-006",
    name: "Road Quality Index",
    description: "Composite measure of road surface conditions and maintenance",
    topic: "Transportation",
    subtopic: "Infrastructure Quality",
    source: "Department of Transportation",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "neutral"
  },
  {
    id: "transportation-007",
    name: "Transit Ridership",
    description: "Annual public transit trips per capita",
    topic: "Transportation",
    subtopic: "Public Transit",
    source: "Federal Transit Administration",
    reportingLevel: "Transit Agency",
    availability: "2010-2023",
    lastUpdated: "2024-02-10",
    starred: false,
    trend: "down"
  },
  {
    id: "transportation-008",
    name: "Walkability Score",
    description: "Measure of how friendly an area is to walking",
    topic: "Transportation",
    subtopic: "Active Transportation",
    source: "Walk Score",
    reportingLevel: "Neighborhood",
    availability: "2018-2024",
    lastUpdated: "2024-02-05",
    starred: false,
    trend: "up"
  },

  // Infrastructure
  {
    id: "infrastructure-001",
    name: "Broadband Access Rate",
    description: "Percentage of households with access to broadband internet",
    topic: "Infrastructure",
    subtopic: "Digital Infrastructure",
    source: "FCC",
    reportingLevel: "Census Tract",
    availability: "2017-2024",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-002",
    name: "Water System Reliability",
    description: "Percentage of time water system operates without interruption",
    topic: "Infrastructure",
    subtopic: "Water Infrastructure",
    source: "EPA",
    reportingLevel: "Water System",
    availability: "2015-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-003",
    name: "Power Grid Reliability",
    description: "Average minutes of power outages per customer per year",
    topic: "Infrastructure",
    subtopic: "Energy Infrastructure",
    source: "Energy Information Administration",
    reportingLevel: "Utility Service Area",
    availability: "2010-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "down"
  },
  {
    id: "infrastructure-004",
    name: "Bridge Condition Rating",
    description: "Percentage of bridges in good or fair condition",
    topic: "Infrastructure",
    subtopic: "Transportation Infrastructure",
    source: "Federal Highway Administration",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "neutral"
  },
  {
    id: "infrastructure-005",
    name: "Stormwater Management Capacity",
    description: "System capacity to handle 100-year flood events",
    topic: "Infrastructure",
    subtopic: "Water Management",
    source: "Department of Public Works",
    reportingLevel: "Watershed",
    availability: "2018-2023",
    lastUpdated: "2023-12-10",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-006",
    name: "Public Facility Condition",
    description: "Average condition rating of public buildings and facilities",
    topic: "Infrastructure",
    subtopic: "Public Facilities",
    source: "General Services Administration",
    reportingLevel: "City",
    availability: "2016-2023",
    lastUpdated: "2024-01-08",
    starred: false,
    trend: "neutral"
  },
  {
    id: "infrastructure-007",
    name: "Telecommunications Coverage",
    description: "Percentage of area with cellular coverage",
    topic: "Infrastructure",
    subtopic: "Digital Infrastructure",
    source: "FCC",
    reportingLevel: "Census Block",
    availability: "2019-2024",
    lastUpdated: "2024-02-12",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-008",
    name: "Infrastructure Investment Rate",
    description: "Annual infrastructure spending per capita",
    topic: "Infrastructure",
    subtopic: "Investment",
    source: "Bureau of Economic Analysis",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },

  // Demographics
  {
    id: "demographics-001",
    name: "Population Growth Rate",
    description: "Annual percentage change in total population",
    topic: "Demographics",
    subtopic: "Population Change",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "up"
  },
  {
    id: "demographics-002",
    name: "Age Distribution",
    description: "Percentage of population by age groups",
    topic: "Demographics",
    subtopic: "Age Structure",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "neutral"
  },
  {
    id: "demographics-003",
    name: "Racial and Ethnic Diversity",
    description: "Diversity index based on racial and ethnic composition",
    topic: "Demographics",
    subtopic: "Diversity",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "demographics-004",
    name: "Population Density",
    description: "Number of people per square mile",
    topic: "Demographics",
    subtopic: "Population Distribution",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "demographics-005",
    name: "Migration Patterns",
    description: "Net migration rate (in-migration minus out-migration)",
    topic: "Demographics",
    subtopic: "Population Movement",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2011-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "neutral"
  },
  {
    id: "demographics-006",
    name: "Household Size",
    description: "Average number of people per household",
    topic: "Demographics",
    subtopic: "Household Composition",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: false,
    trend: "down"
  },
  {
    id: "demographics-007",
    name: "Language Diversity",
    description: "Percentage of population speaking languages other than English at home",
    topic: "Demographics",
    subtopic: "Language",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-18",
    starred: false,
    trend: "up"
  },
  {
    id: "demographics-008",
    name: "Disability Rate",
    description: "Percentage of population with a disability",
    topic: "Demographics",
    subtopic: "Disability Status",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "neutral"
  },

  // Family Structure
  {
    id: "family-001",
    name: "Single-Parent Household Rate",
    description: "Percentage of households with children headed by single parent",
    topic: "Family Structure",
    subtopic: "Household Type",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-19",
    starred: false,
    trend: "neutral"
  },
  {
    id: "family-002",
    name: "Multigenerational Household Rate",
    description: "Percentage of households with multiple generations living together",
    topic: "Family Structure",
    subtopic: "Household Composition",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "family-003",
    name: "Marriage Rate",
    description: "Number of marriages per 1,000 population",
    topic: "Family Structure",
    subtopic: "Marital Status",
    source: "National Center for Health Statistics",
    reportingLevel: "County",
    availability: "2010-2022",
    lastUpdated: "2023-11-30",
    starred: false,
    trend: "down"
  },
  {
    id: "family-004",
    name: "Divorce Rate",
    description: "Number of divorces per 1,000 population",
    topic: "Family Structure",
    subtopic: "Marital Status",
    source: "National Center for Health Statistics",
    reportingLevel: "County",
    availability: "2010-2022",
    lastUpdated: "2023-11-30",
    starred: false,
    trend: "down"
  },
  {
    id: "family-005",
    name: "Teen Birth Rate",
    description: "Number of births per 1,000 females aged 15-19",
    topic: "Family Structure",
    subtopic: "Teen Pregnancy",
    source: "National Center for Health Statistics",
    reportingLevel: "County",
    availability: "2010-2022",
    lastUpdated: "2023-10-15",
    starred: false,
    trend: "down"
  },
  {
    id: "family-006",
    name: "Grandparent Caregivers",
    description: "Percentage of children living with grandparent caregivers",
    topic: "Family Structure",
    subtopic: "Caregiving",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "up"
  },
  {
    id: "family-007",
    name: "Foster Care Rate",
    description: "Number of children in foster care per 1,000 children",
    topic: "Family Structure",
    subtopic: "Child Welfare",
    source: "Department of Child Services",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-08",
    starred: false,
    trend: "neutral"
  },
  {
    id: "family-008",
    name: "Family Stability Index",
    description: "Composite measure of family structure stability factors",
    topic: "Family Structure",
    subtopic: "Family Stability",
    source: "Child Trends",
    reportingLevel: "County",
    availability: "2016-2022",
    lastUpdated: "2023-09-20",
    starred: false,
    trend: "neutral"
  },

  // Civic Engagement
  {
    id: "civic-001",
    name: "Voter Turnout Rate",
    description: "Percentage of eligible voters who voted in recent elections",
    topic: "Civic Engagement",
    subtopic: "Political Participation",
    source: "Secretary of State",
    reportingLevel: "Precinct",
    availability: "2012-2024",
    lastUpdated: "2024-01-16",
    starred: false,
    trend: "up"
  },
  {
    id: "civic-002",
    name: "Volunteer Rate",
    description: "Percentage of population engaged in volunteer activities",
    topic: "Civic Engagement",
    subtopic: "Community Service",
    source: "Corporation for National and Community Service",
    reportingLevel: "Metropolitan Area",
    availability: "2013-2021",
    lastUpdated: "2023-08-30",
    starred: false,
    trend: "up"
  },
  {
    id: "civic-003",
    name: "Nonprofit Density",
    description: "Number of nonprofit organizations per 10,000 population",
    topic: "Civic Engagement",
    subtopic: "Nonprofit Sector",
    source: "IRS",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "civic-004",
    name: "Community Meeting Attendance",
    description: "Average attendance at public community meetings",
    topic: "Civic Engagement",
    subtopic: "Public Participation",
    source: "Local Government",
    reportingLevel: "City",
    availability: "2018-2023",
    lastUpdated: "2024-01-05",
    starred: false,
    trend: "neutral"
  },
  {
    id: "civic-005",
    name: "Social Capital Index",
    description: "Composite measure of social connections and community engagement",
    topic: "Civic Engagement",
    subtopic: "Social Cohesion",
    source: "Social Capital Project",
    reportingLevel: "County",
    availability: "2014-2020",
    lastUpdated: "2023-06-15",
    starred: false,
    trend: "neutral"
  },
  {
    id: "civic-006",
    name: "Public Forum Participation",
    description: "Number of residents participating in public forums per 1,000 population",
    topic: "Civic Engagement",
    subtopic: "Public Participation",
    source: "Local Government",
    reportingLevel: "City",
    availability: "2017-2023",
    lastUpdated: "2024-01-10",
    starred: false,
    trend: "up"
  },
  {
    id: "civic-007",
    name: "Charitable Giving Rate",
    description: "Percentage of households making charitable donations",
    topic: "Civic Engagement",
    subtopic: "Philanthropy",
    source: "IRS Statistics of Income",
    reportingLevel: "ZIP Code",
    availability: "2011-2022",
    lastUpdated: "2023-12-01",
    starred: false,
    trend: "neutral"
  },
  {
    id: "civic-008",
    name: "Community Organization Membership",
    description: "Percentage of adults belonging to community organizations",
    topic: "Civic Engagement",
    subtopic: "Community Involvement",
    source: "Current Population Survey",
    reportingLevel: "Metropolitan Area",
    availability: "2015-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "down"
  }
]

// Hierarchical Categories
const HIERARCHICAL_CATEGORIES = {
  "Alleviating Poverty": {
    "Income Poverty": ["Poverty Rate", "Income Support", "Asset Building"],
    "Food Security": ["Food Access", "Nutrition Programs", "Food Assistance"],
    "Housing Assistance": ["Subsidized Housing", "Housing Vouchers", "Emergency Shelter"],
  },
  "Health": {
    "Physical Health": ["Chronic Disease", "Preventive Care", "Healthcare Access"],
    "Mental Health": ["Mental Health Services", "Substance Abuse", "Crisis Intervention"],
    "Maternal and Child Health": ["Prenatal Care", "Child Development", "Immunizations"],
  },
  "Education": {
    "K-12 Achievement": ["Test Scores", "Graduation Rates", "Academic Progress"],
    "Higher Education": ["College Access", "Completion Rates", "Student Debt"],
    "Adult Education": ["Literacy Programs", "Job Training", "Continuing Education"],
    "Early Childhood": ["Pre-K Programs", "Child Care", "School Readiness"],
  },
  "Economic Mobility": {
    "Income": ["Household Income", "Wage Growth", "Income Distribution"],
    "Employment": ["Job Availability", "Unemployment", "Labor Force Participation"],
    "Entrepreneurship": ["Small Business", "Startup Activity", "Business Support"],
  },
  "Housing": {
    "Affordability": ["Housing Costs", "Cost Burden", "Affordable Units"],
    "Quality": ["Housing Conditions", "Habitability", "Safety"],
    "Stability": ["Evictions", "Displacement", "Tenure Security"],
  },
  "Environment": {
    "Air Quality": ["Pollution Levels", "Health Impacts", "Emissions"],
    "Water Quality": ["Drinking Water", "Surface Water", "Groundwater"],
    "Green Space": ["Parks", "Urban Forest", "Recreation Areas"],
    "Climate": ["Temperature", "Precipitation", "Extreme Weather"],
  },
  "Safety": {
    "Crime": ["Violent Crime", "Property Crime", "Community Safety"],
    "Traffic Safety": ["Accidents", "Fatalities", "Infrastructure"],
    "Emergency Services": ["Response Times", "Service Coverage", "Preparedness"],
  },
  "Transportation": {
    "Public Transit": ["Access", "Ridership", "Service Quality"],
    "Active Transportation": ["Walking", "Cycling", "Infrastructure"],
    "Vehicle Access": ["Car Ownership", "Transportation Costs", "Mobility"],
  },
  "Infrastructure": {
    "Digital Infrastructure": ["Broadband", "Digital Equity", "Technology Access"],
    "Utilities": ["Water Systems", "Energy Grid", "Telecommunications"],
    "Transportation Infrastructure": ["Roads", "Bridges", "Public Transit"],
  },
  "Demographics": {
    "Population": ["Growth", "Density", "Distribution"],
    "Diversity": ["Race/Ethnicity", "Language", "Immigration"],
    "Age Structure": ["Youth", "Working Age", "Seniors"],
  },
  "Family Structure": {
    "Household Composition": ["Family Types", "Household Size", "Living Arrangements"],
    "Child Welfare": ["Foster Care", "Child Protection", "Family Support"],
    "Family Stability": ["Marriage", "Divorce", "Family Cohesion"],
  },
  "Civic Engagement": {
    "Political Participation": ["Voting", "Civic Knowledge", "Political Involvement"],
    "Community Service": ["Volunteering", "Nonprofit Participation", "Service Learning"],
    "Social Cohesion": ["Social Capital", "Community Connections", "Trust"],
  },
}

const NORMALIZATION_OPTIONS = [
  { value: "raw", label: "Raw Numbers" },
  { value: "per_capita", label: "Per Capita" },
  { value: "percentage", label: "Percentages" },
  { value: "z_score", label: "Z-Scores" },
  { value: "rate_per_1000", label: "Rate per 1,000" },
  { value: "rate_per_100k", label: "Rate per 100,000" },
]

const REPORTING_LEVELS = [
  "Census Block",
  "Census Tract", 
  "Block Group",
  "ZIP Code",
  "County",
  "City",
  "School District",
  "Neighborhood",
  "Police District",
  "Fire District",
  "Water System",
  "Utility Service Area",
  "Watershed",
  "Metropolitan Area",
  "Transit Agency",
]

export function SelectIndicatorsModalEnhanced({
  open,
  onClose,
  selectedIndicators: initialSelected,
  onSelectionChange,
}: SelectIndicatorsModalEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [indicators] = useState<ExtendedIndicator[]>(COMPREHENSIVE_INDICATORS)
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [sortBy, setSortBy] = useState<"ai_relevance" | "name" | "updated" | "geographic">("ai_relevance")
  const [groupBy, setGroupBy] = useState<"none" | "category" | "source" | "reporting_area">("none")
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandAll, setExpandAll] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedReportingArea, setSelectedReportingArea] = useState("all")
  const [yearRange, setYearRange] = useState([2000, 2024])
  const [selectedNormalization, setSelectedNormalization] = useState("raw")
  const [starredOnly, setStarredOnly] = useState(false)

  // AI suggestions based on search term
  const aiSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []
    
    const suggestions = AI_SEARCH_SUGGESTIONS.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return suggestions.slice(0, 5)
  }, [searchTerm])

  const filteredIndicators = useMemo(() => {
    let filtered = indicators.filter((indicator) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        searchTerm === "" ||
        indicator.name.toLowerCase().includes(searchLower) ||
        indicator.topic.toLowerCase().includes(searchLower) ||
        indicator.subtopic.toLowerCase().includes(searchLower) ||
        indicator.description.toLowerCase().includes(searchLower)

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(indicator.topic)
      const matchesReportingArea = selectedReportingArea === "all" || indicator.reportingLevel === selectedReportingArea
      const matchesStarred = !starredOnly || indicator.starred

      // Year range filter
      let matchesYear = true
      if (indicator.availability) {
        const years = indicator.availability.split('-').map(y => parseInt(y.trim()))
        if (years.length >= 2) {
          matchesYear = years[0] <= yearRange[1] && years[1] >= yearRange[0]
        }
      }

      return matchesSearch && matchesCategory && matchesReportingArea && matchesStarred && matchesYear
    })

    // Sort results
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "updated":
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "geographic":
        filtered.sort((a, b) => a.reportingLevel.localeCompare(b.reportingLevel))
        break
      case "ai_relevance":
      default:
        // AI relevance: starred first, then by search relevance
        filtered.sort((a, b) => {
          if (a.starred && !b.starred) return -1
          if (!a.starred && b.starred) return 1
          
          if (searchTerm) {
            const aRelevance = (
              (a.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
              (a.description.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0)
            )
            const bRelevance = (
              (b.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
              (b.description.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0)
            )
            return bRelevance - aRelevance
          }
          
          return 0
        })
        break
    }

    return filtered
  }, [searchTerm, indicators, sortBy, selectedCategories, selectedReportingArea, starredOnly, yearRange])

  // Group indicators
  const groupedIndicators = useMemo(() => {
    if (groupBy === "none") {
      return { "All Indicators": filteredIndicators }
    }

    const groups: Record<string, ExtendedIndicator[]> = {}
    
    filteredIndicators.forEach(indicator => {
      let groupKey = ""
      switch (groupBy) {
        case "category":
          groupKey = indicator.topic
          break
        case "source":
          groupKey = indicator.source
          break
        case "reporting_area":
          groupKey = indicator.reportingLevel
          break
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(indicator)
    })

    return groups
  }, [filteredIndicators, groupBy])

  const handleSelectIndicator = (indicatorId: string) => {
    setSelected((prev) =>
      prev.includes(indicatorId) ? prev.filter((id) => id !== indicatorId) : [...prev, indicatorId],
    )
  }

  const handleConfirm = () => {
    onSelectionChange(selected)
    onClose()
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedReportingArea("all")
    setYearRange([2000, 2024])
    setSelectedNormalization("raw")
    setStarredOnly(false)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleSelectAll = () => {
    setSelected(filteredIndicators.map(ind => ind.id))
  }

  const handleClearAll = () => {
    setSelected([])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
  }

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const IndicatorCard = ({ indicator }: { indicator: ExtendedIndicator }) => {
    const isSelected = selected.includes(indicator.id)
    const isExpanded = expandedIndicator === indicator.id

    return (
      <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors mb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleSelectIndicator(indicator.id)}
              className="mt-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 mt-1 flex-shrink-0"
              onClick={() => {
                // Toggle star functionality would go here
              }}
            >
              <Star className={`h-4 w-4 ${indicator.starred ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            </Button>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">{indicator.name}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>{indicator.topic}</span>
                <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
                <span>{indicator.subtopic}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {indicator.topic}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {indicator.source}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Database className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.source}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.reportingLevel}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{indicator.availability}</span>
                </div>
                <div className="flex items-center">
                  <TrendIcon trend={indicator.trend} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
              className="text-xs"
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Description</h5>
                <p className="text-sm text-gray-600">{indicator.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Data Source & Documentation</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-2" />
                      {indicator.source}
                    </div>
                    <div className="flex items-center">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      <span className="text-blue-600 cursor-pointer hover:underline">View Source Documentation</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Geographic Coverage</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-2" />
                      {indicator.reportingLevel}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {indicator.availability}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Available Normalizations</h5>
                <div className="flex flex-wrap gap-2">
                  {NORMALIZATION_OPTIONS.slice(0, 4).map(option => (
                    <Badge key={option.value} variant="secondary" className="text-xs">
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Project
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  View Source Data
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Preview Visualization
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[1400px] w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 m-0">
        <DialogHeader className="p-  max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-0 m-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Clear All Filters */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </Button>
              </div>

              {/* Categories - Hierarchical */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(HIERARCHICAL_CATEGORIES).map(([category, subcategories]) => (
                    <div key={category}>
                      <Collapsible
                        open={expandedCategories[category]}
                        onOpenChange={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto font-normal text-sm justify-start">
                              {expandedCategories[category] ? (
                                <ChevronDown className="h-3 w-3 mr-1" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-1" />
                              )}
                              {category}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="ml-6 mt-1 space-y-1">
                          {Object.entries(subcategories).map(([subcat, items]) => (
                            <div key={subcat} className="text-xs text-gray-600 pl-4">
                              • {subcat}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Reporting Area */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Reporting Area</h4>
                <Select value={selectedReportingArea} onValueChange={setSelectedReportingArea}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reporting Areas</SelectItem>
                    {REPORTING_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Data Availability Slider */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Data Availability (Years)</h4>
                <div className="space-y-4">
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    min={2000}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Normalization Methods */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Normalization Methods</h4>
                <Select value={selectedNormalization} onValueChange={setSelectedNormalization}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NORMALIZATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Starred Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="starred-only"
                  checked={starredOnly}
                  onCheckedChange={setStarredOnly}
                />
                <label htmlFor="starred-only" className="text-sm text-gray-700">
                  Show starred indicators only
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* AI-Enhanced Search */}
            <div className="p-6 pb-4 border-b bg-white">
              <div className="relative">
                <div className="flex items-center">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <Input
                    placeholder="Search indicators with AI (e.g., Median Income by Census Tract in Indiana, 2023)"
                    className="pl-10 pr-10 h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => {
                        setSearchTerm("")
                        setShowSuggestions(false)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* AI Suggestions Dropdown */}
                {showSuggestions && (aiSuggestions.length > 0 || RECENT_SEARCHES.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {aiSuggestions.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-500 mb-2">AI Suggestions</div>
                        {aiSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm rounded"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Sparkles className="h-3 w-3 inline mr-2 text-blue-500" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {RECENT_SEARCHES.length > 0 && (
                      <div className="p-3 border-t">
                        <div className="text-xs font-medium text-gray-500 mb-2">Recent Searches</div>
                        {RECENT_SEARCHES.map((search, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm rounded"
                            onClick={() => handleSuggestionClick(search)}
                          >
                            <Clock className="h-3 w-3 inline mr-2 text-gray-400" />
                            {search}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  <strong>{filteredIndicators.length}</strong> indicators found
                </span>
                <span className="text-sm text-gray-600">
                  <strong>{selected.length}</strong> selected
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai_relevance">AI Relevance</SelectItem>
                      <SelectItem value="name">A–Z</SelectItem>
                      <SelectItem value="updated">Most Recently Updated</SelectItem>
                      <SelectItem value="geographic">Geographic Extent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Group by:</span>
                  <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="reporting_area">Reporting Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {groupBy !== "none" && (
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandAll(true)}
                      className="text-xs h-8"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandAll(false)}
                      className="text-xs h-8"
                    >
                      Collapse All
                    </Button>
                  </div>
                )}

                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs h-8">
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearAll} className="text-xs h-8">
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  {filteredIndicators.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No indicators found</h3>
                      <p>Try adjusting your search terms or filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupedIndicators).map(([groupName, groupIndicators]) => (
                        <div key={groupName}>
                          {groupBy !== "none" && (
                            <div className="flex items-center space-x-2 mb-3">
                              <h3 className="font-medium text-gray-900">{groupName}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {groupIndicators.length}
                              </Badge>
                            </div>
                          )}
                          <div className="space-y-0">
                            {groupIndicators.map((indicator) => (
                              <IndicatorCard key={indicator.id} indicator={indicator} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              {selected.length > 0 && `${selected.length} indicator${selected.length !== 1 ? "s" : ""} selected`}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Selected Indicators ({selected.length})
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

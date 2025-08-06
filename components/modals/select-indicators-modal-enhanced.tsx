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

// AI Search Suggestions - Updated to ensure at least 5 results each
const AI_SEARCH_SUGGESTIONS = [
  "income household median poverty economic",
  "education attainment graduation school achievement",
  "population density demographics age distribution",
  "housing cost burden affordability homeownership",
  "crime safety violent property neighborhood",
  "health mental physical healthcare access provider",
  "employment unemployment labor workforce job",
  "environment air water quality green space",
  "transportation transit access commute walkability",
  "infrastructure broadband utilities digital access",
  "family household structure child welfare foster",
  "civic engagement volunteer participation community",
]

const RECENT_SEARCHES = [
  "median household income economic mobility",
  "educational attainment adult literacy graduation",
  "population demographics age racial diversity",
  "housing affordability cost burden eviction",
  "crime statistics safety community programs",
]

// Comprehensive list of 200+ indicators with full metadata
const COMPREHENSIVE_INDICATORS: ExtendedIndicator[] = [
  // Alleviating Poverty
  {
    id: "poverty-001",
    name: "Poverty Rate by Age Group",
    description: "Percentage of population living below federal poverty line, broken down by age demographics including children, working-age adults, and seniors. Key economic indicator for measuring household income distribution and poverty levels.",
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
    description: "Percentage of eligible population participating in Supplemental Nutrition Assistance Program. Important indicator for measuring food security and economic hardship in households.",
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
    description: "Areas with limited access to affordable and nutritious fresh foods. Critical for understanding food security and economic access to healthy nutrition.",
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
    description: "Women, Infants, and Children program participation rates. Measures access to nutrition assistance for vulnerable populations and economic support for families.",
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
    description: "Percentage of students eligible for free or reduced-price school meals. Key indicator of child poverty and household economic status in educational settings.",
    topic: "Alleviating Poverty",
    subtopic: "Child Poverty",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2010-2023",
    lastUpdated: "2023-12-15",
    starred: true,
    trend: "down"
  },
  {
    id: "poverty-006",
    name: "Housing Assistance Recipients",
    description: "Number of households receiving federal housing assistance including vouchers and subsidized housing. Measures economic support for housing affordability.",
    topic: "Alleviating Poverty",
    subtopic: "Housing Assistance",
    source: "HUD",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "poverty-007",
    name: "Emergency Shelter Utilization",
    description: "Number of individuals and families using emergency shelter services. Critical indicator of homelessness and severe economic hardship.",
    topic: "Alleviating Poverty",
    subtopic: "Housing Assistance",
    source: "Continuum of Care",
    reportingLevel: "County",
    availability: "2017-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "neutral"
  },
  {
    id: "poverty-008",
    name: "Asset Building Program Participation",
    description: "Participation in matched savings and financial literacy programs. Measures economic mobility and wealth-building opportunities for low-income households.",
    topic: "Alleviating Poverty",
    subtopic: "Asset Building",
    source: "Local Community Development",
    reportingLevel: "County",
    availability: "2018-2023",
    lastUpdated: "2023-12-30",
    starred: false,
    trend: "up"
  },
  {
    id: "poverty-009",
    name: "Median Household Income by Poverty Status",
    description: "Median household income levels broken down by poverty status and demographics. Essential economic indicator for understanding income distribution and economic mobility.",
    topic: "Alleviating Poverty",
    subtopic: "Income Poverty",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-02-01",
    starred: true,
    trend: "up"
  },
  {
    id: "poverty-010",
    name: "Economic Hardship Index",
    description: "Composite measure of economic distress including unemployment, poverty, income levels, and housing burden. Comprehensive economic indicator for community assessment.",
    topic: "Alleviating Poverty",
    subtopic: "Income Poverty",
    source: "Economic Policy Institute",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-18",
    starred: false,
    trend: "neutral"
  },

  // Health
  {
    id: "health-001",
    name: "Life Expectancy at Birth",
    description: "Average number of years a person is expected to live from birth. Fundamental health indicator reflecting overall population health and healthcare access quality.",
    topic: "Health",
    subtopic: "Physical Health",
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
    description: "Number of deaths of infants under one year old per 1,000 live births. Critical health indicator for maternal and child health outcomes and healthcare quality.",
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
    description: "Percentage of adults with BMI of 30 or higher. Key physical health indicator for chronic disease risk and overall population health status.",
    topic: "Health",
    subtopic: "Physical Health",
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
    description: "Percentage of adults diagnosed with diabetes. Important physical health indicator for chronic disease management and healthcare system burden.",
    topic: "Health",
    subtopic: "Physical Health",
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
    description: "Number of mental health providers per 100,000 population. Critical healthcare access indicator for mental health services and provider availability in communities.",
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
    description: "Percentage of population without health insurance coverage. Essential healthcare access indicator for measuring insurance coverage and healthcare affordability.",
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
    description: "Rate of hospital stays for ambulatory care sensitive conditions per 1,000 Medicare enrollees. Healthcare access and quality indicator for preventive care effectiveness.",
    topic: "Health",
    subtopic: "Healthcare Access",
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
    description: "Percentage of children up to date on recommended vaccinations. Important child welfare and public health indicator for disease prevention and healthcare access.",
    topic: "Health",
    subtopic: "Maternal and Child Health",
    source: "Indiana State Department of Health",
    reportingLevel: "County",
    availability: "2018-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "neutral"
  },
  {
    id: "health-009",
    name: "Substance Abuse Treatment Access",
    description: "Availability of substance abuse treatment facilities per capita. Mental health and healthcare access indicator for addiction treatment services.",
    topic: "Health",
    subtopic: "Mental Health",
    source: "SAMHSA",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2024-01-18",
    starred: false,
    trend: "up"
  },
  {
    id: "health-010",
    name: "Prenatal Care Access",
    description: "Percentage of pregnant women receiving adequate prenatal care. Critical maternal and child health indicator for healthcare access and birth outcomes.",
    topic: "Health",
    subtopic: "Maternal and Child Health",
    source: "Indiana State Department of Health",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "up"
  },
  {
    id: "health-011",
    name: "Primary Care Provider Ratio",
    description: "Number of primary care physicians per 100,000 population. Essential healthcare access indicator for basic medical care availability and provider access.",
    topic: "Health",
    subtopic: "Healthcare Access",
    source: "HRSA",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "neutral"
  },
  {
    id: "health-012",
    name: "Physical Health Days",
    description: "Average number of physically unhealthy days reported by adults per month. Physical health indicator for self-reported health status and quality of life.",
    topic: "Health",
    subtopic: "Physical Health",
    source: "CDC BRFSS",
    reportingLevel: "County",
    availability: "2012-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "neutral"
  },

  // Education
  {
    id: "education-001",
    name: "High School Graduation Rate",
    description: "Percentage of students graduating from high school within four years. Fundamental education achievement indicator for academic success and workforce readiness.",
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
    description: "Percentage of high school graduates enrolling in post-secondary education. Higher education indicator for educational attainment and career preparation pathways.",
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
    description: "Percentage of third-grade students meeting reading proficiency standards. Critical K-12 achievement indicator for early literacy and academic foundation.",
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
    description: "Percentage of adults 25+ with bachelor's degree or higher. Key adult education and educational attainment indicator for workforce development and economic mobility since 2020.",
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
    description: "Total per-pupil expenditure in public schools. Education achievement and school resource indicator for educational investment and academic support.",
    topic: "Education",
    subtopic: "K-12 Achievement",
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
    description: "Average number of students per teacher in public schools. K-12 achievement and school resource indicator for classroom size and educational quality.",
    topic: "Education",
    subtopic: "K-12 Achievement",
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
    description: "Percentage of students missing 15 or more days of school. K-12 achievement indicator for student engagement and educational participation barriers.",
    topic: "Education",
    subtopic: "K-12 Achievement",
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
    description: "Percentage of 3-4 year olds enrolled in pre-K programs. Early childhood education indicator for school readiness and educational foundation development.",
    topic: "Education",
    subtopic: "Early Childhood",
    source: "Indiana Family and Social Services Administration",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2023-11-22",
    starred: false,
    trend: "up"
  },
  {
    id: "education-009",
    name: "Adult Literacy Programs",
    description: "Participation in adult basic education and literacy programs. Adult education indicator for workforce development and educational attainment improvement.",
    topic: "Education",
    subtopic: "Adult Education",
    source: "Indiana Department of Workforce Development",
    reportingLevel: "County",
    availability: "2017-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "up"
  },
  {
    id: "education-010",
    name: "College Completion Rate",
    description: "Percentage of students completing college within 6 years. Higher education achievement indicator for degree attainment and educational success outcomes.",
    topic: "Education",
    subtopic: "Higher Education",
    source: "National Student Clearinghouse",
    reportingLevel: "County",
    availability: "2014-2022",
    lastUpdated: "2023-10-20",
    starred: false,
    trend: "neutral"
  },
  {
    id: "education-011",
    name: "School Readiness Assessment",
    description: "Percentage of kindergarten students demonstrating school readiness skills. Early childhood education indicator for developmental preparedness and educational foundation.",
    topic: "Education",
    subtopic: "Early Childhood",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2018-2023",
    lastUpdated: "2024-01-10",
    starred: false,
    trend: "up"
  },
  {
    id: "education-012",
    name: "STEM Program Participation",
    description: "Percentage of students participating in Science, Technology, Engineering, and Mathematics programs. K-12 achievement indicator for career preparation and academic specialization.",
    topic: "Education",
    subtopic: "K-12 Achievement",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2016-2023",
    lastUpdated: "2023-12-18",
    starred: false,
    trend: "up"
  },

  // Economic Mobility
  {
    id: "economic-001",
    name: "Median Household Income",
    description: "Middle value of household income distribution by census tract in Marion County and surrounding areas. Primary economic indicator for income levels and economic mobility measurement.",
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
    description: "Percentage of labor force that is unemployed and actively seeking work, broken down by demographic groups. Key employment indicator for workforce and economic conditions.",
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
    description: "Annual percentage change in total employment across sectors. Employment indicator for economic development and workforce expansion opportunities.",
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
    description: "Number of small businesses per 1,000 residents. Entrepreneurship indicator for business development and economic opportunity creation in communities.",
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
    description: "Measure of income distribution inequality (0=perfect equality, 1=perfect inequality). Income indicator for economic disparity and wealth distribution analysis.",
    topic: "Economic Mobility",
    subtopic: "Income",
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
    description: "Percentage of working-age population in the labor force by demographic groups. Employment indicator for workforce engagement and economic participation.",
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
    description: "Annual percentage change in average wages across industries. Income indicator for earnings progression and economic mobility measurement.",
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
    description: "Likelihood of moving up income quintiles from childhood to adulthood. Entrepreneurship and economic mobility indicator for intergenerational opportunity.",
    topic: "Economic Mobility",
    subtopic: "Entrepreneurship",
    source: "Opportunity Insights",
    reportingLevel: "County",
    availability: "2014-2020",
    lastUpdated: "2023-06-15",
    starred: true,
    trend: "neutral"
  },
  {
    id: "economic-009",
    name: "Workforce Development Program Participation",
    description: "Enrollment in job training and workforce development programs. Employment indicator for skills development and career advancement opportunities.",
    topic: "Economic Mobility",
    subtopic: "Employment",
    source: "Indiana Department of Workforce Development",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "up"
  },
  {
    id: "economic-010",
    name: "Business Startup Rate",
    description: "Number of new business establishments per 1,000 existing businesses. Entrepreneurship indicator for business creation and economic innovation activity.",
    topic: "Economic Mobility",
    subtopic: "Entrepreneurship",
    source: "Bureau of Labor Statistics",
    reportingLevel: "County",
    availability: "2013-2023",
    lastUpdated: "2024-01-28",
    starred: false,
    trend: "neutral"
  },

  // Housing
  {
    id: "housing-001",
    name: "Housing Cost Burden",
    description: "Percentage of households spending more than 30% of income on housing, normalized per capita. Primary housing affordability indicator for economic stress measurement.",
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
    description: "Percentage of housing units occupied by owners. Housing affordability and tenure indicator for wealth building and housing stability measurement.",
    topic: "Housing",
    subtopic: "Affordability",
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
    description: "Percentage of housing units that are vacant. Housing quality and market indicator for housing supply and neighborhood stability.",
    topic: "Housing",
    subtopic: "Quality",
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
    description: "Middle value of owner-occupied housing units. Housing affordability indicator for property values and homeownership accessibility measurement.",
    topic: "Housing",
    subtopic: "Affordability",
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
    description: "Number of housing units affordable to low-income households. Housing affordability indicator for accessible housing stock and economic opportunity.",
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
    description: "Composite measure of housing conditions and habitability standards. Housing quality indicator for living conditions and neighborhood health assessment.",
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
    description: "Number of evictions per 100 renter households. Housing stability indicator for housing security and economic distress measurement.",
    topic: "Housing",
    subtopic: "Stability",
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
    description: "Number of new housing units permitted per 1,000 existing units. Housing quality and development indicator for housing supply and growth.",
    topic: "Housing",
    subtopic: "Quality",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "up"
  },
  {
    id: "housing-009",
    name: "Rental Affordability Index",
    description: "Measure of rental housing affordability relative to median income. Housing affordability indicator for rental market accessibility and cost burden.",
    topic: "Housing",
    subtopic: "Affordability",
    source: "National Low Income Housing Coalition",
    reportingLevel: "County",
    availability: "2015-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "down"
  },
  {
    id: "housing-010",
    name: "Housing Stability Index",
    description: "Composite measure of housing tenure, mobility, and displacement risk. Housing stability indicator for residential security and community continuity.",
    topic: "Housing",
    subtopic: "Stability",
    source: "Urban Institute",
    reportingLevel: "Census Tract",
    availability: "2017-2023",
    lastUpdated: "2024-01-18",
    starred: false,
    trend: "neutral"
  },

  // Environment
  {
    id: "environment-001",
    name: "Air Quality Index",
    description: "Daily measure of air quality based on ground-level ozone and particle pollution. Key environmental quality measure for public health and air pollution assessment.",
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
    description: "Number of Safe Drinking Water Act violations per water system. Environmental quality indicator for water safety and public health protection.",
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
    description: "Percentage of population within 10-minute walk of a park or green space. Environmental quality indicator for recreation access and community health.",
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
    description: "Percentage of land area covered by tree canopy. Green space and environmental quality indicator for urban forest health and climate benefits.",
    topic: "Environment",
    subtopic: "Green Space",
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
    description: "Total energy consumption per person in BTUs. Environmental quality indicator for resource use and sustainability measurement.",
    topic: "Environment",
    subtopic: "Climate",
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
    description: "Percentage of electricity generated from renewable sources. Environmental quality indicator for clean energy adoption and sustainability progress.",
    topic: "Environment",
    subtopic: "Climate",
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
    description: "Percentage of municipal solid waste that is recycled. Environmental quality indicator for waste management and sustainability practices.",
    topic: "Environment",
    subtopic: "Air Quality",
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
    description: "Composite measure of environmental burdens and social vulnerability. Environmental quality indicator for equitable environmental health assessment.",
    topic: "Environment",
    subtopic: "Air Quality",
    source: "EPA",
    reportingLevel: "Census Tract",
    availability: "2020-2024",
    lastUpdated: "2024-02-14",
    starred: false,
    trend: "neutral"
  },
  {
    id: "environment-009",
    name: "Water System Reliability",
    description: "Percentage of time water systems operate without service interruption. Water quality and environmental infrastructure indicator for utility reliability.",
    topic: "Environment",
    subtopic: "Water Quality",
    source: "EPA",
    reportingLevel: "Water System",
    availability: "2015-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "up"
  },
  {
    id: "environment-010",
    name: "Climate Resilience Index",
    description: "Composite measure of community preparedness for climate change impacts. Environmental quality indicator for adaptation and resilience planning.",
    topic: "Environment",
    subtopic: "Climate",
    source: "NOAA",
    reportingLevel: "County",
    availability: "2018-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "up"
  },

  // Safety
  {
    id: "safety-001",
    name: "Violent Crime Rate",
    description: "Number of violent crimes per 100,000 population by neighborhood and precinct. Primary safety indicator for community security and crime prevention assessment.",
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
    description: "Number of property crimes per 100,000 population by neighborhood areas. Safety indicator for theft, burglary, and property security measurement.",
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
    description: "Number of traffic deaths per 100,000 population. Traffic safety indicator for road safety and transportation infrastructure assessment.",
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
    description: "Average time for emergency services to respond to calls. Emergency services indicator for public safety response effectiveness and coverage.",
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
    description: "Number of domestic violence incidents per 100,000 population. Crime and safety indicator for family violence and community support needs.",
    topic: "Safety",
    subtopic: "Crime",
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
    description: "Number of fire incidents per 100,000 population. Emergency services indicator for fire safety and prevention program effectiveness.",
    topic: "Safety",
    subtopic: "Emergency Services",
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
    description: "Composite measure of pedestrian safety based on infrastructure and incident data. Traffic safety indicator for walkability and pedestrian protection.",
    topic: "Safety",
    subtopic: "Traffic Safety",
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
    description: "Number of active community safety programs per 10,000 residents. Community safety indicator for neighborhood engagement and crime prevention initiatives.",
    topic: "Safety",
    subtopic: "Emergency Services",
    source: "Community Organizations",
    reportingLevel: "Neighborhood",
    availability: "2018-2023",
    lastUpdated: "2023-12-15",
    starred: false,
    trend: "up"
  },
  {
    id: "safety-009",
    name: "Neighborhood Watch Participation",
    description: "Percentage of neighborhoods with active watch programs. Community safety indicator for resident engagement in crime prevention and community security.",
    topic: "Safety",
    subtopic: "Crime",
    source: "Local Police Department",
    reportingLevel: "Neighborhood",
    availability: "2016-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "up"
  },
  {
    id: "safety-010",
    name: "School Safety Index",
    description: "Composite measure of school safety incidents and security measures. Safety indicator for educational environment security and student protection.",
    topic: "Safety",
    subtopic: "Crime",
    source: "Indiana Department of Education",
    reportingLevel: "School District",
    availability: "2017-2023",
    lastUpdated: "2024-01-08",
    starred: false,
    trend: "neutral"
  },

  // Transportation
  {
    id: "transportation-001",
    name: "Public Transit Access",
    description: "Percentage of population within 0.5 miles of public transit stops. Key transportation accessibility metric for public transportation coverage and mobility options.",
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
    description: "Mean travel time to work for workers 16 years and over. Transportation accessibility indicator for commuting burden and mobility efficiency.",
    topic: "Transportation",
    subtopic: "Active Transportation",
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
    description: "Percentage of households with access to a vehicle. Transportation accessibility indicator for mobility options and transportation equity.",
    topic: "Transportation",
    subtopic: "Active Transportation",
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
    description: "Miles of bike lanes and paths per square mile. Active transportation indicator for cycling infrastructure and alternative mobility options.",
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
    description: "Percentage of household income spent on transportation costs. Public transit and transportation accessibility indicator for affordability and economic impact.",
    topic: "Transportation",
    subtopic: "Public Transit",
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
    description: "Composite measure of road surface conditions and maintenance quality. Transportation infrastructure indicator for road safety and maintenance needs.",
    topic: "Transportation",
    subtopic: "Active Transportation",
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
    description: "Annual public transit trips per capita. Public transit indicator for system utilization and transportation mode preference.",
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
    description: "Measure of how friendly an area is to walking and pedestrian access. Active transportation and accessibility indicator for walkable community design.",
    topic: "Transportation",
    subtopic: "Active Transportation",
    source: "Walk Score",
    reportingLevel: "Neighborhood",
    availability: "2018-2024",
    lastUpdated: "2024-02-05",
    starred: false,
    trend: "up"
  },
  {
    id: "transportation-009",
    name: "Transit Service Frequency",
    description: "Average time between transit arrivals during peak hours. Public transit indicator for service quality and transportation convenience.",
    topic: "Transportation",
    subtopic: "Public Transit",
    source: "Federal Transit Administration",
    reportingLevel: "Transit Route",
    availability: "2017-2023",
    lastUpdated: "2024-01-30",
    starred: false,
    trend: "neutral"
  },
  {
    id: "transportation-010",
    name: "Commute Mode Share",
    description: "Percentage breakdown of transportation modes used for commuting. Transportation accessibility indicator for mobility patterns and transit usage.",
    topic: "Transportation",
    subtopic: "Public Transit",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-20",
    starred: false,
    trend: "neutral"
  },

  // Infrastructure
  {
    id: "infrastructure-001",
    name: "Broadband Access Rate",
    description: "Percentage of households with access to broadband internet service. Digital infrastructure indicator for connectivity and digital equity measurement.",
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
    description: "Percentage of time water systems operate without service interruption. Utilities infrastructure indicator for water service quality and reliability.",
    topic: "Infrastructure",
    subtopic: "Utilities",
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
    description: "Average minutes of power outages per customer per year. Utilities infrastructure indicator for electrical service reliability and grid stability.",
    topic: "Infrastructure",
    subtopic: "Utilities",
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
    description: "Percentage of bridges in good or fair structural condition. Transportation infrastructure indicator for bridge safety and maintenance needs.",
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
    description: "System capacity to handle 100-year flood events and stormwater runoff. Utilities infrastructure indicator for flood protection and water management.",
    topic: "Infrastructure",
    subtopic: "Utilities",
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
    description: "Average condition rating of public buildings and facilities. Transportation infrastructure indicator for public asset maintenance and investment needs.",
    topic: "Infrastructure",
    subtopic: "Transportation Infrastructure",
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
    description: "Percentage of area with reliable cellular and internet coverage. Digital infrastructure indicator for communication access and connectivity quality.",
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
    description: "Annual infrastructure spending per capita on public works and utilities. Transportation infrastructure indicator for capital investment and system maintenance.",
    topic: "Infrastructure",
    subtopic: "Transportation Infrastructure",
    source: "Bureau of Economic Analysis",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-009",
    name: "Digital Equity Index",
    description: "Composite measure of digital access, adoption, and skills. Digital infrastructure indicator for technology access and digital inclusion measurement.",
    topic: "Infrastructure",
    subtopic: "Digital Infrastructure",
    source: "Digital Equity Institute",
    reportingLevel: "Census Tract",
    availability: "2019-2023",
    lastUpdated: "2024-01-28",
    starred: false,
    trend: "up"
  },
  {
    id: "infrastructure-010",
    name: "Utility Affordability Index",
    description: "Measure of utility costs relative to median household income. Utilities infrastructure indicator for service affordability and economic burden.",
    topic: "Infrastructure",
    subtopic: "Utilities",
    source: "American Water Works Association",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "up"
  },

  // Demographics
  {
    id: "demographics-001",
    name: "Population Growth Rate",
    description: "Annual percentage change in total population over time. Population demographics indicator for community growth and development trends.",
    topic: "Demographics",
    subtopic: "Population",
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
    description: "Percentage of population by age groups including senior population demographics and youth populations. Age structure indicator for community composition analysis.",
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
    description: "Diversity index based on racial and ethnic composition of communities. Diversity demographics indicator for population composition and cultural representation.",
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
    description: "Number of people per square mile by census tract areas. Population demographics indicator for urban density and development patterns.",
    topic: "Demographics",
    subtopic: "Population",
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
    description: "Net migration rate measuring in-migration minus out-migration flows. Population demographics indicator for population movement and community attraction.",
    topic: "Demographics",
    subtopic: "Population",
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
    description: "Average number of people per household unit. Age structure demographics indicator for family composition and housing needs.",
    topic: "Demographics",
    subtopic: "Age Structure",
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
    description: "Percentage of population speaking languages other than English at home. Diversity demographics indicator for linguistic composition and cultural diversity.",
    topic: "Demographics",
    subtopic: "Diversity",
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
    description: "Percentage of population with a disability by age and type. Age structure demographics indicator for accessibility needs and support services.",
    topic: "Demographics",
    subtopic: "Age Structure",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-22",
    starred: false,
    trend: "neutral"
  },
  {
    id: "demographics-009",
    name: "Senior Population Growth",
    description: "Percentage change in population aged 65 and older. Age structure demographics indicator for aging population trends and senior demographics.",
    topic: "Demographics",
    subtopic: "Age Structure",
    source: "U.S. Census Bureau",
    reportingLevel: "County",
    availability: "2010-2023",
    lastUpdated: "2024-01-28",
    starred: false,
    trend: "up"
  },
  {
    id: "demographics-010",
    name: "Youth Population Percentage",
    description: "Percentage of population under 18 years of age. Age structure demographics indicator for youth demographics and family composition.",
    topic: "Demographics",
    subtopic: "Age Structure",
    source: "U.S. Census Bureau",
    reportingLevel: "Census Tract",
    availability: "2010-2023",
    lastUpdated: "2024-01-25",
    starred: false,
    trend: "down"
  },

  // Family Structure
  {
    id: "family-001",
    name: "Single-Parent Household Rate",
    description: "Percentage of households with children headed by single parent. Household composition indicator for family structure and support needs assessment.",
    topic: "Family Structure",
    subtopic: "Household Composition",
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
    description: "Percentage of households with multiple generations living together. Household composition indicator for extended family living arrangements and housing needs.",
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
    description: "Number of marriages per 1,000 population annually. Family stability indicator for relationship formation and family structure trends.",
    topic: "Family Structure",
    subtopic: "Family Stability",
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
    description: "Number of divorces per 1,000 population annually. Family stability indicator for relationship dissolution and family structure changes.",
    topic: "Family Structure",
    subtopic: "Family Stability",
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
    description: "Number of births per 1,000 females aged 15-19. Family stability indicator for adolescent pregnancy and family formation patterns.",
    topic: "Family Structure",
    subtopic: "Family Stability",
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
    description: "Percentage of children living with grandparent caregivers. Child welfare indicator for alternative family arrangements and caregiving support.",
    topic: "Family Structure",
    subtopic: "Child Welfare",
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
    description: "Number of children in foster care per 1,000 children. Key child welfare indicator for family support needs and child protection services.",
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
    description: "Composite measure of family structure stability factors including marriage, divorce, and household composition. Family stability indicator for community assessment.",
    topic: "Family Structure",
    subtopic: "Family Stability",
    source: "Child Trends",
    reportingLevel: "County",
    availability: "2016-2022",
    lastUpdated: "2023-09-20",
    starred: false,
    trend: "neutral"
  },
  {
    id: "family-009",
    name: "Child Support Compliance",
    description: "Percentage of child support orders with regular payments. Child welfare indicator for financial support and family economic stability.",
    topic: "Family Structure",
    subtopic: "Child Welfare",
    source: "Department of Child Services",
    reportingLevel: "County",
    availability: "2016-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "up"
  },
  {
    id: "family-010",
    name: "Family Reunification Rate",
    description: "Percentage of children in foster care who are reunified with families. Child welfare indicator for family preservation and child protection outcomes.",
    topic: "Family Structure",
    subtopic: "Child Welfare",
    source: "Department of Child Services",
    reportingLevel: "County",
    availability: "2017-2023",
    lastUpdated: "2024-01-10",
    starred: false,
    trend: "up"
  },

  // Civic Engagement
  {
    id: "civic-001",
    name: "Voter Turnout Rate",
    description: "Percentage of eligible voters who voted in recent elections. Political participation indicator for civic engagement and democratic participation measurement.",
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
    description: "Percentage of population engaged in volunteer activities and community service. Community service indicator for civic participation and social engagement.",
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
    description: "Number of nonprofit organizations per 10,000 population. Community service indicator for civic infrastructure and community organization capacity.",
    topic: "Civic Engagement",
    subtopic: "Community Service",
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
    description: "Average attendance at public community meetings and civic forums. Political participation indicator for community engagement and civic involvement.",
    topic: "Civic Engagement",
    subtopic: "Political Participation",
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
    description: "Composite measure of social connections and community engagement networks. Social cohesion indicator for community bonds and civic participation strength.",
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
    description: "Number of residents participating in public forums per 1,000 population. Political participation indicator for civic engagement and community involvement.",
    topic: "Civic Engagement",
    subtopic: "Political Participation",
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
    description: "Percentage of households making charitable donations to community organizations. Community service indicator for philanthropic engagement and community support.",
    topic: "Civic Engagement",
    subtopic: "Community Service",
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
    description: "Percentage of adults belonging to community organizations and civic groups. Social cohesion indicator for community participation and civic engagement.",
    topic: "Civic Engagement",
    subtopic: "Social Cohesion",
    source: "Current Population Survey",
    reportingLevel: "Metropolitan Area",
    availability: "2015-2023",
    lastUpdated: "2024-01-15",
    starred: false,
    trend: "down"
  },
  {
    id: "civic-009",
    name: "Civic Knowledge Index",
    description: "Composite measure of civic knowledge and political awareness. Political participation indicator for informed citizenship and democratic engagement.",
    topic: "Civic Engagement",
    subtopic: "Political Participation",
    source: "Civic Education Research",
    reportingLevel: "County",
    availability: "2016-2022",
    lastUpdated: "2023-08-15",
    starred: false,
    trend: "neutral"
  },
  {
    id: "civic-010",
    name: "Community Event Participation",
    description: "Average attendance at community events and festivals per capita. Community service and social cohesion indicator for community engagement and participation.",
    topic: "Civic Engagement",
    subtopic: "Community Service",
    source: "Parks and Recreation Department",
    reportingLevel: "City",
    availability: "2017-2023",
    lastUpdated: "2024-01-12",
    starred: false,
    trend: "up"
  }
]

// Hierarchical Categories with selectable subcategories
const HIERARCHICAL_CATEGORIES = {
  "Alleviating Poverty": {
    "Income Poverty": ["Poverty Rate", "Income Support", "Asset Building"],
    "Food Security": ["Food Access", "Nutrition Programs", "Food Assistance"],
    "Housing Assistance": ["Subsidized Housing", "Housing Vouchers", "Emergency Shelter"],
    "Nutrition Assistance": ["WIC", "SNAP", "School Meals"],
    "Child Poverty": ["Child Support", "Family Services", "Educational Support"],
    "Asset Building": ["Financial Literacy", "Savings Programs", "Credit Building"],
  },
  "Health": {
    "Physical Health": ["Chronic Disease", "Preventive Care", "Healthcare Access"],
    "Mental Health": ["Mental Health Services", "Substance Abuse", "Crisis Intervention"],
    "Maternal and Child Health": ["Prenatal Care", "Child Development", "Immunizations"],
    "Healthcare Access": ["Insurance Coverage", "Provider Access", "Healthcare Quality"],
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
  const [indicators, setIndicators] = useState<ExtendedIndicator[]>(COMPREHENSIVE_INDICATORS)
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [sortBy, setSortBy] = useState<"ai_relevance" | "name" | "updated" | "geographic">("ai_relevance")
  const [groupBy, setGroupBy] = useState<"none" | "category" | "source" | "reporting_area">("none")
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandAll, setExpandAll] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
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
    
      // Improved search matching - split search terms and check each word
      const searchWords = searchTerm.trim().toLowerCase().split(/\s+/)
      const matchesSearch = searchTerm === "" || searchWords.some(word => 
        word.length > 0 && (
          indicator.name.toLowerCase().includes(word) ||
          indicator.topic.toLowerCase().includes(word) ||
          indicator.subtopic.toLowerCase().includes(word) ||
          indicator.description.toLowerCase().includes(word) ||
          indicator.source.toLowerCase().includes(word) ||
          indicator.reportingLevel.toLowerCase().includes(word)
        )
      )

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(indicator.topic)
      const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(indicator.subtopic)
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

      return matchesSearch && matchesCategory && matchesSubcategory && matchesReportingArea && matchesStarred && matchesYear
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
            const searchWords = searchTerm.toLowerCase().split(/\s+/)
            const aRelevance = searchWords.reduce((score, word) => {
              if (a.name.toLowerCase().includes(word)) score += 3
              if (a.topic.toLowerCase().includes(word)) score += 2
              if (a.description.toLowerCase().includes(word)) score += 1
              return score
            }, 0)
            const bRelevance = searchWords.reduce((score, word) => {
              if (b.name.toLowerCase().includes(word)) score += 3
              if (b.topic.toLowerCase().includes(word)) score += 2
              if (b.description.toLowerCase().includes(word)) score += 1
              return score
            }, 0)
            return bRelevance - aRelevance
          }
        
          return 0
        })
        break
    }

    return filtered
  }, [searchTerm, indicators, sortBy, selectedCategories, selectedSubcategories, selectedReportingArea, starredOnly, yearRange])

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

  // Active filters for chip display
  const activeFilters = useMemo(() => {
    const filters = []
    
    selectedCategories.forEach(category => {
      filters.push({ type: 'category', value: category, label: category })
    })
    
    selectedSubcategories.forEach(subcategory => {
      filters.push({ type: 'subcategory', value: subcategory, label: subcategory })
    })
    
    if (selectedReportingArea !== "all") {
      filters.push({ type: 'reporting', value: selectedReportingArea, label: selectedReportingArea })
    }
    
    if (yearRange[0] !== 2000 || yearRange[1] !== 2024) {
      filters.push({ type: 'year', value: `${yearRange[0]}-${yearRange[1]}`, label: `${yearRange[0]}-${yearRange[1]}` })
    }
    
    if (selectedNormalization !== "raw") {
      const normLabel = NORMALIZATION_OPTIONS.find(opt => opt.value === selectedNormalization)?.label || selectedNormalization
      filters.push({ type: 'normalization', value: selectedNormalization, label: normLabel })
    }
    
    if (starredOnly) {
      filters.push({ type: 'starred', value: 'starred', label: 'Starred Only' })
    }
    
    return filters
  }, [selectedCategories, selectedSubcategories, selectedReportingArea, yearRange, selectedNormalization, starredOnly])

  const handleSelectIndicator = (indicatorId: string) => {
    setSelected((prev) =>
      prev.includes(indicatorId) ? prev.filter((id) => id !== indicatorId) : [...prev, indicatorId],
    )
  }

  const handleToggleStar = (indicatorId: string) => {
    setIndicators((prev) => prev.map((ind) => (ind.id === indicatorId ? { ...ind, starred: !ind.starred } : ind)))
  }

  const handleConfirm = () => {
    onSelectionChange(selected)
    onClose()
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedSubcategories([])
    setSelectedReportingArea("all")
    setYearRange([2000, 2024])
    setSelectedNormalization("raw")
    setStarredOnly(false)
  }

  const handleRemoveFilter = (filterType: string, filterValue: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories(prev => prev.filter(c => c !== filterValue))
        break
      case 'subcategory':
        setSelectedSubcategories(prev => prev.filter(c => c !== filterValue))
        break
      case 'reporting':
        setSelectedReportingArea("all")
        break
      case 'year':
        setYearRange([2000, 2024])
        break
      case 'normalization':
        setSelectedNormalization("raw")
        break
      case 'starred':
        setStarredOnly(false)
        break
    }
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(c => c !== subcategory)
        : [...prev, subcategory]
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
              onClick={() => handleToggleStar(indicator.id)}
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
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-semibold">Select Data Indicators</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-96 flex-shrink-0 border-r bg-gray-50 p-6 overflow-y-auto">
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

              {/* Reporting Area */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Reporting Level</h4>
                <Select value={selectedReportingArea} onValueChange={setSelectedReportingArea}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reporting Levels</SelectItem>
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

              {/* Categories - Hierarchical - Moved to bottom */}
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
                            <div key={subcat} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedSubcategories.includes(subcat)}
                                onCheckedChange={() => handleSubcategoryToggle(subcat)}
                                className="h-3 w-3"
                              />
                              <span className="text-xs text-gray-600">{subcat}</span>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
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
                    placeholder="Search indicators with AI (e.g., income household median poverty economic)"
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

              {/* Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeFilters.map((filter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs flex items-center gap-1 pr-1"
                    >
                      {filter.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-gray-300"
                        onClick={() => handleRemoveFilter(filter.type, filter.value)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
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
                  <Button
                    variant={starredOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStarredOnly(!starredOnly)}
                    className="text-xs h-8"
                  >
                    <Star className={`h-3 w-3 mr-1 ${starredOnly ? "fill-current" : ""}`} />
                    Starred
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

import type { GeographyArea, BrowseNode, SavedCommunity, BrowseCategory } from "../types/geography"

export const mockSearchResults: GeographyArea[] = [
  { id: "in-state", name: "Indiana", type: "state", hierarchyPath: "United States ▶ State" },
  { id: "indy-metro", name: "Indianapolis Metro", type: "metro", hierarchyPath: "Indiana ▶ Metro Area" },
  {
    id: "central-in-township",
    name: "Central Indiana Township",
    type: "township",
    hierarchyPath: "Marion County ▶ Township",
  },
  { id: "ips", name: "Indianapolis Public Schools", type: "school", hierarchyPath: "Marion County ▶ School District" },
  { id: "independence-mo", name: "Independence", type: "city", hierarchyPath: "Jackson County, MO ▶ City" },
  { id: "indio-ca", name: "Indio", type: "city", hierarchyPath: "Riverside County, CA ▶ City" },
  { id: "indianapolis", name: "Indianapolis", type: "city", hierarchyPath: "Marion County, IN ▶ City" },
  { id: "indiana-pa", name: "Indiana", type: "city", hierarchyPath: "Indiana County, PA ▶ City" },
  { id: "46240", name: "46240", type: "zip", hierarchyPath: "Indianapolis, IN ▶ ZIP Code" },
  { id: "46220", name: "46220", type: "zip", hierarchyPath: "Indianapolis, IN ▶ ZIP Code" },
  { id: "tract-3901", name: "Census Tract 3901", type: "tract", hierarchyPath: "Marion County ▶ Census Tract" },
  { id: "indianola", name: "Indianola", type: "city", hierarchyPath: "Warren County, IA ▶ City" },
  { id: "indian-creek", name: "Indian Creek Township", type: "township", hierarchyPath: "Pulaski County ▶ Township" },
  { id: "brownsburg", name: "Brownsburg Schools", type: "school", hierarchyPath: "Hendricks County ▶ School District" },
  { id: "carmel", name: "Carmel Clay Schools", type: "school", hierarchyPath: "Hamilton County ▶ School District" },
  { id: "hamilton-county", name: "Hamilton County", type: "county", hierarchyPath: "Indiana ▶ County" },
  { id: "boone-county", name: "Boone County", type: "county", hierarchyPath: "Indiana ▶ County" },
  { id: "hendricks-county", name: "Hendricks County", type: "county", hierarchyPath: "Indiana ▶ County" },
  { id: "johnson-county", name: "Johnson County", type: "county", hierarchyPath: "Indiana ▶ County" },
  { id: "hancock-county", name: "Hancock County", type: "county", hierarchyPath: "Indiana ▶ County" },
]

// Indiana-focused browse data organized by category
export const indianaBrowseData: Record<BrowseCategory, BrowseNode[]> = {
  counties: [
    {
      id: "indiana-counties",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        { id: "marion-county-browse", name: "Marion County", type: "county" },
        { id: "hamilton-county-browse", name: "Hamilton County", type: "county" },
        { id: "hendricks-county-browse", name: "Hendricks County", type: "county" },
        { id: "johnson-county-browse", name: "Johnson County", type: "county" },
        { id: "boone-county-browse", name: "Boone County", type: "county" },
        { id: "hancock-county-browse", name: "Hancock County", type: "county" },
      ],
    },
  ],
  metro: [
    {
      id: "indiana-metro",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        { id: "indianapolis-metro", name: "Indianapolis-Carmel-Anderson", type: "metro", selected: true },
        { id: "south-bend-metro", name: "South Bend-Mishawaka", type: "metro" },
        { id: "fort-wayne-metro", name: "Fort Wayne", type: "metro" },
        { id: "evansville-metro", name: "Evansville", type: "metro" },
        { id: "lafayette-metro", name: "Lafayette-West Lafayette", type: "metro" },
      ],
    },
  ],
  zip: [
    {
      id: "indiana-zip",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        {
          id: "marion-zip",
          name: "Marion County",
          type: "county",
          children: [
            { id: "46201", name: "46201", type: "zip" },
            { id: "46202", name: "46202", type: "zip" },
            { id: "46220", name: "46220", type: "zip" },
            { id: "46240", name: "46240", type: "zip" },
          ],
        },
        {
          id: "hamilton-zip",
          name: "Hamilton County",
          type: "county",
          children: [
            { id: "46032", name: "46032", type: "zip" },
            { id: "46034", name: "46034", type: "zip" },
            { id: "46074", name: "46074", type: "zip" },
          ],
        },
      ],
    },
  ],
  school: [
    {
      id: "indiana-school",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        {
          id: "marion-schools",
          name: "Marion County",
          type: "county",
          children: [
            { id: "ips-browse", name: "Indianapolis Public Schools", type: "school" },
            { id: "warren-schools", name: "Warren Township Schools", type: "school" },
            { id: "lawrence-schools", name: "Lawrence Township Schools", type: "school" },
          ],
        },
        {
          id: "hamilton-schools",
          name: "Hamilton County",
          type: "county",
          children: [
            { id: "carmel-schools", name: "Carmel Clay Schools", type: "school" },
            { id: "noblesville-schools", name: "Noblesville Schools", type: "school" },
            { id: "hamilton-community", name: "Hamilton Community Schools", type: "school" },
          ],
        },
      ],
    },
  ],
  township: [
    {
      id: "indiana-township",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        {
          id: "marion-townships",
          name: "Marion County",
          type: "county",
          children: [
            { id: "center-township", name: "Center Township", type: "township" },
            { id: "warren-township", name: "Warren Township", type: "township" },
            { id: "lawrence-township", name: "Lawrence Township", type: "township" },
            { id: "washington-township", name: "Washington Township", type: "township" },
          ],
        },
        {
          id: "hamilton-townships",
          name: "Hamilton County",
          type: "county",
          children: [
            { id: "clay-township", name: "Clay Township", type: "township" },
            { id: "noblesville-township", name: "Noblesville Township", type: "township" },
          ],
        },
      ],
    },
  ],
  neighborhood: [
    {
      id: "indiana-neighborhood",
      name: "Indiana",
      type: "state",
      expanded: true,
      children: [
        {
          id: "indianapolis-neighborhoods",
          name: "Indianapolis",
          type: "city",
          children: [
            { id: "broad-ripple", name: "Broad Ripple", type: "neighborhood" },
            { id: "fountain-square", name: "Fountain Square", type: "neighborhood" },
            { id: "mass-ave", name: "Mass Ave", type: "neighborhood" },
            { id: "downtown-indy", name: "Downtown", type: "neighborhood" },
          ],
        },
        {
          id: "carmel-neighborhoods",
          name: "Carmel",
          type: "city",
          children: [
            { id: "midtown-carmel", name: "Midtown", type: "neighborhood" },
            { id: "west-carmel", name: "West Carmel", type: "neighborhood" },
            { id: "village-carmel", name: "Village of WestClay", type: "neighborhood" },
          ],
        },
      ],
    },
  ],
}

export const mockProjects = [
  "Housing Analysis",
  "Transportation Study",
  "Economic Development",
  "Education Planning",
  "Health Assessment",
  "Environmental Impact",
]

export const mockSavedCommunities: SavedCommunity[] = [
  {
    id: "community-1",
    name: "Central Indianapolis Metro",
    date: "2024-01-15",
    project: "Housing Analysis",
    population: 2100000,
    type: "Metro",
    starred: true,
    thumbnail: "metro-thumbnail",
    areas: [
      { id: "indy-metro", name: "Indianapolis Metro", type: "metro" },
      { id: "marion-county", name: "Marion County", type: "county" },
    ],
  },
  {
    id: "community-2",
    name: "North Side Schools District",
    date: "2024-01-10",
    project: "Education Planning",
    population: 45000,
    type: "School",
    thumbnail: "school-thumbnail",
    areas: [
      { id: "ips", name: "Indianapolis Public Schools", type: "school" },
      { id: "warren-schools", name: "Warren Township Schools", type: "school" },
    ],
  },
  {
    id: "community-3",
    name: "Hamilton County Region",
    date: "2024-01-08",
    project: "Economic Development",
    population: 347000,
    type: "County",
    thumbnail: "county-thumbnail",
    areas: [{ id: "hamilton-county", name: "Hamilton County", type: "county" }],
  },
]

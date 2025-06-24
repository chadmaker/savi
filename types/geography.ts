export interface GeographyArea {
  id: string
  name: string
  type:
    | "state"
    | "metro"
    | "county"
    | "city"
    | "zip"
    | "tract"
    | "blockgroup"
    | "school"
    | "township"
    | "neighborhood"
    | "drawn"
  geometry?: any
  hierarchyPath?: string
  coordinates?: number[][]
  selected?: boolean
}

export interface DrawShape {
  id: string
  type: "rectangle" | "polygon" | "circle"
  coordinates: number[][]
  name: string
}

export interface SavedCommunity {
  id: string
  name: string
  date: string
  project: string
  notes?: string
  geoId?: number
  areas: GeographyArea[]
  thumbnail: string
  type: string // Primary type of the community
  starred?: boolean
}

export interface BrowseNode {
  id: string
  name: string
  type: string
  children?: BrowseNode[]
  selected?: boolean
  expanded?: boolean
  geometry?: number[][]
}

export interface RecentSelection {
  area: GeographyArea
  timestamp: number
}

export type SelectorMode = "search" | "selectregions" | "draw" | "saved"
export type BrowseCategory = "counties" | "metro" | "zip" | "school" | "township" | "neighborhood"
export type SavedFilter = "recent" | "saved" | "project" | "type"

export interface MapLayer {
  id: string
  name: string
  enabled: boolean
  boundaries: GeographyArea[]
}

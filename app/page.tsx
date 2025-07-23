"use client"
import { Dashboard } from "@/components/dashboard"

export type Screen = "dashboard" | "workspace" | "visualization"

export default function Home() {
  return <Dashboard />
}

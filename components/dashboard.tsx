import type React from "react"
import { BarChart3, Folder, Eye, LayoutDashboard, MapPin, Settings, User } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { SidebarNavItem } from "@/components/sidebar-nav"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardProps {
  children?: React.ReactNode
}

const navigationItems = [
  { id: "projects", label: "Data Projects", icon: Folder },
  { id: "indicators", label: "Data Catalog", icon: BarChart3 },
  { id: "communities", label: "My Communities", icon: MapPin },
  { id: "visualizations", label: "Studio", icon: Eye },
]

export function Dashboard({ children }: DashboardProps) {
  return (
    <div className="flex min-h-screen w-full space-x-4">
      <aside className="flex h-screen w-64 flex-col border-r bg-secondary">
        <div className="flex h-20 items-center justify-between border-b px-6">
          <MainNav className="font-bold" />
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <SidebarNavItem href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </SidebarNavItem>
            {navigationItems.map((item) => (
              <SidebarNavItem key={item.id} href={`/dashboard/${item.id}`} icon={item.icon}>
                {item.label}
              </SidebarNavItem>
            ))}
          </nav>
          <div className="mt-6 px-2">
            <SidebarNavItem href="/account" icon={User}>
              <User className="h-4 w-4" />
            </SidebarNavItem>
            <SidebarNavItem href="/settings" icon={Settings}>
              Settings
            </SidebarNavItem>
          </div>
        </div>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </div>
  )
}

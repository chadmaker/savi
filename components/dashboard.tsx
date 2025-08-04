import type React from "react"
import { Home, FolderOpen, MapPin, BarChart3, PieChart, Upload } from "icons"

const Dashboard: React.FC = () => {
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "projects", label: "Projects", icon: FolderOpen }, // Changed from "Data Projects"
    { id: "communities", label: "Communities", icon: MapPin }, // Changed from "My Communities"
    { id: "indicators", label: "Data Catalog", icon: BarChart3 },
    { id: "visualizations", label: "Visualizations", icon: PieChart },
    { id: "upload", label: "Upload Data", icon: Upload },
  ]

  return (
    <div>
      {/* Navigation bar */}
      <nav>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.id}>
              <item.icon />
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <main>
        {/* Placeholder for main content */}
        <p>Welcome to the Dashboard!</p>
      </main>
    </div>
  )
}

export default Dashboard

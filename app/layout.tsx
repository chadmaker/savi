import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pro Tools",
  description: "Advanced data analysis and visualization platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-[1440px] mx-auto px-20">{children}</div>
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

const menuItems = [
  { href: "#", label: "SAVI.org" },
  { href: "#", label: "Data Tools Home" },
  { href: "#", label: "Community Profiles" },
  { href: "#", label: "Population Profiles" },
  { href: "#", label: "Topic Profiles" },
  { href: "#", label: "SAVI Pro", isPro: true },
]

export function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
            </div>
          </div>
        </SheetHeader>
        <div className="mt-6">
          <nav className="grid gap-4">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 ${
                  item.isPro ? "font-bold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

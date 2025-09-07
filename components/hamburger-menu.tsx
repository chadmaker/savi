"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const menuItems = [
  { href: "/", label: "SAVI Home" },
  { href: "/data-tools", label: "Data Tools Home" },
  { href: "/profiles/community", label: "Community Profiles" },
  { href: "/profiles/population", label: "Population Profiles" },
  { href: "/profiles/topic", label: "Topic Profiles" },
  { href: "/pro-tools", label: "Pro Tools", isPro: true },
]

export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Image src="/savi-logo.png" alt="SAVI Logo" width={80} height={32} />
            </Link>
          </div>
        </SheetHeader>
        <div className="mt-6">
          <nav className="grid gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 ${
                  item.isPro ? "font-bold" : ""
                }`}
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

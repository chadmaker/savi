"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Banknote,
  Bike,
  BookOpen,
  Briefcase,
  Coins,
  Grid2x2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Home,
  Leaf,
  LifeBuoy,
  PieChart,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  UserCircle,
  UserRound,
  UsersRound,
  Utensils,
  Wallet,
  Check,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ProfileType = "overview" | "population" | "topic"

const iconsMap = {
  "grid-2x2": Grid2x2,
  users: Users,
  "user-circle": UserCircle,
  "user-round": UserRound,
  "users-round": UsersRound,
  briefcase: Briefcase,
  wallet: Wallet,
  bike: Bike,
  lifebuoy: LifeBuoy,
  handshake: Handshake,
  "shield-check": ShieldCheck,
  "pie-chart": PieChart,
  "book-open": BookOpen,
  "trending-up": TrendingUp,
  banknote: Banknote,
  "graduation-cap": GraduationCap,
  leaf: Leaf,
  scale: Scale,
  utensils: Utensils,
  "heart-pulse": HeartPulse,
  home: Home,
  coins: Coins,
} as const

type IconKey = keyof typeof iconsMap

export type SaviProfileItem = {
  id: string
  label: string
  type: ProfileType
  description?: string
  indicators?: string[]
  iconKey?: IconKey
}

export type SaviProfilePickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: SaviProfileItem[]
  defaultSelectedId?: string
  onConfirm: (item: SaviProfileItem) => void
  title?: string
}

const palette: Record<ProfileType, { bg: string; text: string; border: string }> = {
  overview: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  population: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  topic: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
}

const tagClasses: Record<ProfileType, { container: string; label: string }> = {
  overview: {
    container: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    label: "Community",
  },
  population: {
    container: "bg-rose-50 text-rose-700 border border-rose-200",
    label: "Population",
  },
  topic: {
    container: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Topic",
  },
}

export default function SaviProfilePickerModal(props: SaviProfilePickerProps) {
  const { open, onOpenChange, items, defaultSelectedId, onConfirm, title = "Select a Profile" } = props

  const [selectedId, setSelectedId] = React.useState<string | undefined>(defaultSelectedId)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [open, onOpenChange])

  const allItems = React.useMemo(() => {
    const o = items.filter((i) => i.type === "overview")
    const p = items.filter((i) => i.type === "population")
    const t = items.filter((i) => i.type === "topic")
    return [...o, ...p, ...t]
  }, [items])

  const filtered = React.useMemo(() => {
    if (!query) return allItems
    const q = query.toLowerCase()
    return allItems.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.indicators?.some((d) => d.toLowerCase().includes(q)),
    )
  }, [allItems, query])

  const gridClass = "grid grid-cols-12 gap-2 md:gap-3 w-full"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label={title} className={cn("p-4 md:p-8 rounded-3xl w-[90vw]")}>
        <DialogHeader className="px-0">
          <DialogTitle className="text-2xl font-bold text-left">{title}</DialogTitle>
        </DialogHeader>

        <div className={cn(gridClass, "mx-auto")}>
          <div className="col-span-12">
            <Input
              placeholder="Search profiles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search profiles"
            />
          </div>

          {filtered.map((item) => (
            <ProfileTile
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
              className="col-span-6 sm:col-span-4 md:col-span-2"
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-12 text-sm text-muted-foreground py-6">No profiles found.</div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 w-full bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="w-full mx-auto flex items-center justify-between gap-3 p-3 md:p-4">
            <div className="text-sm md:text-base font-semibold">
              {selectedId
                ? `You’ve selected: ${items.find((i) => i.id === selectedId)?.label ?? ""}`
                : "Select a profile to continue"}
            </div>
            <Button
              size="lg"
              className="text-base"
              disabled={!selectedId}
              onClick={() => {
                const sel = items.find((i) => i.id === selectedId)
                if (sel) onConfirm(sel)
                onOpenChange(false)
              }}
            >
              {selectedId ? `View ${items.find((i) => i.id === selectedId)?.label ?? "Profile"}` : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProfileTile({
  item,
  selected,
  onSelect,
  className,
}: {
  item: SaviProfileItem
  selected: boolean
  onSelect: () => void
  className?: string
}) {
  const TagLabel = tagClasses[item.type].label
  const tagClass = tagClasses[item.type].container
  const IconComponent = item.iconKey ? iconsMap[item.iconKey] : Grid2x2

  const content = (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative w-full text-left outline-none",
        "rounded-xl border transition-shadow min-h-[84px]",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-lg"
          : "bg-card text-card-foreground border-border hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60",
      )}
    >
      <span
        className={cn(
          "absolute left-2 top-2 z-[1] inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
          tagClass,
          selected ? "bg-white/20 text-white border-white/30" : "",
        )}
        aria-label={`${TagLabel} tag`}
      >
        {TagLabel}
      </span>

      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center gap-2">
          <div
            className={cn(
              "rounded-full p-3",
              selected
                ? "bg-primary-foreground/20 text-primary-foreground"
                : cn(palette[item.type].bg, palette[item.type].text),
            )}
            aria-hidden="true"
          >
            <IconComponent className="h-10 w-10" />
          </div>

          <div
            className={cn(
              "text-xs md:text-[13px] font-medium text-center leading-snug line-clamp-2",
              selected ? "text-primary-foreground" : "",
            )}
          >
            {item.label}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <div className="absolute right-2 top-2 rounded-full bg-primary-foreground/20 p-1" aria-hidden="true">
          <Check className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </button>
  )

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("relative", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="hidden md:block">{content}</div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={8}
            avoidCollisions={true}
            collisionPadding={24}
            className="max-w-[min(90vw,420px)] break-words whitespace-normal text-sm leading-snug"
          >
            <div className="flex flex-col gap-2">
              {item.description && <p className="text-foreground">{truncate(item.description, 120)}</p>}
              {item.indicators && item.indicators.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {item.indicators.slice(0, 3).map((ind) => (
                    <li key={ind}>{ind}</li>
                  ))}
                </ul>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="md:hidden">{content}</div>
      </div>
    </TooltipProvider>
  )
}

function truncate(str: string, max = 80) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str
}

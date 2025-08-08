"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, ChevronRight, Home, Info, LayoutGrid, Users, GraduationCap } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ProfileType = "overview" | "population" | "topic"

export type SaviProfileItem = {
  id: string
  label: string
  type: ProfileType
  description?: string
  indicators?: string[]
  icon?: "overview-icon" | "population-icon" | "education-icon"
}

export type SaviProfilePickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: SaviProfileItem[]
  defaultSelectedId?: string
  onConfirm: (item: SaviProfileItem) => void
  title?: string
}

const iconFor = (icon?: SaviProfileItem["icon"], type?: ProfileType) => {
  if (icon === "overview-icon" || type === "overview") return LayoutGrid
  if (icon === "education-icon" || (type === "topic")) return GraduationCap
  return Users
}

const SectionHeader = ({
  title,
  helper,
}: {
  title: string
  helper?: string
}) => (
  <div className="col-span-12 flex items-baseline justify-between">
    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
    {helper ? (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" aria-hidden="true" />
        <span>{helper}</span>
      </div>
    ) : null}
  </div>
)

export default function SaviProfilePickerModal(props: SaviProfilePickerProps) {
  const {
    open,
    onOpenChange,
    items,
    defaultSelectedId,
    onConfirm,
    title = "Select a Profile",
  } = props

  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    defaultSelectedId
  )
  const [query, setQuery] = React.useState("")
  const [mobileTooltipId, setMobileTooltipId] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    if (open) {
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false)
      }
      window.addEventListener("keydown", onEsc)
      return () => window.removeEventListener("keydown", onEsc)
    }
  }, [open, onOpenChange])

  const overview = items.filter((i) => i.type === "overview")
  const populations = items.filter((i) => i.type === "population")
  const topics = items.filter((i) => i.type === "topic")

  const filter = (list: SaviProfileItem[]) =>
    list.filter((i) => {
      if (!query) return true
      const q = query.toLowerCase()
      return (
        i.label.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.indicators?.some((d) => d.toLowerCase().includes(q))
      )
    })

  const gridContainerClass =
    "grid grid-cols-12 gap-4 md:gap-6 max-w-[1280px] w-full"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-label={title}
        className={cn(
          // Centered modal, 1280px max content, internal padding 32 desktop / 16 mobile
          "p-4 md:p-8 rounded-3xl",
          "w-[min(1280px,calc(100vw-2rem))]"
        )}
      >
        <DialogHeader className="px-0">
          <DialogTitle className="text-2xl font-bold text-left">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* 12-col grid wrapper with 80px side padding at 1440 container width.
            Since this is a modal with max 960px, we simply ensure a 12-col grid inside. */}
        <div className={cn(gridContainerClass, "mx-auto")}>
          {/* Search */}
          <div className="col-span-12">
            <Input
              placeholder="Search profiles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Sections in order */}

          {/* 1) Overview – featured card spanning 4 columns */}
          {filter(overview).length > 0 && (
            <>
              <SectionHeader title="Overview" />
              {filter(overview).map((item) => (
                <ProfileTile
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => {
                    setSelectedId(item.id)
                    setMobileTooltipId(
                      mobileTooltipId === item.id ? null : item.id
                    )
                  }}
                  className="col-span-12 sm:col-span-6 md:col-span-4"
                  mobileTooltipOpen={mobileTooltipId === item.id}
                />
              ))}
            </>
          )}

          {/* 2) Populations – tiles 4 cols wide */}
          {filter(populations).length > 0 && (
            <>
              <SectionHeader
                title="Populations"
                helper="Profiles organized by demographic group."
              />
              {filter(populations).map((item) => (
                <ProfileTile
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => {
                    setSelectedId(item.id)
                    setMobileTooltipId(
                      mobileTooltipId === item.id ? null : item.id
                    )
                  }}
                  className="col-span-12 sm:col-span-6 md:col-span-4"
                  mobileTooltipOpen={mobileTooltipId === item.id}
                />
              ))}
            </>
          )}

          {/* 3) Topics – tiles 4 cols wide */}
          {filter(topics).length > 0 && (
            <>
              <SectionHeader
                title="Topics"
                helper="Profiles organized by subject area."
              />
              {filter(topics).map((item) => (
                <ProfileTile
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => {
                    setSelectedId(item.id)
                    setMobileTooltipId(
                      mobileTooltipId === item.id ? null : item.id
                    )
                  }}
                  className="col-span-12 sm:col-span-6 md:col-span-4"
                  mobileTooltipOpen={mobileTooltipId === item.id}
                />
              ))}
            </>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="sticky bottom-0 left-0 w-full bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 p-4 md:p-6">
            <div className="text-sm md:text-base font-semibold">
              {selectedId
                ? `You’ve selected: ${
                    items.find((i) => i.id === selectedId)?.label ?? ""
                  }`
                : "Select a profile to continue"}
            </div>
            <Button
              size="lg"
              disabled={!selectedId}
              onClick={() => {
                const sel = items.find((i) => i.id === selectedId)
                if (sel) onConfirm(sel)
                onOpenChange(false)
              }}
            >
              {selectedId
                ? `View ${
                    items.find((i) => i.id === selectedId)?.label ?? "Profile"
                  }`
                : "Continue"}
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
  mobileTooltipOpen,
}: {
  item: SaviProfileItem
  selected: boolean
  onSelect: () => void
  className?: string
  mobileTooltipOpen?: boolean
}) {
  const Icon = iconFor(item.icon, item.type)

  const content = (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group w-full text-left outline-none",
        "rounded-xl border transition-shadow min-h-[140px]",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-lg"
          : "bg-card text-card-foreground border-border hover:shadow-md",
        className
      )}
    >
      <Card className={cn("border-0 shadow-none bg-transparent")}>
        <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center gap-3">
          <div
            className={cn(
              "rounded-full p-2",
              selected
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </div>
          <div
            className={cn(
              "text-sm md:text-base font-medium text-center leading-tight",
              selected ? "text-primary-foreground" : ""
            )}
          >
            {item.label}
          </div>

          {/* Mobile tooltip (revealed on tap) */}
          {mobileTooltipOpen && (
            <div className="md:hidden mt-2 w-full rounded-md border bg-white p-3 text-xs text-muted-foreground">
              {item.description && (
                <p className="mb-2">{truncate(item.description, 80)}</p>
              )}
              {item.indicators && item.indicators.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {item.indicators.slice(0, 3).map((ind) => (
                    <li key={ind}>{ind}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkmark for selected */}
      {selected && (
        <div
          className="absolute right-2 top-2 rounded-full bg-primary-foreground/20 p-1"
          aria-hidden="true"
        >
          <Check className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </button>
  )

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("relative", className)}>
        {/* Desktop tooltip (hover) */}
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Trigger is the card itself on desktop */}
            <div className="hidden md:block">{content}</div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-sm text-sm leading-snug"
          >
            <div className="flex flex-col gap-2">
              {item.description && (
                <p className="text-foreground">
                  {truncate(item.description, 80)}
                </p>
              )}
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

        {/* Mobile uses the normal content; desktop fallback (no tooltip wrapper) */}
        <div className="md:hidden">{content}</div>
      </div>
    </TooltipProvider>
  )
}

function truncate(str: string, max = 80) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str
}

"use client"
import { SelectIndicatorsModalEnhanced } from "./select-indicators-modal-enhanced"

interface SelectIndicatorsModalProps {
  open: boolean
  onClose: () => void
  selectedIndicators: string[]
  onSelectionChange: (indicators: string[]) => void
}

export function SelectIndicatorsModal(props: SelectIndicatorsModalProps) {
  return <SelectIndicatorsModalEnhanced {...props} />
}

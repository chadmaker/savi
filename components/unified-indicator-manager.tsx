"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnhancedIndicatorSearch } from "./enhanced-indicator-search"
import { Plus, Trash2, Eye, Save, Calculator, ArrowRight } from "lucide-react"

interface RealIndicator {
  id: string
  topic: string
  category: string
  tile: string
  indicator: string
  source: string
  lastUpdated: string
  value: number
  reportingArea: string
  availability: string
  description: string
  notes: string
}

interface Group {
  id: string
  name: string
  level: number
  parent?: string
  indicators: string[]
  children: string[]
}

interface NormalizationRule {
  id: string
  name: string
  method: "percentage" | "per_capita" | "z_score" | "custom"
  baseline: "county" | "state" | "national"
  formula?: string
  indicators: string[]
  perCapitaBase?: number
}

interface UnifiedIndicatorManagerProps {
  indicators: RealIndicator[]
  groups: Group[]
  normalizationRules: NormalizationRule[]
  onUpdateGroups: (groups: Group[]) => void
  onSaveNormalizationRule: (rule: NormalizationRule) => void
  onSaveConfiguration: (config: { groups: Group[]; normalizationRules: NormalizationRule[] }) => void
}

export function UnifiedIndicatorManager({
  indicators,
  groups,
  normalizationRules,
  onUpdateGroups,
  onSaveNormalizationRule,
  onSaveConfiguration,
}: UnifiedIndicatorManagerProps) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<"select" | "group" | "normalize">("select")

  // Group management
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedGroupLevel, setSelectedGroupLevel] = useState<number>(1)
  const [workingGroups, setWorkingGroups] = useState<Group[]>(groups)

  // Normalization
  const [normalizationConfig, setNormalizationConfig] = useState({
    name: "",
    method: "percentage" as const,
    baseline: "county" as const,
    customFormula: "",
    perCapitaBase: 1000,
  })
  const [previewResults, setPreviewResults] = useState<any[]>([])

  const selectedIndicatorObjects = indicators.filter((i) => selectedIndicators.includes(i.id))

  const createGroup = () => {
    if (!newGroupName.trim() || selectedIndicators.length === 0) return

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      level: selectedGroupLevel,
      indicators: [...selectedIndicators],
      children: [],
    }

    setWorkingGroups((prev) => [...prev, newGroup])
    setNewGroupName("")
    setSelectedIndicators([])
  }

  const removeGroup = (groupId: string) => {
    setWorkingGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const calculateNormalizationPreview = () => {
    const results = selectedIndicatorObjects.map((indicator) => {
      let normalizedValue = indicator.value

      switch (normalizationConfig.method) {
        case "percentage":
          const total = selectedIndicatorObjects.reduce((sum, i) => sum + i.value, 0)
          normalizedValue = (indicator.value / total) * 100
          break
        case "per_capita":
          const population = 971822 // Sample population
          normalizedValue = (indicator.value / population) * normalizationConfig.perCapitaBase
          break
        case "z_score":
          const mean = selectedIndicatorObjects.reduce((sum, i) => sum + i.value, 0) / selectedIndicatorObjects.length
          const variance =
            selectedIndicatorObjects.reduce((sum, i) => sum + Math.pow(i.value - mean, 2), 0) /
            selectedIndicatorObjects.length
          const stdDev = Math.sqrt(variance)
          normalizedValue = (indicator.value - mean) / stdDev
          break
        case "custom":
          try {
            normalizedValue = eval(normalizationConfig.customFormula.replace(/value/g, indicator.value.toString()))
          } catch {
            normalizedValue = indicator.value
          }
          break
      }

      return {
        ...indicator,
        originalValue: indicator.value,
        normalizedValue: normalizedValue,
      }
    })

    setPreviewResults(results)
  }

  const saveNormalizationRule = () => {
    const rule: NormalizationRule = {
      id: `rule_${Date.now()}`,
      name: normalizationConfig.name,
      method: normalizationConfig.method,
      baseline: normalizationConfig.baseline,
      formula: normalizationConfig.method === "custom" ? normalizationConfig.customFormula : undefined,
      indicators: selectedIndicators,
      perCapitaBase: normalizationConfig.method === "per_capita" ? normalizationConfig.perCapitaBase : undefined,
    }

    onSaveNormalizationRule(rule)
  }

  const saveCompleteConfiguration = () => {
    onSaveConfiguration({
      groups: workingGroups,
      normalizationRules: normalizationRules,
    })
  }

  const formatValue = (value: number, method: string) => {
    switch (method) {
      case "percentage":
        return `${value.toFixed(2)}%`
      case "per_capita":
        return `${value.toFixed(2)} per ${normalizationConfig.perCapitaBase.toLocaleString()}`
      case "z_score":
        return value.toFixed(3)
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Steps */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Indicator Management</h1>
          <p className="text-muted-foreground">Select, group, normalize, and save your indicators from SAVI data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={currentStep === "select" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep("select")}
          >
            1. Select
          </Button>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={currentStep === "group" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep("group")}
            disabled={selectedIndicators.length === 0}
          >
            2. Group
          </Button>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={currentStep === "normalize" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentStep("normalize")}
            disabled={selectedIndicators.length === 0}
          >
            3. Normalize
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedIndicators.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedIndicators.length} indicators selected</Badge>
                <div className="flex flex-wrap gap-1">
                  {selectedIndicatorObjects.slice(0, 2).map((indicator) => (
                    <Badge key={indicator.id} variant="outline" className="text-xs">
                      {indicator.indicator.length > 30
                        ? `${indicator.indicator.substring(0, 30)}...`
                        : indicator.indicator}
                    </Badge>
                  ))}
                  {selectedIndicators.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedIndicators.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedIndicators([])}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Enhanced Indicator Search */}
        <div className="lg:col-span-1">
          <EnhancedIndicatorSearch
            indicators={indicators}
            selectedIndicators={selectedIndicators}
            onSelectionChange={setSelectedIndicators}
          />
        </div>

        {/* Right Panel - Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={(value: any) => setCurrentStep(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="select">Select Indicators</TabsTrigger>
                <TabsTrigger value="group" disabled={selectedIndicators.length === 0}>
                  Create Groups
                </TabsTrigger>
                <TabsTrigger value="normalize" disabled={selectedIndicators.length === 0}>
                  Normalize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="select" className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-lg font-medium mb-2">Real SAVI Data Loaded</div>
                  <p className="text-gray-500 mb-4">Browse {indicators.length} indicators from the SAVI data portal</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">Topics Available</div>
                      <div className="text-muted-foreground">
                        {[...new Set(indicators.map((i) => i.topic))].length} unique topics
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-medium">Categories</div>
                      <div className="text-muted-foreground">
                        {[...new Set(indicators.map((i) => i.category))].length} categories
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Use the enhanced search on the left to find and select indicators by topic, category, or keyword.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="group" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input
                        id="group-name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Enter group name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="group-level">Group Level</Label>
                      <Select
                        value={selectedGroupLevel.toString()}
                        onValueChange={(v) => setSelectedGroupLevel(Number.parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                          <SelectItem value="4">Level 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={createGroup} disabled={!newGroupName.trim() || selectedIndicators.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group with Selected Indicators
                  </Button>

                  {workingGroups.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Created Groups</h4>
                      {workingGroups.map((group) => (
                        <div key={group.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{group.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Level {group.level} • {group.indicators.length} indicators
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeGroup(group.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="normalize" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Normalization Configuration</h4>
                    <div>
                      <Label htmlFor="rule-name">Rule Name</Label>
                      <Input
                        id="rule-name"
                        value={normalizationConfig.name}
                        onChange={(e) => setNormalizationConfig((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter rule name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="method">Method</Label>
                      <Select
                        value={normalizationConfig.method}
                        onValueChange={(value: any) => setNormalizationConfig((prev) => ({ ...prev, method: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="per_capita">Per Capita Rate</SelectItem>
                          <SelectItem value="z_score">Z-Score</SelectItem>
                          <SelectItem value="custom">Custom Formula</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {normalizationConfig.method === "per_capita" && (
                      <div>
                        <Label htmlFor="per-capita-base">Per Capita Base</Label>
                        <Select
                          value={normalizationConfig.perCapitaBase.toString()}
                          onValueChange={(value) =>
                            setNormalizationConfig((prev) => ({ ...prev, perCapitaBase: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1000">Per 1,000</SelectItem>
                            <SelectItem value="10000">Per 10,000</SelectItem>
                            <SelectItem value="100000">Per 100,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {normalizationConfig.method === "custom" && (
                      <div>
                        <Label htmlFor="custom-formula">Custom Formula</Label>
                        <Textarea
                          id="custom-formula"
                          value={normalizationConfig.customFormula}
                          onChange={(e) =>
                            setNormalizationConfig((prev) => ({ ...prev, customFormula: e.target.value }))
                          }
                          placeholder="Enter formula (use 'value' for indicator value)..."
                          rows={3}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="baseline">Baseline</Label>
                      <Select
                        value={normalizationConfig.baseline}
                        onValueChange={(value: any) => setNormalizationConfig((prev) => ({ ...prev, baseline: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="county">County Average</SelectItem>
                          <SelectItem value="state">State Average</SelectItem>
                          <SelectItem value="national">National Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={calculateNormalizationPreview} variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        onClick={saveNormalizationRule}
                        disabled={!normalizationConfig.name || selectedIndicators.length === 0}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Rule
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Preview Results</h4>
                    {previewResults.length > 0 ? (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Indicator</TableHead>
                              <TableHead className="text-right">Original</TableHead>
                              <TableHead className="text-right">Normalized</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewResults.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">
                                  {result.indicator.length > 40
                                    ? `${result.indicator.substring(0, 40)}...`
                                    : result.indicator}
                                </TableCell>
                                <TableCell className="text-right">{result.originalValue.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatValue(result.normalizedValue, normalizationConfig.method)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Click "Preview" to see normalization results</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Save Configuration */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Save Complete Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Save all groups and normalization rules to apply to your dashboard
              </p>
            </div>
            <Button onClick={saveCompleteConfiguration} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

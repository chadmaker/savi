"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, TrendingUp, BarChart3, Eye, Save } from "lucide-react"

interface Indicator {
  id: string
  name: string
  value: number
  category1: string
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

interface NormalizationConfigProps {
  indicators: Indicator[]
  selectedIndicators: Indicator[]
  onSaveRule: (rule: NormalizationRule) => void
}

export function NormalizationConfig({ indicators, selectedIndicators, onSaveRule }: NormalizationConfigProps) {
  const [ruleName, setRuleName] = useState("")
  const [method, setMethod] = useState<NormalizationRule["method"]>("percentage")
  const [baseline, setBaseline] = useState<NormalizationRule["baseline"]>("county")
  const [customFormula, setCustomFormula] = useState("")
  const [perCapitaBase, setPerCapitaBase] = useState(1000)
  const [previewResults, setPreviewResults] = useState<any[]>([])

  const calculatePreview = () => {
    const results = selectedIndicators.map((indicator) => {
      let normalizedValue = indicator.value

      switch (method) {
        case "percentage":
          const total = indicators.reduce((sum, i) => sum + i.value, 0)
          normalizedValue = (indicator.value / total) * 100
          break
        case "per_capita":
          const population = 971822 // Sample population
          normalizedValue = (indicator.value / population) * perCapitaBase
          break
        case "z_score":
          const mean = indicators.reduce((sum, i) => sum + i.value, 0) / indicators.length
          const variance = indicators.reduce((sum, i) => sum + Math.pow(i.value - mean, 2), 0) / indicators.length
          const stdDev = Math.sqrt(variance)
          normalizedValue = (indicator.value - mean) / stdDev
          break
        case "custom":
          // Simple custom formula evaluation (in real app, use proper parser)
          try {
            normalizedValue = eval(customFormula.replace(/value/g, indicator.value.toString()))
          } catch {
            normalizedValue = indicator.value
          }
          break
      }

      return {
        ...indicator,
        originalValue: indicator.value,
        normalizedValue: normalizedValue,
        method: method,
        baseline: baseline,
      }
    })

    setPreviewResults(results)
  }

  const saveRule = () => {
    const rule: NormalizationRule = {
      id: `rule_${Date.now()}`,
      name: ruleName,
      method,
      baseline,
      formula: method === "custom" ? customFormula : undefined,
      indicators: selectedIndicators.map((i) => i.id),
      perCapitaBase: method === "per_capita" ? perCapitaBase : undefined,
    }

    onSaveRule(rule)

    // Reset form
    setRuleName("")
    setMethod("percentage")
    setBaseline("county")
    setCustomFormula("")
    setPerCapitaBase(1000)
    setPreviewResults([])
  }

  const getMethodDescription = (method: string) => {
    switch (method) {
      case "percentage":
        return "Convert values to percentages of the total"
      case "per_capita":
        return "Calculate rates per specified population base"
      case "z_score":
        return "Standardize values using z-score normalization"
      case "custom":
        return "Apply custom formula for normalization"
      default:
        return ""
    }
  }

  const formatValue = (value: number, method: string) => {
    switch (method) {
      case "percentage":
        return `${value.toFixed(2)}%`
      case "per_capita":
        return `${value.toFixed(2)} per ${perCapitaBase.toLocaleString()}`
      case "z_score":
        return value.toFixed(3)
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Normalization & Roll-up</h2>
          <p className="text-muted-foreground">Define normalization rules for indicator aggregation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={calculatePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveRule} disabled={!ruleName || selectedIndicators.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Save Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Normalization Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter rule name..."
              />
            </div>

            <div>
              <Label>Selected Indicators ({selectedIndicators.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedIndicators.map((indicator) => (
                  <Badge key={indicator.id} variant="secondary">
                    {indicator.name}
                  </Badge>
                ))}
              </div>
              {selectedIndicators.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No indicators selected. Go to Indicator Listing to select indicators.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="method">Normalization Method</Label>
              <Select value={method} onValueChange={(value: any) => setMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="per_capita">Per Capita Rate</SelectItem>
                  <SelectItem value="z_score">Z-Score Normalization</SelectItem>
                  <SelectItem value="custom">Custom Formula</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">{getMethodDescription(method)}</p>
            </div>

            {method === "per_capita" && (
              <div>
                <Label htmlFor="per-capita-base">Per Capita Base</Label>
                <Select
                  value={perCapitaBase.toString()}
                  onValueChange={(value) => setPerCapitaBase(Number.parseInt(value))}
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

            {method === "custom" && (
              <div>
                <Label htmlFor="custom-formula">Custom Formula</Label>
                <Textarea
                  id="custom-formula"
                  value={customFormula}
                  onChange={(e) => setCustomFormula(e.target.value)}
                  placeholder="Enter formula (use 'value' for indicator value)..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">Example: value * 100 / 971822</p>
              </div>
            )}

            <div>
              <Label htmlFor="baseline">Comparison Baseline</Label>
              <Select value={baseline} onValueChange={(value: any) => setBaseline(value)}>
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
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Normalization Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewResults.length > 0 ? (
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="space-y-4">
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
                          <TableCell className="font-medium">{result.name}</TableCell>
                          <TableCell className="text-right">{result.originalValue.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatValue(result.normalizedValue, result.method)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="chart" className="space-y-4">
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart visualization would appear here</p>
                      <p className="text-sm text-gray-400">Integration with charting library needed</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click "Preview" to see normalization results</p>
                  <p className="text-sm text-gray-400">Configure your normalization settings first</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metadata Display */}
      {previewResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Normalization Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Method</Label>
                <p className="text-sm text-muted-foreground">{method}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Baseline</Label>
                <p className="text-sm text-muted-foreground">{baseline}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Indicators Count</Label>
                <p className="text-sm text-muted-foreground">{selectedIndicators.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

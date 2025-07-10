"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Star,
  Info,
  HelpCircle,
} from "lucide-react"

// Sample CSV data for template and preview
const sampleCSVData = `Street,City,State,ZIP,Year,Population,Category
123 Main St,Indianapolis,IN,46201,2023,1250,Residential
456 Oak Ave,Indianapolis,IN,46202,2023,2100,Commercial
789 Pine Rd,Carmel,IN,46032,2023,3200,Residential
321 Elm St,Fishers,IN,46038,2023,1800,Mixed Use
654 Maple Dr,Noblesville,IN,46060,2023,2750,Residential
987 Cedar Ln,Westfield,IN,46074,2023,1950,Commercial
147 Birch Way,Zionsville,IN,46077,2023,2400,Residential
258 Walnut St,Indianapolis,IN,46203,2023,1600,Residential
369 Cherry Ave,Indianapolis,IN,46204,2023,2900,Commercial
741 Spruce Ct,Greenwood,IN,46143,2023,2200,Mixed Use`

const mapData = [
  { id: 1, lat: 39.7684, lng: -86.1581, address: "123 Main St", population: 1250 },
  { id: 2, lat: 39.7792, lng: -86.1478, address: "456 Oak Ave", population: 2100 },
  { id: 3, lat: 39.9784, lng: -86.118, address: "789 Pine Rd", population: 3200 },
  { id: 4, lat: 39.9568, lng: -85.9268, address: "321 Elm St", population: 1800 },
  { id: 5, lat: 40.0456, lng: -85.9722, address: "654 Maple Dr", population: 2750 },
]

interface UploadedData {
  headers: string[]
  rows: string[][]
  errors: { row: number; column: number; message: string }[]
}

interface FieldMapping {
  [key: string]: string
}

interface DataTypes {
  [key: string]: {
    type: "numeric" | "categorical" | "geographic"
    precision?: number
  }
}

export default function SAVIWorkspace() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null)
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    street: "",
    city: "",
    state: "",
    zip: "",
    year: "",
    population: "",
    category: "",
  })
  const [dataTypes, setDataTypes] = useState<DataTypes>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [dataVisibility, setDataVisibility] = useState<"public" | "private" | "sharable">("private")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { number: 1, title: "Upload", description: "Download & Upload CSV" },
    { number: 2, title: "Configure", description: "Map fields and set types" },
    { number: 3, title: "Review", description: "Review data and settings" },
    { number: 4, title: "Complete", description: "Confirmation & Map Display" },
  ]

  const datasets = [
    {
      id: 1,
      title: "American Community Survey",
      extent: "Central Indiana",
      reportingArea: "County",
      updated: "2023",
      dataFrom: "2010",
      icon: "🇺🇸",
    },
    {
      id: 2,
      title: "Community Centers Near Schools",
      extent: "Central Indiana",
      reportingArea: "County",
      updated: "2025",
      dataFrom: "2023",
      icon: "🎯",
    },
    {
      id: 3,
      title: "Educational Attainment Data",
      extent: "Central Indiana",
      reportingArea: "County",
      updated: "2023",
      dataFrom: "2010",
      icon: "🎓",
    },
    {
      id: 4,
      title: "Educational Success Metrics",
      extent: "Central Indiana",
      reportingArea: "County",
      updated: "2023",
      dataFrom: "2010",
      icon: "🤝",
    },
  ]

  const downloadTemplate = () => {
    const blob = new Blob([sampleCSVData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "savi-data-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (csvText: string): UploadedData => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()))

    // Simulate validation errors
    const errors: { row: number; column: number; message: string }[] = []
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (headers[colIndex]?.toLowerCase().includes("year") && isNaN(Number(cell))) {
          errors.push({
            row: rowIndex + 1,
            column: colIndex,
            message: "Year must be a number",
          })
        }
        if (headers[colIndex]?.toLowerCase().includes("population") && isNaN(Number(cell))) {
          errors.push({
            row: rowIndex + 1,
            column: colIndex,
            message: "Population must be a number",
          })
        }
      })
    })

    return { headers, rows, errors }
  }

  const handleFileUpload = useCallback((file: File) => {
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      const data = parseCSV(csvText)
      setUploadedData(data)

      // Auto-map standard fields
      const mapping: FieldMapping = {
        street: "",
        city: "",
        state: "",
        zip: "",
        year: "",
        population: "",
        category: "",
      }
      data.headers.forEach((header) => {
        const lowerHeader = header.toLowerCase()
        if (lowerHeader.includes("street") || lowerHeader.includes("address")) {
          mapping["street"] = header
        } else if (lowerHeader.includes("city")) {
          mapping["city"] = header
        } else if (lowerHeader.includes("state")) {
          mapping["state"] = header
        } else if (lowerHeader.includes("zip")) {
          mapping["zip"] = header
        } else if (lowerHeader.includes("year")) {
          mapping["year"] = header
        } else if (lowerHeader.includes("population")) {
          mapping["population"] = header
        } else if (lowerHeader.includes("category")) {
          mapping["category"] = header
        }
      })
      setFieldMapping(mapping)
      setIsUploading(false)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))
      if (csvFile) {
        handleFileUpload(csvFile)
      }
    },
    [handleFileUpload],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return uploadedData !== null
      case 2:
        return fieldMapping.street && fieldMapping.city && fieldMapping.state && fieldMapping.zip
      case 3:
        return uploadedData && uploadedData.errors.length === 0 && termsAccepted
      default:
        return true
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetModal = () => {
    setCurrentStep(1)
    setUploadedData(null)
    setFieldMapping({ street: "", city: "", state: "", zip: "", year: "", population: "", category: "" })
    setDataTypes({})
    setTermsAccepted(false)
    setDataVisibility("private")
    setIsUploading(false)
  }

  const handleCloseModal = () => {
    setShowUploadModal(false)
    resetModal()
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold ${
                  currentStep >= step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500 bg-white"
                }`}
              >
                {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-sm font-semibold ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Download CSV Template Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Download CSV Template</h3>
          <p className="text-gray-600">
            Start by downloading our sample CSV template to see the expected format for your data.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Template includes these fields:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              Street Address
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              City
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              State
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              ZIP Code
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              Year
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              Population
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              Category
            </div>
          </div>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Once downloaded, you can modify the template with your own data while keeping the same structure.
        </p>
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-200"></div>

      {/* Upload CSV Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV</h3>
          <p className="text-gray-600">Drag and drop your CSV file or click to browse and select it.</p>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-6" />
          <p className="text-lg font-semibold text-gray-900 mb-2">Drag and drop your CSV file here</p>
          <p className="text-gray-600 mb-6">or</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-8 py-3 text-base"
          >
            {isUploading ? "Processing..." : "Browse Files"}
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          <p className="text-sm text-gray-500 mt-6">Supported format: CSV files only</p>
        </div>

        {uploadedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6" />
              <div>
                <div className="font-semibold">File uploaded successfully!</div>
                <div className="text-sm text-green-700 mt-1">
                  Found {uploadedData.headers.length} columns and {uploadedData.rows.length} rows
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Data Fields & Types</h3>
        <p className="text-gray-600">Map your CSV columns to required fields and set data types.</p>
      </div>

      {uploadedData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Required Fields */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Required Fields</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>These fields are required for proper data processing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fieldMapping.street || ""}
                  onValueChange={(value) => setFieldMapping({ ...fieldMapping, street: value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  City <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fieldMapping.city || ""}
                  onValueChange={(value) => setFieldMapping({ ...fieldMapping, city: value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fieldMapping.state || ""}
                  onValueChange={(value) => setFieldMapping({ ...fieldMapping, state: value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fieldMapping.zip || ""}
                  onValueChange={(value) => setFieldMapping({ ...fieldMapping, zip: value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Column - Optional Fields */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Optional Fields</h4>
              <span className="text-sm text-gray-500">(optional)</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>These fields provide additional context for your data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900">Year</Label>
                <Select
                  value={fieldMapping.year || ""}
                  onValueChange={(value) => setFieldMapping({ ...fieldMapping, year: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldMapping.year && (
                  <Select
                    value={dataTypes[fieldMapping.year]?.type || ""}
                    onValueChange={(value: "numeric" | "categorical" | "geographic") =>
                      setDataTypes({
                        ...dataTypes,
                        [fieldMapping.year]: { type: value },
                      })
                    }
                  >
                    <SelectTrigger className="mt-2 border-gray-300">
                      <SelectValue placeholder="Data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="categorical">Categorical</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">Population</Label>
                <Select
                  value={fieldMapping.population || ""}
                  onValueChange={(value) =>
                    setFieldMapping({ ...fieldMapping, population: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldMapping.population && (
                  <Select
                    value={dataTypes[fieldMapping.population]?.type || ""}
                    onValueChange={(value: "numeric" | "categorical" | "geographic") =>
                      setDataTypes({
                        ...dataTypes,
                        [fieldMapping.population]: { type: value },
                      })
                    }
                  >
                    <SelectTrigger className="mt-2 border-gray-300">
                      <SelectValue placeholder="Data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="categorical">Categorical</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">Category</Label>
                <Select
                  value={fieldMapping.category || ""}
                  onValueChange={(value) =>
                    setFieldMapping({ ...fieldMapping, category: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {uploadedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldMapping.category && (
                  <Select
                    value={dataTypes[fieldMapping.category]?.type || ""}
                    onValueChange={(value: "numeric" | "categorical" | "geographic") =>
                      setDataTypes({
                        ...dataTypes,
                        [fieldMapping.category]: { type: value },
                      })
                    }
                  >
                    <SelectTrigger className="mt-2 border-gray-300">
                      <SelectValue placeholder="Data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="categorical">Categorical</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedData && uploadedData.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <div>
              <div className="font-semibold">Validation Issues Found</div>
              <div className="text-sm text-red-700 mt-1">
                {uploadedData.errors.length} validation errors detected in your data.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Data & Privacy Settings</h3>
        <p className="text-gray-600">Review your data and configure privacy settings.</p>
      </div>

      {uploadedData && (
        <div className="space-y-8">
          {/* Validation Status at Top */}
          {uploadedData.errors.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-800">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{uploadedData.errors.length} errors found</div>
                    <div className="text-sm text-red-700 mt-1">Please fix these issues before proceeding.</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const errorReport = uploadedData.errors
                      .map(
                        (error) => `Row ${error.row}, Column ${uploadedData.headers[error.column]}: ${error.message}`,
                      )
                      .join("\n")
                    const blob = new Blob([errorReport], { type: "text/plain" })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "data-errors.txt"
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                  }}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Errors
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Data validation passed!</div>
                  <div className="text-sm text-green-700 mt-1">Your data looks good and is ready for processing.</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Data Preview</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12 font-semibold text-gray-900">#</TableHead>
                      {uploadedData.headers.map((header) => (
                        <TableHead key={header} className="font-semibold text-gray-900">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedData.rows.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{rowIndex + 1}</TableCell>
                        {row.map((cell, cellIndex) => {
                          const hasError = uploadedData.errors.some(
                            (error) => error.row === rowIndex + 1 && error.column === cellIndex,
                          )
                          return (
                            <TableCell
                              key={cellIndex}
                              className={hasError ? "bg-red-50 text-red-800" : "text-gray-700"}
                            >
                              {cell}
                              {hasError && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertCircle className="w-4 h-4 text-red-500 ml-2 inline" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {
                                          uploadedData.errors.find(
                                            (error) => error.row === rowIndex + 1 && error.column === cellIndex,
                                          )?.message
                                        }
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <p className="text-sm text-gray-500">Showing first 5 rows of {uploadedData.rows.length} total rows</p>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Terms & Privacy Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Terms */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Terms & Conditions</h4>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-2">
                  <Label htmlFor="terms" className="text-sm font-semibold text-gray-900 leading-none cursor-pointer">
                    I agree to the Terms and Conditions
                  </Label>
                  <p className="text-sm text-gray-600">
                    By checking this box, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      Terms of Service
                      <ExternalLink className="w-3 h-3" />
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      Privacy Policy
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900">Data Security</h5>
                    <p className="text-sm text-blue-800 mt-1">
                      All uploaded data is encrypted and stored securely. You can change visibility settings or delete
                      your data at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Privacy Settings */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Data Visibility</h4>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={dataVisibility === "private"}
                    onChange={(e) => setDataVisibility(e.target.value as "private")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="private" className="font-semibold text-gray-900 cursor-pointer">
                      Private
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Only you can view and access this data. Recommended for sensitive information.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    id="sharable"
                    name="visibility"
                    value="sharable"
                    checked={dataVisibility === "sharable"}
                    onChange={(e) => setDataVisibility(e.target.value as "sharable")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="sharable" className="font-semibold text-gray-900 cursor-pointer">
                      Sharable
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      You can share this data with specific people, but it won't be indexed or discoverable by other
                      SAVI users.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={dataVisibility === "public"}
                    onChange={(e) => setDataVisibility(e.target.value as "public")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <Label htmlFor="public" className="font-semibold text-gray-900 cursor-pointer">
                      Public
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Data will be visible to other SAVI users and may be used for research purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column - Success Confirmation */}
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Upload Complete!</h3>
            <p className="text-gray-600 mt-3">
              Your data has been successfully processed and is ready to view on the map.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Summary</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600">Records Processed</div>
              <div className="text-2xl font-bold text-blue-600">{uploadedData?.rows.length || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Visibility</div>
              <div className="text-2xl font-bold text-blue-600 capitalize">{dataVisibility}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Field Mappings</h4>
          <div className="space-y-3">
            {Object.entries(fieldMapping)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 capitalize">{key}:</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Right Column - Interactive Map */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900">Indianapolis Metro Area - Your Data</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="relative bg-gray-100" style={{ height: "400px" }}>
            {/* Simulated map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 400 400">
                  {/* Simulated roads */}
                  <path d="M0,200 L400,200" stroke="#666" strokeWidth="2" />
                  <path d="M200,0 L200,400" stroke="#666" strokeWidth="2" />
                  <path d="M100,100 L300,300" stroke="#666" strokeWidth="1" />
                  <path d="M300,100 L100,300" stroke="#666" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* Data points */}
            {mapData.map((point, index) => (
              <TooltipProvider key={point.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + (index % 3) * 20}%`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-semibold">{point.address}</div>
                      <div>Population: {point.population.toLocaleString()}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Map labels */}
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
              Indianapolis
            </div>
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">Carmel</div>
            <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
              Greenwood
            </div>
            <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
              Fishers
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">Your Data Points ({mapData.length})</span>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Interactive Map
          </Badge>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SAVI PRO Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900">SAVI PRO</span>
            </div>

            <nav className="flex items-center gap-8">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 py-4 border-b-2 border-transparent hover:border-blue-600"
              >
                Projects
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 py-4 border-b-2 border-transparent hover:border-blue-600"
              >
                Communities
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 py-4 border-b-2 border-transparent hover:border-blue-600"
              >
                Indicators
              </a>
              <a href="#" className="text-blue-600 font-medium py-4 border-b-2 border-blue-600">
                Data Upload
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 py-4 border-b-2 border-transparent hover:border-blue-600"
              >
                Visualizations
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Datasets</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="p-2 bg-gray-900 text-white rounded-l-lg">
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-r-lg">
                <div className="w-4 h-4 flex flex-col gap-1">
                  <div className="h-0.5 bg-current rounded"></div>
                  <div className="h-0.5 bg-current rounded"></div>
                  <div className="h-0.5 bg-current rounded"></div>
                </div>
              </button>
            </div>

            <Button className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Starred
            </Button>

            <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload data
            </Button>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{dataset.title}</h3>
                <button className="text-gray-400 hover:text-yellow-500">
                  <Star className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className={`
                    ${dataset.id === 1 ? "bg-green-100 text-green-800" : ""}
                    ${dataset.id === 2 ? "bg-blue-100 text-blue-800" : ""}
                    ${dataset.id === 3 ? "bg-purple-100 text-purple-800" : ""}
                    ${dataset.id === 4 ? "bg-orange-100 text-orange-800" : ""}
                  `}
                >
                  {dataset.id === 1
                    ? "Census"
                    : dataset.id === 2
                      ? "My Uploads"
                      : dataset.id === 3
                        ? "Education"
                        : "Community"}
                </Badge>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span>
                  📊 {dataset.dataFrom}-{dataset.updated}
                </span>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Select
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Data Upload</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {renderStepIndicator()}

            <div className="min-h-[600px] px-2">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {currentStep < 4 && (
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8 py-3 bg-transparent"
                >
                  Previous
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()} className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                  {currentStep === 3 ? "Complete Upload" : "Next Step"}
                </Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex justify-center pt-6 border-t border-gray-200">
                <Button onClick={handleCloseModal} className="bg-blue-600 hover:bg-blue-700 px-12 py-3">
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="bg-white border-t p-4 text-center text-sm text-gray-600">
        Copyright 2025 The Polis Center
        <span className="float-right">savi.org</span>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, Upload, FileText, CheckCircle, AlertCircle, Info, MapPin, Eye, ExternalLink } from "lucide-react"

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

export default function SAVIUploadPrototype() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null)
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({ street: "", city: "", state: "", zip: "" })
  const [dataTypes, setDataTypes] = useState<DataTypes>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [dataVisibility, setDataVisibility] = useState<"public" | "private">("private")
  const [isUploading, setIsUploading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { number: 1, title: "Download Template", description: "Get sample CSV format" },
    { number: 2, title: "Upload Data", description: "Upload your CSV file" },
    { number: 3, title: "Map Fields", description: "Match your data fields" },
    { number: 4, title: "Preview & Validate", description: "Review your data" },
    { number: 5, title: "Define Types", description: "Set data formats" },
    { number: 6, title: "Privacy Settings", description: "Terms and visibility" },
    { number: 7, title: "Complete", description: "View on map" },
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
      const mapping: FieldMapping = { street: "", city: "", state: "", zip: "" }
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

  const exportErrors = () => {
    if (!uploadedData) return

    const errorReport = uploadedData.errors
      .map((error) => `Row ${error.row}, Column ${uploadedData.headers[error.column]}: ${error.message}`)
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
  }

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return uploadedData !== null
      case 3:
        return fieldMapping.street && fieldMapping.city && fieldMapping.state && fieldMapping.zip
      case 4:
        return uploadedData && uploadedData.errors.length === 0
      case 5:
        return Object.keys(dataTypes).length > 0
      case 6:
        return termsAccepted
      default:
        return true
    }
  }

  const nextStep = () => {
    if (canProceed() && currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.number ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
            }`}
          >
            {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
          </div>
          <div className="ml-3 hidden md:block">
            <div className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"}`}>
              {step.title}
            </div>
            <div className="text-xs text-gray-500">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download CSV Template
        </CardTitle>
        <CardDescription>
          Start by downloading our sample CSV template to see the expected format for your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Template includes these fields:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>• Street Address</div>
            <div>• City</div>
            <div>• State</div>
            <div>• ZIP Code</div>
            <div>• Year</div>
            <div>• Population</div>
            <div>• Category</div>
          </div>
        </div>
        <Button onClick={downloadTemplate} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Sample CSV
        </Button>
        <p className="text-sm text-gray-600 text-center">
          Once downloaded, you can modify the template with your own data while keeping the same structure.
        </p>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Your CSV File
        </CardTitle>
        <CardDescription>Drag and drop your CSV file or click to browse and select it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drag and drop your CSV file here</p>
          <p className="text-gray-600 mb-4">or</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? "Processing..." : "Browse Files"}
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          <p className="text-sm text-gray-500 mt-4">Supported format: CSV files only</p>
        </div>

        {uploadedData && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">File uploaded successfully!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Found {uploadedData.headers.length} columns and {uploadedData.rows.length} rows
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Field Matching & Validation
        </CardTitle>
        <CardDescription>
          Map your CSV columns to the required fields. Standard fields are auto-matched.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadedData && (
          <>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Street Address</Label>
                  <Select
                    value={fieldMapping.street || "Select column"}
                    onValueChange={(value) => setFieldMapping({ ...fieldMapping, street: value })}
                  >
                    <SelectTrigger>
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
                  <Label className="text-sm font-medium">City</Label>
                  <Select
                    value={fieldMapping.city || "Select column"}
                    onValueChange={(value) => setFieldMapping({ ...fieldMapping, city: value })}
                  >
                    <SelectTrigger>
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
                  <Label className="text-sm font-medium">State</Label>
                  <Select
                    value={fieldMapping.state || "Select column"}
                    onValueChange={(value) => setFieldMapping({ ...fieldMapping, state: value })}
                  >
                    <SelectTrigger>
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
                  <Label className="text-sm font-medium">ZIP Code</Label>
                  <Select
                    value={fieldMapping.zip || "Select column"}
                    onValueChange={(value) => setFieldMapping({ ...fieldMapping, zip: value })}
                  >
                    <SelectTrigger>
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

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Additional Fields (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <Select
                      value={fieldMapping.year || "Select column"}
                      onValueChange={(value) =>
                        setFieldMapping({ ...fieldMapping, year: value === "none" ? "" : value })
                      }
                    >
                      <SelectTrigger>
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
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Population</Label>
                    <Select
                      value={fieldMapping.population || "Select column"}
                      onValueChange={(value) =>
                        setFieldMapping({ ...fieldMapping, population: value === "none" ? "" : value })
                      }
                    >
                      <SelectTrigger>
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
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={fieldMapping.category || "Select column"}
                      onValueChange={(value) =>
                        setFieldMapping({ ...fieldMapping, category: value === "none" ? "" : value })
                      }
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
              </div>
            </div>

            {uploadedData.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Validation Issues Found</span>
                </div>
                <p className="text-sm text-red-700">
                  {uploadedData.errors.length} validation errors detected in your data.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Data Preview & Error Handling
        </CardTitle>
        <CardDescription>Review the first 10 rows of your data and address any issues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadedData && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    {uploadedData.headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedData.rows.slice(0, 10).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                      {row.map((cell, cellIndex) => {
                        const hasError = uploadedData.errors.some(
                          (error) => error.row === rowIndex + 1 && error.column === cellIndex,
                        )
                        return (
                          <TableCell key={cellIndex} className={hasError ? "bg-red-50 text-red-800" : ""}>
                            {cell}
                            {hasError && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertCircle className="w-4 h-4 text-red-500 ml-1 inline" />
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

            {uploadedData.rows.length > 10 && (
              <p className="text-sm text-gray-600 text-center">
                Showing first 10 rows of {uploadedData.rows.length} total rows
              </p>
            )}

            {uploadedData.errors.length > 0 && (
              <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{uploadedData.errors.length} errors found</span>
                  </div>
                  <p className="text-sm text-red-700">Please fix these issues before proceeding.</p>
                </div>
                <Button variant="outline" onClick={exportErrors}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Errors
                </Button>
              </div>
            )}

            {uploadedData.errors.length === 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Data validation passed!</span>
                </div>
                <p className="text-sm text-green-700">Your data looks good and is ready for processing.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Define Data Types & Formats</CardTitle>
        <CardDescription>Specify the data type and format for each field to ensure proper analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadedData && (
          <div className="space-y-4">
            {uploadedData.headers.map((header) => (
              <div key={header} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">{header}</Label>
                  <p className="text-sm text-gray-600">
                    Sample: {uploadedData.rows[0]?.[uploadedData.headers.indexOf(header)] || "N/A"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm">Data Type</Label>
                  <Select
                    value={dataTypes[header]?.type || "Select type"}
                    onValueChange={(value: "numeric" | "categorical" | "geographic") =>
                      setDataTypes({
                        ...dataTypes,
                        [header]: { ...dataTypes[header], type: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="categorical">Categorical</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dataTypes[header]?.type === "numeric" && (
                  <div>
                    <Label className="text-sm">Decimal Places</Label>
                    <Select
                      value={dataTypes[header]?.precision?.toString() || "0"}
                      onValueChange={(value) =>
                        setDataTypes({
                          ...dataTypes,
                          [header]: { ...dataTypes[header], precision: Number.parseInt(value) },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (1234)</SelectItem>
                        <SelectItem value="1">1 (123.4)</SelectItem>
                        <SelectItem value="2">2 (12.34)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {dataTypes[header]?.type === "categorical" && (
                  <div className="text-sm text-gray-600">
                    <p>Format: Text categories</p>
                    <p>Example: Residential, Commercial</p>
                  </div>
                )}

                {dataTypes[header]?.type === "geographic" && (
                  <div className="text-sm text-gray-600">
                    <p>Format: Address/Location</p>
                    <p>Example: 123 Main St</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderStep6 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Terms & Privacy Settings</CardTitle>
        <CardDescription>Review and accept our terms, then choose your data visibility preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="space-y-1">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
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
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Data Visibility</Label>
          <RadioGroup value={dataVisibility} onValueChange={(value: "public" | "private") => setDataVisibility(value)}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="private" id="private" />
              <div className="space-y-1">
                <Label htmlFor="private" className="font-medium">
                  Private
                </Label>
                <p className="text-sm text-gray-600">
                  Only you can view and access this data. Recommended for sensitive information.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="public" id="public" />
              <div className="space-y-1">
                <Label htmlFor="public" className="font-medium">
                  Public
                </Label>
                <p className="text-sm text-gray-600">
                  Data will be visible to other SAVI users and may be used for research purposes.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Data Security</h4>
              <p className="text-sm text-blue-800 mt-1">
                All uploaded data is encrypted and stored securely. You can change visibility settings or delete your
                data at any time.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep7 = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-800">Upload Complete!</h2>
              <p className="text-gray-600 mt-2">
                Your data has been successfully processed and is ready to view on the map.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <div className="font-medium">Records Processed</div>
                <div className="text-2xl font-bold text-blue-600">{uploadedData?.rows.length || 0}</div>
              </div>
              <div>
                <div className="font-medium">Data Visibility</div>
                <div className="text-2xl font-bold text-blue-600 capitalize">{dataVisibility}</div>
              </div>
            </div>
            <Button size="lg" onClick={() => setShowMap(true)} className="w-full">
              <MapPin className="w-4 h-4 mr-2" />
              View Data on Map
            </Button>
          </div>
        </CardContent>
      </Card>

      {showMap && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Indianapolis Metro Area - Your Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "400px" }}>
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
                        className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + (index % 3) * 20}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-medium">{point.address}</div>
                        <div>Population: {point.population.toLocaleString()}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              {/* Map labels */}
              <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded shadow text-sm font-medium">
                Indianapolis
              </div>
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded shadow text-sm font-medium">Carmel</div>
              <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow text-sm font-medium">
                Greenwood
              </div>
              <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded shadow text-sm font-medium">
                Fishers
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Your Data Points ({mapData.length})</span>
              </div>
              <Badge variant="secondary">Interactive Map</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold">SAVI Data Upload</h1>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderStepIndicator()}

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          {currentStep === 7 && renderStep7()}
        </div>

        {currentStep < 7 && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={nextStep} disabled={!canProceed()}>
              {currentStep === 6 ? "Complete Upload" : "Next Step"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, CheckCircle, FileText, AlertCircle, HelpCircle, Info, ExternalLink } from "lucide-react"

interface DataUploadModalProps {
  open: boolean
  onClose: () => void
}

interface UploadedData {
  headers: string[]
  rows: string[][]
  errors: { row: number; column: number; message: string }[]
}

interface FieldMapping {
  street: string
  city: string
  state: string
  zip: string
  year: string
  population: string
  category: string
}

export function DataUploadModal({ open, onClose }: DataUploadModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    street: "",
    city: "",
    state: "",
    zip: "",
    year: "",
    population: "",
    category: "",
  })
  const [dataVisibility, setDataVisibility] = useState<"private" | "sharable" | "public">("private")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Configure" },
    { number: 3, title: "Review" },
    { number: 4, title: "Settings" },
    { number: 5, title: "Confirmation" },
  ]

  const mapData = [
    { id: 1, address: "123 Main St", population: 2500 },
    { id: 2, address: "456 Oak Ave", population: 3200 },
    { id: 3, address: "789 Pine Rd", population: 1800 },
    { id: 4, address: "321 Elm St", population: 2900 },
  ]

  const parseCSV = (csvText: string): UploadedData => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()))

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
          mapping.street = header
        } else if (lowerHeader.includes("city")) {
          mapping.city = header
        } else if (lowerHeader.includes("state")) {
          mapping.state = header
        } else if (lowerHeader.includes("zip")) {
          mapping.zip = header
        } else if (lowerHeader.includes("year")) {
          mapping.year = header
        } else if (lowerHeader.includes("population")) {
          mapping.population = header
        } else if (lowerHeader.includes("category")) {
          mapping.category = header
        }
      })

      setFieldMapping(mapping)
      setIsUploading(false)
    }
    reader.readAsText(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "text/csv") {
      handleFileUpload(file)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `Street Address,City,State,ZIP,Year,Population,Category
123 Main St,Indianapolis,IN,46201,2023,2500,Residential
456 Oak Ave,Indianapolis,IN,46202,2023,3200,Commercial
789 Pine Rd,Indianapolis,IN,46203,2023,1800,Mixed Use`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "savi-data-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return uploadedData !== null
      case 2:
        return fieldMapping.street && fieldMapping.city && fieldMapping.state
      case 3:
        return uploadedData && uploadedData.errors.length === 0
      case 4:
        return termsAccepted
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Upload Your Data"
      case 2:
        return "Configure Field Mapping"
      case 3:
        return "Review & Validate"
      case 4:
        return "Data Settings"
      case 5:
        return "Upload Complete"
      default:
        return "Data Upload"
    }
  }

  const handleCloseModal = () => {
    setCurrentStep(1)
    setUploadedData(null)
    setFieldMapping({
      street: "",
      city: "",
      state: "",
      zip: "",
      year: "",
      population: "",
      category: "",
    })
    setDataVisibility("private")
    setTermsAccepted(false)
    setIsUploading(false)
    onClose()
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
      <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>

      <div className="grid grid-cols-10 gap-8">
        <div className="col-span-4">
          <div className="bg-[#F7F9FC] rounded-lg p-4 space-y-6 h-full">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Start with a Template</h2>
              <p className="text-gray-600 text-sm">Use this template to see the expected format for your data.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Template includes:</h4>
              <div className="space-y-2 text-xs text-gray-700 mb-4">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Street Address
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  City, State, ZIP
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Year, Population
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Category
                </div>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent text-xs"
              >
                <Download className="w-3 h-3 mr-2" />
                Download CSV
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Once downloaded, you can modify the template with your own data while keeping the same structure.
            </p>
          </div>
        </div>

        <div className="col-span-6">
          <div className="rounded-lg p-4 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV</h2>
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
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>

      {uploadedData && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Required Fields</h2>
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

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900 w-1/3">Label</TableHead>
                    <TableHead className="font-semibold text-gray-900 w-1/3">Column Select</TableHead>
                    <TableHead className="font-semibold text-gray-900 w-1/3">Data Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Street Address <span className="text-red-500">*</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={fieldMapping.street || ""}
                        onValueChange={(value) => setFieldMapping({ ...fieldMapping, street: value })}
                      >
                        <SelectTrigger className="border-gray-300">
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
                    </TableCell>
                    <TableCell>
                      <Select disabled value="geographic">
                        <SelectTrigger className="border-gray-300 bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geographic">Geographic</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      City <span className="text-red-500">*</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={fieldMapping.city || ""}
                        onValueChange={(value) => setFieldMapping({ ...fieldMapping, city: value })}
                      >
                        <SelectTrigger className="border-gray-300">
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
                    </TableCell>
                    <TableCell>
                      <Select disabled value="geographic">
                        <SelectTrigger className="border-gray-300 bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geographic">Geographic</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      State <span className="text-red-500">*</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={fieldMapping.state || ""}
                        onValueChange={(value) => setFieldMapping({ ...fieldMapping, state: value })}
                      >
                        <SelectTrigger className="border-gray-300">
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
                    </TableCell>
                    <TableCell>
                      <Select disabled value="geographic">
                        <SelectTrigger className="border-gray-300 bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geographic">Geographic</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>

      {uploadedData && (
        <div className="space-y-8">
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
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
                    {uploadedData.rows.slice(0, 10).map((row, rowIndex) => (
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
            <p className="text-sm text-gray-500">Showing first 10 rows of {uploadedData.rows.length} total rows</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Data Visibility</h2>

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
                  You can share this data with specific people, but it won't be indexed or discoverable by other SAVI
                  users.
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

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Terms & Conditions</h2>

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
                  All uploaded data is encrypted and stored securely. You can change visibility settings or delete your
                  data at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-800">
          <CheckCircle className="w-6 h-6" />
          <div>
            <div className="font-semibold">Upload Complete!</div>
            <div className="text-sm text-green-700 mt-1">
              Your data has been successfully processed and is ready to view on the map.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{uploadedData?.rows.length || 0}</div>
              <div className="text-sm text-blue-800">Records</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">Private</div>
              <div className="text-sm text-green-800">Visibility</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">Indianapolis</div>
              <div className="text-sm text-purple-800">Location</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Field Mappings</h2>
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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Indianapolis Metro Area</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="relative bg-gray-100" style={{ height: "400px" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    <path d="M0,200 L400,200" stroke="#666" strokeWidth="2" />
                    <path d="M200,0 L200,400" stroke="#666" strokeWidth="2" />
                    <path d="M100,100 L300,300" stroke="#666" strokeWidth="1" />
                    <path d="M300,100 L100,300" stroke="#666" strokeWidth="1" />
                  </svg>
                </div>
              </div>

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

              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded px-3 py-2 text-sm">
                <div className="font-semibold">Indianapolis Metro</div>
                <div className="text-gray-600">{uploadedData?.rows.length || 0} data points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
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
            {currentStep === 5 && renderStep5()}
          </div>

          {currentStep < 5 && (
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
                {currentStep === 4 ? "Complete Upload" : "Next Step"}
              </Button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex justify-center pt-6 border-t border-gray-200">
              <Button onClick={handleCloseModal} className="bg-blue-600 hover:bg-blue-700 px-12 py-3">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

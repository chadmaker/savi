"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface DataUploadModalProps {
  open: boolean
  onClose: () => void
}

export function DataUploadModal({ open, onClose }: DataUploadModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const steps = [
    { number: 1, title: "CSV Template", description: "Download template and prepare data" },
    { number: 2, title: "Upload File", description: "Upload your prepared CSV file" },
    { number: 3, title: "Field Matching", description: "Review and match data fields" },
    { number: 4, title: "Confirmation", description: "Confirm upload and processing" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setCurrentStep(3)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onClose()
    setCurrentStep(1)
    setUploadedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Data Upload Wizard</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? <CheckCircle className="h-5 w-5" /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 min-h-0">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Download CSV Template</h3>
                <p className="text-gray-600 mb-6">
                  Download our CSV template to ensure your data is formatted correctly for import.
                </p>
              </div>

              <Card>
                <CardContent className="p-6 text-center">
                  <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <Button className="mb-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Template includes:</p>
                    <ul className="text-left max-w-md mx-auto space-y-1">
                      <li>• Community/Geography column</li>
                      <li>• Data indicator columns</li>
                      <li>• Time period columns</li>
                      <li>• Sample data for reference</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Upload Your Data File</h3>
                <p className="text-gray-600 mb-6">
                  Upload your prepared CSV file using the drag & drop area or file browser.
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop your CSV file here</p>
                    <p className="text-gray-500 mb-4">or</p>
                    <div>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Browse Files
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Supported format: CSV (Max size: 10MB)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Field Matching & Review</h3>
                <p className="text-gray-600 mb-6">
                  Review the automatic field matching and make adjustments if needed.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium">File: {uploadedFile?.name}</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h4 className="font-medium">Field Mapping Preview</h4>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Community → Geography</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Population → Total Population</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Income → Median Household Income</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Year → Time Period</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Complete!</h3>
                <p className="text-gray-600 mb-6">Your data has been successfully uploaded and processed.</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>File processed:</span>
                      <span className="font-medium">{uploadedFile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Records imported:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New indicators created:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Communities updated:</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={currentStep === 1 ? onClose : handleBack} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={currentStep === 4 ? handleComplete : handleNext}
            disabled={currentStep === 2 && !uploadedFile}
          >
            {currentStep === 4 ? "Complete" : "Next"}
            {currentStep !== 4 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

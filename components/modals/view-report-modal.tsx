"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Edit, Share, Calendar, User, Eye, Printer } from "lucide-react"

interface ViewReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: {
    id: string
    title: string
    description: string
    status: string
    author: string
    created: string
    pages: number
  }
}

export function ViewReportModal({ isOpen, onClose, report }: ViewReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{report.title}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {report.status}
                  </Badge>
                  <span className="text-sm text-gray-500">by {report.author}</span>
                  <span className="text-sm text-gray-500">• {report.pages} pages</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Report Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-white border rounded-lg h-96 overflow-y-auto">
                <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">{report.title}</h1>
                  <p className="text-gray-600 mb-6">{report.description}</p>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Executive Summary</h2>
                    <p className="text-gray-700">
                      This comprehensive analysis examines key demographic and socioeconomic indicators across the
                      selected communities. The report provides insights into population trends, housing market
                      conditions, and community resources.
                    </p>

                    <h2 className="text-xl font-semibold">Key Findings</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Population growth of 12% over the past 5 years</li>
                      <li>Median household income increased by 8%</li>
                      <li>Housing affordability remains a key challenge</li>
                      <li>Community resources have expanded significantly</li>
                    </ul>

                    <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                      [Additional report content would appear here...]
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Report Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span>{report.created}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Author:</span>
                    <span>{report.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Pages:</span>
                    <span>{report.pages}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download as Word
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

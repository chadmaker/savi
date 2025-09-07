"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Download, Edit, Share, Calendar, User, Eye } from "lucide-react"

interface ViewVisualizationModalProps {
  isOpen: boolean
  onClose: () => void
  visualization: {
    id: string
    title: string
    description: string
    type: string
    author: string
    created: string
    lastModified: string
  }
}

export function ViewVisualizationModal({ isOpen, onClose, visualization }: ViewVisualizationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{visualization.title}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {visualization.type}
                  </Badge>
                  <span className="text-sm text-gray-500">by {visualization.author}</span>
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
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Visualization Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-50 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Visualization Preview</p>
                  <p className="text-sm text-gray-500 mt-1">{visualization.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">{visualization.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Created:</span>
                      <span>{visualization.created}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Author:</span>
                      <span>{visualization.author}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Screen
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PNG
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Get Share Link
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

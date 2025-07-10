"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share, Mail, Link, FileImage, FileText, Database } from "lucide-react"

interface ExportModalProps {
  open: boolean
  onClose: () => void
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState("png")
  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")

  const exportOptions = [
    { value: "png", label: "PNG Image", icon: FileImage },
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "doc", label: "DOC Document", icon: FileText },
    { value: "csv", label: "CSV Data", icon: Database },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export & Share</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Download Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download {exportOptions.find((o) => o.value === exportFormat)?.label}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share className="h-5 w-5 mr-2" />
                  Share Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Link className="h-6 w-6 mb-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Mail className="h-6 w-6 mb-2" />
                    Email Share
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="share-email">Email Address</Label>
                    <Input
                      id="share-email"
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="share-message">Message (Optional)</Label>
                    <Input
                      id="share-message"
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      placeholder="Add a message..."
                    />
                  </div>
                  <Button className="w-full" disabled={!shareEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

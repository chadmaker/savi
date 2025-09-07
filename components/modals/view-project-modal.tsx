"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Folder, Calendar, User, Share, Download, Edit, BarChart3, Map, FileText, Building2, Clock } from "lucide-react"

interface ViewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    title: string
    description: string
    status: string
    author: string
    created: string
    lastModified: string
  }
}

export function ViewProjectModal({ isOpen, onClose, project }: ViewProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                  <span className="text-sm text-gray-500">by {project.author}</span>
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

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{project.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Created:</span>
                        <span>{project.created}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Last Modified:</span>
                        <span>{project.lastModified}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Author:</span>
                        <span>{project.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">3</div>
                        <div className="text-sm text-gray-600">Communities</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-gray-600">Visualizations</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="communities" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Communities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Marion County", "Broad Ripple", "Downtown Indianapolis"].map((community) => (
                    <Card key={community} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium">{community}</h4>
                            <p className="text-sm text-gray-600">Last updated 2 days ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Visualizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Population Demographics Chart", type: "Chart" },
                    { name: "Housing Market Map", type: "Map" },
                    { name: "Income Distribution Table", type: "Table" },
                    { name: "Community Assessment Report", type: "Report" },
                  ].map((viz) => (
                    <Card key={viz.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          {viz.type === "Chart" && <BarChart3 className="h-5 w-5 text-purple-600" />}
                          {viz.type === "Map" && <Map className="h-5 w-5 text-blue-600" />}
                          {viz.type === "Table" && <FileText className="h-5 w-5 text-orange-600" />}
                          {viz.type === "Report" && <FileText className="h-5 w-5 text-red-600" />}
                          <div>
                            <h4 className="font-medium">{viz.name}</h4>
                            <p className="text-sm text-gray-600">{viz.type}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Data Sources</h3>
                <div className="space-y-3">
                  {[
                    { name: "2023 Census Data", records: "1,247", uploaded: "Jan 15, 2024" },
                    { name: "Housing Market Data", records: "892", uploaded: "Jan 12, 2024" },
                    { name: "Community Resources", records: "156", uploaded: "Jan 10, 2024" },
                  ].map((data) => (
                    <Card key={data.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{data.name}</h4>
                            <p className="text-sm text-gray-600">
                              {data.records} records • Uploaded {data.uploaded}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

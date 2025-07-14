"use client"

import React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Link, Users } from "lucide-react"

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onCreateProject: (projectData: ProjectData) => void
  editData?: ProjectData | null
}

export interface ProjectData {
  name: string
  description: string
  visibility: "private" | "unlisted" | "community"
  relatedPopulations: string[]
  relatedTopics: string[]
}

export function CreateProjectModal({ open, onClose, onCreateProject, editData }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "community">("private")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      onCreateProject({
        name: projectName.trim(),
        description: description.trim(),
        visibility,
        relatedPopulations: [],
        relatedTopics: [],
      })
      onClose()
    }
  }

  // Initialize form state when modal opens
  React.useEffect(() => {
    if (open) {
      if (editData) {
        setProjectName(editData.name)
        setDescription(editData.description)
        setVisibility(editData.visibility)
      } else {
        setProjectName("")
        setDescription("")
        setVisibility("private")
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editData ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="project-name" className="text-base font-medium text-gray-900">
                Project Name *
              </Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium text-gray-900">
                Project Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project goals and scope"
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          {/* Project Visibility Section */}
          <div>
            <Label className="text-base font-medium text-gray-900 mb-4 block">Project Visibility</Label>
            <RadioGroup value={visibility} onValueChange={(value: any) => setVisibility(value)} className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="private" className="font-medium cursor-pointer text-gray-900">
                      Private
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only you can view and access this project. Recommended for sensitive information.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="unlisted" id="unlisted" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Link className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="unlisted" className="font-medium cursor-pointer text-gray-900">
                      Sharable
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    You can share this project with other SAVI users, but it won't be indexed or discoverable by other
                    SAVI users.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="community" id="community" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <Label htmlFor="community" className="font-medium cursor-pointer text-gray-900">
                      Public
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Project will be visible to other SAVI users and may be used for research purposes.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!projectName.trim()} className="bg-blue-600 hover:bg-blue-700">
              {editData ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

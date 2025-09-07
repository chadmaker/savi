"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Link, Users } from "lucide-react"

export interface ProjectData {
  name: string
  description: string
  visibility: "private" | "unlisted" | "community"
  relatedPopulations: string[]
  relatedTopics: string[]
}

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onCreateProject: (projectData: ProjectData) => void
  editData?: ProjectData | null
}

export function CreateProjectModal({ open, onClose, onCreateProject, editData }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "community">("private")

  // Reset / populate form when modal opens
  useEffect(() => {
    if (!open) return
    if (editData) {
      setProjectName(editData.name)
      setDescription(editData.description)
      setVisibility(editData.visibility)
    } else {
      setProjectName("")
      setDescription("")
      setVisibility("private")
    }
  }, [open, editData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return
    onCreateProject({
      name: projectName.trim(),
      description: description.trim(),
      visibility,
      relatedPopulations: [],
      relatedTopics: [],
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1280px] w-full mx-auto max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editData ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
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

          {/* Visibility */}
          <div>
            <Label className="text-base font-medium text-gray-900 mb-4 block">Project Visibility</Label>

            <RadioGroup value={visibility} onValueChange={(v: any) => setVisibility(v)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Private card */}
                <label
                  htmlFor="private"
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    visibility === "private" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="private" id="private" className="mt-1" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Lock className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Private</span>
                      </div>
                      <p className="text-sm text-gray-600">Only you can access this project.</p>
                    </div>
                  </div>
                </label>

                {/* Unlisted card */}
                <label
                  htmlFor="unlisted"
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    visibility === "unlisted" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="unlisted" id="unlisted" className="mt-1" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Link className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Unlisted</span>
                      </div>
                      <p className="text-sm text-gray-600">Shareable via link; not searchable.</p>
                    </div>
                  </div>
                </label>

                {/* Community card */}
                <label
                  htmlFor="community"
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    visibility === "community" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="community" id="community" className="mt-1" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Community</span>
                      </div>
                      <p className="text-sm text-gray-600">Public to other Pro Tools users.</p>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Footer */}
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

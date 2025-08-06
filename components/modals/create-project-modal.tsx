"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface ProjectData {
  name: string
  description: string
  visibility: "private" | "unlisted" | "community"
  relatedPopulations?: string[]
  relatedTopics?: string[]
}

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onCreateProject: (project: ProjectData) => void
  editData?: ProjectData
}

export function CreateProjectModal({ open, onClose, onCreateProject, editData }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: editData?.name || "",
    description: editData?.description || "",
    visibility: editData?.visibility || "private",
    relatedPopulations: editData?.relatedPopulations || [],
    relatedTopics: editData?.relatedTopics || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onCreateProject(formData)
      setFormData({
        name: "",
        description: "",
        visibility: "private",
        relatedPopulations: [],
        relatedTopics: [],
      })
    }
  }

  const handleClose = () => {
    onClose()
    if (!editData) {
      setFormData({
        name: "",
        description: "",
        visibility: "private",
        relatedPopulations: [],
        relatedTopics: [],
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {editData 
              ? "Update your project details below."
              : "Set up a new community data analysis project. You can always modify these settings later."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project goals and scope"
                rows={3}
              />
            </div>
            <div className="grid gap-3">
              <Label>Project Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value: "private" | "unlisted" | "community") =>
                  setFormData({ ...formData, visibility: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="text-sm">
                    <div className="font-medium">Private</div>
                    <div className="text-gray-500">Only you can see this project</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unlisted" id="unlisted" />
                  <Label htmlFor="unlisted" className="text-sm">
                    <div className="font-medium">Unlisted</div>
                    <div className="text-gray-500">Anyone with the link can view</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="community" id="community" />
                  <Label htmlFor="community" className="text-sm">
                    <div className="font-medium">Community</div>
                    <div className="text-gray-500">Visible to all community members</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editData ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

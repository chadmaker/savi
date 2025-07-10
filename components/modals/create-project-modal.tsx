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

const populationOptions = [
  "African Americans",
  "Asians",
  "Hispanics and Latinos",
  "Older Adults",
  "Working Age",
  "Working Poor",
  "Youth",
]

const topicOptions = [
  "Basic Needs",
  "Community Development",
  "Crime and Safety",
  "Demographic",
  "Early Care and Learning",
  "Economic Mobility",
  "Economy",
  "Education",
  "Environment",
  "Equity",
  "Food Access",
  "Health",
  "Housing",
  "Poverty and Income",
]

export function CreateProjectModal({ open, onClose, onCreateProject, editData }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"private" | "unlisted" | "community">("private")
  const [selectedPopulations, setSelectedPopulations] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const handlePopulationToggle = (population: string) => {
    setSelectedPopulations((prev) =>
      prev.includes(population) ? prev.filter((p) => p !== population) : [...prev, population],
    )
  }

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      onCreateProject({
        name: projectName.trim(),
        description: description.trim(),
        visibility,
        relatedPopulations: selectedPopulations,
        relatedTopics: selectedTopics,
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
        setSelectedPopulations([...editData.relatedPopulations])
        setSelectedTopics([...editData.relatedTopics])
      } else {
        setProjectName("")
        setDescription("")
        setVisibility("private")
        setSelectedPopulations([])
        setSelectedTopics([])
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project goals and scope"
                rows={3}
              />
            </div>
          </div>

          {/* Project Visibility */}
          <div>
            <Label className="text-base font-medium">Project Visibility</Label>
            <RadioGroup value={visibility} onValueChange={(value: any) => setVisibility(value)} className="mt-3">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="private" id="private" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Lock className="h-4 w-4 text-gray-600" />
                      <Label htmlFor="private" className="font-medium cursor-pointer">
                        Private
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Only you can view and access this project. Recommended for sensitive information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="unlisted" id="unlisted" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Link className="h-4 w-4 text-gray-600" />
                      <Label htmlFor="unlisted" className="font-medium cursor-pointer">
                        Unlisted
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      You can share this project with other SAVI users, but it won't be discoverable. (Sharable URL)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="community" id="community" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      <Label htmlFor="community" className="font-medium cursor-pointer">
                        Community
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      You can share this project with other SAVI users and SAVI staff for research. (Sharable URL)
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Related Populations - Toggle Buttons Only */}
          <div>
            <Label className="text-base font-medium">Related Populations (Optional)</Label>
            <p className="text-sm text-gray-600 mt-1 mb-3">Select populations relevant to your project</p>
            <div className="flex flex-wrap gap-2">
              {populationOptions.map((population) => (
                <Button
                  key={population}
                  type="button"
                  variant={selectedPopulations.includes(population) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePopulationToggle(population)}
                  className={`${
                    selectedPopulations.includes(population)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "hover:bg-green-50 hover:border-green-300"
                  }`}
                >
                  {population}
                </Button>
              ))}
            </div>
          </div>

          {/* Related Topics - Toggle Buttons Only */}
          <div>
            <Label className="text-base font-medium">Related Topics (Optional)</Label>
            <p className="text-sm text-gray-600 mt-1 mb-3">Select topics relevant to your project</p>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant={selectedTopics.includes(topic) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTopicToggle(topic)}
                  className={`${
                    selectedTopics.includes(topic)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!projectName.trim()}>
              {editData ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

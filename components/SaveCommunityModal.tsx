"use client"

import { useState } from "react"
import { X, Save, Star } from "lucide-react"
import type { GeographyArea } from "../types/geography"

interface SaveCommunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, project: string, notes: string, isFavorite: boolean) => void
  areas: GeographyArea[]
  projects: string[]
}

export function SaveCommunityModal({ isOpen, onClose, onSave, areas, projects }: SaveCommunityModalProps) {
  const [name, setName] = useState(areas.map((a) => a.name).join(", "))
  const [project, setProject] = useState(projects[0] || "")
  const [notes, setNotes] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [geoId] = useState(Math.floor(Math.random() * 9000000000) + 1000000000) // 10-digit random number

  const handleSave = () => {
    if (name.trim() && project) {
      onSave(name.trim(), project, notes.trim(), isFavorite)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Save this community</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter community name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {projects.map((proj) => (
                <option key={proj} value={proj}>
                  {proj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter any notes about this community"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add to Favorites</label>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                isFavorite
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                  : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Added to favorites" : "Add to favorites"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GeoID</label>
            <input
              type="text"
              value={geoId.toString()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Community
          </button>
        </div>
      </div>
    </div>
  )
}

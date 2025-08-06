"use client"

import { useState, useCallback } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface DataUploadModalProps {
  open: boolean
  onClose: () => void
}

export function DataUploadModal({ open, onClose }: DataUploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100)
          
          if (newProgress >= 100) {
            clearInterval(interval)
            // Randomly simulate success or error
            const isSuccess = Math.random() > 0.2
            return {
              ...file,
              progress: 100,
              status: isSuccess ? "success" : "error",
              error: isSuccess ? undefined : "Upload failed. Please try again."
            }
          }
          
          return { ...file, progress: newProgress }
        }
        return file
      }))
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const handleClose = () => {
    setFiles([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Data Files</DialogTitle>
          <DialogDescription>
            Upload CSV, Excel, or JSON files to add to your project. Supported formats: .csv, .xlsx, .xls, .json
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: 50MB per file
              </p>
            </div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button variant="outline" className="mt-4" asChild>
                <span>Browse Files</span>
              </Button>
            </Label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="capitalize">{file.status}</span>
                    </div>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="h-1" />
                    )}
                    {file.status === "error" && file.error && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {files.some(f => f.status === "success") ? "Done" : "Cancel"}
          </Button>
          {files.length > 0 && files.some(f => f.status === "error") && (
            <Button 
              onClick={() => {
                // Retry failed uploads
                files.filter(f => f.status === "error").forEach(file => {
                  setFiles(prev => prev.map(f => 
                    f.id === file.id ? { ...f, status: "uploading", progress: 0, error: undefined } : f
                  ))
                  simulateUpload(file.id)
                })
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry Failed
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function MultiImageUpload({ images, onImagesChange, maxImages = 10 }: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(images)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed max
    if (previews.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`)
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const newPreviews = [...previews, base64String]
        setPreviews(newPreviews)
        onImagesChange(newPreviews)
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    onImagesChange(newPreviews)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    // Check if adding these files would exceed max
    if (previews.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const newPreviews = [...previews, base64String]
        setPreviews(newPreviews)
        onImagesChange(newPreviews)
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-2">
      <Label>Product Images</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square w-full overflow-hidden rounded-md border">
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => handleRemove(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {previews.length < maxImages && (
          <div
            className="flex items-center justify-center aspect-square w-full border-2 border-dashed rounded-md cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center p-4">
              <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">
                Add Image
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      {previews.length === 0 && (
        <div
          className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 5MB (max {maxImages} images)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  )
}


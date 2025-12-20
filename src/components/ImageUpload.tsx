"use client"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface ImageUploadProps {
  onImageChange: (base64: string | null) => void
  currentImage?: string | null
}

export function ImageUpload({ onImageChange, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onImageChange(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base">Reference Image (Optional)</Label>
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 min-w-[44px] min-h-[44px]"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full min-h-[120px] sm:h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 active:bg-muted/90 transition-colors touch-manipulation"
          >
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6 px-4">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-xs sm:text-sm text-muted-foreground text-center">
                <span className="font-semibold">Tap to upload</span>
                <span className="hidden sm:inline"> or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              capture="environment"
            />
          </label>
        </div>
      )}
    </div>
  )
}


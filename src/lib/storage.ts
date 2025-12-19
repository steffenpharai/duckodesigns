import { Storage } from '@google-cloud/storage'
import { logger } from './logger'

let storage: Storage | null = null

/**
 * Initialize Cloud Storage client
 */
function getStorage(): Storage {
  if (storage) {
    return storage
  }

  const bucketName = process.env.GCS_BUCKET_NAME
  const projectId = process.env.GCS_PROJECT_ID
  const keyFilename = process.env.GCS_KEY_FILE

  if (!bucketName || !projectId) {
    throw new Error('GCS_BUCKET_NAME and GCS_PROJECT_ID must be set')
  }

  // For Cloud Run, use default credentials (service account)
  // For local development, use key file if provided
  const options: { projectId: string; keyFilename?: string } = {
    projectId,
  }

  if (keyFilename) {
    options.keyFilename = keyFilename
  }

  storage = new Storage(options)
  return storage
}

/**
 * Upload an image to Cloud Storage
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The desired file name (will be prefixed with timestamp)
 * @param contentType - MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const storage = getStorage()
    const bucketName = process.env.GCS_BUCKET_NAME!

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `orders/${timestamp}-${sanitizedFileName}`

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(uniqueFileName)

    // Upload file
    await file.save(fileBuffer, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
      public: true, // Make file publicly readable
    })

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`

    logger.info('Image uploaded to Cloud Storage', {
      fileName: uniqueFileName,
      bucket: bucketName,
    })

    return publicUrl
  } catch (error) {
    logger.error('Failed to upload image to Cloud Storage', error)
    throw error
  }
}

/**
 * Delete an image from Cloud Storage
 * @param imageUrl - The full URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const storage = getStorage()
    const bucketName = process.env.GCS_BUCKET_NAME!

    // Extract file path from URL
    const urlPattern = new RegExp(`https://storage\\.googleapis\\.com/${bucketName}/(.+)`)
    const match = imageUrl.match(urlPattern)

    if (!match) {
      throw new Error(`Invalid image URL format: ${imageUrl}`)
    }

    const fileName = match[1]
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)

    await file.delete()

    logger.info('Image deleted from Cloud Storage', {
      fileName,
      bucket: bucketName,
    })
  } catch (error) {
    logger.error('Failed to delete image from Cloud Storage', error)
    throw error
  }
}

/**
 * Upload base64 image to Cloud Storage
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param fileName - The desired file name
 * @returns The public URL of the uploaded file
 */
export async function uploadBase64Image(
  base64Data: string,
  fileName: string
): Promise<string> {
  // Remove data URL prefix if present
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '')
  
  // Determine content type from base64 data or default to jpeg
  let contentType = 'image/jpeg'
  if (base64Data.startsWith('data:image/')) {
    const match = base64Data.match(/^data:image\/(\w+);base64,/)
    if (match) {
      contentType = `image/${match[1]}`
    }
  }

  // Convert base64 to buffer
  const fileBuffer = Buffer.from(base64String, 'base64')

  return uploadImage(fileBuffer, fileName, contentType)
}


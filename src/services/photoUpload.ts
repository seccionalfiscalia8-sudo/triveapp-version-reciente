import { supabase } from './supabase'

/**
 * Get a signed URL for a file in storage (valid for 1 hour)
 */
async function getSignedUrl(bucket: string, filePath: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600) // 1 hour

    if (error) {
      console.error('Error creating signed URL:', error)
      // Fallback to public URL if signed URL fails
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      return publicData.publicUrl
    }

    return data.signedUrl
  } catch (err) {
    console.error('Error getting signed URL:', err)
    // Return public URL as fallback
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return publicData.publicUrl
  }
}

/**
 * Convert image URI to Uint8Array (React Native compatible)
 */
async function uriToUint8Array(uri: string): Promise<Uint8Array> {
  try {
    // Fetch the file from URI
    const response = await fetch(uri)
    const blob = await response.blob()
    
    // Try to use arrayBuffer if available (web, modern RN)
    if (typeof blob.arrayBuffer === 'function') {
      const arrayBuffer = await blob.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    }
    
    // Fallback: convert blob to base64 string, then to Uint8Array
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = reader.result as string
          // Extract base64 from data URL: "data:image/jpeg;base64,xxx" -> "xxx"
          const base64 = result.split(',')[1] || result
          // Convert base64 to Uint8Array
          const binaryString = atob(base64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          resolve(bytes)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('FileReader error'))
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting URI to Uint8Array:', error)
    throw error
  }
}

/**
 * Upload profile photo for a user
 * @param userId - User ID
 * @param fileUri - Local URI of the image file
 */
export async function uploadProfilePhoto(userId: string, fileUri: string): Promise<string | null> {
  try {
    // Validate user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (!authUser || authUser.id !== userId) {
      throw new Error('No tienes permiso para subir fotos como este usuario')
    }

    // Read file as Uint8Array using fetch (cross-platform compatible)
    const bytes = await uriToUint8Array(fileUri)

    // Create file path
    const timestamp = Date.now()
    const filePath = `profiles/${userId}/${timestamp}-profile.jpg`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, bytes, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Error al subir la foto: ${uploadError.message}`)
    }

    // Get signed URL (or public URL as fallback)
    const photoUrl = await getSignedUrl('profile-photos', filePath)

    console.log('Profile photo URL:', photoUrl)

    // Update profile in database
    const { data, error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: photoUrl, profile_photo_url: photoUrl })
      .eq('id', userId)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Error al guardar la foto: ${dbError.message}`)
    }

    return photoUrl
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    throw error
  }
}

/**
 * Upload vehicle photo for a driver's route
 * @param driverId - Driver/User ID
 * @param routeId - Route ID (if available) or null to create generic vehicle photo
 * @param fileUri - Local URI of the image file
 */
export async function uploadVehiclePhoto(
  driverId: string,
  routeId: string | null,
  fileUri: string
): Promise<string | null> {
  try {
    // Validate user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (!authUser || authUser.id !== driverId) {
      throw new Error('No tienes permiso para subir fotos como este usuario')
    }

    // Read file as Uint8Array using fetch (cross-platform compatible)
    const bytes = await uriToUint8Array(fileUri)

    // Create file path
    const timestamp = Date.now()
    const folder = routeId ? `drivers/${driverId}/routes/${routeId}` : `drivers/${driverId}`
    const filePath = `${folder}/${timestamp}-vehicle.jpg`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .upload(filePath, bytes, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Error al subir la foto: ${uploadError.message}`)
    }

    // Get signed URL (or public URL as fallback)
    const photoUrl = await getSignedUrl('vehicle-photos', filePath)

    console.log('Vehicle photo URL:', photoUrl)

    // Don't try to save to DB - just return the URL
    // The URL is signed and will be valid for 1 hour
    return photoUrl
  } catch (error) {
    console.error('Error uploading vehicle photo:', error)
    throw error
  }
}

/**
 * Delete a photo and update database
 */
export async function deleteProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(photoUrl)
    const pathInBucket = decodeURIComponent(url.pathname.split('/storage/v1/object/public/profile-photos/')[1] || '')

    if (!pathInBucket) {
      throw new Error('No se pudo extraer la ruta de la foto')
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('profile-photos')
      .remove([pathInBucket])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
      throw new Error(`Error al eliminar la foto: ${deleteError.message}`)
    }

    // Clear from database
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: null, profile_photo_url: null })
      .eq('id', userId)

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Error al actualizar perfil: ${dbError.message}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting profile photo:', error)
    throw error
  }
}

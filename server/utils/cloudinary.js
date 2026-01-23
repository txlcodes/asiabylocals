import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a single image to Cloudinary from base64 data URL
 * @param {string} base64Image - Base64 encoded image (data:image/...)
 * @param {string} folder - Folder path in Cloudinary (e.g., 'tours', 'suppliers')
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<string>} - Cloudinary URL
 */
export async function uploadImage(base64Image, folder = 'asiabylocals', publicId = null) {
  try {
    // Remove data URL prefix if present (data:image/jpeg;base64,)
    const base64Data = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;

    // Upload options
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto' }, // Optimize for web
        { fetch_format: 'auto' } // Auto format (WebP when supported)
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      uploadOptions
    );

    return result.secure_url; // Returns HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {string[]} base64Images - Array of base64 encoded images
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<string[]>} - Array of Cloudinary URLs
 */
export async function uploadMultipleImages(base64Images, folder = 'asiabylocals') {
  try {
    const uploadPromises = base64Images.map((image, index) => 
      uploadImage(image, folder, `${folder}_${Date.now()}_${index}`)
    );
    
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Cloudinary batch upload error:', error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID or URL
 * @returns {Promise<void>}
 */
export async function deleteImage(publicId) {
  try {
    // Extract public ID from URL if full URL is provided
    let id = publicId;
    if (publicId.includes('cloudinary.com')) {
      const parts = publicId.split('/');
      const filename = parts[parts.length - 1];
      id = filename.split('.')[0];
      // Reconstruct folder path
      const folderIndex = parts.indexOf('upload');
      if (folderIndex !== -1 && folderIndex + 2 < parts.length) {
        const folder = parts.slice(folderIndex + 2, -1).join('/');
        id = folder ? `${folder}/${id}` : id;
      }
    }

    await cloudinary.uploader.destroy(id);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw - deletion failures shouldn't break the app
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public IDs or URLs
 * @returns {Promise<void>}
 */
export async function deleteMultipleImages(publicIds) {
  try {
    const deletePromises = publicIds.map(id => deleteImage(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Cloudinary batch delete error:', error);
  }
}

export default cloudinary;




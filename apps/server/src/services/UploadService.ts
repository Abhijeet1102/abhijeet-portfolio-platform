import { v2 as cloudinary } from 'cloudinary';
// Configure cloudinary only if keys are present
if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}

export class UploadService {
  /**
   * Upload an image to Cloudinary (or a local fallback if missing config).
   * Graceful fallback logic ensures that the application doesn't crash during dev.
   */
  public async uploadImage(base64Image: string, folder: string = 'portfolio'): Promise<string> {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.warn('[UploadService] Cloudinary config missing. Using fallback placeholder.');
      // Return a robust placeholder image to simulate successful upload
      return `https://via.placeholder.com/800x600.png?text=Fallback+Image`;
    }

    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder,
        resource_type: 'auto',
      });
      return result.secure_url;
    } catch (error: any) {
      console.error('[UploadService] Error uploading to Cloudinary:', error.message);
      throw new Error('Failed to upload image.');
    }
  }

  public async deleteImage(publicId: string): Promise<boolean> {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.warn('[UploadService] Cloudinary config missing. Simulating delete.');
      return true;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      console.error('[UploadService] Error deleting from Cloudinary:', error.message);
      return false;
    }
  }
}

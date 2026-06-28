export class MediaService {
  static async uploadImage(file: any, folder: string) { return { url: 'https://cloudinary.com/image.jpg' }; }
  static async deleteImage(publicId: string) { return { success: true }; }
}

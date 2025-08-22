import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { config } from '~/share/component/config'
import { ICloudinaryService } from '../interface'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: config.cloudinary.cloudinaryName,
  api_key: config.cloudinary.cloudinaryApiKey,
  api_secret: config.cloudinary.cloudinaryApiSecret,
})

export class CloudinaryService implements ICloudinaryService {
  async deleteImage(url: string): Promise<boolean> {
    try {
      const publicId = this.extractPublicId(url)
      const result = await cloudinaryV2.uploader.destroy(publicId!)
      // result: { result: 'ok' } nếu xóa thành công
      return result.result === 'ok'
    } catch (err) {
      return false
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folderName: string = 'default-folder'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const actualBuffer = Buffer.isBuffer(file.buffer) // trong tường hợp có thể file truyền vào chưa phải là buffer
        ? file.buffer
        : Buffer.from(
            (file.buffer as { data: number[] }).data
          ) // convert object { type:'Buffer', data:[...] } thành Buffer

      const stream = cloudinaryV2.uploader.upload_stream(
        { folder: folderName },
        (err, result) => {
          if (err) reject(err)
          else resolve(result?.secure_url || '')
        }
      )
      streamifier.createReadStream(actualBuffer).pipe(stream)
    })
  }

  private extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/')
      // bỏ qua domain + "upload" + version
      const uploadIndex = parts.findIndex((p) => p === 'upload')
      if (uploadIndex === -1) return null

      // lấy từ sau "upload" + 1 (bỏ version) cho đến hết
      const publicIdParts = parts.slice(uploadIndex + 2)
      const filename = publicIdParts.pop() // vd: fybgqgyh4d3k0b6dqhit.jpg
      if (!filename) return null

      const fileWithoutExt = filename.split('.')[0]
      return [...publicIdParts, fileWithoutExt].join('/')
    } catch (err) {
      return null
    }
  }
}

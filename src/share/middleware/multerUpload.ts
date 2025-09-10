import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../component/ApiError'

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

// filter loại file
const customFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    )
  }
  callback(null, true)
}

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter,
  storage: multer.memoryStorage(),
})

const uploadTweetMedia = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB cho video
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // chỉ cho phép ảnh
      if (['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
        return cb(null, true)
      }
      return cb(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          'Only jpg, jpeg, png allowed'
        )
      )
    }

    if (file.fieldname === 'video') {
      // chỉ cho phép video
      if (['video/mp4', 'video/avi', 'video/mkv'].includes(file.mimetype)) {
        return cb(null, true)
      }
      return cb(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          'Only mp4, avi, mkv allowed'
        )
      )
    }

    cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field'))
  },
}).fields([
  { name: 'images', maxCount: 4 },
  { name: 'video', maxCount: 1 },
])

const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key]
      if (typeof value === 'string') {
        try {
          req.body[key] = JSON.parse(value)
        } catch {
          // nếu parse fail thì để nguyên string
        }
      }
    })
    next()
  } catch (err) {
    next(err)
  }
}

export const multerUploadMiddleware = {
  upload,
  uploadTweetMedia,
  parseFormData,
}

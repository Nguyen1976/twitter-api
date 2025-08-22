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
  parseFormData,
}

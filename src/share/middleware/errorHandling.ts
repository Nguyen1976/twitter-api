import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IApiError } from '../interface'

export const errorHandlingMiddleware = (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack,
  }

  res.status(responseError.statusCode).json(responseError)
}

import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IApiError } from '../interface'
import ApiError from '../component/ApiError';
import { mapDomainErrorToApiError } from '../errors';

export const errorHandlingMiddleware = (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  const apiError = err instanceof ApiError ? err : mapDomainErrorToApiError(err);
  const response = {
    name: apiError.name,
    message: apiError.message,
    statusCode: apiError.statusCode,
  }

  res.status(response.statusCode).json(response)
}

import { InvalidCredentialsError, RefreshTokenExpiredError, RefreshTokenInvalidError, UserAlreadyExistsError, UserNotFoundError } from "~/modules/auth/domain/errors/user-errors"
import ApiError from "../component/ApiError"

export class InvalidTokenError extends Error {
    constructor(message: string = 'Invalid or expired token') {
        super(message)
        this.name = 'InvalidTokenError'
    }
}

export function mapDomainErrorToApiError(error: unknown): ApiError {
    if (error instanceof UserAlreadyExistsError) {
        return new ApiError(409, error.message)
    }
    if (error instanceof InvalidCredentialsError) {
        return new ApiError(401, error.message)
    }
    if (error instanceof UserNotFoundError) {
        return new ApiError(404, error.message)
    }
    return new ApiError(500, 'An unknown error occurred')
}


export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'Username or email already exists') {
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}


export class InvalidCredentialsError extends Error {
    constructor(message: string = 'Invalid username or password') {
        super(message)
        this.name = 'InvalidCredentialsError'
    }
}

export class UserNotFoundError extends Error {
    constructor(message: string = 'User not found') {
        super(message)
        this.name = 'UserNotFoundError'
    }
}


export class RefreshTokenExpiredError extends Error {
    constructor(message: string = 'Refresh token has expired') {
        super(message)
        this.name = 'RefreshTokenExpiredError'
    }
}

export class RefreshTokenInvalidError extends Error {
    constructor(message: string = 'Invalid refresh token') {
        super(message)
        this.name = 'RefreshTokenInvalidError'
    }
}
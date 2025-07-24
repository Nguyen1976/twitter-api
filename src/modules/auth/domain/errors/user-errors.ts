export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'Username or email already exists') {
    super(message)
    this.name = 'UserAlreadyExistsError'
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string = 'User not found') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid credentials') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}
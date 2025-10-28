export * from './userCommands'
export * from './userEntity'
export * from './userQueries'
export * from './userRepository'
export * from './userResponses'

export interface IPasswordHashService {
  hash(password: string): Promise<string>
  compare(password: string, hashedPassword: string): Promise<boolean>
}

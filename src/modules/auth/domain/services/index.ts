
export interface IPasswordHashService {
  hash(password: string): Promise<string>
  compare(password: string, hashedPassword: string): Promise<boolean>
}

export interface IJwtService {
    generateToken(payload: { userId: string, username: string }): string
    verifyToken(token: string): { userId: string, username: string } | null
}
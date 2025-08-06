export interface IRepository<Entity, Cond, UpdateDTO>
  extends IQueryRepository<Entity, Cond>,
    ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, Cond> {
  get(id: string): Promise<Entity | null>
  findByCond(cond: Cond): Promise<Entity | null>
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<boolean>
  update(id: string, data: UpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>
} 

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>
}

export interface IJwtService {
  generateToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string | number
  ): string
  verifyToken(token: string, secret: string): TokenPayload | null
}

export interface TokenPayload {
  id: string
  email: string
}

export interface IApiError extends Error {
  statusCode: number
}

export interface IRedisRepository {
  get(key: string): Promise<string | null>
  set(key: string, value: string, expirationSeconds?: number): Promise<boolean>
  del(key: string): Promise<boolean>
}

export interface IEmailService {
  sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<boolean>
  sendOtpEmail(email: string, otp: string): Promise<boolean>
  sendWelcomeEmail(email: string, username: string): Promise<boolean>
  sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean>
}

export interface IOtpService {
  generate(email: string): Promise<{ otp: string; createdAt: number }>
  validate(email: string, inputOtp: string): Promise<boolean>
}

export interface IOtpJobData {
  email: string
  username: string
}

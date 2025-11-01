export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    email: string
    isVerified: boolean
  }
}

export interface VerifyTokenResponse {
  user: {
    id: string
    email: string
  }
}

export interface SendVerificationOtpResponse {
  message: string
  expiresIn: number
  createdAt: number
}

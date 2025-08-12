export interface IAuthService {
  getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse>
}

export interface GetUserRequest {
  userId: string
}

export interface GetUserResponse {
  id: string
  username: string
  email: string
  birthDate: Date
}

export interface IUserProfileService {
  CreateUserProfile(data: CreateUserProfileRequest): Promise<CreateUserProfileResponse>
}

export interface CreateUserProfileRequest {
  userId: string;
}

export interface CreateUserProfileResponse {
  id: string;
}   
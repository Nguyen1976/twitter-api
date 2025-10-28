import path from 'path'
import { createGrpcClient } from '~/share/grpc/BaseGrpcClient'
import { CreateUserProfileRequest, CreateUserProfileResponse, IUserProfileService } from '~/share/interface/grpc'

export class UserProfileGrpcClient implements IUserProfileService {
  private client: any

  constructor(endpoint: string = 'localhost:50051') {
    this.client = createGrpcClient(
      path.join(__dirname, '../../../../share/protos/userProfile.proto'),
      'userProfile', // package name trong proto
      'UserProfileService', // service name trong proto
      endpoint
    )
  }
  
  CreateUserProfile(
    data: CreateUserProfileRequest
  ): Promise<CreateUserProfileResponse> {
    return new Promise((resolve, reject) => {
      this.client.CreateUserProfile(data, (err: any, response: any) => {
        if (err) return reject(err)
        resolve(response)
      })
    })
  }
}
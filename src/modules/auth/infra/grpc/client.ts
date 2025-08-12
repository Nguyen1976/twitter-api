import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import { CreateUserProfileRequest, CreateUserProfileResponse, IUserProfileService } from '~/share/interface/grpc'


const PROTO_PATH = path.join(
  __dirname,
  '../../../../share/protos/userProfile.proto'
)

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const userProfileProto = grpc.loadPackageDefinition(packageDefinition)
  .userProfile as any

export class UserProfileGrpcClient implements IUserProfileService {
  private client: any

  constructor(endpoint: string = 'localhost:50051') {
    this.client = new userProfileProto.UserProfileService(
      endpoint,
      grpc.credentials.createInsecure()
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

  // Có thể wrap các method khác tương tự...
  // updateProfile, getProfile, ...
}

import path from 'path'
import { createGrpcClient } from '~/share/grpc/BaseGrpcClient'
import {
  GetUserRequest,
  GetUserResponse,
  IAuthService,
} from '~/share/interface/grpc/auth'

export class AuthGrpcClient implements IAuthService {
  private client: any

   constructor(endpoint: string = 'localhost:50052') {
    this.client = createGrpcClient(
      path.join(__dirname, '../../../../share/protos/auth.proto'),
      'auth', // package name trong proto
      'AuthService', // service name trong proto
      endpoint
    )
  }
  getUser(getUserRequest: GetUserRequest): Promise<GetUserResponse> {
    return new Promise((resolve, reject) => {
      this.client.GetUser(getUserRequest, (err: any, response: any) => {
        if (err) return reject(err)
        resolve(response)
      })
    })
  }
}

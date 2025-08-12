import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import {
  GetUserRequest,
  GetUserResponse,
  IAuthService,
} from '~/share/interface/grpc/auth'

const PROTO_PATH = path.join(__dirname, '../../../../share/protos/auth.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const authProto = grpc.loadPackageDefinition(packageDefinition).auth as any

export class AuthGrpcClient implements IAuthService {
  private client: any

  constructor(endpoint: string = 'localhost:50052') {
    this.client = new authProto.AuthService(
      endpoint,
      grpc.credentials.createInsecure()
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

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import { UserProfileGrpcController } from '../../interfaces/grpc/controllers'
export class UserProfileGrpcServer {
  private server: grpc.Server
  private packageDefinition: any
  private userProfileService: any

  constructor(private userProfileController: UserProfileGrpcController) {
    this.server = new grpc.Server()
    this.loadProtoDefinition()
    this.setupServices()
    // this.setupInterceptors()
  }

  private loadProtoDefinition(): void {
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

    const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any
    this.userProfileService = grpcObject.userProfile.UserProfileService
  }

  private setupServices(): void {
    this.server.addService(this.userProfileService.service, {
      CreateUserProfile: this.userProfileController.createProfile.bind(
        this.userProfileController
      ),
    })
  }

  //   private setupInterceptors(): void {
  //     // Add interceptors for auth, logging, etc.
  //     const authInterceptor = new AuthInterceptor()
  //     const loggingInterceptor = new LoggingInterceptor()

  //     // Apply interceptors (implementation depends on your interceptor pattern)
  //   }

  async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (error: Error | null, port: number) => {
          if (error) {
            reject(error)
            return
          }
          console.log(`🚀 User Profile gRPC Server started on port ${port}`)
          resolve()
        }
      )
    })
  }

  //   async stop(): Promise<void> {
  //     return new Promise((resolve) => {
  //       this.server.tryShutdown((error: Error | null) => {
  //         if (error) {
  //           console.error('❌ Error shutting down gRPC server:', error)
  //         } else {
  //           console.log('✅ User Profile gRPC Server stopped')
  //         }
  //         resolve()
  //       })
  //     })
  //   }
}

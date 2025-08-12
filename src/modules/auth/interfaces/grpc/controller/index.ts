// interfaces/grpc/controllers/user-profile.grpc-controller.ts
import {
  ServerUnaryCall,
  sendUnaryData,
  status as grpcStatus
} from '@grpc/grpc-js'
import { IQueryHandler } from '~/share/interface'
import { GetUserQuery } from '../../userQueries'
import { IGetUserResponse } from '../../userRepository'
import { getUserSchema } from '../../dtos/dto'

export class AuthGrpcController {
  constructor(
    private readonly getUserQueryHandler: IQueryHandler<GetUserQuery, IGetUserResponse>
  ) {}

  async getUser(
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ): Promise<void> {
    try {
      const { success, data, error } = getUserSchema.safeParse(
        call.request
      )
      if (!success) {
        callback({
          code: grpcStatus.INVALID_ARGUMENT,
          message: error.message,
        })
        return
      }
      const result = await this.getUserQueryHandler.query({
        dto: data,
      })

      callback(null, result)
    } catch (error) {
      callback({
        code: grpcStatus.INTERNAL,
        message: (error as Error).message,
      })
    }
  }
}

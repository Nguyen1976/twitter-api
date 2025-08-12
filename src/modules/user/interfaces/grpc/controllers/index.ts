// interfaces/grpc/controllers/user-profile.grpc-controller.ts
import {
  ServerUnaryCall,
  sendUnaryData,
  status as grpcStatus
} from '@grpc/grpc-js'
import { CreateCommand } from '../../userProfileCommands'
import { ICommandHandler } from '~/share/interface'
import { UserProfileCreateDTOSchema } from '../../dtos'

export class UserProfileGrpcController {
  
  constructor(
    private readonly createUserProfileCmdHandler: ICommandHandler<
      CreateCommand,
      string
    >
  ) {}

  async createProfile(
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ): Promise<void> {
    try {
      const { success, data, error } = UserProfileCreateDTOSchema.safeParse(
        call.request
      )

      if (!success) {
        callback({
          code: grpcStatus.INVALID_ARGUMENT,
          message: error.message,
        })
        return
      }

      const result = await this.createUserProfileCmdHandler.execute({
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

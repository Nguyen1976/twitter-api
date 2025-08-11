
import { BaseGrpcServer } from '~/share/grpc/BaseGrpcServer ';
import { UserProfileGrpcController } from '../../interfaces/grpc/controllers';

export class UserProfileGrpcServer extends BaseGrpcServer {
  constructor(private controller: UserProfileGrpcController) {
    super('userProfile.proto', 'userProfile', 'UserProfileService');//chỉ cần đẩy tên file proto tên package và tên service

    this.addService({
      CreateUserProfile: this.controller.createProfile.bind(this.controller),
    });
  }
}

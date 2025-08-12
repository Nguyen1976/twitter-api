import { BaseGrpcServer } from '~/share/grpc/BaseGrpcServer ';
import { AuthGrpcController } from '../../interfaces/grpc/controller';

export class AuthGrpcServer extends BaseGrpcServer {
  constructor(private controller: AuthGrpcController) {
    super('auth.proto', 'auth', 'AuthService');//chỉ cần đẩy tên file proto tên package và tên service

    this.addService({
      GetUser: this.controller.getUser.bind(this.controller),
    });
  }
}

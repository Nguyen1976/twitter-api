// shared/grpc/BaseGrpcServer.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

export abstract class BaseGrpcServer {
  protected server: grpc.Server;
  protected serviceDefinition: any;

  constructor(protoFileName: string, packageName: string, serviceName: string) {
    this.server = new grpc.Server();

    const PROTO_PATH = path.join(__dirname, `../../share/protos/${protoFileName}`);
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
    this.serviceDefinition = grpcObject[packageName][serviceName];
  }

  protected addService(implementation: grpc.UntypedServiceImplementation) {
    this.server.addService(this.serviceDefinition.service, implementation);
  }

  async start(port: number) {
    return new Promise<void>((resolve, reject) => {
      this.server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (error) => {
          if (error) return reject(error);
          console.log(`🚀 gRPC server started on port ${port}`);
          resolve();
        }
      );
    });
  }
}

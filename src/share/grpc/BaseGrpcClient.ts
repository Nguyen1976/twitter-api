import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

export function createGrpcClient<T = any>(
  protoPath: string,
  packageName: string,
  serviceName: string,
  endpoint: string
): T {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
  const proto = grpc.loadPackageDefinition(packageDefinition) as any
  const Service = proto[packageName][serviceName]
  return new Service(endpoint, grpc.credentials.createInsecure())
}
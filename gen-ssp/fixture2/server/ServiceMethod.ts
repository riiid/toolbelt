import {MethodDescriptor} from 'pbkit/core/runtime/rpc';

const serviceMethodTable: ServiceMethodTable = {};

interface ServiceMethod {
  (request: string): string | Promise<string>;
}
interface ServiceMethodTable {
  [method: string]: ServiceMethod;
}

export function getServiceMethod(methodName: string) {
  return serviceMethodTable[methodName];
}

export type MethodImplMap<MethodDescriptors extends {[methodName: string]: MethodDescriptor<any, any>}> = {
  [methodName in keyof MethodDescriptors]: (
    req: ReturnType<MethodDescriptors[methodName]['requestType']['deserializeBinary']>
  ) =>
    | ReturnType<MethodDescriptors[methodName]['responseType']['deserializeBinary']>
    | Promise<ReturnType<MethodDescriptors[methodName]['responseType']['deserializeBinary']>>;
};
export function registerServiceMethodImpl<MethodDescriptors extends {[methodName: string]: MethodDescriptor<any, any>}>(
  methodDescriptors: MethodDescriptors,
  methodImplMap: MethodImplMap<MethodDescriptors>
) {
  Object.entries<MethodDescriptor<any, any>>(methodDescriptors).forEach(([methodName, methodDescriptor]) => {
    const methodImpl = methodImplMap[methodName as keyof MethodDescriptors];
    if (methodImpl) {
      const {service, methodName, requestStream, responseStream, requestType, responseType} = methodDescriptor;
      if (requestStream || responseStream) throw new Error('Stream request/response is not supported');
      serviceMethodTable[`${service.serviceName}.${methodName}`] = async (encodedReq: string): Promise<string> => {
        const decodedReq = requestType.deserializeBinary(Buffer.from(encodedReq, 'base64'));
        const decodedRes = await methodImpl(decodedReq);
        return Buffer.from(responseType.serializeBinary(decodedRes)).toString('base64');
      };
    }
  });
}

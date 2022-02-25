import {MethodDescriptor} from 'pbkit/core/runtime/rpc';

export interface RespondFn {
  (id: number, message: string): void;
}
export interface RespondErrorFn {
  (id: number, errorMessage: string): void;
}

interface Req {
  method: string;
  deserialize: DeserializeFn<any>;
  resolve(value: any): void;
  reject(error: any): void;
}
export interface ReqTable {
  [id: number]: Req;
}

export type DeserializeFn<TRes> = MethodDescriptor<any, TRes>['responseType']['deserializeBinary'];

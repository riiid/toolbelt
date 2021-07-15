import { MethodNode, NodeInfo } from "../ast/index.ts";
import { Service } from "../ast/service.ts";

export interface MethodSignature {
  params: {
    name: string;
    type: string;
  }[];
  returnType: string;
}

export interface Method extends MethodNode, NodeInfo {
  requestParamType: string;
  signatures: {
    instance: MethodSignature;
    interface: MethodSignature;
  };
}

export function methodSignatureToString(
  methodName: string,
  signature: MethodSignature,
): string {
  const params = signature.params.map((param) => `${param.name}: ${param.type}`)
    .join(",");
  return `${methodName}(${params}): Promise<${signature.returnType}>;`;
}

export const getIndexModuleFixture = (clientType: string): string => (
  `
    export enum StatusCode {
      OK = 0,
      CANCELLED = 1,
      UNKNOWN = 2,
      INVALID_ARGUMENT = 3,
      DEADLINE_EXCEEDED = 4,
      NOT_FOUND = 5,
      ALREADY_EXISTS = 6,
      PERMISSION_DENIED = 7,
      RESOURCE_EXHAUSTED = 8,
      FAILED_PRECONDITION = 9,
      ABORTED = 10,
      OUT_OF_RANGE = 11,
      UNIMPLEMENTED = 12,
      INTERNAL = 13,
      UNAVAILABLE = 14,
      DATA_LOSS = 15,
      UNAUTHENTICATED = 16,
    };
    export interface Metadata {
      [key: string]: string | (() => string | Promise<string>);
    }

    function getCookieValue(name: string): string | undefined {
      return document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)')?.pop();
    }

    function getKcAccessCookieValue(): string {
      let kcAccess = getCookieValue('kc-access') ?? '';
      if (!kcAccess) return kcAccess;
      let tmp: string | undefined;
      let index = 1;
      while (tmp = getCookieValue(\`kc-access-\${index++}\`)) {
        kcAccess += tmp;
      }
      return kcAccess;
    }

    export async function getMetadata(meta: Metadata = {}) {
      const data = Object.entries(meta).map(async ([key, value]) => ([
        key,
        await (typeof value === 'function' ? value() : value)
      ]));
      const metadata = (await Promise.all(data)).reduce<Record<string, string>>((acc, [k, v]) => Object.assign(acc, {[k]: v}), {});
      { // WEB-222
        const accessTokenExists = 'access-token' in metadata;
        const authorizationHeaderExists = 'Authorization' in metadata;
        if (accessTokenExists && !authorizationHeaderExists) {
          metadata['Authorization'] = 'Bearer ' + metadata['access-token'];
        } else if (!accessTokenExists && !authorizationHeaderExists) {
          const isWebBrowser = typeof document !== 'undefined';
          if (isWebBrowser) {
            const kcAccess = getKcAccessCookieValue();
            if (kcAccess) {
              metadata['Authorization'] = 'Bearer ' + kcAccess;
            }
          }
        }
      }
      return metadata;
    }
    export interface CreateServiceConfig {
      hostname: string;
      client?: ${clientType};
      metaData?: Metadata;
      /**
       * https://github.com/SafetyCulture/grpc-web-devtools
       */
      enableDevTools?: boolean;
      enableLogger?: boolean;
    }
    export function getEncodeRequest(requestType: any) {
      return function encodeRequest(request: any) {
        const req = requestType.encode(request).finish();
        req.toObject = req.toJSON; // hack for grpc-web-devtools;
        return req;
      };
    }
    export function getDecodeResponse(responseType: any) {
      return function decodeResponse(response: any) {
        const res = responseType.decode(response);
        res.toObject = res.toJSON; // hack for grpc-web-devtools;
        return res;
      };
    }
    export function encode(pbMessageType: any, plainObject: any): Buffer {
      const messageInstance = pbMessageType.fromObject(plainObject);
      return Buffer.from(pbMessageType.encode(messageInstance).finish());
    };
    export function decode(pbMessageType: any, pbMessageBuffer: Buffer) {
      return toPlainObject(
        pbMessageType,
        pbMessageType.decode(pbMessageBuffer),
      );
    };
    export function toPlainObject(pbMessageType: any, pbMessageInstance: any) {
      return pbMessageType.toObject(
        pbMessageInstance,
        {
          longs: String,
          enums: String,
          bytes: String,
          json: true,
          defaults: true,
        },
      );
    };
    export class GrpcError extends Error {
      public name: string;
      public code: number;
      public hostName: string;
      public methodName: string;
      public request: {
        metadata: Record<string, string>;
        payload: Record<string, any>;
      };
      constructor(
        message: string,
        code: number,
        hostName: string,
        methodName: string,
        payload: Record<string, any>,
        metadata: Record<string, string>
      ) {
        super(message);
        this.name = 'GrpcError';
        this.code = code;
        this.hostName = hostName;
        this.methodName = methodName;
        this.request = {
          payload,
          metadata,
        };

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, GrpcError);
        }
      }
    }
    export function logRpcCall(label: string, object: { request?: any, response?: any, error?: GrpcError, metaData?: any}) {
      const {request, error, response, metaData} = object;
      console.group((error ? '[F]' : '[S]') + label);
      if (request) console.log(request);
      if (response) console.log(response);
      if (error) console.error(error, { ...error });
      if (metaData) console.log(metaData);
      console.log(new Date().toLocaleString());
      console.groupEnd();
    }


  `
);

export const getGrpcServiceSnippet = (
  { requestType, nodeName, path: methodPath, requestParamType, responseType }:
    Method,
  service: Service,
): string => {
  const path = methodPath.join(".");
  const requestTypePath = service.scopeTable[path].getFullMessagePath(
    requestType,
  );
  const responseTypePath = service.scopeTable[path].getFullMessagePath(
    responseType,
  );
  return `
    async ${nodeName}(request: ${requestParamType}, metaData?: Metadata) {
      if (request instanceof ${requestTypePath}) {
        return await rpcCall('${nodeName}', request, metaData);
      } else {
        const res = await rpcCall('${nodeName}', ${requestTypePath}.fromObject(request), metaData);
        return toPlainObject(${responseTypePath}, res);
      }
    }
  `.trim();
};

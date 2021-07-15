import { RootNode } from "../ast/index.ts";
import { getServices, Service } from "../ast/service.ts";
import {
  getGrpcServiceSnippet,
  getIndexModuleFixture,
  Method,
  methodSignatureToString,
} from "../grpc/index.ts";

function getRpcCallFixture() {
  return `
    function rpcCall(methodName: keyof typeof methodNames, request: any, metaData?: Metadata) {
      return new Promise(async (resolve, reject) => {
        request.toObject = request.toJSON; // hack for grpc-web-devtools;
        const _metaData = await getMetadata({
          ...config.metaData,
          ...metaData,
        });
        const method = config.hostname + '/' + methodNames[methodName];
        client.rpcCall(
          method,
          request,
          _metaData,
          methodInfos[methodName] as any,
          (err, res) => {
            if (err) {
              const grpcError = new GrpcError(
                err.message,
                err.code,
                config.hostname,
                methodNames[methodName],
                request.toJSON(),
                _metaData
              );
              reject(grpcError);
              if (config.enableLogger) logRpcCall(method, {
                request: grpcError.request.payload,
                error: grpcError,
                metaData: _metaData
              });
            } else {
              resolve(res);
            }
            if (config.enableLogger) logRpcCall(method, {
              request: request.toJSON(),
              response: res,
              metaData: _metaData,
            })
          }
        );
      });
    }
  `;
}

interface GrpcServiceModule {
  dir: string[];
  fileName: string;
  code: string;
}
type GrpcServiceModules = GrpcServiceModule[];

export function generateSharedGrpcModules(): GrpcServiceModules {
  const result: GrpcServiceModules = [];
  result.push({
    dir: [],
    fileName: "index.ts",
    code: `
      import * as grpcWeb from 'grpc-web';
      ${getIndexModuleFixture("grpcWeb.GrpcWebClientBase")}
      interface DevToolClient {
        client_: grpcWeb.GrpcWebClientBase;
      }
      export function enableDevTools(...clients: DevToolClient[]) {
        if (typeof window === 'undefined') return;
        if (typeof (window as any).__GRPCWEB_DEVTOOLS__ !== 'function') return;
        (window as any).__GRPCWEB_DEVTOOLS__(clients);
      }
    `,
  });

  return result;
}

export function generateGrpcServiceModules(node: RootNode): GrpcServiceModules {
  const services = getServices(node);
  const result: GrpcServiceModules = services
    .map((service) => {
      const I = (path: string) => path.replace(/([^.]+)$/, "I$1");
      const methods: Method[] = service.methods.map((method) => ({
        ...method,
        requestParamType: `${method.requestTypePath} | ${
          I(method.requestTypePath)
        }`,
        signatures: {
          instance: {
            params: [
              { name: "request", type: method.requestTypePath },
              { name: "metaData?", type: "Metadata" },
            ],
            returnType: method.responseTypePath,
          },
          interface: {
            params: [
              { name: "request", type: I(method.requestTypePath) },
              { name: "metaData?", type: "Metadata" },
            ],
            returnType: I(method.responseTypePath),
          },
        },
      }));
      return [
        {
          dir: service.path,
          fileName: `${service.nodeName}.ts`,
          code: generateGrpcServiceModule(service, methods),
        },
      ] as GrpcServiceModules;
    })
    .flat();
  return result;
}

function generateGrpcServiceModule(service: Service, methods: Method[]) {
  const grpcDir = service.path.map(() => "..").join("/");
  return `
    import * as grpcWeb from 'grpc-web';
    import { ${service.namespaces.join(",")} } from '../${grpcDir}';
    import {
      CreateServiceConfig,
      Metadata,
      getMetadata,
      getEncodeRequest,
      getDecodeResponse,
      toPlainObject,
      enableDevTools,
      logRpcCall,
      GrpcError,
    } from '${grpcDir}';
    export interface ${service.nodeName} {
      ${
    methods
      .map(
        ({ nodeName, signatures }) =>
          `
            ${methodSignatureToString(nodeName, signatures.instance)}
            ${methodSignatureToString(nodeName, signatures.interface)}
          `,
      )
      .join("\n")
  }
    }
    export function create${service.nodeName}(config: CreateServiceConfig): ${service.nodeName} {
      const client = config.client ?? new grpcWeb.GrpcWebClientBase({
        format: 'text',
        withCredentials: true,
      } as any);
      if (config.enableDevTools) enableDevTools({ client_: client });
      ${getRpcCallFixture()}
      const methodNames = {
        ${
    methods
      .map(
        ({ nodeName }) =>
          `
            ${nodeName}: '${
            [...service.path, service.nodeName].join(".")
          }/${nodeName}',
          `,
      )
      .join("\n")
  }
      };
      const methodInfos = {
        ${
    methods
      .map(({ requestType, responseType, nodeName, path }) => {
        const scope = service.scopeTable[path.join(".")];
        const requestPath = scope.getFullMessagePath(requestType);
        const responsePath = scope.getFullMessagePath(responseType);
        return `
          ${nodeName}: new grpcWeb.AbstractClientBase.MethodInfo(
            ${responsePath},
            getEncodeRequest(${requestPath}),
            getDecodeResponse(${responsePath})
          ),
        `;
      })
      .join("\n")
  }
      };
      return {
        ${
    methods.map((method) => getGrpcServiceSnippet(method, service)).join(",")
  }
      } as ${service.nodeName};
    }
  `;
}


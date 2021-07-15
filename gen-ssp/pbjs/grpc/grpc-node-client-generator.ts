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
    function rpcCall(
      methodName: keyof typeof methodNames,
      request: unknown,
      metaData?: Metadata
    ) {
      return getMetadata({
        ...config.metaData,
        ...metaData,
      }).then(metaData => {
        const grpcMetadata = new grpc.Metadata();
        for (const key of Object.keys(metaData)) grpcMetadata.set(key, metaData[key]);
        return new Promise((resolve, reject) => {
          client.makeUnaryRequest(
            methodNames[methodName],
            (methodInfos[methodName] as any).encode,
            (methodInfos[methodName] as any).decode,
            request,
            grpcMetadata,
            null,
            (err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            }
          );
        });
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
      import * as grpc from 'grpc';
      ${getIndexModuleFixture("grpc.Client")}
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
    import * as grpc from 'grpc';
    import {${service.namespaces.join(",")}} from '../${grpcDir}';
    import {
      CreateServiceConfig,
      Metadata,
      getMetadata,
      getEncodeRequest,
      getDecodeResponse,
      toPlainObject,
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
      const client = config.client ?? new grpc.Client(
        config.hostname.split('://').pop()!,
        config.hostname.startsWith('https://')
          ? grpc.credentials.createSsl()
          : grpc.credentials.createInsecure()
      );
      ${getRpcCallFixture()}
      const methodNames = {
        ${
    methods
      .map(
        ({ nodeName }) =>
          nodeName + ': "/' + [...service.path, service.nodeName].join(".") +
          "/" + nodeName + '",',
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
          ${nodeName}: {
            encode: getEncodeRequest(${requestPath}),
            decode: getDecodeResponse(${responsePath}),
          },
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

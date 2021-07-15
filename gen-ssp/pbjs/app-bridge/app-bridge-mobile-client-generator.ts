import { RootNode } from "../ast/index.ts";
import { getServices } from "../ast/service.ts";
import { pascalToCamel } from "../../misc/case.ts";
import { TextFiles } from "../misc.ts";

export function generateServiceModules(node: RootNode): TextFiles {
  const services = getServices(node);
  return services.map((service) => {
    const servicesDir = service.path.map((_) => "..").join("/");
    const appBridgeDir = servicesDir + "/../app-bridge";
    const I = (path: string) => path.replace(/([^.]+)$/, "I$1");
    const code = [
      `import { ${service.namespaces.join(",")} } from '../${servicesDir}';`,
      `import { requestRiiidMobileService } from '${appBridgeDir}';`,
      ...service.methods.map((method) => {
        return `
          export function ${pascalToCamel(method.nodeName)}(
            request: ${I(method.requestTypePath)}
          ): Promise<${I(method.responseTypePath)}> {
            const req = ${method.requestTypePath}.fromObject(request);
            return requestRiiidMobileService(
              '${method.path.join(".")}.${service.nodeName}.${method.nodeName}',
              Buffer.from(${method.requestTypePath}.encode(req).finish()).toString('base64'),
              ${method.requestTypePath},
              ${method.responseTypePath}
            );
          }
        `;
      }),
    ].join("\n");
    return {
      dir: service.path,
      fileName: `${service.nodeName}.ts`,
      code,
    };
  });
}

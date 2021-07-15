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
      `import { browserServiceMethodTable } from '${appBridgeDir}';`,
      `interface ${service.nodeName} {`,
      ...service.methods.map((method) => {
        return `
          ${pascalToCamel(method.nodeName)}(
            request: ${I(method.requestTypePath)}
          ): ${I(method.responseTypePath)} | Promise<${I(method.responseTypePath)}>;
        `;
      }),
      `}`,
      `export function register${service.nodeName}(service: ${service.nodeName}) {`,
      ...service.methods.map((method) => {
        return `
          browserServiceMethodTable[
            '${method.path.join(".")}.${service.nodeName}.${method.nodeName}'
          ] = async (request: string) => {
            const req = ${method.requestTypePath}.decode(Buffer.from(request, 'base64'));
            const res = await service.${pascalToCamel(method.nodeName)}(req.toJSON());
            return Buffer.from(${method.responseTypePath}.encode(res).finish()).toString('base64');
          };
        `;
      }),
      `}`,
    ].join("\n");
    return {
      dir: service.path,
      fileName: `${service.nodeName}.ts`,
      code,
    };
  });
}

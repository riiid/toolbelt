import { MethodNode, NodeInfo, RootNode } from "./index.ts";
import { calcScopeTable, ScopeTable } from "./scope.ts";
import {
  getDefaultVisitors,
  traverseRoot,
  traverseService,
  Visitors,
} from "./traverse.ts";

export interface Service extends NodeInfo {
  scopeTable: ScopeTable;
  namespaces: string[];
  methods: Method[];
}

export interface Method extends MethodNode, NodeInfo {
  requestTypePath: string;
  responseTypePath: string;
}

export function getServices(node: RootNode) {
  const scopeTable = calcScopeTable(node);
  const defaultVisitors = getDefaultVisitors();
  const services: Service[] = [];
  const visitors: Visitors<any> = {
    ...defaultVisitors,
    visitService(service, visitors, serviceInfo, context) {
      const methods: Method[] = [];
      const namespaces: string[] = [];
      traverseService(
        service,
        {
          ...visitors,
          visitMethod(method, _visitors, nodeInfo) {
            const path = nodeInfo.path.join(".");
            const requestTypePath = scopeTable[path].getFullMessagePath(
              method.requestType,
            );
            const responseTypePath = scopeTable[path].getFullMessagePath(
              method.responseType,
            );
            methods.push({
              ...method,
              ...nodeInfo,
              requestTypePath,
              responseTypePath,
            });
            const extractNamespace = (path: string) => {
              const result = /^(?<namespace>\w+)\.?/.exec(path);
              if (!result) throw new Error(`Invalid path. ${path}`);
              return result.groups!.namespace;
            };
            namespaces.push(
              extractNamespace(requestTypePath),
              extractNamespace(responseTypePath),
            );
          },
        },
        serviceInfo,
        context,
      );
      services.push({
        ...serviceInfo,
        scopeTable,
        namespaces: [...new Set(namespaces)],
        methods,
      });
    },
  };
  traverseRoot(node, visitors, { nodeName: "", path: [] }, {});
  return services;
}

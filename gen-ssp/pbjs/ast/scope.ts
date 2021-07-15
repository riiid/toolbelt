import { RootNode } from "./index.ts";
import {
  getDefaultVisitors,
  traverseEnum,
  traverseMessage,
  traverseNamespace,
  traverseRoot,
  traverseService,
  Visitors,
} from "./traverse.ts";

class Scope {
  constructor(
    public nodeName: string,
    public parentScope: Scope | null,
    public messageNames: string[],
  ) {}
  get path(): string {
    if (!this.parentScope) return this.nodeName;
    return this.parentScope.path
      ? this.parentScope.path + "." + this.nodeName
      : this.nodeName;
  }
  has(messageName: string) {
    return this.messageNames.includes(messageName);
  }
  getFullMessagePath(messageName: string) {
    if (messageName.includes(".")) return messageName;

    const scope = this.findScopeFromMessageName(messageName);
    if (!scope) throw new Error(`${this.path}에서 ${messageName}을 찾지 못했습니다.`);
    return scope.path + "." + messageName;
  }
  private findScopeFromMessageName(messageName: string): Scope | null {
    if (this.has(messageName)) return this;
    if (!this.parentScope) return null;
    return this.parentScope.findScopeFromMessageName(messageName);
  }
}

export interface ScopeTable {
  [path: string]: Scope;
}
export function calcScopeTable(node: RootNode): ScopeTable {
  interface Context {
    scope: Scope;
    scopeTable: ScopeTable;
  }
  const scope = new Scope("", null, []);
  const scopeTable = { [scope.path]: scope };
  const handlers: Visitors<Context> = {
    ...getDefaultVisitors(),
    visitNamespace(node, handlers, nodeInfo, context) {
      const scope = new Scope(nodeInfo.nodeName, context.scope, []);
      context.scopeTable[scope.path] = scope;
      traverseNamespace(node, handlers, nodeInfo, {
        ...context,
        scope,
      });
    },
    visitService(node, handlers, nodeInfo, context) {
      context.scope.messageNames.push(nodeInfo.nodeName);
      traverseService(node, handlers, nodeInfo, context);
    },
    visitMessage(node, handlers, nodeInfo, context) {
      context.scope.messageNames.push(nodeInfo.nodeName);
      const scope = new Scope(nodeInfo.nodeName, context.scope, []);
      context.scopeTable[scope.path] = scope;
      traverseMessage(node, handlers, nodeInfo, {
        ...context,
        scope,
      });
    },
    visitEnum(node, handlers, nodeInfo, context) {
      context.scope.messageNames.push(nodeInfo.nodeName);
      traverseEnum(node, handlers, nodeInfo, context);
    },
  };
  traverseRoot(
    node,
    handlers,
    {
      nodeName: "",
      path: [],
    },
    { scope, scopeTable },
  );
  return scopeTable;
}

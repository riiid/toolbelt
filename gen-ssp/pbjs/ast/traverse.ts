import {
  EnumNode,
  isEnumNode,
  isExtendNode,
  isMessageNode,
  isNamespaceNode,
  isServiceNode,
  MessageNode,
  MethodNode,
  NamespaceNode,
  NodeInfo,
  RootNode,
  ServiceNode,
} from "./index.ts";

export interface Visitor<TNode, TContext> {
  (
    node: TNode,
    handlers: Visitors<TContext>,
    nodeInfo: NodeInfo,
    context: TContext,
  ): void;
}

export interface Visitors<TContext> {
  visitNamespace: Visitor<NamespaceNode, TContext>;
  visitService: Visitor<ServiceNode, TContext>;
  visitMethod: Visitor<MethodNode, TContext>;
  visitMessage: Visitor<MessageNode, TContext>;
  visitEnum: Visitor<EnumNode, TContext>;
}
export function getDefaultVisitors<TContext>(): Visitors<TContext> {
  const handlers = {
    visitNamespace: traverseNamespace,
    visitService: traverseService,
    visitMethod: traverseMethod,
    visitMessage: traverseMessage,
    visitEnum: traverseEnum,
  };
  return handlers;
}

export function traverseMethod<TContext>(
  method: MethodNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context?: TContext,
) {}

export function traverseMessage<TContext>(
  method: MessageNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context?: TContext,
) {}

export function traverseEnum<TContext>(
  method: EnumNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context?: TContext,
) {}

export function traverseService<TContext>(
  node: ServiceNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context: TContext,
) {
  const { methods } = node;
  for (const methodName in methods) {
    const methodNode = methods[methodName];
    const methodNodeInfo: NodeInfo = { ...nodeInfo, nodeName: methodName };
    handlers.visitMethod(methodNode, handlers, methodNodeInfo, context);
  }
}

export function traverseNamespace<TContext>(
  node: NamespaceNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context: TContext,
) {
  const { nested } = node;
  for (const nodeName in nested) {
    const childNode = nested[nodeName];
    let handled = false;
    if (isMessageNode(childNode)) {
      handled = true;
      handlers.visitMessage(
        childNode,
        handlers,
        { ...nodeInfo, nodeName },
        context,
      );
    }
    if (isNamespaceNode(childNode)) {
      handled = true;
      handlers.visitNamespace(
        childNode,
        handlers,
        {
          nodeName,
          path: nodeInfo.path.concat(nodeName),
        },
        context,
      );
    }
    if (isServiceNode(childNode)) {
      handled = true;
      handlers.visitService(
        childNode,
        handlers,
        { ...nodeInfo, nodeName },
        context,
      );
    }
    if (isEnumNode(childNode)) {
      handled = true;
      handlers.visitEnum(
        childNode,
        handlers,
        { ...nodeInfo, nodeName },
        context,
      );
    }
    if (isExtendNode(childNode)) {
      handled = true;
      // ignore
    }
    if (!handled) throw new Error("Unknown Node");
  }
}

export function traverseRoot<TContext>(
  node: RootNode,
  handlers: Visitors<TContext>,
  nodeInfo: NodeInfo,
  context: TContext,
) {
  traverseNamespace(node, handlers, nodeInfo, context);
  return context;
}

export function isNamespaceNode(node: any): node is NamespaceNode {
  return "nested" in node;
}
export function isServiceNode(node: any): node is ServiceNode {
  return "methods" in node;
}
export function isMessageNode(node: any): node is MessageNode {
  return "fields" in node;
}
export function isEnumNode(node: any): node is EnumNode {
  return "values" in node;
}
export function isExtendNode(node: any): node is ExtendNode {
  return "extend" in node;
}

export interface NodeInfo {
  nodeName: string;
  path: string[];
}

export type NamespaceChildNode = NamespaceNode | ServiceNode | MessageNode;

export interface NamespaceNode {
  nested: { [key: string]: NamespaceChildNode };
}
export interface ServiceNode {
  methods: { [key: string]: MethodNode };
}
export interface MethodNode {
  requestType: string;
  responseType: string;
}
export interface MessageNode {
  fields: { [key: string]: unknown };
}
export interface EnumNode {
  values: unknown;
}
export interface ExtendNode {
  type: string;
  id: number;
  extend: string;
}
export interface RootNode extends NamespaceNode {
  options: unknown;
}

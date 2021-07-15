import { RootNode } from "./ast/index.ts";
import { writeTextFiles } from "./misc.ts";
import {
  generateServiceModules as generateAppBridgeBrowserClientModules,
} from "./app-bridge/app-bridge-browser-client-generator.ts";
import {
  generateServiceModules as generateAppBridgeBrowserServerModules,
} from "./app-bridge/app-bridge-browser-server-generator.ts";
import {
  generateServiceModules as generateAppBridgeMobileClientModules,
} from "./app-bridge/app-bridge-mobile-client-generator.ts";
import {
  generateGrpcServiceModules as generateGrpcWebServiceModules,
  generateSharedGrpcModules as generateSharedGrpcWebModules,
} from "./grpc/grpc-client-generator.ts";
import {
  generateGrpcServiceModules as generateGrpcNodeServiceModules,
  generateSharedGrpcModules as generateSharedGrpcNodeModules,
} from "./grpc/grpc-node-client-generator.ts";

export async function generateAppBridgeBrowserClient(
  ast: RootNode,
  outDir: string,
): Promise<void> {
  await writeTextFiles(generateAppBridgeBrowserClientModules(ast), outDir);
}

export async function generateAppBridgeBrowserServer(
  ast: RootNode,
  outDir: string,
): Promise<void> {
  await writeTextFiles(generateAppBridgeBrowserServerModules(ast), outDir);
}

export async function generateAppBridgeMobileClient(
  ast: RootNode,
  outDir: string,
): Promise<void> {
  await writeTextFiles(generateAppBridgeMobileClientModules(ast), outDir);
}

export async function generateGrpcClient(
  ast: RootNode,
  outDir: string,
): Promise<void> {
  await writeTextFiles([
    ...generateSharedGrpcWebModules(),
    ...generateGrpcWebServiceModules(ast),
  ], outDir);
}

export async function generateGrpcNodeClient(
  ast: RootNode,
  outDir: string,
): Promise<void> {
  await writeTextFiles([
    ...generateSharedGrpcNodeModules(),
    ...generateGrpcNodeServiceModules(ast),
  ], outDir);
}

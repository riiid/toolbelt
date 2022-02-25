import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import { RootNode } from "../pbjs/ast/index.ts";
import {
  generateAppBridgeBrowserClient,
  generateAppBridgeBrowserServer,
  generateAppBridgeMobileClient,
  generateGrpcClient,
  generateGrpcNodeClient,
} from "../pbjs/index.ts";
import { sspOutPath } from "./index.ts";

export default async function gen(): Promise<void> {
  console.log("Generating protobuf service utils...");
  const ast = await getAst("index.json");
  const browserServicesAst = await getAst("santa-app-browser.json");
  const mobileServicesAst = await getAst("santa-app-mobile.json");
  const iframePath = path.resolve(sspOutPath, "iframe");
  const browserPath = path.resolve(sspOutPath, "browser");
  const mobilePath = path.resolve(sspOutPath, "mobile");
  const grpcClientPath = path.resolve(sspOutPath, "grpc");
  const grpcNodeClientPath = path.resolve(sspOutPath, "grpc-node");
  await generateAppBridgeBrowserClient(browserServicesAst, iframePath);
  await generateAppBridgeBrowserServer(browserServicesAst, browserPath);
  await generateAppBridgeBrowserServer(mobileServicesAst, browserPath);
  await generateAppBridgeMobileClient(mobileServicesAst, mobilePath);
  await generateGrpcClient(ast, grpcClientPath);
  await generateGrpcNodeClient(ast, grpcNodeClientPath);
}

async function getAst(astJsonName: string): Promise<RootNode> {
  const astJsonPath = path.resolve(sspOutPath, astJsonName);
  const astJson = await Deno.readTextFile(astJsonPath);
  return JSON.parse(astJson) as RootNode;
}

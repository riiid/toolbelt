import { GenOptions } from "./index.ts";
import * as path from "https://deno.land/std@0.126.0/path/mod.ts";
import { RootNode } from "../pbjs/ast/index.ts";
import {
  generateAppBridgeBrowserClient,
  generateAppBridgeBrowserServer,
  generateAppBridgeMobileClient,
  generateGrpcClient,
  generateGrpcNodeClient,
} from "../pbjs/index.ts";

export default async function gen({ outDir }: GenOptions): Promise<void> {
  console.log("Generating protobuf service utils...");
  const ast = await getAst("index.json", outDir);
  const browserServicesAst = await getAst("santa-app-browser.json", outDir);
  const mobileServicesAst = await getAst("santa-app-mobile.json", outDir);
  const iframePath = path.resolve(outDir, "iframe");
  const browserPath = path.resolve(outDir, "browser");
  const mobilePath = path.resolve(outDir, "mobile");
  const grpcClientPath = path.resolve(outDir, "grpc");
  const grpcNodeClientPath = path.resolve(outDir, "grpc-node");
  await generateAppBridgeBrowserClient(browserServicesAst, iframePath);
  await generateAppBridgeBrowserServer(browserServicesAst, browserPath);
  await generateAppBridgeBrowserServer(mobileServicesAst, browserPath);
  await generateAppBridgeMobileClient(mobileServicesAst, mobilePath);
  await generateGrpcClient(ast, grpcClientPath);
  await generateGrpcNodeClient(ast, grpcNodeClientPath);
}

async function getAst(astJsonName: string, outDir: string): Promise<RootNode> {
  const astJsonPath = path.resolve(outDir, astJsonName);
  const astJson = await Deno.readTextFile(astJsonPath);
  return JSON.parse(astJson) as RootNode;
}

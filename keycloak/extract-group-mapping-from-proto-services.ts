import { stringify } from "https://deno.land/std@0.138.0/encoding/yaml.ts";
import { walk } from "https://deno.land/std@0.138.0/fs/walk.ts";
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import * as ast from "https://deno.land/x/pbkit@v0.0.38/core/ast/index.ts";
import { parse } from "https://deno.land/x/pbkit@v0.0.38/core/parser/proto.ts";
import {
  filterNodesByType,
  findNodeByType,
} from "https://deno.land/x/pbkit@v0.0.38/core/schema/ast-util.ts";
import {
  evalConstant,
} from "https://deno.land/x/pbkit@v0.0.38/core/schema/eval-ast-constant.ts";
import {
  stringifyFullIdent,
  stringifyOptionName,
} from "https://deno.land/x/pbkit@v0.0.38/core/schema/stringify-ast-frag.ts";

export interface Table {
  [key: string]: string[];
}

if (import.meta.main) {
  interface Options {
    invert?: boolean;
    yaml?: boolean;
  }
  const command = new Command();
  command
    .name("riiid-extract-keycloak-groups")
    .arguments("<dir:string>")
    .option("-i, --invert", "invert result")
    .option("-y, --yaml", "print as yaml")
    .action(async (options: Options, dir: string) => {
      const table: Table = {};
      const entries = walk(dir, { includeDirs: false, exts: [".proto"] });
      for await (const { path } of entries) {
        const code = await Deno.readTextFile(path);
        const parseResult = parse(code);
        Object.assign(
          table,
          getMethodNameToKeycloakGroupTable(parseResult.ast),
        );
      }
      const t = options.invert ? invert(table) : table;
      if (options.yaml) console.log(stringify(t, { lineWidth: Infinity }));
      else console.log(JSON.stringify(t, null, 2));
    })
    .parse(Deno.args);
}

function joinTypePath(...fragments: string[]): string {
  return fragments.filter((fragment) => fragment).join(".");
}

export function getMethodNameToKeycloakGroupTable(ast: ast.Proto): Table {
  const result: Table = {};
  const packagePath = getPackage(ast.statements);
  for (const service of filterNodesByType(ast.statements, "service")) {
    const serviceName = service.serviceName.text;
    const serviceBodyStatements = service.serviceBody.statements;
    for (const rpc of filterNodesByType(serviceBodyStatements, "rpc")) {
      const rpcName = rpc.rpcName.text;
      const rpcPath = joinTypePath(packagePath, serviceName) + "/" + rpcName;
      if (rpc.semiOrRpcBody.type === "rpc-body") {
        const options = getOptions(rpc.semiOrRpcBody.statements);
        const keycloakGroupOptionValue = options["(inside.keycloak_group)"];
        if (typeof keycloakGroupOptionValue === "string") {
          result[rpcPath] = keycloakGroupOptionValue.split(",").map(
            (keycloakGroup) => keycloakGroup.trim(),
          );
          continue;
        }
      }
      result[rpcPath] = [];
    }
  }
  return result;
}

function getPackage(statements: ast.Statement[]): string {
  const packageStatement = findNodeByType(statements, "package");
  if (!packageStatement) return "";
  return stringifyFullIdent(packageStatement.fullIdent);
}

type OptionValue = boolean | number | string;
interface Options {
  [optionName: string]: OptionValue;
}
function getOptions(nodes?: ast.Node[]): Options {
  if (!nodes) return {};
  const optionStatements = filterNodesByType(nodes, "option");
  const result: Options = {};
  for (const statement of optionStatements) {
    const optionName = stringifyOptionName(statement.optionName);
    const optionValue = evalConstant(statement.constant);
    result[optionName] = optionValue;
  }
  return result;
}

export function invert(table: Table): Table {
  const result: Table = {};
  for (const [key, value] of Object.entries(table)) {
    const arr = value.length ? value : [""];
    for (const k of arr) {
      result[k] = result[k] || [];
      result[k].push(key);
    }
  }
  return result;
}

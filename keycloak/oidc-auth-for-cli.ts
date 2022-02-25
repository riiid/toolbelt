import { serve } from "https://deno.land/std@0.126.0/http/server.ts";
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import openBrowser from "../misc/open-browser.ts";

export const port = 61118;
export const oidcAuthUrl = (
  "https://keycloak.riiid.cloud/auth/realms/master/protocol/openid-connect/auth"
);
export const oidcTokenUrl = (
  "https://keycloak.riiid.cloud/auth/realms/master/protocol/openid-connect/token"
);

export interface GetOidcLoginPageUrlConfig {
  callbackServerPort: number;
  oidcAuthUrl: string;
  clientId: string;
  scope: string[];
}
export function getOidcLoginPageUrl(config: GetOidcLoginPageUrlConfig) {
  const port = config.callbackServerPort;
  const url = new URL(config.oidcAuthUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set(
    "redirect_uri",
    `http://localhost:${port}/oidc-auth-callback`,
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scope.join(" "));
  return url.toString();
}

export interface OidcAuthCallbackArgs {
  code: string;
}
export async function openOidcAuthCallbackServer(
  port: number,
): Promise<OidcAuthCallbackArgs> {
  const server = serve({ port });
  for await (const req of server) {
    if (!req.url.startsWith("/oidc-auth-callback")) {
      req.respond({ body: "ok\n" });
      continue;
    }
    const reqUrl = new URL(`http://localhost:${port}${req.url}`);
    const searchParams = Object.fromEntries(reqUrl.searchParams.entries());
    req.respond({ body: "login succeed. you can now close this window.\n" });
    return searchParams as unknown as OidcAuthCallbackArgs;
  }
  throw "never";
}

export interface GetOidcTokenConfig {
  clientId: string;
  clientSecret: string;
  code: string;
}
export async function getOidcToken(config: GetOidcTokenConfig) {
  const searchParams = new URLSearchParams();
  searchParams.set("client_id", config.clientId);
  searchParams.set("client_secret", config.clientSecret);
  searchParams.set("grant_type", "authorization_code");
  searchParams.set("code", config.code);
  const res = await fetch(oidcTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: searchParams.toString(),
  });
  // TODO: return access token
  console.log(await res.json());
}

if (import.meta.main) {
  interface Options {
    oidcAuthUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string[];
    callbackServerPort: number;
  }
  const command = new Command();
  command
    .name("oidc-auth-for-cli")
    .arguments("[options]")
    .option("-o, --oidc-auth-url <url:string>", "openid connect auth url", {
      default: oidcAuthUrl,
    })
    .option("-c, --client-id <id:string>", "client id", {
      required: true,
    })
    .option("-s, --client-secret <secret:string>", "client secret", {
      required: true,
    })
    .option("-S, --scope <scope:string>", "scope", {
      default: ["openid", "email", "profile"],
      collect: true,
    })
    .option("-p, --callback-server-port <port:number>", "port", {
      default: port,
    })
    .action(async (options: Options) => {
      const url = getOidcLoginPageUrl(options);
      await openBrowser("", url);
      await getOidcToken({
        code: (await openOidcAuthCallbackServer(port)).code,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
      });
    })
    .parse(Deno.args);
}

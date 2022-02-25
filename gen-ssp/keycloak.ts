import { parse as parseYaml } from "https://deno.land/std@0.126.0/encoding/yaml.ts";

export interface ClientRoles {
  [clientName: string]: string[];
}

export async function getClientRoles(
  clientRolesPaths: string[],
): Promise<ClientRoles> {
  const result: ClientRoles = {};
  for (const file of clientRolesPaths) {
    const text = await Deno.readTextFile(file);
    const clientRoles = parseYaml(text) as ClientRoles;
    Object.assign(result, clientRoles);
  }
  return result;
}

export async function generateKeycloakUtil(
  clientRoles: ClientRoles,
): Promise<string> {
  const clientNames = Object.keys(clientRoles);
  return `
    export interface ResourceAccess {
      ${
    clientNames
      .map((clientName) => {
        const roles = `(${
          clientRoles[clientName].map((role) => JSON.stringify(role)).join("|")
        })[]`;
        return [
          // Context: https://riiid.slack.com/archives/C015KM3MCG5/p1608780914072500?thread_ts=1608688422.023700&cid=C015KM3MCG5
          `"${clientName}-prod"?: { roles: ${roles}; };`,
          `"${clientName}"?: { roles: ${roles}; };`,
        ];
      })
      .flat(1)
      .join("\n")
  }
    }
    export type ClientName = keyof ResourceAccess;
    export type Role<TClientName extends ClientName> =
      ResourceAccess[TClientName] extends ({ roles: (infer T)[] } | undefined) ? T : never;
    export interface TokenPayload {
      name?: string;
      email?: string;
      resource_access?: ResourceAccess;
    }
    export async function getTokenPayloadFromKeycloak(): Promise<TokenPayload> {
      return await fetch('/oauth/token').then(res => res.json());
    }
    export function signOut(): void {
      location.href = '/oauth/logout';
    }
    export function createFakeToken(tokenPayload: TokenPayload): string {
      const tokenPayloadJson = JSON.stringify(tokenPayload);
      const payload = Buffer.from(tokenPayloadJson).toString('base64').replace(/=*$/, '');
      return 'e30.' + payload + '.';
    }
    export function hasRole<TClientName extends ClientName>(
      tokenPayload: TokenPayload,
      clientName: TClientName,
      role: Role<TClientName>
    ): boolean {
      const roles = tokenPayload.resource_access?.[clientName]?.roles;
      if (!Array.isArray(roles)) return false;
      return (roles as Role<TClientName>[]).includes(role);
    }
  `;
}

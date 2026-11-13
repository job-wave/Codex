import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { withSecurityHeaders } from "../app/security-headers";
import { notFoundPage } from "../app/visitor";

// Every response gets the security headers; an unknown page address gets the branded 404 page.
async function respond(request: Request, pending: Response | Promise<Response>) {
  const response = await pending;
  if (response.status === 101) return response;
  const path = new URL(request.url).pathname;
  const wantsPage = request.method === "GET" && (request.headers.get("accept") || "").includes("text/html");
  if (response.status === 404 && wantsPage && !path.startsWith("/api/") && !(response.headers.get("content-type") || "").includes("text/html")) {
    return withSecurityHeaders(notFoundPage());
  }
  return withSecurityHeaders(response);
}

const worker = {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return respond(request, runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx)));
  },
};

export default worker;

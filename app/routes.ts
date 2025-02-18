import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("callback", "routes/callback.ts"),
  route("document", "routes/document.tsx"),
  route("ping", "routes/ping.ts"),
  route("webhook", "routes/webhook.ts"),
] satisfies RouteConfig;

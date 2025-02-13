import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("callback", "routes/callback.ts"),
  route("document", "routes/document.tsx"),
] satisfies RouteConfig;

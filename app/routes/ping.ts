import type { Route } from "./+types/ping";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);

  console.log("loader ping", searchParams);

  return true;
}

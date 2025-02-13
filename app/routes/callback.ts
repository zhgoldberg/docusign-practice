import { redirect } from "react-router";
import { mockDb } from "../mockDb";
import type { Route } from "./+types/callback";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    throw new Error("Invalid request");
  }

  // Validate state
  if (state !== mockDb.state) {
    throw new Error("Invalid state");
  }

  mockDb.state = null;

  // Create headers using integration key and secret key
  const headers = new Headers({
    Authorization: `Basic ${Buffer.from(
      `${process.env.DOCUSIGN_INTEGRATION_KEY!}:${process.env
        .DOCUSIGN_SECRET_KEY!}`
    ).toString("base64")}`,
    "Content-Type": "application/json",
  });

  // Exchange code for access token
  const response = await fetch(
    `${process.env.DOCUSIGN_AUTH_URL!}/oauth/token`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        code,
        grant_type: "authorization_code",
      }),
    }
  );

  if (response.status !== 200) {
    console.error(await response.json());

    throw new Error("Failed to exchange code for access token");
  }

  // Save token to mockDb
  mockDb.token = await response.json();

  // Redirect to document page
  return redirect("/document");
}

import type { Route } from "./+types/webhook";
import docusign from "docusign-esign";

export async function action({ request, params }: Route.ActionArgs) {
  const { searchParams } = new URL(request.url);

  const body = await request.json();

  console.log("body", body);

  const envelopes = new docusign.UsersApi();

  const user = await envelopes.getProfile(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    body.data.userId
  );

  console.log("user", user);

  console.log("params", params);

  console.log("webhook ping", searchParams);

  return true;
}

import { redirect } from "react-router";
import { mockDb } from "../mockDb";
import type { Route } from "./+types/home";
import crypto from "crypto";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  mockDb.company = formData.get("company") as string;

  mockDb.state = crypto.randomBytes(16).toString("hex");

  const url = new URL(process.env.DOCUSIGN_BASE_URL!);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "signature");
  url.searchParams.set("client_id", process.env.DOCUSIGN_INTEGRATION_KEY!);
  url.searchParams.set("state", mockDb.state);
  url.searchParams.set("redirect_uri", process.env.DOCUSIGN_REDIRECT_URL!);

  return redirect(url.toString());
}

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
        action="/?index"
        method="post"
      >
        <input
          type="text"
          placeholder="Please enter your company name"
          name="company"
          style={{
            width: "400px",
            height: "40px",
            fontSize: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: "20px",
            fontSize: "20px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

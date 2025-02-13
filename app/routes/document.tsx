import type { Route } from "./+types/document";
import docusign from "docusign-esign";
import { mockDb } from "../mockDb";
import {
  makeEnvelope,
  makeRecipientViewRequest,
} from "../helpers/docusign.server";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(process.env.DOCUSIGN_ENVELOPE_PATH!); // Note that this will need to be retrieved via API call in production
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + mockDb.token?.access_token
  );
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  let results = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    {
      envelopeDefinition: makeEnvelope(),
    }
  );

  if (!results.envelopeId) {
    throw new Error("No envelopeId returned from createEnvelope");
  }

  let viewRequest = makeRecipientViewRequest();
  // Call the CreateRecipientView API
  // Exceptions will be caught by the calling function
  let recipientView = await envelopesApi.createRecipientView(
    process.env.DOCUSIGN_ACCOUNT_ID!,
    results.envelopeId,
    {
      recipientViewRequest: viewRequest,
    }
  );

  return {
    envelopeId: results.envelopeId,
    redirectUrl: recipientView.url,
    integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY,
  };
}

export async function action({ request }: Route.ActionArgs) {
  return true;
}

export default function Document({
  loaderData: { envelopeId, redirectUrl, integrationKey },
}: Route.ComponentProps) {
  useEffect(() => {
    window.DocuSign.loadDocuSign(integrationKey)
      .then((docusign) => {
        console.log("docusign", docusign);
        const signing = docusign.signing({
          url: redirectUrl,
          displayFormat: "focused",
          style: {
            /** High-level variables that mirror our existing branding APIs. Reusing the branding name here for familiarity. */
            branding: {
              primaryButton: {
                /** Background color of primary button */
                backgroundColor: "#333",
                /** Text color of primary button */
                color: "#fff",
              },
            },

            /** High-level components we allow specific overrides for */
            signingNavigationButton: {
              finishText: "You have finished the document! Hooray!",
              position: "bottom-center",
            },
          },
        });

        signing.on("ready", (event) => {
          console.log("UI is rendered");
        });

        signing.on("sessionEnd", (event) => {
          /** The event here denotes what caused the sessionEnd to trigger, such as signing_complete, ttl_expired etc../ **/
          console.log("sessionend", event);
        });

        signing.mount("#agreement");
      })
      .catch((ex) => {
        // Any configuration or API limits will be caught here
      });
  }, []);

  return (
    <div style={{ padding: "100px" }}>
      <div
        style={{ border: "2px solid brown", height: "700px" }}
        className="docusign-agreement"
        id="agreement"
      ></div>
    </div>
  );
}

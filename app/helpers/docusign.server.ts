import docusign from "docusign-esign";
import { mockDb } from "../mockDb";

export const makeEnvelope = () => {
  // Create a signer recipient for the signer role of the server template
  let signer1 = docusign.Signer.constructFromObject({
    email: mockDb.user.email,
    name: mockDb.user.name,
    roleName: "signer", // This value should correspond to the role name created on the template
    recipientId: "1",
    // Adding clientUserId transforms the template recipient
    // into an embedded recipient:
    clientUserId: mockDb.user.id,

    // To prefill the field
    tabs: {
      textTabs: [
        {
          tabLabel: "Company",
          value: mockDb.company,
        },
      ],
    },
  });
  // Recipients object:
  let recipientsServerTemplate = docusign.Recipients.constructFromObject({
    signers: [signer1],
  });

  // create a composite template for the Server Template
  let compTemplate1 = docusign.CompositeTemplate.constructFromObject({
    compositeTemplateId: "1",
    serverTemplates: [
      docusign.ServerTemplate.constructFromObject({
        sequence: "1",
        templateId: process.env.DOCUSIGN_TEMPLATE_ID!,
      }),
    ],
    // Add the roles via an inlineTemplate
    inlineTemplates: [
      docusign.InlineTemplate.constructFromObject({
        sequence: "2",
        recipients: recipientsServerTemplate,
      }),
    ],
  });

  // create the envelope definition
  let env = docusign.EnvelopeDefinition.constructFromObject({
    status: "sent",
    compositeTemplates: [compTemplate1],
  });

  return env;
};

export function makeRecipientViewRequest() {
  let viewRequest = new docusign.RecipientViewRequest();

  // Set the url where you want the recipient to go once they are done signing
  // should typically be a callback route somewhere in your app.
  // The query parameter is included as an example of how
  // to save/recover state information during the redirect to
  // the DocuSign signing. It's usually better to use
  // the session mechanism of your web framework. Query parameters
  // can be changed/spoofed very easily.
  viewRequest.returnUrl = process.env.APP_URL! + "?state=123";

  // How has your app authenticated the user? In addition to your app's
  // authentication, you can include authenticate steps from DocuSign.
  // Eg, SMS authentication
  viewRequest.authenticationMethod = "password";

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = mockDb.user.email;
  viewRequest.userName = mockDb.user.name;
  viewRequest.clientUserId = mockDb.user.id;

  // DocuSign recommends that you redirect to DocuSign for the
  // embedded signing. There are multiple ways to save state.
  // To maintain your application's session, use the pingUrl
  // parameter. It causes the DocuSign signing web page
  // (not the DocuSign server) to send pings via AJAX to your
  // app,
  //   viewRequest.pingFrequency = 600; // seconds
  // NOTE: The pings will only be sent if the pingUrl is an https address
  //   viewRequest.pingUrl = args.dsPingUrl; // optional setting
  viewRequest.frameAncestors = [
    process.env.APP_URL!,
    process.env.DOCUSIGN_BASE_URL!,
  ];
  viewRequest.messageOrigins = [process.env.DOCUSIGN_BASE_URL!];

  return viewRequest;
}

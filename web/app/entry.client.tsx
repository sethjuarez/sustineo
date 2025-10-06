import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "store/authConfig";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <HydratedRouter />
      </MsalProvider>
    </StrictMode>
  );
});

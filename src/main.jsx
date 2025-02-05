import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm6qo711x009j13z6xuszkvrt" // Replace with your actual Privy App ID
      config={{
        appearance: {
          accentColor: "#6A6FF5",
          theme: "#222224",
          showWalletLoginFirst: false,
          logo: "https://auth.privy.io/logos/privy-logo-dark.png",
          walletChainType: "ethereum-only",
          walletList: [
            "detected_wallets",
            "phantom",
            "solflare",
            "backpack",
            "okx_wallet"
          ],
        },
        loginMethods: ["email", "wallet", "google", "apple", "github", "discord"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "off",
          },
          solana: {
            createOnLogin: "off",
          },
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },

      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

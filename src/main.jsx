import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
<<<<<<< HEAD
      appId="cm7b9ly1800ocj4cjh8awayjj" // Replace with your actual Privy App ID
=======
      appId="cm6qo711x009j13z6xuszkvrt" // Replace with your actual Privy App ID
>>>>>>> 3f8fae7eeeb8928daaf508437b53b2806baec909
      config={{
        appearance: {
          accentColor: "#6A6FF5",
          theme: "#222224",
<<<<<<< HEAD

          logo: "https://auth.privy.io/logos/privy-logo-dark.png",

        },
        loginMethods: ["google", "email",
          "twitter",
          "github",
          "discord"],

=======
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
>>>>>>> 3f8fae7eeeb8928daaf508437b53b2806baec909

      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

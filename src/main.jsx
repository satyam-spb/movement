import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm7b9ly1800ocj4cjh8awayjj" // Replace with your actual Privy App ID
      config={{
        appearance: {
          accentColor: "#6A6FF5",
          theme: "#222224",

          logo: "https://auth.privy.io/logos/privy-logo-dark.png",

        },
        loginMethods: ["google", "email",
          "twitter",
          "github",
          "discord"],


      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);

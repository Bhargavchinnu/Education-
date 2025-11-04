import React from "react";
import ReactDOM from "react-dom/client";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </React.StrictMode>
);

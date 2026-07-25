import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
         <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,

        style: {
          borderRadius: "14px",
          background: "#fff",
          color: "#3D3939",
          border: "1px solid #F0DCE4",
          padding: "14px 16px",
        },

        success: {
          iconTheme: {
            primary: "#F33B7D",
            secondary: "#fff",
          },
        },

        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
        },
      }}
    />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
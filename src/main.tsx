import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "@components/AuthContext.tsx";
import Navbar from "@components/Navbar.tsx";
import Footer from "@components/Footer.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <StrictMode>
        <Navbar />
        <App />
        <Footer />
      </StrictMode>
    </BrowserRouter>
  </AuthContextProvider>
);

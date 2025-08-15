import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./query-provider";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <QueryProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster />
  </QueryProvider>
);

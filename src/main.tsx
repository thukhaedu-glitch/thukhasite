import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import AdminPanel from "./components/AdminPanel";
import "./index.css";

const isAdminPage =
  window.location.pathname === "/admin" ||
  window.location.pathname.startsWith("/admin/");

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    {isAdminPage ? <AdminPanel /> : <App />}
  </StrictMode>,
);

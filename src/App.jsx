import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout.jsx";
import Resumen from "./pages/Resumen.jsx";
import SubirPDF from "./pages/SubirPDF.jsx";
import Revision from "./pages/Revision.jsx";
import Graficas from "./pages/Graficas.jsx";
import Inversion from "./pages/Inversion.jsx";
import AccessGate from "./components/AccessGate.jsx";
import { api, clearSession, getSessionToken } from "./api/client.js";

export default function App() {
  const [status, setStatus] = useState(getSessionToken() ? "checking" : "locked");

  useEffect(() => {
    if (!getSessionToken()) return;
    api.getSession().then(() => setStatus("ready")).catch(() => {
      clearSession();
      setStatus("locked");
    });
  }, []);

  if (status === "checking") return <div className="min-h-full" aria-busy="true" />;
  if (status === "locked") return <AccessGate onAccess={() => setStatus("ready")} />;

  const logout = () => {
    clearSession();
    setStatus("locked");
  };

  return (
    <Routes>
      <Route element={<Layout onLogout={logout} />}>
        <Route index element={<Resumen />} />
        <Route path="subir" element={<SubirPDF />} />
        <Route path="revision" element={<Revision />} />
        <Route path="graficas" element={<Graficas />} />
        <Route path="inversion" element={<Inversion />} />
        <Route path="*" element={<Resumen />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Resumen from "./pages/Resumen.jsx";
import SubirPDF from "./pages/SubirPDF.jsx";
import Revision from "./pages/Revision.jsx";
import Graficas from "./pages/Graficas.jsx";
import Inversion from "./pages/Inversion.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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

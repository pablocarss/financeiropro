import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import ContasBancarias from "./pages/ContasBancarias";
import Clientes from "./pages/Clientes";
import Categorias from "./pages/Categorias";
import FormasPagamento from "./pages/FormasPagamento";
import CentrosCusto from "./pages/CentrosCusto";
import TiposDocumento from "./pages/TiposDocumento";
import ImportarLancamentos from "./pages/ImportarLancamentos";
import ConciliacaoBancaria from "./pages/ConciliacaoBancaria";

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lancamentos" element={<Lancamentos />} />
              <Route path="/contas-bancarias" element={<ContasBancarias />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/centros-custo" element={<CentrosCusto />} />
              <Route path="/tipos-documento" element={<TiposDocumento />} />
              <Route path="/importar-lancamentos" element={<ImportarLancamentos />} />
              <Route path="/conciliacao-bancaria" element={<ConciliacaoBancaria />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

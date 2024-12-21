import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route } from "react-router-dom";
import { Painel } from "./pages/Painel";
import { Lancamentos } from "./pages/Lancamentos";
import { Categorias } from "./pages/Categorias";
import { ContasBancarias } from "./pages/ContasBancarias";
import { FormasPagamento } from "./pages/FormasPagamento";
import { Clientes } from "./pages/Clientes";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Painel />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/contas-bancarias" element={<ContasBancarias />} />
            <Route path="/formas-pagamento" element={<FormasPagamento />} />
            <Route path="/clientes" element={<Clientes />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

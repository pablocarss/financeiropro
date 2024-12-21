import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lancamentos from "./pages/Lancamentos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/lancamentos" element={<Lancamentos />} />
        <Route path="/categorias" element={<Index />} />
        <Route path="/contas-bancarias" element={<Index />} />
        <Route path="/formas-pagamento" element={<Index />} />
        <Route path="/clientes" element={<Index />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

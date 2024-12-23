import { ThemeProvider } from "./contexts/ThemeContext"
import { AppProvider } from "./contexts/AppContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Insights from "./pages/Insights"
import Lancamentos from "./pages/Lancamentos"
import Previsao from "./pages/Previsao"
import ContasBancarias from "./pages/ContasBancarias"
import Categorias from "./pages/Categorias"
import Clientes from "./pages/Clientes"
import FormasPagamento from "./pages/FormasPagamento"
import CentrosCusto from "./pages/CentrosCusto"
import TiposDocumento from "./pages/TiposDocumento"
import ImportarLancamentos from "./pages/ImportarLancamentos"
import ConciliacaoBancaria from "./pages/ConciliacaoBancaria"
import CartoesCredito from "./pages/CartoesCredito"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Perfil from "./pages/Perfil"
import Relatorios from "./pages/Relatorios"
import { TooltipProvider } from "./components/ui/tooltip"
import { Toaster } from "./components/ui/toaster"

interface PrivateRouteProps {
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

interface PublicRouteProps {
  children: React.ReactNode
}

function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <AppProvider>
            <TooltipProvider>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Landing />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/registro"
                  element={
                    <PublicRoute>
                      <Registro />
                    </PublicRoute>
                  }
                />

                {/* Rotas privadas */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/insights"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Insights />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/lancamentos"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Lancamentos />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/previsao"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Previsao />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contas-bancarias"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ContasBancarias />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Categorias />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Clientes />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/formas-pagamento"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <FormasPagamento />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/centros-custo"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <CentrosCusto />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tipos-documento"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <TiposDocumento />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/importar-lancamentos"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ImportarLancamentos />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/conciliacao-bancaria"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ConciliacaoBancaria />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cartoes-credito"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <CartoesCredito />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cartoes"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <CartoesCredito />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Perfil />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/relatorios"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Relatorios />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Clientes />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              </Routes>
              <Toaster />
            </TooltipProvider>
          </AppProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileCheck,
  FileDown,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LineChart,
  ListTodo,
  Receipt,
  Settings,
  Tags,
  TrendingUp,
  Users,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/insights",
    label: "Insights",
    icon: LineChart,
  },
  {
    path: "/lancamentos",
    label: "Lançamentos",
    icon: ListTodo,
  },
  {
    path: "/categorias",
    label: "Categorias",
    icon: Tags,
  },
  {
    path: "/contas-bancarias",
    label: "Contas Bancárias",
    icon: Building2,
  },
  {
    path: "/formas-pagamento",
    label: "Formas de Pagamento",
    icon: CreditCard,
  },
  {
    path: "/clientes",
    label: "Clientes",
    icon: Users,
  },
  {
    path: "/centros-custo",
    label: "Centros de Custo",
    icon: BarChart3,
  },
  {
    path: "/tipos-documento",
    label: "Tipos de Documento",
    icon: FileSpreadsheet,
  },
  {
    path: "/importar-lancamentos",
    label: "Importar Lançamentos",
    icon: FileDown,
  },
  {
    path: "/conciliacao-bancaria",
    label: "Conciliação Bancária",
    icon: FileCheck,
  },
  {
    path: "/previsao",
    label: "Previsão",
    icon: TrendingUp,
  },
  {
    path: "/cartoes-credito",
    label: "Cartões de Crédito",
    icon: CreditCard,
  },
  {
    path: "/relatorios",
    label: "Relatórios",
    icon: FileText,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex h-screen w-72 flex-col bg-background border-r">
      <div className="flex items-center gap-2 px-6 py-4">
        <img src="/logo.svg" alt="FinanceiroPRO" className="w-8 h-8" />
        <span className="font-semibold text-xl tracking-tight">FinanceiroPRO</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-2">
        <div className="space-y-1">
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </NavLink>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}

import { Link, useLocation } from "react-router-dom";
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
  ListTodo,
  Receipt,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
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
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex h-screen w-72 flex-col bg-background border-r">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3">
          <img 
            src="/public/vite.svg" 
            alt="FinanceiroPRO" 
            className="w-8 h-8"
          />
          <span className="font-bold text-xl">FinanceiroPRO</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

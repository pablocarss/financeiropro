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
  Tags,
  Users,
} from "lucide-react";

const menuItems = [
  {
    path: "/",
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
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-900 p-6">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-xl text-zinc-100">FINANCEIRO PRO+</span>
      </Link>

      <nav className="space-y-0.5">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded px-3 py-2 hover:bg-zinc-800",
              pathname === item.path && "bg-zinc-800"
            )}
          >
            <item.icon className="w-5 h-5 text-zinc-500" />
            <span className="font-medium text-zinc-100">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

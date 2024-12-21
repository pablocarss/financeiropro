import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Wallet,
  CreditCard,
  Users,
} from "lucide-react";

const menuItems = [
  {
    path: "/",
    label: "Painel",
    icon: LayoutDashboard,
  },
  {
    path: "/lancamentos",
    label: "Lançamentos",
    icon: Receipt,
  },
  {
    path: "/categorias",
    label: "Categorias",
    icon: Tags,
  },
  {
    path: "/contas-bancarias",
    label: "Contas Bancárias",
    icon: Wallet,
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
];

export function Sidebar() {
  return (
    <aside className="w-64 gradient-sidebar flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <img src="/logo.svg" alt="" className="w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          FinanceiroPro
        </h1>
      </div>
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-purple-500/10 text-purple-400 border-r-4 border-purple-500 font-semibold"
                  : "text-muted-foreground hover:text-purple-400 hover:bg-purple-500/5"
              }`
            }
            end
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

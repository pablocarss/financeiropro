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
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-black border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">FinanceiroPro</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white border-r-4 border-purple-500"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

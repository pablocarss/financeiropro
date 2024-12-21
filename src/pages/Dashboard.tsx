import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// Dados de exemplo
const dadosFluxoCaixa = [
  { mes: "Jan", entrada: 5000, saida: 3000 },
  { mes: "Fev", entrada: 6000, saida: 3500 },
  { mes: "Mar", entrada: 4500, saida: 4000 },
  { mes: "Abr", entrada: 7000, saida: 3800 },
  { mes: "Mai", entrada: 8000, saida: 4200 },
  { mes: "Jun", entrada: 7500, saida: 4500 },
];

const dadosCategoriasReceitas = [
  { name: "Vendas", value: 15000 },
  { name: "Serviços", value: 8000 },
  { name: "Outros", value: 2000 },
];

const dadosCategoriasDespesas = [
  { name: "Fornecedores", value: 8000 },
  { name: "Aluguel", value: 3000 },
  { name: "Funcionários", value: 5000 },
  { name: "Outros", value: 2000 },
];

const dadosContasBancarias = [
  { conta: "Conta Principal", saldo: 25000 },
  { conta: "Conta Poupança", saldo: 15000 },
  { conta: "Conta Investimentos", saldo: 35000 },
];

const CORES_GRAFICOS = [
  "#10B981", // emerald-500
  "#6366F1", // indigo-500
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
];

export default function Dashboard() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("mes");

  // Calcular totais
  const totais = dadosFluxoCaixa.reduce(
    (acc, item) => {
      acc.entradas += item.entrada;
      acc.saidas += item.saida;
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );

  const saldoTotal = dadosContasBancarias.reduce(
    (total, conta) => total + conta.saldo,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Saldo Total</p>
              <p className="text-2xl font-bold text-emerald-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(saldoTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Receitas (Mês)</p>
              <p className="text-2xl font-bold text-indigo-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.entradas)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Despesas (Mês)</p>
              <p className="text-2xl font-bold text-red-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.saidas)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Resultado (Mês)</p>
              <p className="text-2xl font-bold text-purple-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.entradas - totais.saidas)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Fluxo de Caixa</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosFluxoCaixa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="entrada"
                  stroke="#10B981"
                  name="Entradas"
                />
                <Line
                  type="monotone"
                  dataKey="saida"
                  stroke="#EF4444"
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribuição por Contas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição por Contas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosContasBancarias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="conta" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="saldo" fill="#8B5CF6" name="Saldo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categorias de Receitas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Categorias de Receitas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosCategoriasReceitas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosCategoriasReceitas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CORES_GRAFICOS[index % CORES_GRAFICOS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categorias de Despesas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Categorias de Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosCategoriasDespesas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosCategoriasDespesas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CORES_GRAFICOS[index % CORES_GRAFICOS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

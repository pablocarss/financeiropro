import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, AlertTriangleIcon, PiggyBankIcon, LineChartIcon } from "lucide-react";

export default function Insights() {
  const { calcularTotais, calcularTotaisPorCategoria, calcularTendencias } = useApp();
  const totais = calcularTotais();
  const totaisPorCategoria = calcularTotaisPorCategoria();
  const tendencias = calcularTendencias();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Encontrar categoria com maior lucro e prejuízo
  const maiorLucro = totaisPorCategoria.receitas[0] || { valor: 0 };
  const maiorPrejuizo = totaisPorCategoria.despesas[0] || { valor: 0 };

  // Calcular economia potencial (20% da maior despesa)
  const economiaPotencial = maiorPrejuizo.valor * 0.2;

  // Preparar dados para o gráfico
  const dadosGrafico = [
    {
      label: 'Mês Anterior',
      receitas: totais.receitasTotal - totais.receitasMesAtual,
      despesas: totais.despesasTotal - totais.despesasMesAtual,
    },
    {
      label: 'Mês Atual',
      receitas: totais.receitasMesAtual,
      despesas: totais.despesasMesAtual,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Insights Financeiros</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Receita</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatarMoeda(maiorLucro.valor)}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoria: {maiorLucro.nome || 'Nenhuma'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Despesa</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatarMoeda(maiorPrejuizo.valor)}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoria: {maiorPrejuizo.nome || 'Nenhuma'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Potencial</CardTitle>
            <PiggyBankIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(economiaPotencial)}
            </div>
            <p className="text-xs text-muted-foreground">
              Redução possível em {maiorPrejuizo.nome}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência</CardTitle>
            <TrendingUpIcon className={`h-4 w-4 ${tendencias.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${tendencias.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {tendencias.saldo >= 0 ? '+' : ''}{tendencias.saldo.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {tendencias.saldo >= 0 ? 'Crescimento' : 'Redução'} em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise Detalhada</TabsTrigger>
          <TabsTrigger value="reports">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Evolução Financeira</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Bar dataKey="receitas" name="Receitas" fill="#22c55e" />
                    <Bar dataKey="despesas" name="Despesas" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Alertas e Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maiorPrejuizo.valor > totais.receitasMesAtual * 0.5 && (
                    <div className="flex items-start gap-4">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Alto Gasto em Categoria</h4>
                        <p className="text-sm text-muted-foreground">
                          Suas despesas com "{maiorPrejuizo.nome}" representam mais de 50% das suas receitas.
                          Considere revisar seus gastos nesta categoria.
                        </p>
                      </div>
                    </div>
                  )}

                  {totais.saldoMesAtual > 0 && (
                    <div className="flex items-start gap-4">
                      <LineChartIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Oportunidade de Investimento</h4>
                        <p className="text-sm text-muted-foreground">
                          Você tem um saldo positivo de {formatarMoeda(totais.saldoMesAtual)}.
                          Considere investir o excedente para fazer seu dinheiro render mais.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <PiggyBankIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Meta de Economia</h4>
                      <p className="text-sm text-muted-foreground">
                        Reduzindo 20% dos gastos em "{maiorPrejuizo.nome}",
                        você poderia economizar {formatarMoeda(economiaPotencial)} por mês.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Análises detalhadas serão adicionadas aqui */}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Recomendações personalizadas serão adicionadas aqui */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

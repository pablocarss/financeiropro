import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react";

export default function Previsao() {
  const { calcularTotais, calcularTendencias } = useApp();
  const totais = calcularTotais();
  const tendencias = calcularTendencias();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcular previsões para os próximos 6 meses
  const calcularPrevisoes = () => {
    const hoje = new Date();
    const previsoes = [];

    for (let i = 0; i < 6; i++) {
      const mes = addMonths(startOfMonth(hoje), i);
      const fatorReceitas = Math.pow(1 + tendencias.receitas / 100, i);
      const fatorDespesas = Math.pow(1 + tendencias.despesas / 100, i);

      const receitasPrevistas = totais.receitasMesAtual * fatorReceitas;
      const despesasPrevistas = totais.despesasMesAtual * fatorDespesas;
      const saldoPrevisto = receitasPrevistas - despesasPrevistas;

      previsoes.push({
        mes: format(mes, 'MMMM yyyy', { locale: ptBR }),
        receitas: receitasPrevistas,
        despesas: despesasPrevistas,
        saldo: saldoPrevisto,
        variacao: i === 0 ? 0 : ((saldoPrevisto - previsoes[i-1].saldo) / Math.abs(previsoes[i-1].saldo)) * 100
      });
    }

    return previsoes;
  };

  const previsoes = calcularPrevisoes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Previsão Financeira</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão de Receitas</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatarMoeda(previsoes[previsoes.length - 1].receitas)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimativa para daqui a 6 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão de Despesas</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatarMoeda(previsoes[previsoes.length - 1].despesas)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimativa para daqui a 6 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Previsto</CardTitle>
            <TrendingUpIcon className={`h-4 w-4 ${previsoes[previsoes.length - 1].saldo >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${previsoes[previsoes.length - 1].saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatarMoeda(previsoes[previsoes.length - 1].saldo)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimativa para daqui a 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução Prevista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={previsoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Despesas</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previsoes.map((previsao, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {previsao.mes}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatarMoeda(previsao.receitas)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatarMoeda(previsao.despesas)}
                  </TableCell>
                  <TableCell className={`text-right ${previsao.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatarMoeda(previsao.saldo)}
                  </TableCell>
                  <TableCell className={`text-right ${previsao.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {previsao.variacao === 0 ? '-' : `${previsao.variacao >= 0 ? '+' : ''}${previsao.variacao.toFixed(1)}%`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

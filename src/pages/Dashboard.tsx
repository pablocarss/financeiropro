import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

export default function Dashboard() {
  const { lancamentos, categorias, contasBancarias } = useApp();
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [fluxoCaixa, setFluxoCaixa] = useState<Array<{ mes: string; receitas: number; despesas: number }>>([]);
  const [categoriasDespesas, setCategoriasDespesas] = useState<Array<{ nome: string; valor: number }>>([]);
  const [categoriasReceitas, setCategoriasReceitas] = useState<Array<{ nome: string; valor: number }>>([]);
  const [saldosPorConta, setSaldosPorConta] = useState<Array<{ nome: string; saldo: number }>>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [receitasMes, setReceitasMes] = useState(0);
  const [despesasMes, setDespesasMes] = useState(0);
  const [saldoMes, setSaldoMes] = useState(0);
  const [dadosSaldo, setDadosSaldo] = useState([]);
  const [dadosReceitas, setDadosReceitas] = useState([]);
  const [dadosDespesas, setDadosDespesas] = useState([]);
  const [dadosBalanco, setDadosBalanco] = useState([]);

  useEffect(() => {
    // Reseta todos os estados se não houver dados
    if (!Array.isArray(lancamentos) || !Array.isArray(categorias) || !Array.isArray(contasBancarias)) {
      setTotais({ receitas: 0, despesas: 0, saldo: 0 });
      setFluxoCaixa([]);
      setCategoriasDespesas([]);
      setCategoriasReceitas([]);
      setSaldosPorConta([]);
      setSaldoTotal(0);
      setReceitasMes(0);
      setDespesasMes(0);
      setSaldoMes(0);
      setDadosSaldo([]);
      setDadosReceitas([]);
      setDadosDespesas([]);
      setDadosBalanco([]);
      return;
    }

    // Calcula totais
    const totaisCalculados = lancamentos.reduce((acc, lancamento) => {
      const valor = Number(lancamento.valor) || 0;
      if (lancamento.tipo === 'entrada') {
        acc.receitas += valor;
      } else if (lancamento.tipo === 'saida') {
        acc.despesas += valor;
      }
      return acc;
    }, { receitas: 0, despesas: 0 });

    totaisCalculados.saldo = totaisCalculados.receitas - totaisCalculados.despesas;
    setTotais(totaisCalculados);

    // Calcula fluxo de caixa
    const fluxoPorMes = lancamentos.reduce((acc, lancamento) => {
      try {
        const data = new Date(lancamento.data);
        const mes = data.toLocaleString('pt-BR', { month: 'short' });
        const valor = Number(lancamento.valor) || 0;

        if (!acc[mes]) {
          acc[mes] = { mes, receitas: 0, despesas: 0 };
        }

        if (lancamento.tipo === 'entrada') {
          acc[mes].receitas += valor;
        } else if (lancamento.tipo === 'saida') {
          acc[mes].despesas += valor;
        }
      } catch (error) {
        console.error('Erro ao processar lançamento:', error);
      }
      return acc;
    }, {} as Record<string, { mes: string; receitas: number; despesas: number }>);

    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const fluxoOrdenado = Object.values(fluxoPorMes).sort((a, b) => 
      meses.indexOf(a.mes) - meses.indexOf(b.mes)
    );

    setFluxoCaixa(fluxoOrdenado);

    // Calcula saldos por conta
    const saldos = contasBancarias.map(conta => ({
      nome: conta.nome,
      saldo: lancamentos
        .filter(l => l.contaBancaria === conta.id)
        .reduce((acc, l) => {
          const valor = Number(l.valor) || 0;
          return l.tipo === 'entrada' ? acc + valor : acc - valor;
        }, Number(conta.saldoInicial) || 0)
    }));

    setSaldosPorConta(saldos);

    // Calcula categorias
    const categoriasAgrupadas = {
      receitas: {} as Record<string, number>,
      despesas: {} as Record<string, number>
    };

    lancamentos.forEach(lancamento => {
      const categoria = categorias.find(c => c.id === lancamento.categoria);
      if (!categoria) return;

      const tipo = lancamento.tipo === 'entrada' ? 'receitas' : 'despesas';
      const valor = Number(lancamento.valor) || 0;

      if (!categoriasAgrupadas[tipo][categoria.nome]) {
        categoriasAgrupadas[tipo][categoria.nome] = 0;
      }
      categoriasAgrupadas[tipo][categoria.nome] += valor;
    });

    const formatarCategorias = (dados: Record<string, number>) => 
      Object.entries(dados)
        .map(([nome, valor]) => ({ nome, valor }))
        .sort((a, b) => b.valor - a.valor);

    setCategoriasDespesas(formatarCategorias(categoriasAgrupadas.despesas));
    setCategoriasReceitas(formatarCategorias(categoriasAgrupadas.receitas));

    // Calcula saldo total
    const saldoTotalCalculado = saldos.reduce((acc, saldo) => acc + saldo.saldo, 0);
    setSaldoTotal(saldoTotalCalculado);

    // Calcula receitas e despesas do mês
    const dataAtual = new Date();
    const mesAtual = dataAtual.toLocaleString('pt-BR', { month: 'short' });
    const receitasMesCalculado = fluxoOrdenado.find(f => f.mes === mesAtual)?.receitas || 0;
    const despesasMesCalculado = fluxoOrdenado.find(f => f.mes === mesAtual)?.despesas || 0;
    setReceitasMes(receitasMesCalculado);
    setDespesasMes(despesasMesCalculado);

    // Calcula saldo do mês
    const saldoMesCalculado = receitasMesCalculado - despesasMesCalculado;
    setSaldoMes(saldoMesCalculado);

    // Calcula dados para gráficos
    const dadosSaldoCalculado = saldos.map(saldo => ({ x: saldo.nome, y: saldo.saldo }));
    const dadosReceitasCalculado = fluxoOrdenado.map(f => ({ x: f.mes, y: f.receitas }));
    const dadosDespesasCalculado = fluxoOrdenado.map(f => ({ x: f.mes, y: f.despesas }));
    const dadosBalancoCalculado = fluxoOrdenado.map(f => ({ x: f.mes, y: f.receitas - f.despesas }));
    setDadosSaldo(dadosSaldoCalculado);
    setDadosReceitas(dadosReceitasCalculado);
    setDadosDespesas(dadosDespesasCalculado);
    setDadosBalanco(dadosBalancoCalculado);

  }, [lancamentos, categorias, contasBancarias]);

  const formatarNumero = (numero: number) => {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Total</CardTitle>
            <CardDescription>Todas as contas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {formatarNumero(saldoTotal)}</div>
            <div className="mt-4 h-[60px]">
              <ResponsiveLine
                data={[
                  {
                    id: "saldo",
                    data: dadosSaldo
                  }
                ]}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                pointSize={4}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.15}
                colors={["#22c55e"]}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: "#777777",
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: "#777777",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#dddddd",
                      strokeWidth: 1,
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              + R$ {formatarNumero(receitasMes)}
            </div>
            <div className="mt-4 h-[60px]">
              <ResponsiveLine
                data={[
                  {
                    id: "receitas",
                    data: dadosReceitas
                  }
                ]}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 0, max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                pointSize={4}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.15}
                colors={["#22c55e"]}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: "#777777",
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: "#777777",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#dddddd",
                      strokeWidth: 1,
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
            <CardDescription>Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              - R$ {formatarNumero(despesasMes)}
            </div>
            <div className="mt-4 h-[60px]">
              <ResponsiveLine
                data={[
                  {
                    id: "despesas",
                    data: dadosDespesas
                  }
                ]}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 0, max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                pointSize={4}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.15}
                colors={["#ef4444"]}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: "#777777",
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: "#777777",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#dddddd",
                      strokeWidth: 1,
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balanço</CardTitle>
            <CardDescription>Mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={saldoMes > 0 ? "text-2xl font-bold text-emerald-500" : "text-2xl font-bold text-rose-500"}>
              {saldoMes > 0 ? "+" : "-"} R$ {formatarNumero(Math.abs(saldoMes))}
            </div>
            <div className="mt-4 h-[60px]">
              <ResponsiveLine
                data={[
                  {
                    id: "balanço",
                    data: dadosBalanco
                  }
                ]}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                pointSize={4}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableArea={true}
                areaOpacity={0.15}
                colors={[saldoMes > 0 ? "#22c55e" : "#ef4444"]}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: "#777777",
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      text: {
                        fontSize: 12,
                        fill: "#777777",
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: "#dddddd",
                      strokeWidth: 1,
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsivePie
                data={categoriasReceitas}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'greens' }}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#777777"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
                tooltip={({ datum }) => (
                  <div className="bg-white dark:bg-zinc-950 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <strong>{datum.id}</strong>: R$ {formatarNumero(datum.value)}
                  </div>
                )}
                theme={{
                  labels: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsivePie
                data={categoriasDespesas}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'reds' }}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#777777"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
                tooltip={({ datum }) => (
                  <div className="bg-white dark:bg-zinc-950 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <strong>{datum.id}</strong>: R$ {formatarNumero(datum.value)}
                  </div>
                )}
                theme={{
                  labels: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                  legends: {
                    text: {
                      fontSize: 12,
                      fill: "#777777",
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

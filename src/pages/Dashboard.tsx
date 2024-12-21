import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { useEffect, useState } from "react"
import { Tooltip } from "@/components/ui/tooltip"
import { ResponsivePie } from '@nivo/pie'

export default function Dashboard() {
  const { lancamentos, categorias, contasBancarias } = useApp()
  const [totais, setTotais] = useState({
    saldoTotal: 0,
    receitas: 0,
    despesas: 0,
    balanco: 0
  })

  const [dadosGraficoDespesas, setDadosGraficoDespesas] = useState([])
  const [dadosGraficoReceitas, setDadosGraficoReceitas] = useState([])

  useEffect(() => {
    if (!lancamentos?.length) return

    const calculoTotais = lancamentos.reduce((acc, lancamento) => {
      const valor = Number(lancamento.valor) || 0
      if (lancamento.tipo === 'entrada') {
        acc.receitas += valor
      } else {
        acc.despesas += valor
      }
      return acc
    }, {
      receitas: 0,
      despesas: 0
    })

    calculoTotais.balanco = calculoTotais.receitas - calculoTotais.despesas
    setTotais(calculoTotais)

    // Cálculo para os gráficos de pizza
    const despesasPorCategoria = {}
    const receitasPorCategoria = {}

    lancamentos.forEach(lancamento => {
      const categoria = categorias?.find(c => c.id === lancamento.categoria)?.nome || 'Sem categoria'
      const valor = Number(lancamento.valor) || 0

      if (lancamento.tipo === 'entrada') {
        receitasPorCategoria[categoria] = (receitasPorCategoria[categoria] || 0) + valor
      } else {
        despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + valor
      }
    })

    const formatarDadosGrafico = (dados) => {
      return Object.entries(dados).map(([categoria, valor]) => ({
        id: categoria,
        label: categoria,
        value: valor
      }))
    }

    setDadosGraficoDespesas(formatarDadosGrafico(despesasPorCategoria))
    setDadosGraficoReceitas(formatarDadosGrafico(receitasPorCategoria))

  }, [lancamentos, categorias])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Tooltip>
              <Tooltip content="Saldo total considerando todas as transações">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(totais.balanco)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <Tooltip>
              <Tooltip content="Total de receitas">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatarMoeda(totais.receitas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <Tooltip>
              <Tooltip content="Total de despesas">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatarMoeda(totais.despesas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balanço</CardTitle>
            <Tooltip>
              <Tooltip content="Diferença entre receitas e despesas">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totais.balanco >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatarMoeda(totais.balanco)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Receitas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {dadosGraficoReceitas.length > 0 ? (
              <ResponsivePie
                data={dadosGraficoReceitas}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'category10' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
                tooltip={({ datum }) => (
                  <div className="bg-background p-2 rounded-lg border">
                    <strong>{datum.label}:</strong> {formatarMoeda(datum.value)}
                  </div>
                )}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Nenhuma receita registrada
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {dadosGraficoDespesas.length > 0 ? (
              <ResponsivePie
                data={dadosGraficoDespesas}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'category10' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
                tooltip={({ datum }) => (
                  <div className="bg-background p-2 rounded-lg border">
                    <strong>{datum.label}:</strong> {formatarMoeda(datum.value)}
                  </div>
                )}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Nenhuma despesa registrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

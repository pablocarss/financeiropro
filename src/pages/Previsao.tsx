import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/contexts/AppContext"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveLine } from "@nivo/line"
import { addMonths, format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Previsao() {
  const { lancamentos } = useApp()
  const [periodo, setPeriodo] = useState("3")
  const [dadosHistoricos, setDadosHistoricos] = useState([])
  const [dadosPrevisao, setDadosPrevisao] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    grafico: []
  })

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  useEffect(() => {
    if (!lancamentos?.length) return

    // Organiza os dados históricos por mês
    const dadosPorMes = lancamentos.reduce((acc, lancamento) => {
      const data = new Date(lancamento.data)
      const mesAno = format(data, 'MM/yyyy')
      
      if (!acc[mesAno]) {
        acc[mesAno] = {
          mes: format(data, 'MMM/yy', { locale: ptBR }),
          receitas: 0,
          despesas: 0,
          data: data
        }
      }

      const valor = Number(lancamento.valor) || 0
      if (lancamento.tipo === 'entrada') {
        acc[mesAno].receitas += valor
      } else {
        acc[mesAno].despesas += valor
      }

      return acc
    }, {})

    // Converte para array e ordena por data
    const historicoOrdenado = Object.values(dadosPorMes)
      .sort((a: any, b: any) => a.data - b.data)
      .map((mes: any) => ({
        ...mes,
        saldo: mes.receitas - mes.despesas
      }))

    setDadosHistoricos(historicoOrdenado)

    // Calcula médias dos últimos 3 meses para previsão
    const ultimosMeses = historicoOrdenado.slice(-3)
    const mediaReceitas = ultimosMeses.reduce((acc, mes) => acc + mes.receitas, 0) / ultimosMeses.length
    const mediaDespesas = ultimosMeses.reduce((acc, mes) => acc + mes.despesas, 0) / ultimosMeses.length
    const mediaSaldo = mediaReceitas - mediaDespesas

    // Gera previsão para os próximos meses
    const numMesesPrevisao = Number(periodo)
    const ultimaData = historicoOrdenado[historicoOrdenado.length - 1]?.data || new Date()
    
    const previsao = Array.from({ length: numMesesPrevisao }, (_, i) => {
      const data = addMonths(ultimaData, i + 1)
      return {
        mes: format(data, 'MMM/yy', { locale: ptBR }),
        receitas: mediaReceitas,
        despesas: mediaDespesas,
        saldo: mediaSaldo,
        data: data
      }
    })

    setDadosPrevisao({
      receitas: mediaReceitas * numMesesPrevisao,
      despesas: mediaDespesas * numMesesPrevisao,
      saldo: mediaSaldo * numMesesPrevisao,
      grafico: [...historicoOrdenado, ...previsao]
    })

  }, [lancamentos, periodo])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Previsão Financeira</h1>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Próximos 3 meses</SelectItem>
            <SelectItem value="6">Próximos 6 meses</SelectItem>
            <SelectItem value="12">Próximos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Receitas Previstas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatarMoeda(dadosPrevisao.receitas)}
            </div>
            <p className="text-sm text-muted-foreground">
              Próximos {periodo} meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Despesas Previstas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatarMoeda(dadosPrevisao.despesas)}
            </div>
            <p className="text-sm text-muted-foreground">
              Próximos {periodo} meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saldo Previsto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dadosPrevisao.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatarMoeda(dadosPrevisao.saldo)}
            </div>
            <div className={`text-sm ${dadosPrevisao.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {dadosPrevisao.saldo >= 0 ? 'Lucro Previsto' : 'Prejuízo Previsto'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico e Projeção Financeira</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {dadosPrevisao.grafico.length > 0 ? (
            <ResponsiveLine
              data={[
                {
                  id: "Receitas",
                  color: "rgb(34, 197, 94)",
                  data: dadosPrevisao.grafico.map(d => ({
                    x: d.mes,
                    y: d.receitas
                  }))
                },
                {
                  id: "Despesas",
                  color: "rgb(239, 68, 68)",
                  data: dadosPrevisao.grafico.map(d => ({
                    x: d.mes,
                    y: d.despesas
                  }))
                },
                {
                  id: "Saldo",
                  color: "rgb(59, 130, 246)",
                  data: dadosPrevisao.grafico.map(d => ({
                    x: d.mes,
                    y: d.saldo
                  }))
                }
              ]}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              yFormat={value => formatarMoeda(Number(value))}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Meses',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Valores',
                legendOffset: -40,
                legendPosition: 'middle',
                format: value => formatarMoeda(Number(value))
              }}
              enablePoints={true}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              enableArea={true}
              areaOpacity={0.15}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              tooltip={({ point }) => (
                <div className="bg-background p-2 rounded-lg border">
                  <strong>{point.serieId}:</strong> {formatarMoeda(point.data.y)}
                </div>
              )}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Sem dados suficientes para gerar previsão
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

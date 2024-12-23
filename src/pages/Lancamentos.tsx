import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import { format } from "date-fns"
import { Plus, Receipt, Filter } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";
import { LancamentoCard } from "@/components/lancamentos/LancamentoCard";

export default function Lancamentos() {
  const { lancamentos, categorias, contasBancarias, formasPagamento, adicionarLancamento } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    categoria: 'todos',
    contaBancaria: 'todos',
    formaPagamento: 'todos',
    status: 'todos',
    dataInicial: '',
    dataFinal: ''
  });

  const [lancamentosFiltrados, setLancamentosFiltrados] = useState<typeof lancamentos>([]);

  // Função memoizada para aplicar filtros
  const aplicarFiltros = useCallback(() => {
    let resultado = [...lancamentos];

    // Filtro por tipo
    if (filtros.tipo && filtros.tipo !== 'todos') {
      resultado = resultado.filter(l => l.tipo === filtros.tipo);
    }

    // Filtro por categoria
    if (filtros.categoria && filtros.categoria !== 'todos') {
      resultado = resultado.filter(l => String(l.categoria) === filtros.categoria);
    }

    // Filtro por conta bancária
    if (filtros.contaBancaria && filtros.contaBancaria !== 'todos') {
      resultado = resultado.filter(l => String(l.contaBancaria) === filtros.contaBancaria);
    }

    // Filtro por forma de pagamento
    if (filtros.formaPagamento && filtros.formaPagamento !== 'todos') {
      resultado = resultado.filter(l => String(l.formaPagamento) === filtros.formaPagamento);
    }

    // Filtro por status
    if (filtros.status && filtros.status !== 'todos') {
      resultado = resultado.filter(l => l.status === filtros.status);
    }

    // Filtro por data inicial
    if (filtros.dataInicial) {
      const dataInicial = new Date(filtros.dataInicial);
      dataInicial.setHours(0, 0, 0, 0);
      resultado = resultado.filter(l => {
        const dataLancamento = new Date(l.data);
        return dataLancamento >= dataInicial;
      });
    }

    // Filtro por data final
    if (filtros.dataFinal) {
      const dataFinal = new Date(filtros.dataFinal);
      dataFinal.setHours(23, 59, 59, 999);
      resultado = resultado.filter(l => {
        const dataLancamento = new Date(l.data);
        return dataLancamento <= dataFinal;
      });
    }

    // Ordenar por data (mais recente primeiro)
    resultado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    setLancamentosFiltrados(resultado);
  }, [lancamentos, filtros]);

  // Atualiza os lançamentos filtrados quando os lançamentos ou filtros mudam
  useEffect(() => {
    aplicarFiltros();
  }, [lancamentos, filtros, aplicarFiltros]);

  // Inicializa os lançamentos filtrados quando a página carrega
  useEffect(() => {
    setLancamentosFiltrados([...lancamentos].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
  }, [lancamentos]);

  const limparFiltros = () => {
    setFiltros({
      tipo: 'todos',
      categoria: 'todos',
      contaBancaria: 'todos',
      formaPagamento: 'todos',
      status: 'todos',
      dataInicial: '',
      dataFinal: ''
    });
  };

  const calcularSaldoTotal = () => {
    let saldo = 0;
    lancamentosFiltrados.forEach(lancamento => {
      if (lancamento.tipo === 'entrada') {
        saldo += lancamento.valor;
      } else {
        saldo -= lancamento.valor;
      }
    });
    return saldo;
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [status, setStatus] = useState("recebido");
  const [data, setData] = useState<Date>(new Date());
  const [dataAberta, setDataAberta] = useState(false);

  useEffect(() => {
    if (categoria && categorias) {
      const categoriaObj = categorias.find(cat => cat.id === categoria)
      if (categoriaObj?.tipo) {
        setTipo(categoriaObj.tipo)
        // Reseta o status quando muda o tipo
        setStatus(categoriaObj.tipo === 'entrada' ? 'recebido' : 'pago')
      }
    }
  }, [categoria, categorias])

  useEffect(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataLancamento = new Date(data)
    dataLancamento.setHours(0, 0, 0, 0)

    if (dataLancamento < hoje) {
      // Data retroativa: só pode ser recebido ou pago
      setStatus(tipo === 'entrada' ? 'recebido' : 'pago')
    } else {
      // Data futura: mantém o status atual ou define o padrão
      setStatus(prev => {
        if (tipo === 'entrada') {
          return ['receber', 'recebido'].includes(prev) ? prev : 'receber'
        } else {
          return ['pagar', 'pago'].includes(prev) ? prev : 'pagar'
        }
      })
    }
  }, [data, tipo])

  const handleSubmit = async (continuar: boolean = false) => {
    if (!descricao || !valor || !categoria || !tipo || !status || !data) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios."
      })
      return
    }

    const novoLancamento = {
      descricao,
      valor: Number(valor),
      categoria: Number(categoria),
      tipo,
      status: status as 'pago' | 'a_pagar' | 'recebido' | 'a_receber',
      data: format(data, 'yyyy-MM-dd'),
      vencimento: format(data, 'yyyy-MM-dd'),
      competencia: format(data, 'yyyy-MM'),
      contaBancaria: 1, // Valor padrão por enquanto
      formaPagamento: 1, // Valor padrão por enquanto
      centroCusto: 1, // Valor padrão por enquanto
      recorrencia: {
        tipo: 'nao_repete'
      }
    }

    try {
      adicionarLancamento(novoLancamento)

      if (continuar) {
        // Limpa apenas os campos principais, mantém tipo e data
        setDescricao("")
        setValor("")
        setCategoria("")
      } else {
        // Fecha o modal e reseta tudo
        setIsModalOpen(false)
        resetForm()
      }

      toast({
        title: "Sucesso!",
        description: `Lançamento ${continuar ? 'salvo! Continue lançando.' : 'salvo com sucesso!'}`
      })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar o lançamento."
      })
    }
  };

  const resetForm = () => {
    setDescricao("")
    setValor("")
    setCategoria("")
    setTipo("entrada")
    setStatus("recebido")
    setData(new Date())
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Lançamentos</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-zinc-100">Filtros</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-zinc-300">Tipo</Label>
                  <Select value={filtros.tipo} onValueChange={value => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-zinc-300">Categoria</Label>
                  <Select value={filtros.categoria} onValueChange={value => setFiltros(prev => ({ ...prev, categoria: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {categorias.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-zinc-300">Conta Bancária</Label>
                  <Select value={filtros.contaBancaria} onValueChange={value => setFiltros(prev => ({ ...prev, contaBancaria: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {contasBancarias.map(conta => (
                        <SelectItem key={conta.id} value={conta.id.toString()}>
                          {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-zinc-300">Forma de Pagamento</Label>
                  <Select value={filtros.formaPagamento} onValueChange={value => setFiltros(prev => ({ ...prev, formaPagamento: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {formasPagamento.map(forma => (
                        <SelectItem key={forma.id} value={forma.id.toString()}>
                          {forma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-zinc-300">Status</Label>
                  <Select value={filtros.status} onValueChange={value => setFiltros(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="a_pagar">A Pagar</SelectItem>
                      <SelectItem value="recebido">Recebido</SelectItem>
                      <SelectItem value="a_receber">A Receber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-zinc-300">Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100"
                      >
                        {filtros.dataInicial ? (
                          format(new Date(filtros.dataInicial), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filtros.dataInicial ? new Date(filtros.dataInicial) : undefined}
                        onSelect={(date) => 
                          setFiltros(prev => ({ 
                            ...prev, 
                            dataInicial: date ? format(date, 'yyyy-MM-dd') : '' 
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-zinc-300">Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100"
                      >
                        {filtros.dataFinal ? (
                          format(new Date(filtros.dataFinal), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filtros.dataFinal ? new Date(filtros.dataFinal) : undefined}
                        onSelect={(date) => 
                          setFiltros(prev => ({ 
                            ...prev, 
                            dataFinal: date ? format(date, 'yyyy-MM-dd') : '' 
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={limparFiltros} className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
                    Limpar
                  </Button>
                  <Button onClick={() => setFiltroAberto(false)} className="bg-purple-600 hover:bg-purple-700">
                    Aplicar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="mt-8 mb-4 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Balanço Total</h3>
            <p className="text-sm text-muted-foreground">
              Baseado em todos os lançamentos
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${calcularSaldoTotal() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatarMoeda(calcularSaldoTotal())}
            </div>
            <div className={`text-sm ${calcularSaldoTotal() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {calcularSaldoTotal() >= 0 ? 'Lucro' : 'Prejuízo'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lancamentosFiltrados.map((lancamento) => (
          <LancamentoCard
            key={lancamento.id}
            lancamento={lancamento}
            onDelete={(id) => {
              // Implementar função de deletar
              console.log('Deletar lançamento:', id);
            }}
            onEdit={(id, dados) => {
              // Implementar função de editar
              console.log('Editar lançamento:', id, dados);
            }}
          />
        ))}
      </div>

      {lancamentosFiltrados.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum lançamento encontrado</p>
        </div>
      )}
      <NovoLancamentoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

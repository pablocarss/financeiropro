import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import { format } from "date-fns"
import { Plus, Receipt, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";

export default function Lancamentos() {
  const { lancamentos, categorias, contasBancarias, formasPagamento, adicionarLancamento } = useApp();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    contaBancaria: '',
    formaPagamento: '',
    status: '',
    dataInicial: '',
    dataFinal: ''
  });

  const [lancamentosFiltrados, setLancamentosFiltrados] = useState(lancamentos);

  useEffect(() => {
    aplicarFiltros();
  }, [lancamentos, filtros]);

  const aplicarFiltros = () => {
    let resultado = [...lancamentos];

    if (filtros.tipo) {
      resultado = resultado.filter(l => l.tipo === filtros.tipo);
    }
    if (filtros.categoria) {
      resultado = resultado.filter(l => l.categoria === Number(filtros.categoria));
    }
    if (filtros.contaBancaria) {
      resultado = resultado.filter(l => l.contaBancaria === Number(filtros.contaBancaria));
    }
    if (filtros.formaPagamento) {
      resultado = resultado.filter(l => l.formaPagamento === Number(filtros.formaPagamento));
    }
    if (filtros.status) {
      resultado = resultado.filter(l => l.status === filtros.status);
    }
    if (filtros.dataInicial) {
      resultado = resultado.filter(l => new Date(l.data) >= new Date(filtros.dataInicial));
    }
    if (filtros.dataFinal) {
      resultado = resultado.filter(l => new Date(l.data) <= new Date(filtros.dataFinal));
    }

    setLancamentosFiltrados(resultado);
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: '',
      categoria: '',
      contaBancaria: '',
      formaPagamento: '',
      status: '',
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Lançamentos</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFiltroAberto(true)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={tipo} 
                    onValueChange={(value) => {
                      setTipo(value)
                      setCategoria("")
                      if (data < new Date()) {
                        setStatus(value === 'entrada' ? 'recebido' : 'pago')
                      } else {
                        setStatus(value === 'entrada' ? 'receber' : 'pagar')
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias
                        ?.filter(cat => cat.tipo === tipo)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data < new Date() ? (
                        tipo === 'entrada' ? (
                          <SelectItem value="recebido">Recebido</SelectItem>
                        ) : (
                          <SelectItem value="pago">Pago</SelectItem>
                        )
                      ) : (
                        tipo === 'entrada' ? (
                          <>
                            <SelectItem value="receber">A Receber</SelectItem>
                            <SelectItem value="recebido">Recebido</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="pagar">A Pagar</SelectItem>
                            <SelectItem value="pago">Pago</SelectItem>
                          </>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {data ? (
                          format(data, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={data}
                        onSelect={(date) => setData(date || new Date())}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={() => handleSubmit(false)}
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                  <Button 
                    onClick={() => handleSubmit(true)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Salvar e Continuar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={filtroAberto} onOpenChange={setFiltroAberto}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <DialogTitle className="text-lg font-bold mb-4 text-zinc-100">Filtros</DialogTitle>
            
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300">Tipo</Label>
                <Select value={filtros.tipo} onValueChange={value => setFiltros(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
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
                    <SelectItem value="">Todas</SelectItem>
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
                    <SelectItem value="">Todas</SelectItem>
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
                    <SelectItem value="">Todas</SelectItem>
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
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="a_pagar">A Pagar</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Data Inicial</Label>
                <Input
                  type="date"
                  value={filtros.dataInicial}
                  onChange={e => setFiltros(prev => ({ ...prev, dataInicial: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Data Final</Label>
                <Input
                  type="date"
                  value={filtros.dataFinal}
                  onChange={e => setFiltros(prev => ({ ...prev, dataFinal: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={limparFiltros} className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
                  Limpar
                </Button>
                <Button onClick={() => setFiltroAberto(false)} className="bg-purple-600 hover:bg-purple-700">
                  Aplicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

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

      <div className="grid gap-4">
        {lancamentosFiltrados.map(lancamento => {
          const categoria = categorias.find(c => c.id === lancamento.categoria);
          const conta = contasBancarias.find(c => c.id === lancamento.contaBancaria);
          const formaPagamento = formasPagamento.find(f => f.id === lancamento.formaPagamento);

          return (
            <div
              key={lancamento.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{lancamento.descricao}</p>
                  <p className="text-sm text-muted-foreground">
                    {categoria?.nome} • {conta?.nome} • {formaPagamento?.nome} • {format(new Date(lancamento.data), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {lancamento.tipo === 'entrada' ? 
                      (lancamento.status === 'receber' ? 'A Receber' : 'Recebido') :
                      (lancamento.status === 'pagar' ? 'A Pagar' : 'Pago')
                    }
                  </p>
                </div>
              </div>
              <div className={`text-right ${lancamento.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                <p className="font-medium">
                  {lancamento.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(lancamento.valor)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

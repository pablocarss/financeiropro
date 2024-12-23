import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { NumericFormat } from 'react-number-format';

interface NovoLancamentoModalProps {
  open: boolean
  onClose: () => void
  lancamentoParaEditar?: any
}

interface Categoria {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
}

export function NovoLancamentoModal({ open, onClose, lancamentoParaEditar }: NovoLancamentoModalProps) {
  const { toast } = useToast()
  const {
    categorias,
    contasBancarias,
    formasPagamento,
    centrosCusto,
    tiposDocumento,
    clientesPF,
    clientesPJ,
    adicionarLancamento,
    editarLancamento
  } = useApp()

  const [selectedDate, setSelectedDate] = useState<Date>(lancamentoParaEditar?.data ? new Date(lancamentoParaEditar.data) : new Date())
  const [vencimento, setVencimento] = useState<Date>(lancamentoParaEditar?.vencimento ? new Date(lancamentoParaEditar.vencimento) : new Date())
  const [competencia, setCompetencia] = useState(lancamentoParaEditar?.competencia || format(new Date(), 'yyyy-MM'))
  const [descricao, setDescricao] = useState(lancamentoParaEditar?.descricao || "")
  const [valor, setValor] = useState(lancamentoParaEditar?.valor?.toString() || "")
  const [categoria, setCategoria] = useState(lancamentoParaEditar?.categoria?.toString() || "")
  const [contaBancaria, setContaBancaria] = useState(lancamentoParaEditar?.contaBancaria?.toString() || "")
  const [formaPagamento, setFormaPagamento] = useState(lancamentoParaEditar?.formaPagamento?.toString() || "")
  const [centroCusto, setCentroCusto] = useState(lancamentoParaEditar?.centroCusto?.toString() || "")
  const [tipoDocumento, setTipoDocumento] = useState(lancamentoParaEditar?.tipoDocumento?.toString() || "")
  const [numeroDocumento, setNumeroDocumento] = useState(lancamentoParaEditar?.numeroDocumento || "")
  const [observacoes, setObservacoes] = useState(lancamentoParaEditar?.observacoes || "")
  const [anexos, setAnexos] = useState<File[]>(lancamentoParaEditar?.anexos || [])
  const [recorrencia, setRecorrencia] = useState(lancamentoParaEditar?.recorrencia?.tipo || 'nao_repete')
  const [recorrenciaQtd, setRecorrenciaQtd] = useState(lancamentoParaEditar?.recorrencia?.qtd || '')
  const [status, setStatus] = useState(lancamentoParaEditar?.status || 'a_pagar')
  const [tipoSelecionado, setTipoSelecionado] = useState<'receita' | 'despesa'>(lancamentoParaEditar?.tipo === 'entrada' ? 'receita' : 'despesa')
  const [clientePF, setClientePF] = useState(lancamentoParaEditar?.clientePF?.toString() || "")
  const [clientePJ, setClientePJ] = useState(lancamentoParaEditar?.clientePJ?.toString() || "")

  // Função para filtrar categorias baseado no tipo selecionado
  const categoriasFiltradas = categorias.filter(cat => {
    if (tipoSelecionado === 'receita') {
      return cat.tipo === 'entrada';
    } else {
      return cat.tipo === 'saida';
    }
  });

  // Atualizar tipo quando mudar o status
  useEffect(() => {
    if (status === 'a_pagar' || status === 'pago') {
      setTipoSelecionado('despesa');
    } else if (status === 'a_receber' || status === 'recebido') {
      setTipoSelecionado('receita');
    }
  }, [status]);

  // Atualizar status quando mudar a data
  useEffect(() => {
    const isDataPassada = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
    
    if (isDataPassada) {
      if (tipoSelecionado === 'receita') {
        setStatus('recebido');
      } else {
        setStatus('pago');
      }
    } else {
      if (tipoSelecionado === 'receita') {
        setStatus('a_receber');
      } else {
        setStatus('a_pagar');
      }
    }
  }, [selectedDate, tipoSelecionado]);

  // Opções de status baseadas no tipo e data
  const getOpcoesStatus = () => {
    const isDataPassada = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
    
    if (isDataPassada) {
      return tipoSelecionado === 'receita'
        ? [{ value: 'recebido', label: 'Recebido' }]
        : [{ value: 'pago', label: 'Pago' }];
    }
    
    return tipoSelecionado === 'receita'
      ? [
          { value: 'a_receber', label: 'A Receber' },
          { value: 'recebido', label: 'Recebido' }
        ]
      : [
          { value: 'a_pagar', label: 'A Pagar' },
          { value: 'pago', label: 'Pago' }
        ];
  };

  useEffect(() => {
    if (!open) {
      // Reset form when modal is closed
      setSelectedDate(new Date())
      setVencimento(new Date())
      setCompetencia(format(new Date(), 'yyyy-MM'))
      setDescricao("")
      setValor("")
      setCategoria("")
      setContaBancaria("")
      setFormaPagamento("")
      setCentroCusto("")
      setTipoDocumento("")
      setNumeroDocumento("")
      setObservacoes("")
      setAnexos([])
      setRecorrencia("none")
      setRecorrenciaQtd('')
      setStatus('a_pagar')
      setTipoSelecionado('despesa')
      setClientePF("")
      setClientePJ("")
    }
  }, [open])

  const handleSubmit = (continuar = false) => {
    // Validação dos campos obrigatórios
    const camposFaltando = [];
    
    if (!descricao.trim()) camposFaltando.push('Descrição');
    if (!valor || Number(valor) <= 0) camposFaltando.push('Valor');
    if (!categoria) camposFaltando.push('Categoria');
    if (!formaPagamento) camposFaltando.push('Forma de Pagamento');
    if (!contaBancaria) camposFaltando.push('Conta Bancária');
    if (!centroCusto) camposFaltando.push('Centro de Custo');
    
    if (camposFaltando.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Por favor, preencha os seguintes campos: ${camposFaltando.join(', ')}`
      });
      return;
    }

    const categoriaObj = categorias.find(c => c.id === categoria);
    if (!categoriaObj) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Categoria inválida."
      });
      return;
    }

    const novoLancamento = {
      descricao,
      valor: Number(valor),
      tipo: tipoSelecionado,
      data: format(selectedDate, 'yyyy-MM-dd'),
      vencimento: format(vencimento, 'yyyy-MM-dd'),
      competencia: competencia || format(selectedDate, 'yyyy-MM'),
      categoria: Number(categoria),
      contaBancaria: Number(contaBancaria),
      formaPagamento: Number(formaPagamento),
      centroCusto: Number(centroCusto),
      status: status as 'pago' | 'a_pagar' | 'recebido' | 'a_receber',
      tipoDocumento: tipoDocumento ? Number(tipoDocumento) : undefined,
      numeroDocumento,
      observacoes,
      anexos: anexos.map(file => file.name), // Por enquanto só salvamos os nomes
      recorrencia: {
        tipo: recorrencia || 'nao_repete',
        qtd: recorrenciaQtd || undefined,
      },
      clientePF,
      clientePJ
    };

    try {
      if (lancamentoParaEditar) {
        editarLancamento(lancamentoParaEditar.id, novoLancamento);
      } else {
        // Criar lançamentos recorrentes
        if (recorrencia === 'mensal' && recorrenciaQtd) {
          const qtdMeses = parseInt(recorrenciaQtd);
          for (let i = 0; i < qtdMeses; i++) {
            const dataLancamento = new Date(selectedDate);
            dataLancamento.setMonth(dataLancamento.getMonth() + i);
            
            const lancamentoRecorrente = {
              ...novoLancamento,
              data: format(dataLancamento, 'yyyy-MM-dd'),
              vencimento: format(dataLancamento, 'yyyy-MM-dd'),
              competencia: format(dataLancamento, 'yyyy-MM'),
            };
            
            adicionarLancamento(lancamentoRecorrente);
          }
        } else {
          adicionarLancamento(novoLancamento);
        }
      }

      toast({
        title: "Sucesso",
        description: "Lançamento salvo com sucesso!"
      });

      if (!continuar) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar o lançamento."
      });
    }
  };

  // Atualizar status baseado no tipo selecionado
  useEffect(() => {
    if (tipoSelecionado === 'receita') {
      setStatus(selectedDate < new Date() ? 'recebido' : 'a_receber');
    } else {
      setStatus(selectedDate < new Date() ? 'pago' : 'a_pagar');
    }
  }, [tipoSelecionado, selectedDate]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {lancamentoParaEditar ? 'Editar Lançamento' : 'Novo Lançamento'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="principal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="principal" className="text-sm">Principal</TabsTrigger>
            <TabsTrigger value="detalhes" className="text-sm">Detalhes</TabsTrigger>
            <TabsTrigger value="recorrencia" className="text-sm">Recorrência</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <Label className="text-sm">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2 text-sm">
                <Label className="text-sm">Vencimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(vencimento, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={vencimento}
                      onSelect={(date) => date && setVencimento(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Competência</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(parse(competencia, 'yyyy-MM', new Date()), "MMMM 'de' yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parse(competencia, 'yyyy-MM', new Date())}
                    onSelect={(date) => date && setCompetencia(format(date, 'yyyy-MM'))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Valor</Label>
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
                value={valor}
                onValueChange={(values) => {
                  setValor(values.value);
                }}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Descrição</Label>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição do lançamento"
              />
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={tipoSelecionado}
                    onValueChange={(value: 'receita' | 'despesa') => {
                      setTipoSelecionado(value);
                      setCategoria(''); // Limpa a categoria ao mudar o tipo
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOpcoesStatus().map(opcao => (
                        <SelectItem key={opcao.value} value={opcao.value}>
                          {opcao.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <Label className="text-sm">Categoria</Label>
                <Select
                  value={categoria}
                  onValueChange={setCategoria}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasFiltradas.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Cliente PF</Label>
                  <Select value={clientePF} onValueChange={setClientePF}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente PF" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientesPF.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Cliente PJ</Label>
                  <Select value={clientePJ} onValueChange={setClientePJ}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente PJ" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientesPJ.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Conta Bancária</Label>
                  <Select
                    value={contaBancaria}
                    onValueChange={setContaBancaria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {contasBancarias.map((conta) => (
                        <SelectItem key={conta.id} value={conta.id.toString()}>
                          {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 text-sm">
                  <Label className="text-sm">Forma de Pagamento</Label>
                  <Select
                    value={formaPagamento}
                    onValueChange={setFormaPagamento}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPagamento.map((forma) => (
                        <SelectItem key={forma.id} value={forma.id.toString()}>
                          {forma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <Label className="text-sm">Centro de Custo</Label>
                <Select
                  value={centroCusto}
                  onValueChange={setCentroCusto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o centro de custo" />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosCusto.map((centro) => (
                      <SelectItem key={centro.id} value={centro.id.toString()}>
                        {centro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <Label className="text-sm">Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-sm">
                <Label className="text-sm">Número do Documento</Label>
                <Input
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  placeholder="Número/Identificação"
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Observações</Label>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
              />
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Comprovante</Label>
              <div className="border rounded-md p-4 bg-background hover:bg-accent/50 transition-colors cursor-pointer">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setAnexos(Array.from(e.target.files))
                      }
                    }} 
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16.5V7.5M8 11.5L12 7.5L16 11.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Clique para anexar ou arraste arquivos</span>
                  </div>
                </label>
                {anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Arquivos selecionados:</p>
                    <ul className="space-y-2">
                      {anexos.map((file, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm bg-accent/50 rounded-md p-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 21C5.89543 21 5 20.1046 5 19V3C5 1.89543 5.89543 1 7 1H14L19 6V19C19 20.1046 18.1046 21 17 21H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 1V7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma.id} value={forma.id.toString()}>
                      {forma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-sm">
              <Label className="text-sm">Centro de Custo</Label>
              <Select value={centroCusto} onValueChange={setCentroCusto}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o centro de custo" />
                </SelectTrigger>
                <SelectContent>
                  {centrosCusto.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id.toString()}>
                      {centro.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="recorrencia" className="space-y-4 mt-0">
            <div className="space-y-2 text-sm">
              <Label className="text-sm">Tipo de Recorrência</Label>
              <Select value={recorrencia} onValueChange={setRecorrencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_repete">Não Repete</SelectItem>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recorrencia !== "nao_repete" && (
              <div className="space-y-2 text-sm">
                <Label className="text-sm">Quantidade de Repetições</Label>
                <Input
                  type="number"
                  min="1"
                  value={recorrenciaQtd}
                  onChange={(e) => setRecorrenciaQtd(e.target.value)}
                  placeholder="Quantas vezes irá repetir?"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <Check className="mr-2 h-4 w-4" />
            Salvar e Continuar
          </Button>
          <Button onClick={() => handleSubmit(false)}>
            <Check className="mr-2 h-4 w-4" />
            {lancamentoParaEditar ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

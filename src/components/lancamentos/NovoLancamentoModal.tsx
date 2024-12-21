import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useApp } from "@/contexts/AppContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NovoLancamentoModalProps {
  open: boolean
  onClose: () => void
  lancamentoParaEditar?: any
}

export function NovoLancamentoModal({ open, onClose, lancamentoParaEditar }: NovoLancamentoModalProps) {
  const {
    categorias,
    contasBancarias,
    formasPagamento,
    centrosCusto,
    tiposDocumento,
    criarLancamento,
    editarLancamento
  } = useApp()

  const [selectedDate, setSelectedDate] = useState(lancamentoParaEditar?.data ? new Date(lancamentoParaEditar.data) : new Date())
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
  const [recorrenciaEndDate, setRecorrenciaEndDate] = useState(lancamentoParaEditar?.recorrencia?.periodicidade ? new Date(lancamentoParaEditar.recorrencia.periodicidade) : null)

  useEffect(() => {
    if (!open) {
      // Reset form when modal is closed
      setSelectedDate(new Date())
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
      setRecorrenciaEndDate(null)
    }
  }, [open])

  const handleSave = () => {
    const lancamento = {
      descricao,
      valor: Number(valor),
      data: selectedDate.toISOString(),
      categoria: Number(categoria),
      contaBancaria: Number(contaBancaria),
      formaPagamento: Number(formaPagamento),
      centroCusto: Number(centroCusto),
      tipoDocumento: Number(tipoDocumento),
      numeroDocumento,
      observacoes,
      anexos,
      recorrencia: {
        tipo: recorrencia,
        periodicidade: recorrenciaEndDate?.toISOString() || null,
      },
    }

    if (lancamentoParaEditar) {
      editarLancamento(lancamentoParaEditar.id, lancamento)
    } else {
      criarLancamento(lancamento)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{lancamentoParaEditar ? 'Editar Lançamento' : 'Novo Lançamento'}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <Tabs defaultValue="principal" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="recorrencia">Recorrência</TabsTrigger>
            </TabsList>

            <TabsContent value="principal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP", { locale: ptBR })}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição do lançamento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Select value={contaBancaria} onValueChange={setContaBancaria}>
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
              </div>
            </TabsContent>

            <TabsContent value="detalhes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais"
                />
              </div>

              <div className="space-y-2">
                <Label>Anexos</Label>
                <div className="border rounded-md p-4">
                  <input type="file" multiple onChange={(e) => {
                    if (e.target.files) {
                      setAnexos(Array.from(e.target.files))
                    }
                  }} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
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

              <div className="space-y-2">
                <Label>Centro de Custo</Label>
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

              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
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

              <div className="space-y-2">
                <Label>Número do Documento</Label>
                <Input
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  placeholder="Digite o número do documento"
                />
              </div>
            </TabsContent>

            <TabsContent value="recorrencia" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Tipo de Recorrência</Label>
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
                <div className="space-y-2">
                  <Label>Data Final da Recorrência</Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recorrenciaEndDate
                        ? format(recorrenciaEndDate, "PPP", { locale: ptBR })
                        : "Selecione a data final"}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            {lancamentoParaEditar ? 'Salvar Alterações' : 'Criar Lançamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

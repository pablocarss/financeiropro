import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NovoLancamentoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (lancamento: any) => void;
  categorias: Array<{ id: number; nome: string; tipo: string }>;
  contasBancarias: Array<{ id: number; nome: string }>;
  formasPagamento: Array<{ id: number; nome: string }>;
}

export function NovoLancamentoModal({ 
  open, 
  onClose, 
  onSubmit,
  categorias,
  contasBancarias,
  formasPagamento
}: NovoLancamentoModalProps) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState<Date>(new Date());
  const [vencimento, setVencimento] = useState<Date>(new Date());
  const [competencia, setCompetencia] = useState<Date>(new Date());
  const [categoria, setCategoria] = useState("");
  const [contaBancaria, setContaBancaria] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determina o status com base no tipo e nas datas
    let status;
    const hoje = new Date();
    if (tipo === "entrada") {
      status = data <= hoje ? "recebido" : "a_receber";
    } else {
      status = data <= hoje ? "pago" : "a_pagar";
    }

    onSubmit({
      descricao,
      valor: Number(valor),
      tipo,
      data: data.toISOString(),
      vencimento: vencimento.toISOString(),
      competencia: competencia.toISOString(),
      categoria,
      contaBancaria,
      formaPagamento,
      status,
      numeroDocumento,
      comprovante
    });

    // Limpa o formulário
    setDescricao("");
    setValor("");
    setTipo("entrada");
    setData(new Date());
    setVencimento(new Date());
    setCompetencia(new Date());
    setCategoria("");
    setContaBancaria("");
    setFormaPagamento("");
    setNumeroDocumento("");
    setComprovante(null);
  };

  const categoriasFiltradas = categorias.filter(cat => cat.tipo === tipo);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipo === "entrada" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTipo("entrada")}
            >
              Entrada
            </Button>
            <Button
              type="button"
              variant={tipo === "saida" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTipo("saida")}
            >
              Saída
            </Button>
          </div>

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
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Data do Lançamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={(date) => date && setData(date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !vencimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vencimento ? format(vencimento, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={vencimento}
                    onSelect={(date) => date && setVencimento(date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Competência</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !competencia && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {competencia ? format(competencia, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={competencia}
                    onSelect={(date) => date && setCompetencia(date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriasFiltradas.map((cat) => (
                  <SelectItem key={cat.id} value={cat.nome}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Conta Bancária</Label>
            <Select value={contaBancaria} onValueChange={setContaBancaria} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {contasBancarias.map((conta) => (
                  <SelectItem key={conta.id} value={conta.nome}>
                    {conta.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select value={formaPagamento} onValueChange={setFormaPagamento} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {formasPagamento.map((forma) => (
                  <SelectItem key={forma.id} value={forma.nome}>
                    {forma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">Número do Documento</Label>
            <Input
              id="numeroDocumento"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprovante">Comprovante</Label>
            <Input
              id="comprovante"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setComprovante(file);
              }}
              accept="image/*,.pdf"
            />
          </div>

          <Button type="submit" className="w-full">
            Criar Lançamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

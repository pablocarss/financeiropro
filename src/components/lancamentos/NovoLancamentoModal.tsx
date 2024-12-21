import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface NovoLancamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (lancamento: {
    descricao: string;
    valor: number;
    tipo: "entrada" | "saida";
    data: string;
    categoria: string;
    contaBancaria: string;
    formaPagamento: string;
  }) => void;
}

export function NovoLancamentoModal({
  open,
  onOpenChange,
  onSubmit,
}: NovoLancamentoModalProps) {
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
    categoria: "",
    contaBancaria: "",
    formaPagamento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      valor: Number(formData.valor),
      tipo,
    });
    setFormData({
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0],
      categoria: "",
      contaBancaria: "",
      formaPagamento: "",
    });
    setTipo("entrada");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gradient-card border-purple-500/20">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={tipo === "entrada" ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                tipo === "entrada"
                  ? "bg-green-500 hover:bg-green-600"
                  : "hover:border-green-500 hover:text-green-500"
              }`}
              onClick={() => setTipo("entrada")}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Entrada
            </Button>
            <Button
              type="button"
              variant={tipo === "saida" ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                tipo === "saida"
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:border-red-500 hover:text-red-500"
              }`}
              onClick={() => setTipo("saida")}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Saída
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="contaBancaria">Conta Bancária</Label>
              <Input
                id="contaBancaria"
                value={formData.contaBancaria}
                onChange={(e) =>
                  setFormData({ ...formData, contaBancaria: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Input
                id="formaPagamento"
                value={formData.formaPagamento}
                onChange={(e) =>
                  setFormData({ ...formData, formaPagamento: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NovoLancamentoModalProps {
  aberto: boolean;
  onClose: () => void;
  onSave: (lancamento: {
    descricao: string;
    valor: number;
    tipo: "entrada" | "saida";
    data: string;
    categoria: string;
    contaBancaria: string;
    formaPagamento: string;
  }) => void;
}

export function NovoLancamentoModal({ aberto, onClose, onSave }: NovoLancamentoModalProps) {
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    tipo: "entrada",
    data: new Date().toISOString().split("T")[0],
    categoria: "",
    contaBancaria: "",
    formaPagamento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      valor: Number(form.valor),
      tipo: form.tipo as "entrada" | "saida",
    });
    setForm({
      descricao: "",
      valor: "",
      tipo: "entrada",
      data: new Date().toISOString().split("T")[0],
      categoria: "",
      contaBancaria: "",
      formaPagamento: "",
    });
  };

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-white">Descrição</Label>
            <Input
              id="descricao"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-white">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data" className="text-white">Data</Label>
              <Input
                id="data"
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-white">Tipo</Label>
            <Select
              value={form.tipo}
              onValueChange={(value) => setForm({ ...form, tipo: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-purple-500/20">
                <SelectItem value="entrada" className="text-white">Entrada</SelectItem>
                <SelectItem value="saida" className="text-white">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-white">Categoria</Label>
            <Select
              value={form.categoria}
              onValueChange={(value) => setForm({ ...form, categoria: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-purple-500/20">
                <SelectItem value="salario" className="text-white">Salário</SelectItem>
                <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                <SelectItem value="servicos" className="text-white">Serviços</SelectItem>
                <SelectItem value="despesas" className="text-white">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contaBancaria" className="text-white">Conta Bancária</Label>
              <Select
                value={form.contaBancaria}
                onValueChange={(value) => setForm({ ...form, contaBancaria: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-500/20">
                  <SelectItem value="nubank" className="text-white">Nubank</SelectItem>
                  <SelectItem value="itau" className="text-white">Itaú</SelectItem>
                  <SelectItem value="bradesco" className="text-white">Bradesco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaPagamento" className="text-white">Forma de Pagamento</Label>
              <Select
                value={form.formaPagamento}
                onValueChange={(value) => setForm({ ...form, formaPagamento: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-500/20">
                  <SelectItem value="pix" className="text-white">PIX</SelectItem>
                  <SelectItem value="credito" className="text-white">Cartão de Crédito</SelectItem>
                  <SelectItem value="debito" className="text-white">Cartão de Débito</SelectItem>
                  <SelectItem value="dinheiro" className="text-white">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-500/20 text-white hover:bg-purple-500/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

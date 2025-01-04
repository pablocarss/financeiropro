import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

interface NovoCartaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoCartaoModal({ isOpen, onClose }: NovoCartaoModalProps) {
  const { adicionarCartao } = useApp();
  const [formData, setFormData] = useState({
    nome: "",
    bandeira: "",
    limite: "",
    diaFechamento: "",
    diaVencimento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarCartao({
      ...formData,
      limite: parseFloat(formData.limite),
      diaFechamento: parseInt(formData.diaFechamento),
      diaVencimento: parseInt(formData.diaVencimento),
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão de Crédito</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cartão</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Nubank Principal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bandeira">Bandeira</Label>
            <Input
              id="bandeira"
              name="bandeira"
              value={formData.bandeira}
              onChange={handleChange}
              placeholder="Ex: Mastercard"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limite">Limite</Label>
            <Input
              id="limite"
              name="limite"
              type="number"
              value={formData.limite}
              onChange={handleChange}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diaFechamento">Dia do Fechamento</Label>
              <Input
                id="diaFechamento"
                name="diaFechamento"
                type="number"
                min="1"
                max="31"
                value={formData.diaFechamento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaVencimento">Dia do Vencimento</Label>
              <Input
                id="diaVencimento"
                name="diaVencimento"
                type="number"
                min="1"
                max="31"
                value={formData.diaVencimento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

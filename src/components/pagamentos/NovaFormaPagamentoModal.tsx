import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NovaFormaPagamentoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function NovaFormaPagamentoModal({
  open,
  onClose,
  onSubmit,
}: NovaFormaPagamentoModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-zinc-950 rounded-2xl border border-zinc-800 w-full max-w-md shadow-xl">
          <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-zinc-100">
                Nova Forma de Pagamento
              </Dialog.Title>
              <Dialog.Close className="text-zinc-400 hover:text-zinc-100">
                <X className="size-6" />
              </Dialog.Close>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 bg-emerald-600 text-white font-medium hover:bg-emerald-700"
              >
                Cadastrar
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

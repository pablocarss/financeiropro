import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Pencil, Trash } from "lucide-react";

interface NovaFormaPagamentoModalProps {
  open: boolean;
  onClose: () => void;
  formaParaEditar?: {
    id: number;
    nome: string;
  };
}

function NovaFormaPagamentoModal({ open, onClose, formaParaEditar }: NovaFormaPagamentoModalProps) {
  const { adicionarFormaPagamento, editarFormaPagamento } = useApp();
  const [nome, setNome] = useState(formaParaEditar?.nome || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formaParaEditar) {
      editarFormaPagamento(formaParaEditar.id, { nome });
    } else {
      adicionarFormaPagamento({ nome });
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            {formaParaEditar ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome da forma de pagamento"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {formaParaEditar ? 'Salvar Alterações' : 'Criar Forma de Pagamento'}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function FormasPagamento() {
  const { formasPagamento, removerFormaPagamento } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formaParaEditar, setFormaParaEditar] = useState<{
    id: number;
    nome: string;
  } | undefined>();

  const handleEditar = (forma: typeof formaParaEditar) => {
    setFormaParaEditar(forma);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setFormaParaEditar(undefined);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Formas de Pagamento</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Forma de Pagamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formasPagamento.map(forma => (
          <Card key={forma.id} className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-zinc-100">{forma.nome}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditar(forma)}
                  className="hover:bg-zinc-800"
                >
                  <Pencil className="w-4 h-4 text-zinc-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerFormaPagamento(forma.id)}
                  className="hover:bg-zinc-800"
                >
                  <Trash className="w-4 h-4 text-zinc-400" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NovaFormaPagamentoModal
        open={isModalOpen}
        onClose={handleFecharModal}
        formaParaEditar={formaParaEditar}
      />
    </div>
  );
}

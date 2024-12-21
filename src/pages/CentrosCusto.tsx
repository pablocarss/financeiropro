import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Pencil, Trash } from "lucide-react";

interface NovoCentroCustoModalProps {
  open: boolean;
  onClose: () => void;
  centroParaEditar?: {
    id: number;
    nome: string;
  };
}

function NovoCentroCustoModal({ open, onClose, centroParaEditar }: NovoCentroCustoModalProps) {
  const { adicionarCentroCusto, editarCentroCusto } = useApp();
  const [nome, setNome] = useState(centroParaEditar?.nome || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (centroParaEditar) {
      editarCentroCusto(centroParaEditar.id, { nome });
    } else {
      adicionarCentroCusto({ nome });
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            {centroParaEditar ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do centro de custo"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {centroParaEditar ? 'Salvar Alterações' : 'Criar Centro de Custo'}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function CentrosCusto() {
  const { centrosCusto, removerCentroCusto } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [centroParaEditar, setCentroParaEditar] = useState<{
    id: number;
    nome: string;
  } | undefined>();

  const handleEditar = (centro: typeof centroParaEditar) => {
    setCentroParaEditar(centro);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setCentroParaEditar(undefined);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Centros de Custo</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Centro de Custo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {centrosCusto.map(centro => (
          <Card key={centro.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{centro.nome}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditar(centro)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerCentroCusto(centro.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NovoCentroCustoModal
        open={isModalOpen}
        onClose={handleFecharModal}
        centroParaEditar={centroParaEditar}
      />
    </div>
  );
}

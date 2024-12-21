import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Pencil, Trash } from "lucide-react";

interface NovoTipoDocumentoModalProps {
  open: boolean;
  onClose: () => void;
  tipoParaEditar?: {
    id: number;
    nome: string;
  };
}

function NovoTipoDocumentoModal({ open, onClose, tipoParaEditar }: NovoTipoDocumentoModalProps) {
  const { adicionarTipoDocumento, editarTipoDocumento } = useApp();
  const [nome, setNome] = useState(tipoParaEditar?.nome || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoParaEditar) {
      editarTipoDocumento(tipoParaEditar.id, { nome });
    } else {
      adicionarTipoDocumento({ nome });
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            {tipoParaEditar ? 'Editar Tipo de Documento' : 'Novo Tipo de Documento'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do tipo de documento"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {tipoParaEditar ? 'Salvar Alterações' : 'Criar Tipo de Documento'}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function TiposDocumento() {
  const { tiposDocumento, removerTipoDocumento } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoParaEditar, setTipoParaEditar] = useState<{
    id: number;
    nome: string;
  } | undefined>();

  const handleEditar = (tipo: typeof tipoParaEditar) => {
    setTipoParaEditar(tipo);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setTipoParaEditar(undefined);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tipos de Documento</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tipo de Documento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiposDocumento.map(tipo => (
          <Card key={tipo.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{tipo.nome}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditar(tipo)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerTipoDocumento(tipo.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NovoTipoDocumentoModal
        open={isModalOpen}
        onClose={handleFecharModal}
        tipoParaEditar={tipoParaEditar}
      />
    </div>
  );
}

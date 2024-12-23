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
    setNome('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg w-full max-w-md border">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {tipoParaEditar ? 'Editar Tipo de Documento' : 'Novo Tipo de Documento'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do tipo de documento"
                className="w-full"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {tipoParaEditar ? 'Salvar Alterações' : 'Criar'}
              </Button>
            </div>
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tipos de Documento</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Documento
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tiposDocumento.map(tipo => (
              <Card key={tipo.id} className="p-4 bg-background border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{tipo.nome}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditar(tipo)}
                      className="hover:bg-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removerTipoDocumento(tipo.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <NovoTipoDocumentoModal
        open={isModalOpen}
        onClose={handleFecharModal}
        tipoParaEditar={tipoParaEditar}
      />
    </div>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useApp } from "@/contexts/AppContext";
import { useState, useEffect } from "react";

interface NovaCategoriaModalProps {
  open: boolean;
  onClose: () => void;
  categoriaParaEditar?: {
    id: number;
    nome: string;
    tipo: "entrada" | "saida";
  };
}

export function NovaCategoriaModal({ open, onClose, categoriaParaEditar }: NovaCategoriaModalProps) {
  const { adicionarCategoria, editarCategoria } = useApp();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");

  useEffect(() => {
    if (categoriaParaEditar) {
      setNome(categoriaParaEditar.nome);
      setTipo(categoriaParaEditar.tipo);
    }
  }, [categoriaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      return;
    }

    if (categoriaParaEditar) {
      editarCategoria(categoriaParaEditar.id, {
        nome: nome.trim(),
        tipo,
      });
    } else {
      adicionarCategoria({
        id: Math.random(),
        nome: nome.trim(),
        tipo,
      });
    }

    setNome("");
    setTipo("entrada");
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-full max-w-md bg-background border">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {categoriaParaEditar ? 'Editar Categoria' : 'Nova Categoria'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome da categoria
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-medium">
                Tipo
              </Label>
              <Select
                value={tipo}
                onValueChange={(value: "entrada" | "saida") => setTipo(value)}
              >
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Receita</SelectItem>
                  <SelectItem value="saida">Despesa</SelectItem>
                </SelectContent>
              </Select>
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
                {categoriaParaEditar ? 'Salvar Alterações' : 'Criar'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

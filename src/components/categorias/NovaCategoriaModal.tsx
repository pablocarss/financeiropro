import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

interface NovaCategoriaModalProps {
  open: boolean;
  onClose: () => void;
}

export function NovaCategoriaModal({ open, onClose }: NovaCategoriaModalProps) {
  const { adicionarCategoria } = useApp();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      return;
    }

    adicionarCategoria({
      id: Math.random(),
      nome: nome.trim(),
      tipo,
    });

    setNome("");
    setTipo("entrada");
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-full max-w-md bg-zinc-900 border border-zinc-800">
          <Dialog.Title className="text-lg font-bold mb-4 text-zinc-100">
            Nova Categoria
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-zinc-300">
                Nome da categoria
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-zinc-300">
                Tipo
              </Label>
              <Select
                value={tipo}
                onValueChange={(value: "entrada" | "saida") => setTipo(value)}
              >
                <SelectTrigger id="tipo" className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Receita</SelectItem>
                  <SelectItem value="saida">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Criar Categoria
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

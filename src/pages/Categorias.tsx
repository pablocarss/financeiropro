import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovaCategoriaModal } from "@/components/categorias/NovaCategoriaModal";
import { useApp } from "@/contexts/AppContext";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Categorias() {
  const { categorias, removerCategoria } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<any>(null);

  const handleEditar = (categoria: any) => {
    setCategoriaParaEditar(categoria);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Categorias</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map(categoria => (
          <Card key={categoria.id} className="p-4 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-zinc-100">{categoria.nome}</h3>
                <p className="text-sm text-zinc-400">
                  {categoria.tipo === 'entrada' ? 'Receita' : 'Despesa'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditar(categoria)}
                  className="hover:bg-zinc-800"
                >
                  <Pencil className="w-4 h-4 text-zinc-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerCategoria(categoria.id)}
                  className="hover:bg-zinc-800"
                >
                  <Trash className="w-4 h-4 text-zinc-400" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NovaCategoriaModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoriaParaEditar(null);
        }}
      />
    </div>
  );
}

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map(categoria => (
              <Card key={categoria.id} className="p-4 bg-background border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{categoria.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoria.tipo === 'entrada' ? 'Receita' : 'Despesa'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditar(categoria)}
                      className="hover:bg-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removerCategoria(categoria.id)}
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

      <NovaCategoriaModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoriaParaEditar(null);
        }}
        categoriaParaEditar={categoriaParaEditar}
      />
    </div>
  );
}

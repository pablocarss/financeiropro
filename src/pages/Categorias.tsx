import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovaCategoriaModal } from "@/components/categorias/NovaCategoriaModal";
import { Plus, Tag } from "lucide-react";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  tipo: "receita" | "despesa";
}

export default function Categorias() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const handleAddCategoria = (novaCategoria: Omit<Categoria, "id">) => {
    setCategorias((prev) => [
      ...prev,
      { ...novaCategoria, id: Math.random() },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <Card className="p-6">
        {categorias.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-zinc-500">Nenhuma categoria cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => (
              <Card key={categoria.id} className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  categoria.tipo === "receita" 
                    ? "bg-emerald-500/10" 
                    : "bg-red-500/10"
                }`}>
                  <Tag className={`w-5 h-5 ${
                    categoria.tipo === "receita"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">{categoria.nome}</h3>
                  {categoria.descricao && (
                    <p className="text-sm text-zinc-500 mt-1">
                      {categoria.descricao}
                    </p>
                  )}
                  <span className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
                    categoria.tipo === "receita"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {categoria.tipo === "receita" ? "Receita" : "Despesa"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <NovaCategoriaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategoria}
      />
    </div>
  );
}

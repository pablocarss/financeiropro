import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import { Plus, Users, Building, User } from "lucide-react";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tipo: "pf" | "pj";
}

export default function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const handleAddCliente = (novoCliente: Omit<Cliente, "id">) => {
    setClientes((prev) => [
      ...prev,
      { ...novoCliente, id: Math.random() },
    ]);
    setIsModalOpen(false);
  };

  // Contagem de clientes por tipo
  const totalPF = clientes.filter((cliente) => cliente.tipo === "pf").length;
  const totalPJ = clientes.filter((cliente) => cliente.tipo === "pj").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-purple-500">
                {clientes.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Pessoa Física</p>
              <p className="text-2xl font-bold text-blue-500">{totalPF}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Building className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Pessoa Jurídica</p>
              <p className="text-2xl font-bold text-emerald-500">{totalPJ}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card className="p-6">
        {clientes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-zinc-500">Nenhum cliente cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientes.map((cliente) => (
              <Card key={cliente.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    {cliente.tipo === "pf" ? (
                      <User className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Building className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{cliente.nome}</h3>
                    <p className="text-sm text-zinc-500">
                      {cliente.tipo === "pf" ? "CPF: " : "CNPJ: "}
                      {cliente.documento}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      {cliente.email} • {cliente.telefone}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {cliente.cidade}, {cliente.estado}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <NovoClienteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCliente}
      />
    </div>
  );
}

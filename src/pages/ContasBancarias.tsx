import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovaContaBancariaModal } from "@/components/contas/NovaContaBancariaModal";
import { Plus, Building2, Wallet } from "lucide-react";

interface ContaBancaria {
  id: number;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: string;
  saldoInicial: number;
  saldoAtual?: number;
}

export default function ContasBancarias() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contas, setContas] = useState<ContaBancaria[]>([]);

  const handleAddConta = (novaConta: Omit<ContaBancaria, "id">) => {
    setContas((prev) => [
      ...prev,
      { ...novaConta, id: Math.random(), saldoAtual: novaConta.saldoInicial },
    ]);
    setIsModalOpen(false);
  };

  const totalSaldo = contas.reduce((total, conta) => total + (conta.saldoAtual || conta.saldoInicial), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contas Bancárias</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Card de Saldo Total */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/10">
            <Wallet className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500">Saldo Total</p>
            <p className="text-2xl font-bold text-purple-500">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalSaldo)}
            </p>
          </div>
        </div>
      </Card>

      {/* Lista de Contas */}
      <Card className="p-6">
        {contas.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-zinc-500">Nenhuma conta bancária cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contas.map((conta) => (
              <Card key={conta.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Building2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{conta.nome}</h3>
                        <p className="text-sm text-zinc-500">{conta.banco}</p>
                      </div>
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">
                        {conta.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      Ag: {conta.agencia} • CC: {conta.conta}
                    </p>
                    <p className="text-lg font-medium text-emerald-500 mt-2">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(conta.saldoAtual || conta.saldoInicial)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <NovaContaBancariaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddConta}
      />
    </div>
  );
}
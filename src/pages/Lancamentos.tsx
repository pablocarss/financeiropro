import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";
import { Plus, ArrowUpCircle, ArrowDownCircle, Filter } from "lucide-react";

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  categoria: string;
  contaBancaria: string;
  formaPagamento: string;
}

export default function Lancamentos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const handleAddLancamento = (novoLancamento: Omit<Lancamento, "id">) => {
    setLancamentos((prev) => [
      ...prev,
      { ...novoLancamento, id: Math.random() },
    ]);
    setIsModalOpen(false);
  };

  // Calcular totais
  const totais = lancamentos.reduce(
    (acc, lancamento) => {
      if (lancamento.tipo === "entrada") {
        acc.entradas += lancamento.valor;
      } else {
        acc.saidas += lancamento.valor;
      }
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lançamentos</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Entradas</p>
              <h2 className="text-2xl font-bold text-green-500">
                {totais.entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Saídas</p>
              <h2 className="text-2xl font-bold text-red-500">
                {totais.saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo</p>
              <h2 className={`text-2xl font-bold ${
                totais.entradas - totais.saidas >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {(totais.entradas - totais.saidas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              totais.entradas - totais.saidas >= 0 ? "bg-green-500/10" : "bg-red-500/10"
            }`}>
              {totais.entradas - totais.saidas >= 0 ? (
                <ArrowUpCircle className="w-6 h-6 text-green-500" />
              ) : (
                <ArrowDownCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="gradient-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Lançamentos</h3>
          {lancamentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum lançamento registrado ainda.
              <br />
              <Button
                variant="link"
                onClick={() => setIsModalOpen(true)}
                className="mt-2"
              >
                Criar primeiro lançamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lancamentos.map((lancamento) => (
                <div
                  key={lancamento.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      lancamento.tipo === "entrada"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}>
                      {lancamento.tipo === "entrada" ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{lancamento.descricao}</p>
                      <p className="text-sm text-muted-foreground">
                        {lancamento.categoria} • {lancamento.formaPagamento}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      lancamento.tipo === "entrada"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {lancamento.tipo === "entrada" ? "+" : "-"}
                      {lancamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(lancamento.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <NovoLancamentoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddLancamento}
      />
    </div>
  );
}

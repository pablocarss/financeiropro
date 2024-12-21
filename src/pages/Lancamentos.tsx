import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";

// Tipo para os lançamentos
interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  categoria: string;
  contaBancaria: string;
  formaPagamento: string;
}

export default function Lancamentos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const adicionarLancamento = (novoLancamento: Omit<Lancamento, "id">) => {
    const lancamento = {
      ...novoLancamento,
      id: crypto.randomUUID(),
    };
    setLancamentos([...lancamentos, lancamento]);
    setModalAberto(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Lançamentos</h1>
          <Button
            onClick={() => setModalAberto(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Lançamento
          </Button>
        </div>

        {lancamentos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60">Nenhum lançamento registrado</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {lancamentos.map((lancamento) => (
              <div
                key={lancamento.id}
                className="gradient-card p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-white">{lancamento.descricao}</h3>
                  <p className="text-sm text-white/60">
                    {new Date(lancamento.data).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      lancamento.tipo === "entrada"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {lancamento.tipo === "entrada" ? "+" : "-"} R${" "}
                    {lancamento.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-white/60">{lancamento.categoria}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NovoLancamentoModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={adicionarLancamento}
      />
    </Layout>
  );
}

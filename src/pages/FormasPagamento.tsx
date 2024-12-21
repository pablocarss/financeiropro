import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovaFormaPagamentoModal } from "@/components/pagamentos/NovaFormaPagamentoModal";
import { Plus, CreditCard, Wallet } from "lucide-react";

interface FormaPagamento {
  id: number;
  nome: string;
  descricao?: string;
}

// Formas de pagamento padrão
const formasPagamentoPadrao: FormaPagamento[] = [
  {
    id: 1,
    nome: "Dinheiro",
    descricao: "Pagamento em espécie",
  },
  {
    id: 2,
    nome: "Cartão de Crédito",
    descricao: "Pagamento com cartão de crédito",
  },
  {
    id: 3,
    nome: "Cartão de Débito",
    descricao: "Pagamento com cartão de débito",
  },
  {
    id: 4,
    nome: "PIX",
    descricao: "Transferência via PIX",
  },
];

export default function FormasPagamento() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>(formasPagamentoPadrao);

  const handleAddFormaPagamento = (novaForma: Omit<FormaPagamento, "id">) => {
    setFormasPagamento((prev) => [
      ...prev,
      { ...novaForma, id: Math.random() },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Formas de Pagamento</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Forma de Pagamento
        </Button>
      </div>

      <Card className="p-6">
        {formasPagamento.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-zinc-500">Nenhuma forma de pagamento cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formasPagamento.map((forma) => (
              <Card key={forma.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{forma.nome}</h3>
                    {forma.descricao && (
                      <p className="text-sm text-zinc-500 mt-1">
                        {forma.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <NovaFormaPagamentoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFormaPagamento}
      />
    </div>
  );
}

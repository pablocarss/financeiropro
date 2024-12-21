import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";
import { Plus, ArrowUpCircle, ArrowDownCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  vencimento: string;
  competencia: string;
  categoria: string;
  contaBancaria: string;
  formaPagamento: string;
  status: "pago" | "a_pagar" | "recebido" | "a_receber";
  numeroDocumento?: string;
  comprovante?: File;
}

interface FiltroModalProps {
  open: boolean;
  onClose: () => void;
  onFilter: (filtros: any) => void;
}

function FiltroModal({ open, onClose, onFilter }: FiltroModalProps) {
  const [filtros, setFiltros] = useState({
    dataInicial: "",
    dataFinal: "",
    tipo: "",
    categoria: "",
    contaBancaria: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filtros);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-zinc-950 rounded-2xl border border-zinc-800 w-full max-w-md shadow-xl">
          <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-zinc-100">
                Filtrar Lançamentos
              </Dialog.Title>
              <Dialog.Close className="text-zinc-400 hover:text-zinc-100">
                <X className="size-6" />
              </Dialog.Close>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data Inicial</Label>
                    <Input
                      type="date"
                      value={filtros.dataInicial}
                      onChange={(e) =>
                        setFiltros({ ...filtros, dataInicial: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Data Final</Label>
                    <Input
                      type="date"
                      value={filtros.dataFinal}
                      onChange={(e) =>
                        setFiltros({ ...filtros, dataFinal: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Tipo</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-100"
                    value={filtros.tipo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, tipo: e.target.value })
                    }
                  >
                    <option value="">Todos</option>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div>
                  <Label>Categoria</Label>
                  <Input
                    value={filtros.categoria}
                    onChange={(e) =>
                      setFiltros({ ...filtros, categoria: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Conta Bancária</Label>
                  <Input
                    value={filtros.contaBancaria}
                    onChange={(e) =>
                      setFiltros({ ...filtros, contaBancaria: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 bg-purple-600 text-white font-medium hover:bg-purple-700"
              >
                Aplicar Filtros
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function Lancamentos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [filtros, setFiltros] = useState({});

  const [categorias, setCategorias] = useState([
    { id: 1, nome: "Vendas", tipo: "entrada" },
    { id: 2, nome: "Serviços", tipo: "entrada" },
    { id: 3, nome: "Aluguel", tipo: "saida" },
    { id: 4, nome: "Fornecedores", tipo: "saida" },
  ]);

  const [contasBancarias, setContasBancarias] = useState([
    { id: 1, nome: "Conta Principal" },
    { id: 2, nome: "Conta Poupança" },
  ]);

  const [formasPagamento, setFormasPagamento] = useState([
    { id: 1, nome: "Dinheiro" },
    { id: 2, nome: "Cartão de Crédito" },
    { id: 3, nome: "Cartão de Débito" },
    { id: 4, nome: "PIX" },
  ]);

  const handleAddLancamento = (novoLancamento: Omit<Lancamento, "id">) => {
    setLancamentos((prev) => [
      ...prev,
      { ...novoLancamento, id: Math.random() },
    ]);
    setIsModalOpen(false);
  };

  const handleFilter = (novosFiltros: any) => {
    setFiltros(novosFiltros);
    // Aqui você pode implementar a lógica de filtro
  };

  // Calcular totais
  const totais = lancamentos.reduce(
    (acc, lancamento) => {
      if (lancamento.tipo === "entrada") {
        acc.entradas += Number(lancamento.valor);
      } else {
        acc.saidas += Number(lancamento.valor);
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
          <Button variant="outline" onClick={() => setIsFiltroOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowUpCircle className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm text-zinc-500">Entradas</p>
              <p className="text-2xl font-bold text-emerald-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.entradas)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-zinc-500">Saídas</p>
              <p className="text-2xl font-bold text-red-500">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.saidas)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">=</span>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totais.entradas - totais.saidas)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de lançamentos */}
      <Card className="p-6">
        {lancamentos.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-zinc-500">Nenhum lançamento registrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lancamentos.map((lancamento) => (
              <div
                key={lancamento.id}
                className="flex items-center justify-between p-4 rounded-lg bg-zinc-50"
              >
                <div>
                  <p className="font-medium">{lancamento.descricao}</p>
                  <p className="text-sm text-zinc-500">
                    {lancamento.categoria} • {lancamento.contaBancaria} • {lancamento.formaPagamento}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">
                      Data: {new Date(lancamento.data).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Venc.: {new Date(lancamento.vencimento).toLocaleDateString("pt-BR")}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        lancamento.status === "pago" || lancamento.status === "recebido"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {lancamento.status === "pago"
                        ? "Pago"
                        : lancamento.status === "a_pagar"
                        ? "A Pagar"
                        : lancamento.status === "recebido"
                        ? "Recebido"
                        : "A Receber"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      lancamento.tipo === "entrada"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {lancamento.tipo === "entrada" ? "+" : "-"}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(lancamento.valor))}
                  </p>
                  {lancamento.numeroDocumento && (
                    <p className="text-xs text-zinc-500 mt-1">
                      Doc: {lancamento.numeroDocumento}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <NovoLancamentoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLancamento}
        categorias={categorias}
        contasBancarias={contasBancarias}
        formasPagamento={formasPagamento}
      />

      <FiltroModal
        open={isFiltroOpen}
        onClose={() => setIsFiltroOpen(false)}
        onFilter={handleFilter}
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Trash2, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { EditarLancamentoModal } from "./EditarLancamentoModal";

interface LancamentoCardProps {
  lancamento: {
    id: string;
    tipo: string;
    descricao: string;
    valor: number;
    data: string;
    categoria: string;
    contaBancaria: string;
    formaPagamento: string;
    status: string;
    criadoEm: string;
    atualizadoEm: string;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string, dados: any) => void;
}

export function LancamentoCard({ lancamento, onDelete, onEdit }: LancamentoCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    try {
      const dataObj = new Date(data);
      if (isNaN(dataObj.getTime())) {
        return "Data inválida";
      }
      return format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatarHora = (data: string) => {
    try {
      const dataObj = new Date(data);
      if (isNaN(dataObj.getTime())) {
        return "--:--:--";
      }
      return format(dataObj, "HH:mm:ss", { locale: ptBR });
    } catch (error) {
      return "--:--:--";
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        lancamento.tipo === "receita" ? "hover:border-green-500" : "hover:border-red-500"
      }`}
      onClick={() => !isDetailsOpen && setIsDetailsOpen(true)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            className={
              lancamento.tipo === "receita" ? "text-green-500" : "text-red-500"
            }
          >
            {formatarMoeda(lancamento.valor)}
          </CardTitle>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              lancamento.status === "pago"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {lancamento.status}
          </span>
        </div>
        <CardDescription>{lancamento.descricao}</CardDescription>
      </CardHeader>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Lançamento</DialogTitle>
            <DialogDescription>
              Informações completas e histórico do lançamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Valor</h4>
                <p className={lancamento.tipo === "receita" ? "text-green-500" : "text-red-500"}>
                  {formatarMoeda(lancamento.valor)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <p>{lancamento.status}</p>
              </div>
              <div>
                <h4 className="font-semibold">Categoria</h4>
                <p>{lancamento.categoria}</p>
              </div>
              <div>
                <h4 className="font-semibold">Conta</h4>
                <p>{lancamento.contaBancaria}</p>
              </div>
              <div>
                <h4 className="font-semibold">Forma de Pagamento</h4>
                <p>{lancamento.formaPagamento}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Histórico</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Criado em {formatarData(lancamento.criadoEm)}</span>
                  <Clock className="ml-4 mr-2 h-4 w-4" />
                  <span>{formatarHora(lancamento.criadoEm)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Atualizado em {formatarData(lancamento.atualizadoEm)}</span>
                  <Clock className="ml-4 mr-2 h-4 w-4" />
                  <span>{formatarHora(lancamento.atualizadoEm)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDetailsOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
                    onDelete(lancamento.id);
                    setIsDetailsOpen(false);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditarLancamentoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lancamento={lancamento}
        onEdit={onEdit}
      />
    </Card>
  );
}

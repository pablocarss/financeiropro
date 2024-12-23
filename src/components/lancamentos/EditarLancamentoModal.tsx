import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { useState, useEffect } from "react";

interface EditarLancamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lancamento: any;
  onEdit: (id: string, dados: any) => void;
}

export function EditarLancamentoModal({
  isOpen,
  onClose,
  lancamento,
  onEdit,
}: EditarLancamentoModalProps) {
  const { categorias, contasBancarias, formasPagamento } = useApp();
  const [dadosEditados, setDadosEditados] = useState(lancamento);

  useEffect(() => {
    setDadosEditados(lancamento);
  }, [lancamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(lancamento.id, dadosEditados);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lançamento</DialogTitle>
          <DialogDescription>
            Modifique os dados do lançamento conforme necessário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Input
                id="descricao"
                value={dadosEditados.descricao}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, descricao: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                id="valor"
                type="number"
                value={dadosEditados.valor}
                onChange={(e) =>
                  setDadosEditados({
                    ...dadosEditados,
                    valor: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={dadosEditados.data}
                onChange={(e) =>
                  setDadosEditados({ ...dadosEditados, data: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Categoria</Label>
              <Select
                value={dadosEditados.categoria}
                onValueChange={(value) =>
                  setDadosEditados({ ...dadosEditados, categoria: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Conta</Label>
              <Select
                value={dadosEditados.contaBancaria}
                onValueChange={(value) =>
                  setDadosEditados({ ...dadosEditados, contaBancaria: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {contasBancarias.map((conta) => (
                    <SelectItem key={conta.id} value={conta.id}>
                      {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Forma de Pagamento</Label>
              <Select
                value={dadosEditados.formaPagamento}
                onValueChange={(value) =>
                  setDadosEditados({ ...dadosEditados, formaPagamento: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma.id} value={forma.id}>
                      {forma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Select
                value={dadosEditados.status}
                onValueChange={(value) =>
                  setDadosEditados({ ...dadosEditados, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

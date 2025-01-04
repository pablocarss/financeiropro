import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/contexts/AppContext";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  user?: string;
  selected?: boolean;
}

interface FaturaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  faturaData: {
    bankName: string;
    transactions: Transaction[];
  } | null;
}

export function FaturaPreviewModal({
  isOpen,
  onClose,
  faturaData,
}: FaturaPreviewModalProps) {
  const { categorias = [], usuarios = [] } = useApp();
  const [transacoes, setTransacoes] = useState<Transaction[]>(
    (faturaData?.transactions || []).map(t => ({ ...t, selected: true }))
  );

  const handleCategoriaChange = (index: number, categoria: string) => {
    const novasTransacoes = [...transacoes];
    novasTransacoes[index] = { ...novasTransacoes[index], category: categoria };
    setTransacoes(novasTransacoes);
  };

  const handleUsuarioChange = (index: number, usuario: string) => {
    const novasTransacoes = [...transacoes];
    novasTransacoes[index] = { ...novasTransacoes[index], user: usuario };
    setTransacoes(novasTransacoes);
  };

  const handleSelectionChange = (index: number, checked: boolean) => {
    const novasTransacoes = [...transacoes];
    novasTransacoes[index] = { ...novasTransacoes[index], selected: checked };
    setTransacoes(novasTransacoes);
  };

  const handleSelectAll = (checked: boolean) => {
    setTransacoes(transacoes.map(t => ({ ...t, selected: checked })));
  };

  const handleSalvar = () => {
    // Filtra apenas as transações selecionadas
    const transacoesSelecionadas = transacoes.filter(t => t.selected);
    console.log("Transações a serem salvas:", transacoesSelecionadas);
    onClose();
  };

  if (!faturaData) return null;

  const totalSelecionado = transacoes
    .filter(t => t.selected)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Fatura - {faturaData.bankName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0 p-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={transacoes.every(t => t.selected)}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todas as transações"
                  />
                </TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((transacao, index) => (
                <TableRow key={index} className={transacao.selected ? "" : "opacity-50"}>
                  <TableCell>
                    <Checkbox 
                      checked={transacao.selected}
                      onCheckedChange={(checked) => handleSelectionChange(index, checked as boolean)}
                      aria-label={`Selecionar transação ${transacao.description}`}
                    />
                  </TableCell>
                  <TableCell>{transacao.date}</TableCell>
                  <TableCell>{transacao.description}</TableCell>
                  <TableCell className={`text-right ${transacao.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    R$ {Math.abs(transacao.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={transacao.category}
                      onValueChange={(value) =>
                        handleCategoriaChange(index, value)
                      }
                      disabled={!transacao.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(categorias || []).map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id.toString()}>
                            {categoria.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={transacao.user}
                      onValueChange={(value) =>
                        handleUsuarioChange(index, value)
                      }
                      disabled={!transacao.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(usuarios || []).map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id.toString()}>
                            {usuario.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Total Selecionado: R$ {Math.abs(totalSelecionado).toFixed(2)}
              <span className="ml-2 text-xs">
                ({transacoes.filter(t => t.selected).length} de {transacoes.length} transações)
              </span>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSalvar}
                disabled={!transacoes.some(t => t.selected)}
              >
                Salvar Lançamentos
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

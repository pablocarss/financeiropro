import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  user?: string;
}

interface ProcessarFaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onSave: (transactions: Transaction[]) => void;
  categories: string[];
  users: string[];
}

export function ProcessarFaturaModal({
  isOpen,
  onClose,
  transactions,
  onSave,
  categories,
  users
}: ProcessarFaturaModalProps) {
  const [processedTransactions, setProcessedTransactions] = useState<Transaction[]>(transactions);

  const handleCategoryChange = (index: number, category: string) => {
    const updated = [...processedTransactions];
    updated[index] = { ...updated[index], category };
    setProcessedTransactions(updated);
  };

  const handleUserChange = (index: number, user: string) => {
    const updated = [...processedTransactions];
    updated[index] = { ...updated[index], user };
    setProcessedTransactions(updated);
  };

  const handleSave = () => {
    onSave(processedTransactions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Processar Transações da Fatura</DialogTitle>
        </DialogHeader>

        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={transaction.category}
                      onValueChange={(value) => handleCategoryChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={transaction.user}
                      onValueChange={(value) => handleUserChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
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

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Transações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

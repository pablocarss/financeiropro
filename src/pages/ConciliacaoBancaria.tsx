import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Upload } from "lucide-react";
import { useState } from "react";
import { parseOFX } from 'ofx-js';

interface Transaction {
  TRNTYPE: string;
  DTPOSTED: string;
  TRNAMT: string;
  FITID: string;
  NAME: string;
  MEMO: string;
}

export default function ConciliacaoBancaria() {
  const { lancamentos, contasBancarias, atualizarLancamento } = useApp();
  const [uploading, setUploading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const data = await parseOFX(text);
      
      // Extrair transações do arquivo OFX
      const bankTransactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
      setTransactions(bankTransactions);

      // Para cada transação, tentar encontrar o lançamento correspondente
      bankTransactions.forEach((transaction: Transaction) => {
        const data = new Date(transaction.DTPOSTED);
        const valor = parseFloat(transaction.TRNAMT);
        
        // Procurar lançamento com data e valor correspondentes
        const lancamentoCorrespondente = lancamentos.find(l => 
          l.data.toISOString().split('T')[0] === data.toISOString().split('T')[0] &&
          l.valor === Math.abs(valor)
        );

        if (lancamentoCorrespondente) {
          // Atualizar status do lançamento para conciliado
          atualizarLancamento({
            ...lancamentoCorrespondente,
            status: valor > 0 ? 'recebido' : 'pago',
            conciliado: true
          });
        }
      });

      alert('Arquivo OFX processado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar arquivo OFX:', error);
      alert('Erro ao processar arquivo. Verifique se o formato está correto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conciliação Bancária</h2>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Importar Extrato OFX</CardTitle>
            <CardDescription>
              Importe o arquivo OFX do seu banco para conciliar automaticamente os lançamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-zinc-500" />
                  <p className="mb-2 text-sm text-zinc-500">
                    <span className="font-semibold">Clique para selecionar</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-zinc-500">OFX</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".ofx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Transações do Extrato</CardTitle>
              <CardDescription>
                Lista de transações encontradas no arquivo OFX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-zinc-100 dark:bg-zinc-800">
                    <tr>
                      <th scope="col" className="px-6 py-3">Data</th>
                      <th scope="col" className="px-6 py-3">Descrição</th>
                      <th scope="col" className="px-6 py-3">Valor</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index} className="border-b dark:border-zinc-700">
                        <td className="px-6 py-4">
                          {new Date(transaction.DTPOSTED).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{transaction.NAME || transaction.MEMO}</td>
                        <td className="px-6 py-4">
                          {parseFloat(transaction.TRNAMT).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          {parseFloat(transaction.TRNAMT) > 0 ? 'Crédito' : 'Débito'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

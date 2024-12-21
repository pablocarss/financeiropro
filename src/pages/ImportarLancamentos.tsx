import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function ImportarLancamentos() {
  const { adicionarLancamento } = useApp();
  const [uploading, setUploading] = useState(false);

  const downloadModelo = () => {
    // Criar modelo de planilha
    const modelo = [
      ['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Conta', 'Status'],
      ['21/12/2023', 'Exemplo de Receita', '1000.00', 'receita', 'Salário', 'Nubank', 'recebido'],
      ['22/12/2023', 'Exemplo de Despesa', '-500.00', 'despesa', 'Alimentação', 'Itaú', 'pago'],
    ];

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(modelo);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Lançamentos");

    // Fazer download
    XLSX.writeFile(wb, "modelo_lancamentos.xlsx");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Processar cada linha
      jsonData.forEach((row: any) => {
        const lancamento = {
          data: new Date(row.Data),
          descricao: row.Descrição,
          valor: parseFloat(row.Valor),
          tipo: row.Tipo.toLowerCase(),
          categoria: row.Categoria,
          conta: row.Conta,
          status: row.Status.toLowerCase(),
        };

        adicionarLancamento(lancamento);
      });

      alert('Lançamentos importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      alert('Erro ao importar arquivo. Verifique se o formato está correto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Importar Lançamentos</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Modelo Excel</CardTitle>
            <CardDescription>
              Baixe o modelo de planilha para importação de lançamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadModelo} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar Modelo Excel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar Arquivo</CardTitle>
            <CardDescription>
              Selecione o arquivo Excel preenchido para importar os lançamentos
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
                  <p className="text-xs text-zinc-500">XLSX, XLS</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

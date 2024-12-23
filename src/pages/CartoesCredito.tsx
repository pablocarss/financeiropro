import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { CreditCard, Plus, FileUp, Download } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function CartoesCredito() {
  const { 
    cartoesCredito, 
    faturas, 
    contasBancarias,
    adicionarCartao,
    processarFatura,
    exportarRelatorio 
  } = useApp();

  const [novoCartao, setNovoCartao] = useState({
    nome: "",
    bandeira: "",
    limite: 0,
    diaFechamento: 1,
    diaVencimento: 10,
    contaBancariaId: 0
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/ofx': ['.ofx'],
      'text/csv': ['.csv']
    },
    onDrop: (files) => {
      // Implementar importação de extrato
      console.log('Arquivos recebidos:', files);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarCartao(novoCartao);
    setNovoCartao({
      nome: "",
      bandeira: "",
      limite: 0,
      diaFechamento: 1,
      diaVencimento: 10,
      contaBancariaId: 0
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cartão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo cartão de crédito para começar a gerenciar suas faturas.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nome" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="nome"
                      value={novoCartao.nome}
                      onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bandeira" className="text-right">
                      Bandeira
                    </Label>
                    <Input
                      id="bandeira"
                      value={novoCartao.bandeira}
                      onChange={(e) => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="limite" className="text-right">
                      Limite
                    </Label>
                    <Input
                      id="limite"
                      type="number"
                      value={novoCartao.limite}
                      onChange={(e) => setNovoCartao({ ...novoCartao, limite: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diaFechamento" className="text-right">
                      Dia do Fechamento
                    </Label>
                    <Input
                      id="diaFechamento"
                      type="number"
                      min="1"
                      max="31"
                      value={novoCartao.diaFechamento}
                      onChange={(e) => setNovoCartao({ ...novoCartao, diaFechamento: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diaVencimento" className="text-right">
                      Dia do Vencimento
                    </Label>
                    <Input
                      id="diaVencimento"
                      type="number"
                      min="1"
                      max="31"
                      value={novoCartao.diaVencimento}
                      onChange={(e) => setNovoCartao({ ...novoCartao, diaVencimento: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Conta de Débito</Label>
                    <Select
                      value={novoCartao.contaBancariaId.toString()}
                      onValueChange={(value) => setNovoCartao({
                        ...novoCartao,
                        contaBancariaId: Number(value)
                      })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {contasBancarias.map((conta) => (
                          <SelectItem key={conta.id} value={conta.id.toString()}>
                            {conta.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Adicionar Cartão</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="cartoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cartoes">Meus Cartões</TabsTrigger>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="importar">Importar Extrato</TabsTrigger>
        </TabsList>

        <TabsContent value="cartoes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cartoesCredito.map((cartao) => (
              <Card key={cartao.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {cartao.nome}
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatarMoeda(cartao.limite)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bandeira: {cartao.bandeira}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fechamento: dia {cartao.diaFechamento}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vencimento: dia {cartao.diaVencimento}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faturas">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cartão</TableHead>
                    <TableHead>Mês</TableHead>
                    <TableHead>Fechamento</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturas.map((fatura) => {
                    const cartao = cartoesCredito.find(c => c.id === fatura.cartaoId);
                    return (
                      <TableRow key={fatura.id}>
                        <TableCell>{cartao?.nome}</TableCell>
                        <TableCell>
                          {format(new Date(fatura.mesReferencia), 'MMMM yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(fatura.dataFechamento), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(fatura.dataVencimento), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarMoeda(fatura.valorTotal)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fatura.status === 'paga' 
                              ? 'bg-green-100 text-green-800'
                              : fatura.status === 'fechada'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {fatura.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportarRelatorio('pdf', {
                              dataInicio: format(new Date(fatura.dataFechamento), 'yyyy-MM-dd'),
                              dataFim: format(new Date(fatura.dataVencimento), 'yyyy-MM-dd'),
                            })}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importar">
          <Card>
            <CardHeader>
              <CardTitle>Importar Extrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
              >
                <input {...getInputProps()} />
                <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2">Arraste e solte arquivos OFX ou CSV aqui, ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground">
                  Suporta arquivos .ofx e .csv
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

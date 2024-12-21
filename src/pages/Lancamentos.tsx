import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NovoLancamentoModal } from "@/components/lancamentos/NovoLancamentoModal";
import { useApp } from "@/contexts/AppContext";
import { Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Lancamentos() {
  const { lancamentos, categorias, contasBancarias, formasPagamento } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    contaBancaria: '',
    formaPagamento: '',
    status: '',
    dataInicial: '',
    dataFinal: ''
  });

  const [lancamentosFiltrados, setLancamentosFiltrados] = useState(lancamentos);

  useEffect(() => {
    aplicarFiltros();
  }, [lancamentos, filtros]);

  const aplicarFiltros = () => {
    let resultado = [...lancamentos];

    if (filtros.tipo) {
      resultado = resultado.filter(l => l.tipo === filtros.tipo);
    }
    if (filtros.categoria) {
      resultado = resultado.filter(l => l.categoria === Number(filtros.categoria));
    }
    if (filtros.contaBancaria) {
      resultado = resultado.filter(l => l.contaBancaria === Number(filtros.contaBancaria));
    }
    if (filtros.formaPagamento) {
      resultado = resultado.filter(l => l.formaPagamento === Number(filtros.formaPagamento));
    }
    if (filtros.status) {
      resultado = resultado.filter(l => l.status === filtros.status);
    }
    if (filtros.dataInicial) {
      resultado = resultado.filter(l => new Date(l.data) >= new Date(filtros.dataInicial));
    }
    if (filtros.dataFinal) {
      resultado = resultado.filter(l => new Date(l.data) <= new Date(filtros.dataFinal));
    }

    setLancamentosFiltrados(resultado);
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: '',
      categoria: '',
      contaBancaria: '',
      formaPagamento: '',
      status: '',
      dataInicial: '',
      dataFinal: ''
    });
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Lançamentos</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFiltroAberto(true)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>
      </div>

      <Dialog.Root open={filtroAberto} onOpenChange={setFiltroAberto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4 text-zinc-100">Filtros</Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300">Tipo</Label>
                <Select value={filtros.tipo} onValueChange={value => setFiltros(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Categoria</Label>
                <Select value={filtros.categoria} onValueChange={value => setFiltros(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Conta Bancária</Label>
                <Select value={filtros.contaBancaria} onValueChange={value => setFiltros(prev => ({ ...prev, contaBancaria: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {contasBancarias.map(conta => (
                      <SelectItem key={conta.id} value={conta.id.toString()}>
                        {conta.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Forma de Pagamento</Label>
                <Select value={filtros.formaPagamento} onValueChange={value => setFiltros(prev => ({ ...prev, formaPagamento: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {formasPagamento.map(forma => (
                      <SelectItem key={forma.id} value={forma.id.toString()}>
                        {forma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Status</Label>
                <Select value={filtros.status} onValueChange={value => setFiltros(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="a_pagar">A Pagar</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-zinc-300">Data Inicial</Label>
                <Input
                  type="date"
                  value={filtros.dataInicial}
                  onChange={e => setFiltros(prev => ({ ...prev, dataInicial: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div>
                <Label className="text-zinc-300">Data Final</Label>
                <Input
                  type="date"
                  value={filtros.dataFinal}
                  onChange={e => setFiltros(prev => ({ ...prev, dataFinal: e.target.value }))}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={limparFiltros} className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
                  Limpar
                </Button>
                <Button onClick={() => setFiltroAberto(false)} className="bg-purple-600 hover:bg-purple-700">
                  Aplicar
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="grid gap-4">
        {lancamentosFiltrados.map(lancamento => {
          const categoria = categorias.find(c => c.id === lancamento.categoria);
          const conta = contasBancarias.find(c => c.id === lancamento.contaBancaria);
          const formaPagamento = formasPagamento.find(f => f.id === lancamento.formaPagamento);

          return (
            <Card key={lancamento.id} className="p-4 bg-zinc-900 border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-zinc-100">{lancamento.descricao}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-400">
                      {categoria?.nome} • {conta?.nome} • {formaPagamento?.nome}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {format(new Date(lancamento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    lancamento.tipo === 'entrada' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {lancamento.tipo === 'entrada' ? '+' : '-'}
                    {lancamento.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lancamento.status === 'pago' || lancamento.status === 'recebido'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {lancamento.status === 'pago' ? 'Pago'
                      : lancamento.status === 'a_pagar' ? 'A Pagar'
                      : lancamento.status === 'recebido' ? 'Recebido'
                      : 'A Receber'}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <NovoLancamentoModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Força a atualização dos filtros ao fechar o modal
          aplicarFiltros();
        }}
      />
    </div>
  );
}

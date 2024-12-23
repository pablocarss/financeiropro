import { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface BaseEntity {
  id: number;
  userId: string;
}

interface Categoria extends BaseEntity {
  nome: string;
  tipo: 'entrada' | 'saida';
}

interface ContaBancaria extends BaseEntity {
  nome: string;
  saldo: number;
  banco: string;
  agencia: string;
  conta: string;
}

interface FormaPagamento extends BaseEntity {
  nome: string;
}

interface CentroCusto extends BaseEntity {
  nome: string;
}

interface TipoDocumento extends BaseEntity {
  nome: string;
}

interface Lancamento extends BaseEntity {
  descricao: string;
  valor: number;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria: number;
  contaBancaria: number;
  formaPagamento: number;
  centroCusto: number;
  tipoDocumento: number;
  competencia: string;
  observacao?: string;
  clientePF?: string;
  clientePJ?: string;
  status: 'pago' | 'a_pagar' | 'recebido' | 'a_receber';
  vencimento: string;
  numeroDocumento?: string;
  anexos?: string[];
  recorrencia?: {
    tipo: 'nao_repete' | 'mensal';
    qtd?: string;
  };
}

interface CartaoCredito extends BaseEntity {
  nome: string;
  bandeira: string;
  limite: number;
  diaFechamento: number;
  diaVencimento: number;
  contaBancariaId: number;
  ultimaFatura?: number;
}

interface Fatura extends BaseEntity {
  cartaoId: number;
  mesReferencia: string;
  dataFechamento: Date;
  dataVencimento: Date;
  valorTotal: number;
  status: 'aberta' | 'fechada' | 'paga';
  lancamentos: LancamentoCartao[];
}

interface LancamentoCartao extends BaseEntity {
  faturaId: number;
  descricao: string;
  valor: number;
  data: Date;
  parcela?: number;
  totalParcelas?: number;
  estabelecimento: string;
}

interface ClientePF extends BaseEntity {
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
}

interface ClientePJ extends BaseEntity {
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
}

interface AppContextType {
  categorias: Categoria[];
  contasBancarias: ContaBancaria[];
  formasPagamento: FormaPagamento[];
  centrosCusto: CentroCusto[];
  tiposDocumento: TipoDocumento[];
  lancamentos: Lancamento[];
  cartoesCredito: CartaoCredito[];
  faturas: Fatura[];
  clientesPF: ClientePF[];
  clientesPJ: ClientePJ[];
  adicionarCategoria: (categoria: Omit<Categoria, 'id' | 'userId'>) => void;
  adicionarContaBancaria: (conta: Omit<ContaBancaria, 'id' | 'userId'>) => void;
  adicionarFormaPagamento: (forma: Omit<FormaPagamento, 'id' | 'userId'>) => void;
  adicionarCentroCusto: (centro: Omit<CentroCusto, 'id' | 'userId'>) => void;
  adicionarTipoDocumento: (tipo: Omit<TipoDocumento, 'id' | 'userId'>) => void;
  adicionarLancamento: (lancamento: Omit<Lancamento, 'id' | 'userId'>) => void;
  adicionarCartao: (cartao: Omit<CartaoCredito, 'id' | 'userId'>) => void;
  processarFatura: (cartaoId: number) => void;
  exportarRelatorio: (tipo: 'pdf' | 'csv', filtros?: {
    dataInicio?: string;
    dataFim?: string;
    tipo?: 'entrada' | 'saida';
    categoria?: number;
  }) => void;
  editarCategoria: (id: number, categoria: Partial<Categoria>) => void;
  editarContaBancaria: (id: number, conta: Partial<ContaBancaria>) => void;
  editarFormaPagamento: (id: number, forma: Partial<FormaPagamento>) => void;
  editarCentroCusto: (id: number, centro: Partial<CentroCusto>) => void;
  editarTipoDocumento: (id: number, tipo: Partial<TipoDocumento>) => void;
  editarLancamento: (id: number, lancamento: Partial<Lancamento>) => void;
  editarCartao: (id: number, cartao: Partial<CartaoCredito>) => void;
  removerCategoria: (id: number) => void;
  removerContaBancaria: (id: number) => void;
  removerFormaPagamento: (id: number) => void;
  removerCentroCusto: (id: number) => void;
  removerTipoDocumento: (id: number) => void;
  removerLancamento: (id: number) => void;
  removerCartao: (id: number) => void;
  adicionarClientePF: (cliente: Omit<ClientePF, 'id' | 'userId'>) => void;
  adicionarClientePJ: (cliente: Omit<ClientePJ, 'id' | 'userId'>) => void;
  editarClientePF: (id: number, cliente: Partial<ClientePF>) => void;
  editarClientePJ: (id: number, cliente: Partial<ClientePJ>) => void;
  removerClientePF: (id: number) => void;
  removerClientePJ: (id: number) => void;
  calcularTotais: () => {
    receitasMesAtual: number;
    despesasMesAtual: number;
    receitasMesAnterior: number;
    despesasMesAnterior: number;
    saldoMesAtual: number;
    saldoMesAnterior: number;
    saldoTotal: number;
  };
  calcularTotaisPorCategoria: () => {
    receitas: { id: number; nome: string; valor: number }[];
    despesas: { id: number; nome: string; valor: number }[];
  };
  calcularTendencias: () => {
    receitas: number;
    despesas: number;
    saldo: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const userId = user?.uid || '';

  if (loading) {
    return <div>Carregando...</div>;
  }

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [cartoesCredito, setCartoesCredito] = useState<CartaoCredito[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [clientesPF, setClientesPF] = useState<ClientePF[]>([]);
  const [clientesPJ, setClientesPJ] = useState<ClientePJ[]>([]);

  const filtrarPorUsuario = <T extends BaseEntity>(items: T[]): T[] => {
    return items.filter(item => item.userId === userId);
  };

  const adicionarCategoria = (categoria: Omit<Categoria, 'id' | 'userId'>) => {
    const novaCategoria: Categoria = {
      ...categoria,
      id: Math.max(0, ...categorias.map(c => c.id)) + 1,
      userId
    };
    setCategorias([...categorias, novaCategoria]);
  };

  const adicionarContaBancaria = (conta: Omit<ContaBancaria, 'id' | 'userId'>) => {
    const novaConta: ContaBancaria = {
      ...conta,
      id: Math.max(0, ...contasBancarias.map(c => c.id)) + 1,
      userId
    };
    setContasBancarias([...contasBancarias, novaConta]);
  };

  const adicionarFormaPagamento = (forma: Omit<FormaPagamento, 'id' | 'userId'>) => {
    const novaForma: FormaPagamento = {
      ...forma,
      id: Math.max(0, ...formasPagamento.map(f => f.id)) + 1,
      userId
    };
    setFormasPagamento([...formasPagamento, novaForma]);
  };

  const adicionarCentroCusto = (centro: Omit<CentroCusto, 'id' | 'userId'>) => {
    const novoCentro: CentroCusto = {
      ...centro,
      id: Math.max(0, ...centrosCusto.map(c => c.id)) + 1,
      userId
    };
    setCentrosCusto([...centrosCusto, novoCentro]);
  };

  const adicionarTipoDocumento = (tipo: Omit<TipoDocumento, 'id' | 'userId'>) => {
    const novoTipo: TipoDocumento = {
      ...tipo,
      id: Math.max(0, ...tiposDocumento.map(t => t.id)) + 1,
      userId
    };
    setTiposDocumento([...tiposDocumento, novoTipo]);
  };

  const adicionarLancamento = (lancamento: Omit<Lancamento, 'id' | 'userId'>) => {
    const novoLancamento: Lancamento = {
      ...lancamento,
      id: Math.max(0, ...lancamentos.map(l => l.id)) + 1,
      userId
    };
    setLancamentos([...lancamentos, novoLancamento]);
  };

  const adicionarCartao = (cartao: Omit<CartaoCredito, 'id' | 'userId'>) => {
    const novoCartao: CartaoCredito = {
      ...cartao,
      id: Math.max(0, ...cartoesCredito.map(c => c.id)) + 1,
      userId
    };
    setCartoesCredito([...cartoesCredito, novoCartao]);
  };

  const processarFatura = (cartaoId: number) => {
    const cartao = cartoesCredito.find(c => c.id === cartaoId && c.userId === userId);
    if (!cartao) return;

    const hoje = new Date();
    const mesReferencia = format(hoje, 'yyyy-MM');
    
    const lancamentosCartao = lancamentos.filter(l => 
      l.userId === userId &&
      l.formaPagamento === cartaoId &&
      l.competencia === mesReferencia
    );

    const novaFatura: Fatura = {
      id: Math.max(0, ...faturas.map(f => f.id)) + 1,
      userId,
      cartaoId,
      mesReferencia,
      dataFechamento: new Date(hoje.getFullYear(), hoje.getMonth(), cartao.diaFechamento),
      dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), cartao.diaVencimento),
      valorTotal: lancamentosCartao.reduce((sum, l) => sum + l.valor, 0),
      status: 'aberta',
      lancamentos: lancamentosCartao.map(l => ({
        id: Math.max(0, ...faturas.flatMap(f => f.lancamentos.map(lc => lc.id))) + 1,
        userId,
        faturaId: 0, // será atualizado após criar a fatura
        descricao: l.descricao,
        valor: l.valor,
        data: new Date(l.data),
        estabelecimento: l.descricao
      }))
    };

    setFaturas([...faturas, novaFatura]);
  };

  const exportarRelatorio = async (tipo: 'pdf' | 'csv', filtros?: {
    dataInicio?: string;
    dataFim?: string;
    tipo?: 'entrada' | 'saida';
    categoria?: number;
  }) => {
    const dadosFiltrados = lancamentos.filter(l => {
      if (l.userId !== userId) return false;
      if (filtros?.dataInicio && l.data < filtros.dataInicio) return false;
      if (filtros?.dataFim && l.data > filtros.dataFim) return false;
      if (filtros?.tipo && l.tipo !== filtros.tipo) return false;
      if (filtros?.categoria && l.categoria !== filtros.categoria) return false;
      return true;
    });

    if (tipo === 'csv') {
      const headers = ['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria'];
      const rows = dadosFiltrados.map(l => [
        l.data,
        l.descricao,
        l.valor.toString(),
        l.tipo,
        categorias.find(c => c.id === l.categoria)?.nome || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
    } else {
      // Exportação PDF usando jsPDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text('Relatório Financeiro', 14, 22);
      
      // Subtítulo com filtros
      doc.setFontSize(12);
      let y = 32;
      if (filtros?.dataInicio || filtros?.dataFim) {
        doc.text(`Período: ${filtros?.dataInicio || ''} a ${filtros?.dataFim || ''}`, 14, y);
        y += 8;
      }
      if (filtros?.tipo) {
        doc.text(`Tipo: ${filtros.tipo}`, 14, y);
        y += 8;
      }
      if (filtros?.categoria) {
        const categoriaNome = categorias.find(c => c.id === filtros.categoria)?.nome;
        doc.text(`Categoria: ${categoriaNome}`, 14, y);
        y += 8;
      }

      // Tabela de lançamentos
      const headers = [['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria']];
      const rows = dadosFiltrados.map(l => [
        l.data,
        l.descricao,
        l.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        l.tipo,
        categorias.find(c => c.id === l.categoria)?.nome || ''
      ]);

      doc.autoTable({
        head: headers,
        body: rows,
        startY: y + 5,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Totais
      const total = dadosFiltrados.reduce((sum, l) => sum + l.valor, 0);
      const totalEntradas = dadosFiltrados.filter(l => l.tipo === 'entrada').reduce((sum, l) => sum + l.valor, 0);
      const totalSaidas = dadosFiltrados.filter(l => l.tipo === 'saida').reduce((sum, l) => sum + l.valor, 0);

      y = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total de Entradas: ${totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);
      y += 8;
      doc.text(`Total de Saídas: ${totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);
      y += 8;
      doc.text(`Saldo: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);

      // Rodapé
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Download do PDF
      doc.save(`relatorio_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    }
  };

  const calcularTotais = () => {
    const hoje = new Date();
    const mesAtual = format(hoje, 'yyyy-MM');
    const mesAnterior = format(new Date(hoje.getFullYear(), hoje.getMonth() - 1), 'yyyy-MM');

    const lancamentosMesAtual = lancamentos.filter(l => {
      const competencia = l.competencia || format(new Date(l.data), 'yyyy-MM');
      return competencia === mesAtual;
    });

    const lancamentosMesAnterior = lancamentos.filter(l => {
      const competencia = l.competencia || format(new Date(l.data), 'yyyy-MM');
      return competencia === mesAnterior;
    });

    const receitasMesAtual = lancamentosMesAtual
      .filter(l => l.tipo === 'entrada')
      .reduce((total, l) => total + l.valor, 0);

    const despesasMesAtual = lancamentosMesAtual
      .filter(l => l.tipo === 'saida')
      .reduce((total, l) => total + l.valor, 0);

    const receitasMesAnterior = lancamentosMesAnterior
      .filter(l => l.tipo === 'entrada')
      .reduce((total, l) => total + l.valor, 0);

    const despesasMesAnterior = lancamentosMesAnterior
      .filter(l => l.tipo === 'saida')
      .reduce((total, l) => total + l.valor, 0);

    const saldoMesAtual = receitasMesAtual - despesasMesAtual;
    const saldoMesAnterior = receitasMesAnterior - despesasMesAnterior;
    const saldoTotal = lancamentos
      .reduce((total, l) => total + (l.tipo === 'entrada' ? l.valor : -l.valor), 0);

    return {
      receitasMesAtual,
      despesasMesAtual,
      receitasMesAnterior,
      despesasMesAnterior,
      saldoMesAtual,
      saldoMesAnterior,
      saldoTotal
    };
  };

  const calcularTendencias = () => {
    const { 
      receitasMesAtual, 
      receitasMesAnterior,
      despesasMesAtual,
      despesasMesAnterior,
      saldoMesAtual,
      saldoMesAnterior 
    } = calcularTotais();

    const calcularVariacao = (atual: number, anterior: number) => {
      if (anterior === 0) return atual > 0 ? 100 : 0;
      return ((atual - anterior) / anterior) * 100;
    };

    return {
      receitas: calcularVariacao(receitasMesAtual, receitasMesAnterior),
      despesas: calcularVariacao(despesasMesAtual, despesasMesAnterior),
      saldo: calcularVariacao(saldoMesAtual, saldoMesAnterior)
    };
  };

  const calcularTotaisPorCategoria = () => {
    const totaisPorCategoria = lancamentos.reduce(
      (acc, lancamento) => {
        const categoria = categorias.find(c => c.id === lancamento.categoria);
        if (!categoria) return acc;

        const valor = Number(lancamento.valor) || 0;
        const tipo = lancamento.tipo === 'entrada' ? 'receitas' : 'despesas';

        const index = acc[tipo].findIndex(item => item.id === lancamento.categoria);
        if (index === -1) {
          acc[tipo].push({
            id: lancamento.categoria,
            nome: categoria.nome,
            valor: valor,
          });
        } else {
          acc[tipo][index].valor += valor;
        }

        return acc;
      },
      { receitas: [], despesas: [] } as {
        receitas: { id: number; nome: string; valor: number }[];
        despesas: { id: number; nome: string; valor: number }[];
      }
    );

    return {
      receitas: totaisPorCategoria.receitas.sort((a, b) => b.valor - a.valor),
      despesas: totaisPorCategoria.despesas.sort((a, b) => b.valor - a.valor),
    };
  };

  const adicionarClientePF = (cliente: Omit<ClientePF, 'id' | 'userId'>) => {
    const novoCliente: ClientePF = {
      ...cliente,
      id: Math.random(),
      userId
    };
    setClientesPF(prev => [...prev, novoCliente]);
  };

  const adicionarClientePJ = (cliente: Omit<ClientePJ, 'id' | 'userId'>) => {
    const novoCliente: ClientePJ = {
      ...cliente,
      id: Math.random(),
      userId
    };
    setClientesPJ(prev => [...prev, novoCliente]);
  };

  const editarClientePF = (id: number, cliente: Partial<ClientePF>) => {
    setClientesPF(prev => prev.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const editarClientePJ = (id: number, cliente: Partial<ClientePJ>) => {
    setClientesPJ(prev => prev.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const removerClientePF = (id: number) => {
    setClientesPF(prev => prev.filter(c => c.id !== id));
  };

  const removerClientePJ = (id: number) => {
    setClientesPJ(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider value={{
      categorias: filtrarPorUsuario(categorias),
      contasBancarias: filtrarPorUsuario(contasBancarias),
      formasPagamento: filtrarPorUsuario(formasPagamento),
      centrosCusto: filtrarPorUsuario(centrosCusto),
      tiposDocumento: filtrarPorUsuario(tiposDocumento),
      lancamentos: filtrarPorUsuario(lancamentos),
      cartoesCredito: filtrarPorUsuario(cartoesCredito),
      faturas: filtrarPorUsuario(faturas),
      clientesPF: filtrarPorUsuario(clientesPF),
      clientesPJ: filtrarPorUsuario(clientesPJ),
      adicionarCategoria,
      adicionarContaBancaria,
      adicionarFormaPagamento,
      adicionarCentroCusto,
      adicionarTipoDocumento,
      adicionarLancamento,
      adicionarCartao,
      processarFatura,
      exportarRelatorio,
      adicionarClientePF,
      adicionarClientePJ,
      editarClientePF,
      editarClientePJ,
      removerClientePF,
      removerClientePJ,
      calcularTotais,
      calcularTotaisPorCategoria,
      calcularTendencias,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

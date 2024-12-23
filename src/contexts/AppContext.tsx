import { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Categoria {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
}

interface ContaBancaria {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
}

interface FormaPagamento {
  id: number;
  nome: string;
}

interface CentroCusto {
  id: number;
  nome: string;
}

interface TipoDocumento {
  id: number;
  nome: string;
}

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida' | 'transferencia';
  data: string;
  vencimento: string;
  competencia: string;
  categoria: number;
  contaBancaria: number;
  formaPagamento: number;
  status: 'pago' | 'a_pagar' | 'recebido' | 'a_receber';
  centroCusto: number;
  recorrencia?: {
    tipo: 'nao_repete' | 'mais_uma_vez' | 'sempre';
    periodicidade?: 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
    quantidade?: number;
  };
  anexos?: string[];
  observacoes?: string;
  numeroDocumento?: string;
  tipoDocumento?: number;
}

interface AppContextType {
  categorias: Categoria[];
  contasBancarias: ContaBancaria[];
  formasPagamento: FormaPagamento[];
  centrosCusto: CentroCusto[];
  tiposDocumento: TipoDocumento[];
  lancamentos: Lancamento[];
  adicionarCategoria: (categoria: Omit<Categoria, 'id'>) => void;
  adicionarContaBancaria: (conta: Omit<ContaBancaria, 'id'>) => void;
  adicionarFormaPagamento: (forma: Omit<FormaPagamento, 'id'>) => void;
  adicionarCentroCusto: (centro: Omit<CentroCusto, 'id'>) => void;
  adicionarTipoDocumento: (tipo: Omit<TipoDocumento, 'id'>) => void;
  adicionarLancamento: (lancamento: Omit<Lancamento, 'id'>) => void;
  editarCategoria: (id: string, categoria: Partial<Categoria>) => void;
  editarContaBancaria: (id: number, conta: Partial<ContaBancaria>) => void;
  editarFormaPagamento: (id: number, forma: Partial<FormaPagamento>) => void;
  editarCentroCusto: (id: number, centro: Partial<CentroCusto>) => void;
  editarTipoDocumento: (id: number, tipo: Partial<TipoDocumento>) => void;
  editarLancamento: (id: number, lancamento: Partial<Lancamento>) => void;
  removerCategoria: (id: string) => void;
  removerContaBancaria: (id: number) => void;
  removerFormaPagamento: (id: number) => void;
  removerCentroCusto: (id: number) => void;
  removerTipoDocumento: (id: number) => void;
  removerLancamento: (id: number) => void;
  calcularTotais: () => {
    saldoTotal: number;
    receitasTotal: number;
    despesasTotal: number;
    saldoMesAtual: number;
    receitasMesAtual: number;
    despesasMesAtual: number;
  };
  calcularTotaisPorCategoria: () => {
    receitas: { id: number; nome: string; valor: number }[];
    despesas: { id: number; nome: string; valor: number }[];
  };
  calcularTendencias: () => {
    saldo: number;
    receitas: number;
    despesas: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>(() => {
    const saved = localStorage.getItem('categorias');
    return saved ? JSON.parse(saved) : [];
  });

  const [contasBancarias, setContasBancarias] = useState<ContaBancaria[]>(() => {
    const saved = localStorage.getItem('contasBancarias');
    return saved ? JSON.parse(saved) : [];
  });

  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>(() => {
    const saved = localStorage.getItem('formasPagamento');
    return saved ? JSON.parse(saved) : [];
  });

  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>(() => {
    const saved = localStorage.getItem('centrosCusto');
    return saved ? JSON.parse(saved) : [];
  });

  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>(() => {
    const saved = localStorage.getItem('tiposDocumento');
    return saved ? JSON.parse(saved) : [];
  });

  const [lancamentos, setLancamentos] = useState<Lancamento[]>(() => {
    const saved = localStorage.getItem('lancamentos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem('contasBancarias', JSON.stringify(contasBancarias));
  }, [contasBancarias]);

  useEffect(() => {
    localStorage.setItem('formasPagamento', JSON.stringify(formasPagamento));
  }, [formasPagamento]);

  useEffect(() => {
    localStorage.setItem('centrosCusto', JSON.stringify(centrosCusto));
  }, [centrosCusto]);

  useEffect(() => {
    localStorage.setItem('tiposDocumento', JSON.stringify(tiposDocumento));
  }, [tiposDocumento]);

  useEffect(() => {
    localStorage.setItem('lancamentos', JSON.stringify(lancamentos));
    // Dispara evento customizado quando os lançamentos mudam
    window.dispatchEvent(new CustomEvent('lancamentosUpdated', {
      detail: { lancamentos }
    }));
  }, [lancamentos]);

  const adicionarCategoria = (categoria: Omit<Categoria, 'id'>) => {
    setCategorias(prev => [...prev, { ...categoria, id: Date.now().toString() }]);
  };

  const adicionarContaBancaria = (conta: Omit<ContaBancaria, 'id'>) => {
    setContasBancarias(prev => [...prev, { ...conta, id: Date.now() }]);
  };

  const adicionarFormaPagamento = (forma: Omit<FormaPagamento, 'id'>) => {
    setFormasPagamento(prev => [...prev, { ...forma, id: Date.now() }]);
  };

  const adicionarCentroCusto = (centro: Omit<CentroCusto, 'id'>) => {
    setCentrosCusto(prev => [...prev, { ...centro, id: Date.now() }]);
  };

  const adicionarTipoDocumento = (tipo: Omit<TipoDocumento, 'id'>) => {
    setTiposDocumento(prev => [...prev, { ...tipo, id: Date.now() }]);
  };

  const adicionarLancamento = (lancamento: Omit<Lancamento, 'id'>) => {
    setLancamentos(prev => [...prev, { ...lancamento, id: Date.now() }]);
  };

  const editarCategoria = (id: string, categoria: Partial<Categoria>) => {
    setCategorias(prev => prev.map(item => item.id === id ? { ...item, ...categoria } : item));
  };

  const editarContaBancaria = (id: number, conta: Partial<ContaBancaria>) => {
    setContasBancarias(prev => prev.map(item => item.id === id ? { ...item, ...conta } : item));
  };

  const editarFormaPagamento = (id: number, forma: Partial<FormaPagamento>) => {
    setFormasPagamento(prev => prev.map(item => item.id === id ? { ...item, ...forma } : item));
  };

  const editarCentroCusto = (id: number, centro: Partial<CentroCusto>) => {
    setCentrosCusto(prev => prev.map(item => item.id === id ? { ...item, ...centro } : item));
  };

  const editarTipoDocumento = (id: number, tipo: Partial<TipoDocumento>) => {
    setTiposDocumento(prev => prev.map(item => item.id === id ? { ...item, ...tipo } : item));
  };

  const editarLancamento = (id: number, lancamento: Partial<Lancamento>) => {
    setLancamentos(prev => prev.map(item => item.id === id ? { ...item, ...lancamento } : item));
  };

  const removerCategoria = (id: string) => {
    setCategorias(prev => prev.filter(item => item.id !== id));
  };

  const removerContaBancaria = (id: number) => {
    setContasBancarias(prev => prev.filter(item => item.id !== id));
  };

  const removerFormaPagamento = (id: number) => {
    setFormasPagamento(prev => prev.filter(item => item.id !== id));
  };

  const removerCentroCusto = (id: number) => {
    setCentrosCusto(prev => prev.filter(item => item.id !== id));
  };

  const removerTipoDocumento = (id: number) => {
    setTiposDocumento(prev => prev.filter(item => item.id !== id));
  };

  const removerLancamento = (id: number) => {
    setLancamentos(prev => prev.filter(item => item.id !== id));
  };

  const calcularTotais = () => {
    const hoje = new Date();
    const mesAtual = format(hoje, 'yyyy-MM');

    const totais = lancamentos.reduce(
      (acc, lancamento) => {
        const valor = Number(lancamento.valor) || 0;
        const ehMesAtual = lancamento.competencia === mesAtual;

        if (lancamento.tipo === 'entrada') {
          acc.receitasTotal += valor;
          if (ehMesAtual) acc.receitasMesAtual += valor;
        } else if (lancamento.tipo === 'saida') {
          acc.despesasTotal += valor;
          if (ehMesAtual) acc.despesasMesAtual += valor;
        }

        return acc;
      },
      {
        receitasTotal: 0,
        despesasTotal: 0,
        receitasMesAtual: 0,
        despesasMesAtual: 0,
      }
    );

    return {
      ...totais,
      saldoTotal: totais.receitasTotal - totais.despesasTotal,
      saldoMesAtual: totais.receitasMesAtual - totais.despesasMesAtual,
    };
  };

  const calcularTotaisPorCategoria = () => {
    const totaisPorCategoria = lancamentos.reduce(
      (acc, lancamento) => {
        const categoria = categorias.find(c => c.id === String(lancamento.categoria));
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

  const calcularTendencias = () => {
    const hoje = new Date();
    const mesAtual = format(hoje, 'yyyy-MM');
    const mesAnterior = format(new Date(hoje.getFullYear(), hoje.getMonth() - 1), 'yyyy-MM');

    const totaisMesAtual = lancamentos
      .filter(l => l.competencia === mesAtual)
      .reduce(
        (acc, l) => {
          const valor = Number(l.valor) || 0;
          if (l.tipo === 'entrada') acc.receitas += valor;
          else if (l.tipo === 'saida') acc.despesas += valor;
          return acc;
        },
        { receitas: 0, despesas: 0 }
      );

    const totaisMesAnterior = lancamentos
      .filter(l => l.competencia === mesAnterior)
      .reduce(
        (acc, l) => {
          const valor = Number(l.valor) || 0;
          if (l.tipo === 'entrada') acc.receitas += valor;
          else if (l.tipo === 'saida') acc.despesas += valor;
          return acc;
        },
        { receitas: 0, despesas: 0 }
      );

    return {
      receitas: totaisMesAnterior.receitas ? 
        ((totaisMesAtual.receitas - totaisMesAnterior.receitas) / totaisMesAnterior.receitas) * 100 : 0,
      despesas: totaisMesAnterior.despesas ? 
        ((totaisMesAtual.despesas - totaisMesAnterior.despesas) / totaisMesAnterior.despesas) * 100 : 0,
      saldo: totaisMesAnterior.receitas - totaisMesAnterior.despesas ? 
        (((totaisMesAtual.receitas - totaisMesAtual.despesas) - 
          (totaisMesAnterior.receitas - totaisMesAnterior.despesas)) / 
          Math.abs(totaisMesAnterior.receitas - totaisMesAnterior.despesas)) * 100 : 0,
    };
  };

  return (
    <AppContext.Provider
      value={{
        categorias,
        contasBancarias,
        formasPagamento,
        centrosCusto,
        tiposDocumento,
        lancamentos,
        adicionarCategoria,
        adicionarContaBancaria,
        adicionarFormaPagamento,
        adicionarCentroCusto,
        adicionarTipoDocumento,
        adicionarLancamento,
        editarCategoria,
        editarContaBancaria,
        editarFormaPagamento,
        editarCentroCusto,
        editarTipoDocumento,
        editarLancamento,
        removerCategoria,
        removerContaBancaria,
        removerFormaPagamento,
        removerCentroCusto,
        removerTipoDocumento,
        removerLancamento,
        calcularTotais,
        calcularTotaisPorCategoria,
        calcularTendencias,
      }}
    >
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

import { createContext, useContext, useState, useEffect } from 'react';

interface Categoria {
  id: number;
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
  editarCategoria: (id: number, categoria: Partial<Categoria>) => void;
  editarContaBancaria: (id: number, conta: Partial<ContaBancaria>) => void;
  editarFormaPagamento: (id: number, forma: Partial<FormaPagamento>) => void;
  editarCentroCusto: (id: number, centro: Partial<CentroCusto>) => void;
  editarTipoDocumento: (id: number, tipo: Partial<TipoDocumento>) => void;
  editarLancamento: (id: number, lancamento: Partial<Lancamento>) => void;
  removerCategoria: (id: number) => void;
  removerContaBancaria: (id: number) => void;
  removerFormaPagamento: (id: number) => void;
  removerCentroCusto: (id: number) => void;
  removerTipoDocumento: (id: number) => void;
  removerLancamento: (id: number) => void;
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
    setCategorias(prev => [...prev, { ...categoria, id: Date.now() }]);
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

  const editarCategoria = (id: number, categoria: Partial<Categoria>) => {
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

  const removerCategoria = (id: number) => {
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

  return (
    <AppContext.Provider value={{
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
      removerLancamento
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

import { createContext, useContext, useState, ReactNode } from "react";

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: number;
  competencia: string;
  data: string;
  conta: number;
  status: 'pendente' | 'pago' | 'recebido';
}

interface AppContextData {
  lancamentos: Lancamento[];
  adicionarLancamento: (lancamento: Lancamento) => void;
  editarLancamento: (id: number, lancamento: Partial<Lancamento>) => void;
  removerLancamento: (id: number) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    // Dados de exemplo
    {
      id: 1,
      descricao: "Salário",
      valor: 5000,
      tipo: "receita",
      categoria: 1,
      competencia: "2024-01",
      data: "2024-01-05",
      conta: 1,
      status: "recebido"
    },
    {
      id: 2,
      descricao: "Aluguel",
      valor: 1500,
      tipo: "despesa",
      categoria: 2,
      competencia: "2024-01",
      data: "2024-01-10",
      conta: 1,
      status: "pago"
    },
    // Adicione mais dados de exemplo conforme necessário
  ]);

  const adicionarLancamento = (lancamento: Lancamento) => {
    setLancamentos(prev => [...prev, { ...lancamento, id: prev.length + 1 }]);
  };

  const editarLancamento = (id: number, lancamento: Partial<Lancamento>) => {
    setLancamentos(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...lancamento } : item
      )
    );
  };

  const removerLancamento = (id: number) => {
    setLancamentos(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        lancamentos,
        adicionarLancamento,
        editarLancamento,
        removerLancamento,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

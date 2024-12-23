import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lancamento {
  data: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
}

interface FaturaCartao {
  cartao: string;
  mesReferencia: string;
  dataFechamento: Date;
  dataVencimento: Date;
  valorTotal: number;
  lancamentos: Array<{
    data: Date;
    descricao: string;
    valor: number;
    estabelecimento: string;
  }>;
}

export const gerarPDFExtrato = (lancamentos: Lancamento[], periodo: { inicio: string; fim: string }) => {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Extrato Financeiro', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Período: ${format(new Date(periodo.inicio), 'dd/MM/yyyy')} a ${format(new Date(periodo.fim), 'dd/MM/yyyy')}`, 14, 32);

  // Tabela de lançamentos
  const rows = lancamentos.map(l => [
    format(new Date(l.data), 'dd/MM/yyyy'),
    l.descricao,
    l.categoria,
    l.tipo === 'entrada' ? 'Receita' : 'Despesa',
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(l.valor)
  ]);

  autoTable(doc, {
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: rows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Totais
  const totalEntradas = lancamentos
    .filter(l => l.tipo === 'entrada')
    .reduce((sum, l) => sum + l.valor, 0);

  const totalSaidas = lancamentos
    .filter(l => l.tipo === 'saida')
    .reduce((sum, l) => sum + l.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  const finalY = (doc as any).lastAutoTable.finalY || 40;

  doc.setFontSize(10);
  doc.text('Resumo:', 14, finalY + 10);
  doc.text(`Total de Entradas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEntradas)}`, 14, finalY + 20);
  doc.text(`Total de Saídas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaidas)}`, 14, finalY + 30);
  doc.text(`Saldo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}`, 14, finalY + 40);

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const gerarPDFFatura = (fatura: FaturaCartao) => {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Fatura do Cartão', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Cartão: ${fatura.cartao}`, 14, 32);
  doc.text(`Mês de Referência: ${format(new Date(fatura.mesReferencia), 'MMMM yyyy', { locale: ptBR })}`, 14, 42);
  doc.text(`Vencimento: ${format(fatura.dataVencimento, 'dd/MM/yyyy')}`, 14, 52);

  // Tabela de lançamentos
  const rows = fatura.lancamentos.map(l => [
    format(l.data, 'dd/MM/yyyy'),
    l.descricao,
    l.estabelecimento,
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(l.valor)
  ]);

  autoTable(doc, {
    head: [['Data', 'Descrição', 'Estabelecimento', 'Valor']],
    body: rows,
    startY: 60,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 60;
  doc.setFontSize(12);
  doc.text(
    `Total da Fatura: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valorTotal)}`,
    14,
    finalY + 20
  );

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const gerarPDFFluxoCaixa = (lancamentos: Lancamento[], periodo: { inicio: string; fim: string }) => {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Fluxo de Caixa', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Período: ${format(new Date(periodo.inicio), 'dd/MM/yyyy')} a ${format(new Date(periodo.fim), 'dd/MM/yyyy')}`, 14, 32);

  // Agrupar por categoria
  const categorias = lancamentos.reduce((acc, l) => {
    if (!acc[l.categoria]) {
      acc[l.categoria] = {
        entradas: 0,
        saidas: 0
      };
    }
    if (l.tipo === 'entrada') {
      acc[l.categoria].entradas += l.valor;
    } else {
      acc[l.categoria].saidas += l.valor;
    }
    return acc;
  }, {} as Record<string, { entradas: number; saidas: number }>);

  // Tabela de fluxo por categoria
  const rows = Object.entries(categorias).map(([categoria, valores]) => [
    categoria,
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.entradas),
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.saidas),
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.entradas - valores.saidas)
  ]);

  autoTable(doc, {
    head: [['Categoria', 'Entradas', 'Saídas', 'Saldo']],
    body: rows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Totais
  const totalEntradas = lancamentos
    .filter(l => l.tipo === 'entrada')
    .reduce((sum, l) => sum + l.valor, 0);

  const totalSaidas = lancamentos
    .filter(l => l.tipo === 'saida')
    .reduce((sum, l) => sum + l.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  const finalY = (doc as any).lastAutoTable.finalY || 40;

  doc.setFontSize(10);
  doc.text('Resumo:', 14, finalY + 10);
  doc.text(`Total de Entradas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEntradas)}`, 14, finalY + 20);
  doc.text(`Total de Saídas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaidas)}`, 14, finalY + 30);
  doc.text(`Saldo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}`, 14, finalY + 40);

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
};

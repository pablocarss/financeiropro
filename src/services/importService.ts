import Papa from 'papaparse';

interface ImportedTransaction {
  data: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria?: string;
  estabelecimento?: string;
}

export const importarCSV = (file: File): Promise<ImportedTransaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = results.data.map((row: any) => ({
            data: row.data || row.DATA || row.Date || '',
            descricao: row.descricao || row.DESCRICAO || row.Description || '',
            valor: parseFloat(String(row.valor || row.VALOR || row.Amount).replace(',', '.')),
            tipo: parseFloat(String(row.valor || row.VALOR || row.Amount)) >= 0 ? 'entrada' : 'saida',
            categoria: row.categoria || row.CATEGORIA || row.Category || '',
            estabelecimento: row.estabelecimento || row.ESTABELECIMENTO || row.Merchant || ''
          }));
          resolve(transactions);
        } catch (error) {
          reject(new Error('Erro ao processar arquivo CSV'));
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const importarOFX = async (file: File): Promise<ImportedTransaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        
        // Extrair transações do OFX
        const transactions: ImportedTransaction[] = [];
        
        // Encontrar todas as transações no arquivo OFX
        const transactionRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
        let match;
        
        while ((match = transactionRegex.exec(text)) !== null) {
          const transaction = match[1];
          
          // Extrair dados da transação
          const dateMatch = /<DTPOSTED>(\d{8})<\/DTPOSTED>/.exec(transaction);
          const amountMatch = /<TRNAMT>([-\d.]+)<\/TRNAMT>/.exec(transaction);
          const descMatch = /<MEMO>(.*?)<\/MEMO>/.exec(transaction);
          
          if (dateMatch && amountMatch) {
            const date = dateMatch[1];
            const amount = parseFloat(amountMatch[1]);
            const desc = descMatch ? descMatch[1] : '';
            
            transactions.push({
              data: `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)}`,
              descricao: desc,
              valor: Math.abs(amount),
              tipo: amount >= 0 ? 'entrada' : 'saida',
              estabelecimento: desc
            });
          }
        }
        
        resolve(transactions);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo OFX'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
};

export const processarArquivo = async (file: File): Promise<ImportedTransaction[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return importarCSV(file);
    case 'ofx':
      return importarOFX(file);
    default:
      throw new Error('Formato de arquivo não suportado');
  }
};

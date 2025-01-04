import * as pdfjs from 'pdfjs-dist';
import { Transaction } from '@/types/transaction';

export interface CreditCardTransaction extends Transaction {
  cardId: string;
  userId?: string;
  installment?: {
    current: number;
    total: number;
  };
}

export class CreditCardService {
  static async extractTransactionsFromPDF(file: File): Promise<CreditCardTransaction[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    const transactions: CreditCardTransaction[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      
      // Aqui implementamos a lógica de extração específica para cada banco
      // Por enquanto vamos usar um exemplo simples
      const lines = text.split('\n');
      
      for (const line of lines) {
        const transaction = this.parseTransactionLine(line);
        if (transaction) {
          transactions.push(transaction);
        }
      }
    }
    
    return transactions;
  }
  
  private static parseTransactionLine(line: string): CreditCardTransaction | null {
    // Implementar regex específicos para cada banco/formato de fatura
    const regex = /(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+R\$\s+(\d+,\d{2})/;
    const match = line.match(regex);
    
    if (match) {
      const [_, date, description, amount] = match;
      return {
        cardId: '', // Será preenchido depois
        date: new Date(date),
        description,
        amount: parseFloat(amount.replace(',', '.')),
        type: 'expense',
        status: 'pending'
      };
    }
    
    return null;
  }
  
  static async processInvoice(file: File, cardId: string): Promise<CreditCardTransaction[]> {
    const transactions = await this.extractTransactionsFromPDF(file);
    return transactions.map(transaction => ({
      ...transaction,
      cardId
    }));
  }
}

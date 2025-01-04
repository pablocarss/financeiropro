export class CreditCardInvoiceService {
  private static pdfjsLib: any;

  private static async loadPdfJs() {
    if (!this.pdfjsLib) {
      const pdfjsScript = document.createElement('script');
      pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      document.head.appendChild(pdfjsScript);

      await new Promise<void>((resolve) => {
        pdfjsScript.onload = () => {
          // @ts-ignore
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.pdfjsLib = pdfjsLib;
          resolve();
        };
      });
    }
    return this.pdfjsLib;
  }

  static async processInvoice(file: File): Promise<any> {
    console.log("Iniciando processamento da fatura...");

    try {
      const text = await this.extractTextFromPDF(file);
      console.log("Texto extraído do PDF:", text);

      if (text.includes("Nubank") || text.includes("Nu Pagamentos")) {
        console.log("Usando padrão Nubank para processamento");
        return this.processNubankInvoice(text);
      }

      throw new Error("Formato de fatura não reconhecido");
    } catch (error) {
      console.error("Erro ao processar fatura:", error);
      throw error;
    }
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    await this.loadPdfJs();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const pdfData = event.target?.result;
          const pdf = await this.pdfjsLib.getDocument({ data: pdfData }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private static processNubankInvoice(text: string) {
    console.log("Texto completo para debug:", text);

    const transactions: any[] = [];
    
    // Encontra a seção de transações
    const transactionStart = text.indexOf("TRANSAÇÕES   DE 01 DEZ A 01 JAN");
    if (transactionStart === -1) {
      console.log("Seção de transações não encontrada");
      return { bankName: "Nubank", transactions: [] };
    }

    // Extrai apenas a parte do texto que contém as transações
    const transactionText = text.substring(transactionStart);
    const lines = transactionText.split(/\s{2,}/); // Divide por 2 ou mais espaços
    console.log("Total de linhas após split:", lines.length);

    // Regex para identificar transações
    const dateRegex = /^\d{2} DEZ$/;
    let currentTransaction: any = null;

    lines.forEach((part, index) => {
      // Se encontrou uma data
      if (dateRegex.test(part.trim())) {
        // Se já tem uma transação pendente, salva ela
        if (currentTransaction && currentTransaction.amount) {
          transactions.push(currentTransaction);
        }

        currentTransaction = {
          date: part.trim(),
          description: "",
          amount: null
        };
        return;
      }

      // Se tem uma transação em andamento
      if (currentTransaction) {
        // Procura valor em R$
        const valueMatch = part.match(/R\$\s*([-\d.,]+)/);
        if (valueMatch) {
          // Se ainda não tem descrição, a parte anterior deve ser a descrição
          if (!currentTransaction.description && index > 0) {
            currentTransaction.description = lines[index - 1].trim();
          }
          
          currentTransaction.amount = parseFloat(valueMatch[1].replace(".", "").replace(",", "."));
          transactions.push(currentTransaction);
          console.log("Transação adicionada:", currentTransaction);
          currentTransaction = null;
        }
        // Se não tem valor e não é a data, deve ser parte da descrição
        else if (!part.match(dateRegex)) {
          currentTransaction.description = (currentTransaction.description + " " + part).trim();
        }
      }
    });

    // Adiciona a última transação se existir
    if (currentTransaction && currentTransaction.amount) {
      transactions.push(currentTransaction);
    }

    console.log("Total de transações encontradas:", transactions.length);

    const result = {
      bankName: "Nubank",
      transactions: transactions.filter(t => 
        t.date && 
        t.description && 
        t.amount !== null &&
        !t.description.includes("Pagamento em") &&
        !t.description.includes("Saldo restante")
      )
    };

    console.log("Fatura processada:", result);
    return result;
  }
}

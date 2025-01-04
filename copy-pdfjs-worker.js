import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyWorker() {
  try {
    // Caminho do arquivo worker na pasta node_modules
    const workerSrc = join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');

    // Caminho de destino na pasta public
    const publicDir = join(__dirname, 'public');
    const workerDest = join(publicDir, 'pdf.worker.min.js');

    // Cria a pasta public se não existir
    try {
      await fs.access(publicDir);
    } catch {
      await fs.mkdir(publicDir);
    }

    // Copia o arquivo
    await fs.copyFile(workerSrc, workerDest);
    console.log('Worker copiado com sucesso!');
  } catch (error) {
    console.error('Erro ao copiar worker:', error);
  }
}

copyWorker();

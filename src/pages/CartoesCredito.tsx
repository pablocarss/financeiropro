import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { NovoCartaoModal } from "@/components/cartoes/NovoCartaoModal";
import { FaturaPreviewModal } from "@/components/cartoes/FaturaPreviewModal";
import { CreditCardInvoiceService } from "@/services/creditCardInvoiceService";
import { toast } from "@/components/ui/use-toast";

export default function CartoesCredito() {
  const { cartoesCredito } = useApp();
  const [activeTab, setActiveTab] = useState("meus-cartoes");
  const [showNovoCartaoModal, setShowNovoCartaoModal] = useState(false);
  const [showFaturaPreviewModal, setShowFaturaPreviewModal] = useState(false);
  const [faturaData, setFaturaData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsProcessing(true);
        try {
          const result = await CreditCardInvoiceService.processInvoice(acceptedFiles[0]);
          setFaturaData(result);
          setShowFaturaPreviewModal(true);
          toast({
            title: "Fatura processada com sucesso",
            description: `Identificamos ${result.transactions.length} transações da fatura ${result.bankName}`,
          });
        } catch (error) {
          toast({
            title: "Erro ao processar fatura",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
        <Button onClick={() => setShowNovoCartaoModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cartão
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="meus-cartoes">Meus Cartões</TabsTrigger>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="importar">Importar Fatura</TabsTrigger>
        </TabsList>

        <TabsContent value="meus-cartoes">
          <Card>
            <CardHeader>
              <CardTitle>Meus Cartões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartoesCredito.map((cartao) => (
                  <Card key={cartao.id} className="bg-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8" />
                        <div>
                          <h3 className="font-semibold">{cartao.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cartao.bandeira}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p>Limite: R$ {cartao.limite.toFixed(2)}</p>
                        <p>Fechamento: Dia {cartao.diaFechamento}</p>
                        <p>Vencimento: Dia {cartao.diaVencimento}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importar">
          <Card>
            <CardHeader>
              <CardTitle>Importar Fatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center 
                  transition-colors duration-200 ease-in-out
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                `}
              >
                <input {...getInputProps()} />
                {isProcessing ? (
                  <>
                    <Loader2 className="mx-auto h-12 w-12 mb-4 animate-spin text-primary" />
                    <h3 className="text-lg font-semibold mb-2">
                      Processando fatura...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Isso pode levar alguns segundos
                    </p>
                  </>
                ) : (
                  <>
                    <CreditCard className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isDragActive
                        ? "Solte a fatura aqui"
                        : "Arraste e solte a fatura aqui"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Suporta faturas em PDF dos principais bancos
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      (Nubank, Itaú, Bradesco, Santander e outros)
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Novo Cartão */}
      <NovoCartaoModal 
        isOpen={showNovoCartaoModal}
        onClose={() => setShowNovoCartaoModal(false)}
      />

      {/* Modal de Preview da Fatura */}
      {faturaData && (
        <FaturaPreviewModal
          isOpen={showFaturaPreviewModal}
          onClose={() => {
            setShowFaturaPreviewModal(false);
            setFaturaData(null);
          }}
          faturaData={faturaData}
        />
      )}
    </div>
  );
}

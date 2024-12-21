import { Card } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

export function Painel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total a Receber</p>
              <h2 className="text-2xl font-bold text-green-500">
                R$ 45.231,89
              </h2>
              <p className="text-sm text-green-500">+20.1% em relação ao mês anterior</p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total a Pagar</p>
              <h2 className="text-2xl font-bold text-red-500">
                R$ 12.543,67
              </h2>
              <p className="text-sm text-red-500">-4.5% em relação ao mês anterior</p>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="gradient-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
              <h2 className="text-2xl font-bold text-purple-500">
                R$ 32.688,22
              </h2>
              <p className="text-sm text-muted-foreground">Somatório de todas as contas</p>
            </div>
            <Wallet className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Adicione mais conteúdo do painel aqui */}
    </div>
  );
}

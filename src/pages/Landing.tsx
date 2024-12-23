import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Landing() {
  const navigate = useNavigate();

  const planos = [
    {
      nome: "Básico",
      preco: "Grátis",
      periodo: "",
      recursos: [
        "Controle de receitas e despesas",
        "Categorização de transações",
        "Relatórios básicos",
      ],
      destaque: false,
    },
    {
      nome: "Pro",
      preco: "R$ 29,90/mês",
      periodo: "",
      recursos: [
        "Todas as funcionalidades do plano básico",
        "Importação de extratos bancários",
        "Relatórios avançados",
        "Suporte prioritário",
      ],
      destaque: true,
    },
    {
      nome: "Enterprise",
      preco: "R$ 99,90/mês",
      periodo: "",
      recursos: [
        "Todas as funcionalidades do plano pro",
        "API para integração",
        "Usuários ilimitados",
        "Suporte 24/7",
      ],
      destaque: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="FinanceiroPRO" className="w-8 h-8" />
          <span className="font-semibold text-xl tracking-tight text-primary">FinanceiroPRO</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/registro")}>Registre-se</Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Gerencie suas finanças com{" "}
            <span className="text-primary">simplicidade</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Tenha controle total sobre suas receitas e despesas com nossa
            plataforma intuitiva e poderosa.
          </p>
          <Button size="lg" onClick={() => navigate("/registro")} className="px-8">
            Comece Grátis
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planos.map((plano) => (
            <Card
              key={plano.nome}
              className={cn(
                "relative overflow-hidden",
                plano.destaque && "border-primary shadow-lg"
              )}
            >
              {plano.destaque && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm rounded-bl">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <CardDescription className="text-3xl font-bold">
                  {plano.preco}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plano.destaque ? "default" : "outline"}
                  onClick={() => navigate("/registro")}
                >
                  {plano.nome === "Enterprise"
                    ? "Contate Vendas"
                    : plano.destaque
                    ? "Assinar Agora"
                    : "Começar Agora"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Produto</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Recursos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Preços</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Atualizações</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Sobre</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Documentação</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Termos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/logo.svg" alt="FinanceiroPRO" className="w-6 h-6" />
              <span className="text-sm text-muted-foreground">
                FinanceiroPRO v1.0 2024
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Desenvolvido por Plazer</span>
              <sup>®</sup>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

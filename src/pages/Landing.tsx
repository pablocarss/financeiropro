import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <nav className="container flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <img 
              src="/public/vite.svg" 
              alt="FinanceiroPRO" 
              className="w-8 h-8"
            />
            <div className="text-2xl font-bold text-primary">FinanceiroPRO</div>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/registro")}>Registre-se</Button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gerencie suas finanças com{" "}
            <span className="text-primary">simplicidade</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tenha controle total sobre suas receitas e despesas com nossa
            plataforma intuitiva e poderosa.
          </p>
          <Button size="lg" onClick={() => navigate("/registro")}>
            Comece Grátis
          </Button>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {planos.map((plano) => (
            <Card
              key={plano.nome}
              className={`p-6 border rounded-lg ${
                plano.destaque
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">{plano.nome}</h3>
              <p className="text-3xl font-bold mb-4">{plano.preco}</p>
              <ul className="space-y-2 mb-6">
                {plano.recursos.map((recurso) => (
                  <li key={recurso} className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    {recurso}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plano.destaque ? "secondary" : "outline"}
                onClick={() => navigate("/registro")}
              >
                {plano.nome === "Enterprise"
                  ? "Contate Vendas"
                  : plano.destaque
                  ? "Assinar Agora"
                  : "Começar Agora"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

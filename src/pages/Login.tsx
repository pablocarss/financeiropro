import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chrome } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Login() {
  const navigate = useNavigate()
  const { login, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Preencha todos os campos.",
      })
      return
    }
    
    setLoading(true)

    try {
      const { user } = await login(email, password)
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta${user.displayName ? `, ${user.displayName}` : ''}!`,
      })
      navigate("/dashboard")
    } catch (error: any) {
      let message = "Email ou senha incorretos."
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Email ou senha incorretos."
      } else if (error.code === "auth/invalid-email") {
        message = "Email inválido."
      } else if (error.code === "auth/user-disabled") {
        message = "Esta conta foi desativada."
      } else if (error.code === "auth/too-many-requests") {
        message = "Muitas tentativas. Tente novamente mais tarde."
      }

      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle()
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo${user.displayName ? `, ${user.displayName}` : ''}!`,
      })
      navigate("/dashboard")
    } catch (error: any) {
      let message = "Tente novamente mais tarde."
      
      if (error.code === "auth/popup-closed-by-user") {
        message = "Login cancelado. Tente novamente."
      } else if (error.code === "auth/popup-blocked") {
        message = "Pop-up bloqueado pelo navegador. Permita pop-ups para continuar."
      }

      toast({
        variant: "destructive",
        title: "Erro ao fazer login com Google",
        description: message,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Faça login para continuar no FinanceiroPRO
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Button
            variant="link"
            className="pl-1"
            onClick={() => navigate("/registro")}
          >
            Registre-se
          </Button>
        </p>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chrome } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Registro() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Todos os campos são obrigatórios.",
      })
      return false
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "As senhas não coincidem.",
      })
      return false
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "A senha deve ter pelo menos 6 caracteres.",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Digite um email válido.",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      await signUp(email, password, name)
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo ao FinanceiroPRO, ${name}!`,
      })
      navigate("/dashboard")
    } catch (error: any) {
      let message = "Tente novamente mais tarde."
      
      if (error.code === "auth/email-already-in-use") {
        message = "Este email já está em uso. Por favor, use outro email."
      } else if (error.code === "auth/invalid-email") {
        message = "Email inválido. Por favor, verifique o email digitado."
      } else if (error.code === "auth/weak-password") {
        message = "A senha é muito fraca. Use uma senha mais forte."
      } else if (error.code === "auth/network-request-failed") {
        message = "Erro de conexão. Verifique sua internet."
      }

      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate("/dashboard")
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao FinanceiroPRO.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta com Google",
        description: "Tente novamente mais tarde.",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground">
            Comece a controlar suas finanças hoje mesmo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
            />
          </div>
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
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              A senha deve ter pelo menos 6 caracteres
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
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
          Já tem uma conta?{" "}
          <Button
            variant="link"
            className="pl-1"
            onClick={() => navigate("/login")}
          >
            Faça login
          </Button>
        </p>
      </div>
    </div>
  )
}

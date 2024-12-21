import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  AuthError,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  updateUserEmail: (email: string) => Promise<void>
  updateUserPassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Primeiro cria o usuário
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      // Depois atualiza o perfil com o nome
      await updateProfile(user, {
        displayName: name,
      })

      // Força atualização do estado do usuário
      setUser({ ...user, displayName: name })
    } catch (error) {
      console.error("Erro no registro:", error)
      const authError = error as AuthError
      
      switch (authError.code) {
        case "auth/email-already-in-use":
          throw new Error("Este email já está em uso. Por favor, use outro email.")
        case "auth/invalid-email":
          throw new Error("O email fornecido é inválido.")
        case "auth/operation-not-allowed":
          throw new Error("O registro com email/senha não está habilitado.")
        case "auth/weak-password":
          throw new Error("A senha é muito fraca. Use uma senha mais forte.")
        default:
          throw new Error("Ocorreu um erro durante o registro. Tente novamente mais tarde.")
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const authError = error as AuthError
      
      switch (authError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          throw new Error("Email ou senha incorretos.")
        case "auth/invalid-email":
          throw new Error("O email fornecido é inválido.")
        case "auth/user-disabled":
          throw new Error("Esta conta foi desativada.")
        default:
          throw new Error("Erro ao fazer login. Tente novamente mais tarde.")
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      // Se não houver displayName, usa o email como nome
      if (!result.user.displayName && result.user.email) {
        await updateProfile(result.user, {
          displayName: result.user.email.split("@")[0],
        })
        // Atualiza o estado do usuário
        setUser({ ...result.user, displayName: result.user.email.split("@")[0] })
      }
      
      return result
    } catch (error) {
      const authError = error as AuthError
      
      switch (authError.code) {
        case "auth/popup-closed-by-user":
          throw new Error("Login cancelado. Tente novamente.")
        case "auth/popup-blocked":
          throw new Error("Pop-up bloqueado pelo navegador. Permita pop-ups para continuar.")
        default:
          throw new Error("Erro ao fazer login com Google. Tente novamente mais tarde.")
      }
    }
  }

  const logout = () => {
    return signOut(auth)
  }

  const updateUserProfile = async (displayName: string) => {
    if (!user) throw new Error("Usuário não autenticado")
    await updateProfile(user, { displayName })
    setUser({ ...user, displayName })
  }

  const updateUserEmail = async (email: string) => {
    if (!user) throw new Error("Usuário não autenticado")
    await updateEmail(user, email)
    setUser({ ...user, email })
  }

  const updateUserPassword = async (password: string) => {
    if (!user) throw new Error("Usuário não autenticado")
    await updatePassword(user, password)
  }

  const value = {
    user,
    loading,
    signUp,
    login,
    signInWithGoogle,
    logout,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Pencil, Trash } from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface Banco {
  codigo: string
  nome: string
  logo: string
}

const bancos: Banco[] = [
  { codigo: "001", nome: "Banco do Brasil", logo: "/bancos/bb.svg" },
  { codigo: "033", nome: "Santander", logo: "/bancos/santander.svg" },
  { codigo: "104", nome: "Caixa Econômica Federal", logo: "/bancos/caixa.svg" },
  { codigo: "237", nome: "Bradesco", logo: "/bancos/bradesco.svg" },
  { codigo: "341", nome: "Itaú", logo: "/bancos/itau.svg" },
  { codigo: "077", nome: "Inter", logo: "/bancos/inter.svg" },
  { codigo: "260", nome: "Nubank", logo: "/bancos/nubank.svg" },
  { codigo: "336", nome: "C6 Bank", logo: "/bancos/c6.svg" },
  { codigo: "290", nome: "Pagseguro", logo: "/bancos/pagseguro.svg" },
  { codigo: "380", nome: "PicPay", logo: "/bancos/picpay.svg" },
  { codigo: "323", nome: "Mercado Pago", logo: "/bancos/mercadopago.svg" },
]

export default function ContasBancarias() {
  const { contasBancarias, adicionarContaBancaria, editarContaBancaria, removerContaBancaria } = useApp()

  const [nome, setNome] = useState("")
  const [bancoSelecionado, setBancoSelecionado] = useState<Banco | null>(null)
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [digitoConta, setDigitoConta] = useState("")
  const [tipoConta, setTipoConta] = useState<"corrente" | "poupanca" | "investimento">("corrente")
  const [saldoInicial, setSaldoInicial] = useState("")
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [busca, setBusca] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novaConta = {
      nome,
      banco: {
        codigo: bancoSelecionado?.codigo || "",
        nome: bancoSelecionado?.nome || "",
        logo: bancoSelecionado?.logo || ""
      },
      agencia,
      conta,
      digitoConta,
      tipoConta,
      saldoInicial: Number(saldoInicial)
    }

    adicionarContaBancaria(novaConta)
    
    // Limpar formulário
    setNome("")
    setBancoSelecionado(null)
    setAgencia("")
    setConta("")
    setDigitoConta("")
    setTipoConta("corrente")
    setSaldoInicial("")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contas Bancárias</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Formulário de Nova Conta */}
        <Card className="p-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Conta</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Conta Corrente Principal"
              />
            </div>

            <div className="space-y-2">
              <Label>Banco</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                  >
                    {bancoSelecionado ? (
                      <div className="flex items-center">
                        <img 
                          src={bancoSelecionado.logo} 
                          alt={bancoSelecionado.nome} 
                          className="w-6 h-6 mr-2 object-contain"
                        />
                        {bancoSelecionado.nome}
                      </div>
                    ) : (
                      "Selecione um banco..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="max-h-[300px] overflow-y-auto">
                    {bancos
                      .filter((banco) =>
                        banco.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        banco.codigo.includes(searchQuery)
                      )
                      .map((banco) => (
                        <div
                          key={banco.codigo}
                          className={cn(
                            "flex items-center gap-2 w-full cursor-pointer select-none py-1.5 px-2 outline-none hover:bg-accent focus:bg-accent",
                            bancoSelecionado?.codigo === banco.codigo && "bg-accent"
                          )}
                          onClick={() => {
                            setBancoSelecionado(banco === bancoSelecionado ? null : banco);
                            setOpen(false);
                          }}
                        >
                          <img
                            src={banco.logo}
                            alt={banco.nome}
                            className="w-8 h-8 object-contain"
                          />
                          <span className="flex-1">{banco.nome}</span>
                          {bancoSelecionado?.codigo === banco.codigo && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agência</Label>
                <Input
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                  placeholder="0000"
                />
              </div>

              <div className="space-y-2">
                <Label>Conta</Label>
                <div className="flex gap-2">
                  <Input
                    value={conta}
                    onChange={(e) => setConta(e.target.value)}
                    placeholder="00000"
                    className="flex-1"
                  />
                  <Input
                    value={digitoConta}
                    onChange={(e) => setDigitoConta(e.target.value)}
                    placeholder="0"
                    className="w-16"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <select
                value={tipoConta}
                onChange={(e) => setTipoConta(e.target.value as any)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              >
                <option value="corrente">Conta Corrente</option>
                <option value="poupanca">Conta Poupança</option>
                <option value="investimento">Conta Investimento</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Saldo Inicial</Label>
              <Input
                type="number"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                placeholder="0,00"
                step="0.01"
              />
            </div>

            <Button type="submit" className="w-full">
              Adicionar Conta
            </Button>
          </form>
        </Card>

        {/* Lista de Contas */}
        {contasBancarias.map((conta) => (
          <Card key={conta.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={conta.banco.logo} 
                  alt={conta.banco.nome} 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="font-semibold">{conta.nome}</h3>
                  <p className="text-sm text-zinc-500">
                    Ag: {conta.agencia} • CC: {conta.conta}-{conta.digitoConta}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {/* Implementar edição */}}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerContaBancaria(conta.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">{conta.tipoConta}</span>
              <span className="font-semibold">
                R$ {conta.saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
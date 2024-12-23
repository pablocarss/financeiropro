import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

export function ClientesModal() {
  const { toast } = useToast()
  const { adicionarClientePF, adicionarClientePJ } = useApp()

  const [openPF, setOpenPF] = useState(false)
  const [openPJ, setOpenPJ] = useState(false)
  const [nomePF, setNomePF] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefonePF, setTelefonePF] = useState('')
  const [emailPF, setEmailPF] = useState('')
  const [nomePJ, setNomePJ] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefonePJ, setTelefonePJ] = useState('')
  const [emailPJ, setEmailPJ] = useState('')

  const handleSalvarPF = () => {
    if (!nomePF) {
      toast({
        title: 'Erro',
        description: 'O nome do cliente é obrigatório',
        variant: 'destructive',
      })
      return
    }

    adicionarClientePF({
      nome: nomePF,
      cpf,
      telefone: telefonePF,
      email: emailPF,
    })

    setNomePF('')
    setCpf('')
    setTelefonePF('')
    setEmailPF('')
    setOpenPF(false)

    toast({
      title: 'Sucesso',
      description: 'Cliente PF cadastrado com sucesso!',
    })
  }

  const handleSalvarPJ = () => {
    if (!nomePJ) {
      toast({
        title: 'Erro',
        description: 'O nome do cliente é obrigatório',
        variant: 'destructive',
      })
      return
    }

    adicionarClientePJ({
      nome: nomePJ,
      cnpj,
      telefone: telefonePJ,
      email: emailPJ,
    })

    setNomePJ('')
    setCnpj('')
    setTelefonePJ('')
    setEmailPJ('')
    setOpenPJ(false)

    toast({
      title: 'Sucesso',
      description: 'Cliente PJ cadastrado com sucesso!',
    })
  }

  return (
    <Tabs defaultValue="pf" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pf">Pessoa Física</TabsTrigger>
        <TabsTrigger value="pj">Pessoa Jurídica</TabsTrigger>
      </TabsList>

      <TabsContent value="pf">
        <Dialog open={openPF} onOpenChange={setOpenPF}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Novo Cliente PF
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente Pessoa Física</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={nomePF}
                  onChange={e => setNomePF(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  placeholder="CPF"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={telefonePF}
                  onChange={e => setTelefonePF(e.target.value)}
                  placeholder="Telefone"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  value={emailPF}
                  onChange={e => setEmailPF(e.target.value)}
                  type="email"
                  placeholder="E-mail"
                />
              </div>
              <Button onClick={handleSalvarPF} className="w-full">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="pj">
        <Dialog open={openPJ} onOpenChange={setOpenPJ}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Novo Cliente PJ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente Pessoa Jurídica</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome/Razão Social</Label>
                <Input
                  value={nomePJ}
                  onChange={e => setNomePJ(e.target.value)}
                  placeholder="Nome/Razão Social"
                />
              </div>
              <div>
                <Label>CNPJ</Label>
                <Input
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  placeholder="CNPJ"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={telefonePJ}
                  onChange={e => setTelefonePJ(e.target.value)}
                  placeholder="Telefone"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  value={emailPJ}
                  onChange={e => setEmailPJ(e.target.value)}
                  type="email"
                  placeholder="E-mail"
                />
              </div>
              <Button onClick={handleSalvarPJ} className="w-full">
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}

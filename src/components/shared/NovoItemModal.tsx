import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface NovoItemModalProps {
  open: boolean
  onClose: () => void
  titulo: string
  onSubmit: (nome: string) => void
  placeholder?: string
  buttonLabel?: string
}

export function NovoItemModal({ 
  open, 
  onClose, 
  titulo, 
  onSubmit, 
  placeholder = "Digite o nome",
  buttonLabel = "Criar"
}: NovoItemModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nome = formData.get('nome') as string
    if (nome.trim()) {
      onSubmit(nome)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{titulo}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder={placeholder}
                  className="w-full"
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {buttonLabel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

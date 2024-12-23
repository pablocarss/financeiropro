import { NovoItemModal } from "../shared/NovoItemModal"
import { useApp } from "@/contexts/AppContext"

interface NovoCentroCustoModalProps {
  open: boolean
  onClose: () => void
}

export function NovoCentroCustoModal({ open, onClose }: NovoCentroCustoModalProps) {
  const { adicionarCentroCusto } = useApp()

  return (
    <NovoItemModal
      open={open}
      onClose={onClose}
      titulo="Novo Centro de Custo"
      onSubmit={nome => adicionarCentroCusto({ nome })}
      placeholder="Nome do centro de custo"
      buttonLabel="Criar Centro de Custo"
    />
  )
}

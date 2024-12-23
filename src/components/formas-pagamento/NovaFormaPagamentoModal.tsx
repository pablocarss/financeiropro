import { NovoItemModal } from "../shared/NovoItemModal"
import { useApp } from "@/contexts/AppContext"

interface NovaFormaPagamentoModalProps {
  open: boolean
  onClose: () => void
}

export function NovaFormaPagamentoModal({ open, onClose }: NovaFormaPagamentoModalProps) {
  const { adicionarFormaPagamento } = useApp()

  return (
    <NovoItemModal
      open={open}
      onClose={onClose}
      titulo="Nova Forma de Pagamento"
      onSubmit={nome => adicionarFormaPagamento({ nome })}
      placeholder="Nome da forma de pagamento"
      buttonLabel="Criar Forma de Pagamento"
    />
  )
}

import { NovoItemModal } from "../shared/NovoItemModal"
import { useApp } from "@/contexts/AppContext"

interface NovoTipoDocumentoModalProps {
  open: boolean
  onClose: () => void
}

export function NovoTipoDocumentoModal({ open, onClose }: NovoTipoDocumentoModalProps) {
  const { adicionarTipoDocumento } = useApp()

  return (
    <NovoItemModal
      open={open}
      onClose={onClose}
      titulo="Novo Tipo de Documento"
      onSubmit={nome => adicionarTipoDocumento({ nome })}
      placeholder="Nome do tipo de documento"
      buttonLabel="Criar Tipo de Documento"
    />
  )
}

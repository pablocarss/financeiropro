import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NovoClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function NovoClienteModal({
  open,
  onClose,
  onSubmit,
}: NovoClienteModalProps) {
  const [tipo, setTipo] = useState<"pf" | "pj">("pf");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, tipo });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-zinc-950 rounded-2xl border border-zinc-800 w-full max-w-md shadow-xl">
          <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold text-zinc-100">
                Novo Cliente
              </Dialog.Title>
              <Dialog.Close className="text-zinc-400 hover:text-zinc-100">
                <X className="size-6" />
              </Dialog.Close>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Tipo de Cliente */}
              <div>
                <Label>Tipo de Cliente</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    type="button"
                    onClick={() => setTipo("pf")}
                    className={`h-10 ${
                      tipo === "pf"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    Pessoa Física
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setTipo("pj")}
                    className={`h-10 ${
                      tipo === "pj"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    Pessoa Jurídica
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">
                    {tipo === "pf" ? "Nome Completo" : "Razão Social"}
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="documento">
                    {tipo === "pf" ? "CPF" : "CNPJ"}
                  </Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) =>
                      setFormData({ ...formData, documento: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 bg-emerald-600 text-white font-medium hover:bg-emerald-700"
              >
                Cadastrar
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

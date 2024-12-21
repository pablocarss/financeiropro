import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

interface NovaContaBancariaModalProps {
  open: boolean;
  onClose: () => void;
}

export function NovaContaBancariaModal({ open, onClose }: NovaContaBancariaModalProps) {
  const { adicionarContaBancaria } = useApp();
  const [nome, setNome] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [saldo, setSaldo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      return;
    }

    adicionarContaBancaria({
      id: Math.random(),
      nome: nome.trim(),
      banco: banco.trim(),
      agencia: agencia.trim(),
      conta: conta.trim(),
      saldo: Number(saldo) || 0,
    });

    setNome("");
    setBanco("");
    setAgencia("");
    setConta("");
    setSaldo("");
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-full max-w-md bg-zinc-900 border border-zinc-800">
          <Dialog.Title className="text-lg font-bold mb-4 text-zinc-100">
            Nova Conta Bancária
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-zinc-300">
                Nome da conta
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banco" className="text-zinc-300">
                Banco
              </Label>
              <Input
                id="banco"
                value={banco}
                onChange={e => setBanco(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agencia" className="text-zinc-300">
                  Agência
                </Label>
                <Input
                  id="agencia"
                  value={agencia}
                  onChange={e => setAgencia(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conta" className="text-zinc-300">
                  Conta
                </Label>
                <Input
                  id="conta"
                  value={conta}
                  onChange={e => setConta(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="saldo" className="text-zinc-300">
                Saldo inicial
              </Label>
              <Input
                id="saldo"
                type="number"
                step="0.01"
                value={saldo}
                onChange={e => setSaldo(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Criar Conta
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

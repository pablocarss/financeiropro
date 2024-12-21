import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { ContaBancaria } from "@/contexts/AppContext";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditarContaModalProps {
  isOpen: boolean;
  onClose: () => void;
  conta?: ContaBancaria;
}

interface Banco {
  code: string;
  name: string;
  logo?: string;
}

const bancos: Banco[] = [
  { code: "001", name: "Banco do Brasil", logo: "bb.png" },
  { code: "033", name: "Santander", logo: "santander.png" },
  { code: "104", name: "Caixa Econômica Federal", logo: "caixa.png" },
  { code: "237", name: "Bradesco", logo: "bradesco.png" },
  { code: "341", name: "Itaú", logo: "itau.png" },
  { code: "077", name: "Inter", logo: "inter.png" },
  { code: "260", name: "Nubank", logo: "nubank.png" },
  { code: "336", name: "C6 Bank", logo: "c6.png" },
  // Adicione mais bancos conforme necessário
];

export function EditarContaModal({ isOpen, onClose, conta }: EditarContaModalProps) {
  const { editarContaBancaria } = useApp();
  const [nome, setNome] = useState(conta?.nome || "");
  const [saldo, setSaldo] = useState(conta?.saldo?.toString() || "0");
  const [tipo, setTipo] = useState(conta?.tipo || "");
  const [bancoSelecionado, setBancoSelecionado] = useState<Banco | null>(null);
  const [openBancos, setOpenBancos] = useState(false);

  useEffect(() => {
    if (conta) {
      setNome(conta.nome);
      setSaldo(conta.saldo?.toString() || "0");
      setTipo(conta.tipo);
      const banco = bancos.find(b => b.name === conta.tipo);
      setBancoSelecionado(banco || null);
    }
  }, [conta]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conta) return;

    editarContaBancaria(conta.id, {
      nome,
      saldo: Number(saldo),
      tipo: bancoSelecionado?.name || tipo,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Conta Bancária</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Conta</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label>Banco</Label>
            <Popover open={openBancos} onOpenChange={setOpenBancos}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBancos}
                  className="w-full justify-between bg-zinc-900 border-zinc-800 text-zinc-100"
                >
                  {bancoSelecionado ? (
                    <div className="flex items-center gap-2">
                      {bancoSelecionado.logo && (
                        <img 
                          src={`/bancos/${bancoSelecionado.logo}`} 
                          alt={bancoSelecionado.name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      {bancoSelecionado.name}
                    </div>
                  ) : (
                    "Selecione um banco..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800">
                <Command>
                  <CommandInput placeholder="Buscar banco..." className="h-9 bg-zinc-900" />
                  <CommandEmpty>Nenhum banco encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {bancos.map((banco) => (
                      <CommandItem
                        key={banco.code}
                        value={banco.name}
                        onSelect={() => {
                          setBancoSelecionado(banco);
                          setOpenBancos(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
                      >
                        {banco.logo && (
                          <img 
                            src={`/bancos/${banco.logo}`} 
                            alt={banco.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        {banco.name}
                        {bancoSelecionado?.code === banco.code && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saldo">Saldo Inicial</Label>
            <Input
              id="saldo"
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
              step="0.01"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

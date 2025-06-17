"use client"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Card } from "@/components/ui/card"

// Ajuste do tipo para o Option
interface Option {
  Programa: string
  descricaoMaterial: string
}

interface Props {
  programasDisponiveis: Option[]
  onSelect: (programa: string) => void
}

export function SelectProgramaInput({ programasDisponiveis, onSelect }: Props) {
  return (
    <Card className="p-2">
      <Command>
        <CommandInput placeholder="Busque por número ou descrição..." />
        <CommandList>
          <CommandEmpty>Nenhum programa encontrado.</CommandEmpty>
          {programasDisponiveis.map((p, idx) => (
            <CommandItem key={idx} className="cursor-pointer" onSelect={() => onSelect(p.Programa)}>
              {`${p.Programa} – ${p.descricaoMaterial}`}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </Card>
  )
}
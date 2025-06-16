// components/SelectProgramaInput.tsx
"use client"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Card } from "@/components/ui/card"

type ProgramaItem = {
  Programa: string
  item: string
  descricaoMaterial: string
  QuantidadePecasPai: number
  Maquinas: { CodigoMaquina: number; TempoCorteMinutosProgramado: number }[]
}

interface Props {
  programasDisponiveis: ProgramaItem[]
  onSelect: (programa: string) => void
}

export function SelectProgramaInput({ programasDisponiveis, onSelect }: Props) {
  return (
    <Card className="p-2">
      <Command>
        <CommandInput placeholder="Digite o número ou descrição do programa..." />
        <CommandList>
          <CommandEmpty>Nenhum programa encontrado.</CommandEmpty>
          {programasDisponiveis.map((p, idx) => (
            <CommandItem
              key={idx}
              onSelect={() => onSelect(p.Programa)}
            >
              {`${p.Programa} - ${p.descricaoMaterial}`}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </Card>
  )
}

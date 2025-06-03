// app/page.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SelectProgramaInput } from "@/components/SelectProgramaInput"

import { programasDisponiveis } from '../data/programasData';

type MaquinaEficiencia = {
  Maquina: number
  Eficiencia: number
}

type ProgramaData = {
  programa: string
  maquinasComEficienciaManual: MaquinaEficiencia[]
}

export default function Home() {
  const [programaAtual, setProgramaAtual] = useState<string>("")
  const [maquina, setMaquina] = useState<string>("")
  const [eficiencia, setEficiencia] = useState<string>("")
  const [programas, setProgramas] = useState<ProgramaData[]>([])

  const adicionarMaquina = () => {
    if (!programaAtual || !maquina || !eficiencia) return

    const novaMaquina: MaquinaEficiencia = {
      Maquina: parseInt(maquina),
      Eficiencia: parseFloat(eficiencia)
    }

    setProgramas(prev => {
      const index = prev.findIndex(p => p.programa === programaAtual)
      if (index !== -1) {
        const atualizado = [...prev]
        atualizado[index].maquinasComEficienciaManual.push(novaMaquina)
        return atualizado
      }
      return [...prev, {
        programa: programaAtual,
        maquinasComEficienciaManual: [novaMaquina]
      }]
    })

    setMaquina("")
    setEficiencia("")
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Adicionar Máquina a um Programa</h2>

        <SelectProgramaInput
          programasDisponiveis={programasDisponiveis}
          onSelect={(programaSelecionado) => {
            const programaEncontrado = programasDisponiveis.find(p => p.programa === programaSelecionado)

            if (!programaEncontrado) return

            // Atualiza o state com os dados das máquinas automaticamente
            setProgramas(prev => {
              const jaExiste = prev.find(p => p.programa === programaEncontrado.programa)
              if (jaExiste) return prev // evita duplicatas

              return [
                ...prev,
                {
                  programa: programaEncontrado.programa,
                  maquinasComEficienciaManual: programaEncontrado.Maquinas.map(m => ({
                    Maquina: m.Maquina,
                    Eficiencia: m.Eficiencia
                  }))
                }
              ]
            })
          }}
        />


        <Button onClick={adicionarMaquina}>Adicionar</Button>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Programas Registrados</h2>
        {programas.map((p, idx) => (
          <Card key={idx} className="p-4">
            <h3 className="font-semibold">Programa: {p.programa}</h3>
            <ul className="pl-4 list-disc">
              {p.maquinasComEficienciaManual.map((m, i) => (
                <li key={i}>
                  Máquina {m.Maquina} - Eficiência: {m.Eficiencia}%
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </main>
  )
}

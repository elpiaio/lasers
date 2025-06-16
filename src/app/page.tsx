"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SelectProgramaInput } from "@/components/SelectProgramaInput"

type MaquinaTempo = {
  Maquina: number
  Tempo: number
}

type ProgramaItem = {
  Programa: string
  item: string
  descricaoMaterial: string
  QuantidadePecasPai: number
  Maquinas: {
    CodigoMaquina: number
    TempoCorteMinutosProgramado: number
  }[]
}

type ProgramaData = {
  programa: string
  maquinas: MaquinaTempo[]
}

export default function Home() {
  const [programaAtual, setProgramaAtual] = useState<string>("")
  const [maquina, setMaquina] = useState<string>("")
  const [tempo, setTempo] = useState<string>("")
  const [programas, setProgramas] = useState<ProgramaData[]>([])
  const [programasDisponiveis, setProgramasDisponiveis] = useState<ProgramaItem[]>([])

  useEffect(() => {
    fetch("/search.json")
      .then(res => res.json())
      .then((data: ProgramaItem[]) => setProgramasDisponiveis(data))
      .catch(err => console.error("Erro ao carregar search.json:", err))
  }, [])

  const adicionarMaquina = () => {
    if (!programaAtual || !maquina || !tempo) return

    const novaMaquina: MaquinaTempo = {
      Maquina: parseInt(maquina),
      Tempo: parseFloat(tempo)
    }

    setProgramas(prev => {
      const index = prev.findIndex(p => p.programa === programaAtual)
      if (index !== -1) {
        const atualizado = [...prev]
        atualizado[index].maquinas.push(novaMaquina)
        return atualizado
      }
      return [...prev, { programa: programaAtual, maquinas: [novaMaquina] }]
    })

    setMaquina("")
    setTempo("")
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Adicionar Máquina a um Programa</h2>

        <SelectProgramaInput
          programasDisponiveis={programasDisponiveis}
          onSelect={(programaSelecionado) => {
            const programaEncontrado = programasDisponiveis.find(
              p => p.Programa === programaSelecionado
            )
            if (!programaEncontrado) return

            setProgramaAtual(programaEncontrado.Programa)

            setProgramas(prev => {
              const jaExiste = prev.find(p => p.programa === programaEncontrado.Programa)
              if (jaExiste) return prev

              const maquinasIniciais = programaEncontrado.Maquinas.map(m => ({
                Maquina: m.CodigoMaquina,
                Tempo: m.TempoCorteMinutosProgramado
              }))

              return [
                ...prev,
                { programa: programaEncontrado.Programa, maquinas: maquinasIniciais }
              ]
            })
          }}
        />

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Máquina (código)"
            value={maquina}
            onChange={e => setMaquina(e.target.value)}
          />
          <Input
            placeholder="Tempo (minutos)"
            value={tempo}
            onChange={e => setTempo(e.target.value)}
          />
          <Button onClick={adicionarMaquina}>Adicionar</Button>
        </div>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Programas Registrados</h2>
        {programas.map((p, idx) => (
          <Card key={idx} className="p-4">
            <h3 className="font-semibold">Programa: {p.programa}</h3>
            <ul className="pl-4 list-disc">
              {p.maquinas.map((m, i) => (
                <li key={i}>
                  Máquina {m.Maquina} - Tempo: {m.Tempo.toFixed(3)} min
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </main>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { SelectProgramaInput } from "@/components/SelectProgramaInput"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Raw conforme search.json
type RawProgramaItem = {
  Programa: string
  item: string
  descricaoMaterial: string
  QuantidadePecasPai: number
  Maquinas: { CodigoMaquina: number; TempoCorteMinutosProgramado: number }[]
}

// Estado de cada programa registrado
type ProgramaItem = {
  Programa: string                    // nome conforme JSON
  QuantidadePecas: number
  maquinasDisponiveis: number[]      // códigos disponíveis
  eficienciaManual: Record<number, number> // mapeia código de máquina para eficiência
}

export default function Home() {
  const [programasDisponiveis, setProgramasDisponiveis] = useState<RawProgramaItem[]>([])
  const [programas, setProgramas] = useState<ProgramaItem[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/search.json')
      .then(res => res.json())
      .then((data: RawProgramaItem[]) => setProgramasDisponiveis(data))
      .catch(err => console.error('Erro ao carregar search.json:', err))
  }, [])

  const handleSelect = (prog: string) => {
    const raw = programasDisponiveis.find(p => p.Programa === prog)
    if (!raw) return

    const novo: ProgramaItem = {
      Programa: raw.Programa,
      QuantidadePecas: raw.QuantidadePecasPai,
      maquinasDisponiveis: raw.Maquinas.map(m => m.CodigoMaquina),
      eficienciaManual: {}
    }
    setProgramas(prev => prev.some(p => p.Programa === prog) ? prev : [...prev, novo])
  }

  const handleEficienciaChange = (prog: string, maq: number, val: string) => {
    const nova = parseFloat(val) || 0
    setProgramas(prev => prev.map(p => {
      if (p.Programa === prog) {
        return {
          ...p,
          eficienciaManual: { ...p.eficienciaManual, [maq]: nova }
        }
      }
      return p
    }))
  }

  // Handler do botão Otimizar
  const handleOtimizar = () => {
    // Para já, navega para página de resultado
    router.push('/resultado')
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Seleção de programas */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Selecionar Programa</h2>
        <SelectProgramaInput
          programasDisponiveis={programasDisponiveis.map(p => ({ Programa: p.Programa, descricaoMaterial: p.descricaoMaterial }))}
          onSelect={handleSelect}
        />
      </Card>

      {/* Programas registrados */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Programas Registrados</h2>
        {programas.map((p, idx) => (
          <Card key={idx} className="p-6 bg-gray-50 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Programa: {p.Programa}</h3>
                <p className="text-sm text-gray-600">Quantidade de Peças: {p.QuantidadePecas}</p>
              </div>
              <p className="text-sm font-medium text-blue-600">
                Máquinas Disponíveis: {p.maquinasDisponiveis.length}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {p.maquinasDisponiveis.map((maq, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl shadow flex flex-col space-y-2">
                  <span className="font-semibold">Máquina {maq}</span>
                  <div className="flex items-center space-x-2">
                    <Input
                      className="w-24"
                      placeholder="efic. manual %"
                      value={p.eficienciaManual[maq]?.toString() || ''}
                      onChange={e => handleEficienciaChange(p.Programa, maq, e.target.value)}
                    />
                    <span>%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      {/* Botão de otimização */}
      <div className="flex justify-center">
        <Button onClick={handleOtimizar} className="mt-4">Otimizar</Button>
      </div>
    </main>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { SelectProgramaInput } from "@/components/SelectProgramaInput"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RawProgramaItem {
  Programa: string
  item: string
  descricaoMaterial: string
  QuantidadePecasPai: number
  Maquinas: { CodigoMaquina: number; TempoCorteMinutosProgramado: number }[]
}

interface ProgramaItem {
  Programa: string
  QuantidadePecas: number
  maquinasDisponiveis: number[]
  eficienciaManual: Record<number, number>
}

export default function Home() {
  const [programasDisponiveis, setProgramasDisponiveis] = useState<RawProgramaItem[]>([])
  const [programas, setProgramas] = useState<ProgramaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(0)

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

  const handleQuantidadeChange = (prog: string, val: string) => {
    const qtd = parseInt(val) || 0
    setProgramas(prev => prev.map(p => p.Programa === prog ? { ...p, QuantidadePecas: qtd } : p))
  }

  const handleEficienciaChange = (prog: string, maq: number, val: string) => {
    const nova = parseFloat(val) || 0
    setProgramas(prev => prev.map(p => 
      p.Programa === prog 
        ? { ...p, eficienciaManual: { ...p.eficienciaManual, [maq]: nova } } 
        : p
    ))
  }

  const handleOtimizar = () => {
    // Monta manual_efficiency_data conforme especificado
    const manual_efficiency_data = programas.map(p => ({
      programa: p.Programa,
      QuantidadePecas: p.QuantidadePecas,
      maquinasComEficienciaManual: Object.entries(p.eficienciaManual)
        .map(([maq, efi]) => ({ Maquina: parseInt(maq), Eficiencia: efi }))
        .filter(item => item.Eficiencia > 0)
    }))

    // Salva no localStorage
    try {
      localStorage.setItem('otimizacaoParams', JSON.stringify(manual_efficiency_data))
    } catch (e) {
      console.error('Erro ao salvar parâmetros:', e)
    }

    window.open('/resultado-cards', '_blank')

    // Loading
    setLoading(true)
    setSeconds(0)
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    setTimeout(() => {
      clearInterval(interval)
      setLoading(false)
    }, 5000)
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Selecionar Programa</h2>
        <SelectProgramaInput
          programasDisponiveis={programasDisponiveis.map(p => ({ Programa: p.Programa, descricaoMaterial: p.descricaoMaterial }))}
          onSelect={handleSelect}
        />
      </Card>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Programas Registrados</h2>
        {programas.map((p, idx) => (
          <Card key={idx} className="p-6 bg-gray-50 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Programa: {p.Programa}</h3>
                <Input
                  className="w-32"
                  type="number"
                  value={p.QuantidadePecas}
                  min={0}
                  onChange={e => handleQuantidadeChange(p.Programa, e.target.value)}
                />
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
                      disabled={loading}
                    />
                    <span>%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <div className="flex justify-center">
        <Button onClick={handleOtimizar} disabled={loading} className="mt-4 cursor-pointer">
          {loading ? `Carregando... ${seconds}s` : 'Otimizar'}
        </Button>
      </div>
    </main>
  )
}

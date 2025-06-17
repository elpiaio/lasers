'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsDialog } from '@/components/StatsDialog'

interface ResultadoPrograma {
  Programa: string
  DescricaoItem: string
  QuantidadePecas: number
  PecasPorMinuto: number
  DuracaoMin: number
  StartMin: number
  EndMin: number
}

interface ResultadoMaquina {
  Maquina: number
  Programas: ResultadoPrograma[]
}

interface Resultado {
  Tolerancia: string
  Maquinas: ResultadoMaquina[]
}

export default function ResultadoPage() {
  const [resultado, setResultado] = useState<Resultado | null>(null)

  useEffect(() => {
    fetch('/resultado.json')
      .then(res => res.json())
      .then((data: Resultado) => setResultado(data))
      .catch(err => console.error('Erro ao carregar resultado.json:', err))
  }, [])

  if (!resultado) return <p className="text-center py-10">Carregando...</p>

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold">Resultado da Otimização</h2>
        <Badge variant="secondary" className="text-lg">
          Tolerância: {resultado.Tolerancia}%
        </Badge>
        <StatsDialog machines={resultado.Maquinas} />
      </header>

      <div className="space-y-6">
        {resultado.Maquinas.map((m, idx) => (
          <Card key={idx} className="overflow-hidden border border-gray-200 shadow-lg">
            <div className="bg-gradient-to-r ml-4">
              <h3 className="text-xl font-semibold text-black">
                Máquina {m.Maquina}
              </h3>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {m.Programas.map((prog, i) => (
                <Card
                  key={i}
                  className="transform transition hover:scale-105 hover:shadow-xl p-4 bg-white rounded-2xl border border-gray-100"
                >
                  <h4 className="font-semibold text-lg mb-1">{prog.Programa}</h4>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {prog.DescricaoItem}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline">Qtd: {prog.QuantidadePecas}</Badge>
                    <Badge variant="outline">
                      Pçs/Min: {prog.PecasPorMinuto.toFixed(3)}
                    </Badge>
                    <Badge variant="outline">
                      Duração: {prog.DuracaoMin} min
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>Start: {prog.StartMin} min</span>
                    <span>End: {prog.EndMin} min</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}

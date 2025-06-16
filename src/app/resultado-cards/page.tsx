"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

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

  if (!resultado) return <p>Carregando...</p>

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Resultado da Otimização</h2>
      <p>Tolerância: {resultado.Tolerancia}%</p>
      <div className="space-y-4">
        {resultado.Maquinas.map((m, idx) => (
          <Card key={idx} className="p-4 space-y-2">
            <h3 className="font-semibold">Máquina {m.Maquina}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {m.Programas.map((prog, i) => (
                <Card key={i} className="p-3 bg-white rounded-lg shadow">
                  <h4 className="font-medium">{prog.Programa}</h4>
                  <p className="text-sm">{prog.DescricaoItem}</p>
                  <p className="text-sm">Qtd: {prog.QuantidadePecas}</p>
                  <p className="text-sm">Pçs/Min: {prog.PecasPorMinuto.toFixed(3)}</p>
                  <p className="text-sm">Duração: {prog.DuracaoMin} min</p>
                  <p className="text-sm">Start: {prog.StartMin}</p>
                  <p className="text-sm">End: {prog.EndMin}</p>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}

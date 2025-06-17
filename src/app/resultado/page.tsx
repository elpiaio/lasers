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
      {resultado.Maquinas.map((m, idx) => (
        <Card key={idx} className="p-4 space-y-2">
          <h3 className="font-semibold">Máquina {m.Maquina}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Programa</th>
                <th>Item</th>
                <th>Qtd Peças</th>
                <th>Pçs/Min</th>
                <th>Duração</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {m.Programas.map((prog, i) => (
                <tr key={i} className="border-t">
                  <td>{prog.Programa}</td>
                  <td>{prog.DescricaoItem}</td>
                  <td>{prog.QuantidadePecas}</td>
                  <td>{prog.PecasPorMinuto.toFixed(3)}</td>
                  <td>{prog.DuracaoMin} min</td>
                  <td>{prog.StartMin}</td>
                  <td>{prog.EndMin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </main>
  )
}

// components/SelectProgramaInput.tsx permanece igual

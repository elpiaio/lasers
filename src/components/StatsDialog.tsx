// components/StatsDialog.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts'

interface Programa {
    Programa: string
    DescricaoItem: string
    QuantidadePecas: number
    PecasPorMinuto: number
    DuracaoMin: number
    StartMin: number
    EndMin: number
}

interface StatsDialogProps {
    machines: {
        Maquina: number
        Programas: Programa[]
    }[]
}


export function StatsDialog({ machines }: StatsDialogProps) {
    const [hoveredProgram, setHoveredProgram] = useState<Programa | null>(null)

    // Compute chart data
    const chartData = machines.map(m => ({
        Maquina: `M${m.Maquina}`,
        Programas: m.Programas,
        dummy: Math.max(...m.Programas.map(p => p.EndMin)),
    }))
    const maxTempo = Math.max(...chartData.map(d => d.dummy))
    const avgTempo = chartData.reduce((acc, d) => acc + d.dummy, 0) / chartData.length

    const renderSegments = (props: any) => {
        const { x, y, width, height, payload } = props
        const scale = width / maxTempo
        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
        return (
            <g>
                {payload.Programas.map((p: Programa, idx: number) => {
                    const segX = x + p.StartMin * scale
                    const segWidth = (p.EndMin - p.StartMin) * scale
                    const fill = hoveredProgram?.Programa === p.Programa ? '#000' : colors[idx % colors.length]
                    return (
                        <rect
                            key={idx}
                            x={segX}
                            y={y}
                            width={segWidth}
                            height={height}
                            fill={fill}
                            onMouseEnter={() => setHoveredProgram(p)}
                            onMouseLeave={() => setHoveredProgram(null)}
                        />
                    )
                })}
            </g>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Estatísticas!</Button>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
                <DialogContent
                    className="fixed top-1/2 left-1/2 max-w-6xl sm:max-w-6xl w-[80vw] max-h-[80vh] p-8 flex flex-col bg-white rounded-md shadow-lg overflow-auto z-50 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <DialogHeader>
                        <DialogTitle>Estatísticas por Máquina</DialogTitle>
                        <DialogDescription>
                            Gráfico com segmentos coloridos por programa
                        </DialogDescription>
                    </DialogHeader>

                    {/* Fixed height container for chart */}
                    <div className="mt-4 mb-4" style={{ height: `${machines.length * 60 + 100}px`, minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, maxTempo]} />
                                <YAxis dataKey="Maquina" type="category" width={50} />
                                <Bar
                                    dataKey="dummy"
                                    fill="transparent"
                                    background={{ fill: '#f3f4f6' }}
                                    shape={renderSegments}
                                    isAnimationActive={false}
                                />
                                <ReferenceLine
                                    x={avgTempo}
                                    stroke="red"
                                    strokeDasharray="5 5"
                                    label={{ value: 'Média', position: 'insideTop', fill: 'red' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Hover info card */}
                    {hoveredProgram && (
                        <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-sm" style={{ top: '20%', left: '50%', transform: 'translate(-50%, 0)' }}>
                            <p><strong>{hoveredProgram.Programa}</strong></p>
                            <p>{hoveredProgram.DescricaoItem}</p>
                            <p>Quantidade: {hoveredProgram.QuantidadePecas}</p>
                            <p>Tempo: {hoveredProgram.StartMin} - {hoveredProgram.EndMin} min</p>
                        </div>
                    )}

                    <DialogClose asChild>
                        <Button className="self-end cursor-pointer">Fechar</Button>
                    </DialogClose>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}

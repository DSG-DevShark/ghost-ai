"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '@/types/canvas'
import type { ShapeType } from '@/types/canvas'
import type { CanvasTemplate } from '@/components/editor/starter-templates'
import { CANVAS_TEMPLATES } from '@/components/editor/starter-templates'

interface StarterTemplatesModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImport: (template: CanvasTemplate) => void
}

interface PreviewShapeProps {
    x: number
    y: number
    w: number
    h: number
    shape: ShapeType
    fill: string
    stroke: string
}

function PreviewShape({ x, y, w, h, shape, fill, stroke }: PreviewShapeProps) {
    switch (shape) {
        case 'rectangle':
            return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" rx="8" />
        case 'pill':
            return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" rx={h / 2} />
        case 'circle':
            return <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth="1.5" />
        case 'diamond': {
            const cx = x + w / 2
            const cy = y + h / 2
            return (
                <polygon
                    points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="1.5"
                />
            )
        }
        case 'hexagon': {
            const points = [
                `${x + w * 0.97},${y + h * 0.5}`,
                `${x + w * 0.74},${y + h * 0.09}`,
                `${x + w * 0.27},${y + h * 0.09}`,
                `${x + w * 0.03},${y + h * 0.5}`,
                `${x + w * 0.27},${y + h * 0.91}`,
                `${x + w * 0.74},${y + h * 0.91}`,
            ].join(' ')
            return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1.5" />
        }
        case 'cylinder': {
            const rx = w / 2
            const ry = h * 0.18
            return (
                <g>
                    <ellipse cx={x + rx} cy={y + h - ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth="1.5" />
                    <rect x={x} y={y + ry} width={w} height={h - ry * 2} fill={fill} />
                    <line x1={x} y1={y + ry} x2={x} y2={y + h - ry} stroke={stroke} strokeWidth="1.5" />
                    <line x1={x + w} y1={y + ry} x2={x + w} y2={y + h - ry} stroke={stroke} strokeWidth="1.5" />
                    <ellipse cx={x + rx} cy={y + ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth="1.5" />
                </g>
            )
        }
        default:
            return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="1.5" rx="8" />
    }
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
    const pad = 20
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    for (const node of template.nodes) {
        minX = Math.min(minX, node.position.x)
        minY = Math.min(minY, node.position.y)
        maxX = Math.max(maxX, node.position.x + (node.width ?? 100))
        maxY = Math.max(maxY, node.position.y + (node.height ?? 64))
    }

    const vx = minX - pad
    const vy = minY - pad
    const vw = maxX - minX + pad * 2
    const vh = maxY - minY + pad * 2

    const nodeMap = new Map(template.nodes.map(node => [node.id, node]))
    const markerId = `arrow-${template.id}`

    return (
        <svg
            viewBox={`${vx} ${vy} ${vw} ${vh}`}
            className="w-full h-full"
            aria-hidden
        >
            <defs>
                <marker
                    id={markerId}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(248,250,252,0.45)" />
                </marker>
            </defs>

            {template.edges.map(edge => {
                const src = nodeMap.get(edge.source)
                const tgt = nodeMap.get(edge.target)
                if (!src || !tgt) return null

                const sw = src.width ?? 100
                const sh = src.height ?? 64
                const tw = tgt.width ?? 100
                const th = tgt.height ?? 64

                const x1 = src.position.x + sw
                const y1 = src.position.y + sh / 2
                const x2 = tgt.position.x
                const y2 = tgt.position.y + th / 2

                const offset = Math.max(Math.abs(x2 - x1) / 2, 30)
                const d = `M ${x1},${y1} C ${x1 + offset},${y1} ${x2 - offset},${y2} ${x2},${y2}`

                return (
                    <path
                        key={edge.id}
                        d={d}
                        fill="none"
                        stroke="rgba(248,250,252,0.3)"
                        strokeWidth="1.5"
                        markerEnd={`url(#${markerId})`}
                    />
                )
            })}

            {template.nodes.map(node => {
                const { x, y } = node.position
                const w = node.width ?? 100
                const h = node.height ?? 64
                const colorPair = NODE_COLORS.find(c => c.fill === node.data.color) ?? DEFAULT_NODE_COLOR
                const shape = node.data.shape ?? 'rectangle'
                const clipId = `clip-${template.id}-${node.id}`

                return (
                    <g key={node.id}>
                        <defs>
                            <clipPath id={clipId}>
                                <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} />
                            </clipPath>
                        </defs>
                        <PreviewShape
                            x={x}
                            y={y}
                            w={w}
                            h={h}
                            shape={shape}
                            fill={colorPair.fill}
                            stroke="rgba(255,255,255,0.14)"
                        />
                        <text
                            x={x + w / 2}
                            y={y + h / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={colorPair.text}
                            fontSize={10}
                            clipPath={`url(#${clipId})`}
                            style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}
                        >
                            {node.data.label}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export function StarterTemplatesModal({ open, onOpenChange, onImport }: StarterTemplatesModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-3xl bg-surface border-surface-border p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="text-base font-semibold text-copy-primary">
                        Plantillas de inicio
                    </DialogTitle>
                    <p className="text-sm text-copy-muted mt-0.5">
                        Empieza desde un diagrama predefinido y personalízalo a tu gusto.
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-6 overflow-y-auto max-h-[70vh]">
                    {CANVAS_TEMPLATES.map(template => (
                        <div
                            key={template.id}
                            className="flex flex-col rounded-2xl border border-surface-border bg-elevated overflow-hidden hover:border-subtle transition-colors"
                        >
                            <div className="h-40 bg-base p-2">
                                <TemplatePreview template={template} />
                            </div>
                            <div className="flex flex-col gap-3 p-4">
                                <div>
                                    <p className="text-sm font-medium text-copy-primary leading-snug">
                                        {template.name}
                                    </p>
                                    <p className="text-xs text-copy-muted mt-1 leading-snug">
                                        {template.description}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    onClick={() => onImport(template)}
                                >
                                    Importar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

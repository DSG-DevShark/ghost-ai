import type { Node, Edge } from '@xyflow/react'

export const NODE_SHAPES = ['rectangle', 'diamond', 'circle', 'pill', 'cylinder', 'hexagon'] as const
export type ShapeType = typeof NODE_SHAPES[number]

export interface ShapeSize {
    width: number
    height: number
}

export const SHAPE_DEFAULT_SIZES: Record<ShapeType, ShapeSize> = {
    rectangle: { width: 160, height: 80 },
    diamond: { width: 140, height: 140 },
    circle: { width: 100, height: 100 },
    pill: { width: 160, height: 64 },
    cylinder: { width: 100, height: 120 },
    hexagon: { width: 120, height: 100 },
}

export interface NodeColor {
    fill: string
    text: string
    name: string
}

export const NODE_COLORS: NodeColor[] = [
    { fill: '#1F1F1F', text: '#EDEDED', name: 'Gris' },
    { fill: '#10233D', text: '#52A8FF', name: 'Azul' },
    { fill: '#2E1938', text: '#BF7AF0', name: 'Morado' },
    { fill: '#331B00', text: '#FF990A', name: 'Naranja' },
    { fill: '#3C1618', text: '#FF6166', name: 'Rojo' },
    { fill: '#3A1726', text: '#F75F8F', name: 'Rosa' },
    { fill: '#0F2E18', text: '#62C073', name: 'Verde' },
    { fill: '#062822', text: '#0AC7B4', name: 'Teal' },
]

export const DEFAULT_NODE_COLOR = NODE_COLORS[0]

export interface CanvasNodeData extends Record<string, unknown> {
    label: string
    color?: string
    shape?: ShapeType
}

export interface CanvasEdgeData extends Record<string, unknown> {
    label?: string
}

export type CanvasNode = Node<CanvasNodeData, 'canvasNode'>
export type CanvasEdge = Edge<CanvasEdgeData, 'canvasEdge'>

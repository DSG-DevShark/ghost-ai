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
}

export const NODE_COLORS: NodeColor[] = [
    { fill: '#1F1F1F', text: '#EDEDED' },
    { fill: '#10233D', text: '#52A8FF' },
    { fill: '#2E1938', text: '#BF7AF0' },
    { fill: '#331B00', text: '#FF990A' },
    { fill: '#3C1618', text: '#FF6166' },
    { fill: '#3A1726', text: '#F75F8F' },
    { fill: '#0F2E18', text: '#62C073' },
    { fill: '#062822', text: '#0AC7B4' },
]

export const DEFAULT_NODE_COLOR = NODE_COLORS[0]

export interface CanvasNodeData extends Record<string, unknown> {
    label: string
    color?: string
    shape?: ShapeType
}

export type CanvasNode = Node<CanvasNodeData, 'canvasNode'>
export type CanvasEdge = Edge<Record<string, unknown>, 'canvasEdge'>

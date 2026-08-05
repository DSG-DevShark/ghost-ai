import type { CanvasNode, CanvasEdge, ShapeType } from '@/types/canvas'
import { NODE_COLORS } from '@/types/canvas'

export interface CanvasTemplate {
    id: string
    name: string
    description: string
    nodes: CanvasNode[]
    edges: CanvasEdge[]
}

function n(
    id: string,
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    shape: ShapeType,
    colorIndex: number,
): CanvasNode {
    return {
        id,
        type: 'canvasNode',
        position: { x, y },
        width,
        height,
        data: { label, color: NODE_COLORS[colorIndex].fill, shape },
    }
}

function e(id: string, source: string, target: string, label?: string): CanvasEdge {
    return { id, type: 'canvasEdge', source, target, data: { label } }
}

const microservices: CanvasTemplate = {
    id: 'microservices',
    name: 'Arquitectura de Microservicios',
    description: 'API gateway que enruta peticiones a servicios independientes, cada uno con su propia base de datos.',
    nodes: [
        n('gw',      'API Gateway',      260, 0,   160, 80,  'rectangle', 1),
        n('auth',    'Auth Service',     0,   180,  140, 64,  'pill',      6),
        n('user',    'User Service',     200, 180,  140, 64,  'pill',      1),
        n('order',   'Order Service',    400, 180,  140, 64,  'pill',      3),
        n('product', 'Product Catalog',  600, 180,  140, 64,  'pill',      2),
        n('userdb',  'User DB',          220, 340,  100, 100, 'cylinder',  0),
        n('orderdb', 'Order DB',         420, 340,  100, 100, 'cylinder',  0),
    ],
    edges: [
        e('e1', 'gw',    'auth'),
        e('e2', 'gw',    'user'),
        e('e3', 'gw',    'order'),
        e('e4', 'gw',    'product'),
        e('e5', 'user',  'userdb'),
        e('e6', 'order', 'orderdb'),
    ],
}

const cicd: CanvasTemplate = {
    id: 'cicd',
    name: 'Pipeline CI/CD',
    description: 'Integración y despliegue continuo desde el repositorio de código hasta producción.',
    nodes: [
        n('code',    'Code Repo',     0,   100, 140, 64,  'rectangle', 0),
        n('build',   'Build',         200, 100, 120, 64,  'pill',      1),
        n('test',    'Test Suite',    380, 100, 120, 64,  'pill',      6),
        n('gate',    'Quality Gate',  530, 30,  140, 140, 'diamond',   3),
        n('staging', 'Staging',       730, 60,  140, 64,  'pill',      7),
        n('prod',    'Production',    730, 160, 140, 64,  'pill',      6),
    ],
    edges: [
        e('e1', 'code',    'build'),
        e('e2', 'build',   'test'),
        e('e3', 'test',    'gate'),
        e('e4', 'gate',    'staging', 'approved'),
        e('e5', 'gate',    'prod'),
    ],
}

const eventDriven: CanvasTemplate = {
    id: 'event-driven',
    name: 'Sistema Orientado a Eventos',
    description: 'Bus de mensajes que distribuye eventos de productores a consumidores independientes con manejo de errores.',
    nodes: [
        n('producer', 'Event Producer',    0,   160, 160, 64,  'pill',    1),
        n('bus',      'Message Bus',       260, 120, 160, 120, 'hexagon', 3),
        n('c1',       'Order Consumer',    520, 40,  160, 64,  'pill',    6),
        n('c2',       'Email Consumer',    520, 160, 160, 64,  'pill',    2),
        n('c3',       'Analytics',         520, 280, 160, 64,  'pill',    7),
        n('dlq',      'Dead Letter Queue', 260, 340, 160, 80,  'cylinder', 4),
    ],
    edges: [
        e('e1', 'producer', 'bus'),
        e('e2', 'bus',      'c1'),
        e('e3', 'bus',      'c2'),
        e('e4', 'bus',      'c3'),
        e('e5', 'bus',      'dlq', 'on error'),
    ],
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [microservices, cicd, eventDriven]

"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { CanvasNode } from '@/types/canvas'
import { NODE_COLORS, DEFAULT_NODE_COLOR } from '@/types/canvas'

const HANDLES = [Position.Top, Position.Right, Position.Bottom, Position.Left]
const MIN_WIDTH = 60
const MIN_HEIGHT = 40

const RESIZE_LINE_STYLE: React.CSSProperties = {
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
}

const RESIZE_HANDLE_STYLE: React.CSSProperties = {
    width: 7,
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.55)',
    border: 'none',
    borderRadius: 2,
}

function nodeBorder(selected: boolean) {
    return selected ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)'
}

function DiamondSvg({ fill, stroke }: { fill: string; stroke: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
        >
            <polygon points="50,3 97,50 50,97 3,50" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
    )
}

function HexagonSvg({ fill, stroke }: { fill: string; stroke: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
        >
            <polygon points="97,50 74,9 27,9 3,50 27,91 74,91" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
    )
}

function CylinderSvg({ fill, stroke }: { fill: string; stroke: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
        >
            {/* bottom ellipse drawn first so body rect can cover its top half */}
            <ellipse cx="50" cy="75" rx="48" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <rect x="2" y="22" width="96" height="53" fill={fill} />
            <line x1="2" y1="22" x2="2" y2="75" stroke={stroke} strokeWidth="1.5" />
            <line x1="98" y1="22" x2="98" y2="75" stroke={stroke} strokeWidth="1.5" />
            <ellipse cx="50" cy="22" rx="48" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
    )
}

export function CanvasNodeComponent({ id, data, selected }: NodeProps<CanvasNode>) {
    const { updateNodeData } = useReactFlow()
    const [isEditing, setIsEditing] = useState(false)
    const editableRef = useRef<HTMLDivElement>(null)
    const editStartLabelRef = useRef<string>('')

    const colorPair = NODE_COLORS.find(c => c.fill === data.color) ?? DEFAULT_NODE_COLOR
    const border = nodeBorder(selected ?? false)
    const shape = data.shape ?? 'rectangle'

    // Set initial content and focus when editing opens.
    // Depends only on isEditing — intentionally excludes data.label so Liveblocks
    // updates while typing don't reset the cursor position.
    useEffect(() => {
        if (!isEditing || !editableRef.current) return
        const el = editableRef.current
        el.textContent = editStartLabelRef.current
        el.focus()
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
    }, [isEditing]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        editStartLabelRef.current = data.label
        setIsEditing(true)
    }, [data.label])

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        updateNodeData(id, { label: e.currentTarget.innerText })
    }, [id, updateNodeData])

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain').replace(/\n/g, ' ')
        document.execCommand('insertText', false, text)
    }, [])

    const handleBlur = useCallback(() => {
        setIsEditing(false)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (e.key === 'Escape') {
            if (editableRef.current) {
                editableRef.current.textContent = editStartLabelRef.current
            }
            updateNodeData(id, { label: editStartLabelRef.current })
            setIsEditing(false)
        }
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }, [id, updateNodeData])

    const activeColor = data.color ?? DEFAULT_NODE_COLOR.fill

    return (
        <div
            className="group relative w-full h-full flex items-center justify-center select-none text-sm font-medium"
            onDoubleClick={!isEditing ? handleDoubleClick : undefined}
        >
            <NodeToolbar
                isVisible={selected ?? false}
                position={Position.Top}
                offset={8}
                className="nodrag nopan flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-elevated shadow-xl"
            >
                {NODE_COLORS.map((pair) => (
                    <button
                        key={pair.fill}
                        aria-label={pair.name}
                        onClick={e => {
                            e.stopPropagation()
                            updateNodeData(id, { color: pair.fill })
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = `0 0 5px 2px ${pair.text}55`
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = ''
                        }}
                        className="nodrag nopan w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-110"
                        style={{
                            backgroundColor: pair.fill,
                            border: '1px solid rgba(255,255,255,0.15)',
                            outline: activeColor === pair.fill ? '2px solid rgba(255,255,255,0.85)' : 'none',
                            outlineOffset: '2px',
                            transform: activeColor === pair.fill ? 'scale(1.15)' : undefined,
                        }}
                    />
                ))}
            </NodeToolbar>
            <NodeResizer
                isVisible={selected ?? false}
                minWidth={MIN_WIDTH}
                minHeight={MIN_HEIGHT}
                lineStyle={RESIZE_LINE_STYLE}
                handleStyle={RESIZE_HANDLE_STYLE}
            />
            {shape === 'diamond' && <DiamondSvg fill={colorPair.fill} stroke={border} />}
            {shape === 'hexagon' && <HexagonSvg fill={colorPair.fill} stroke={border} />}
            {shape === 'cylinder' && <CylinderSvg fill={colorPair.fill} stroke={border} />}
            {(shape === 'rectangle' || shape === 'pill' || shape === 'circle') && (
                <div
                    className="absolute inset-0 border"
                    style={{
                        backgroundColor: colorPair.fill,
                        borderColor: border,
                        borderRadius: shape === 'rectangle' ? '12px' : '9999px',
                    }}
                />
            )}
            {isEditing ? (
                <div
                    ref={editableRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onPaste={handlePaste}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onMouseDown={e => e.stopPropagation()}
                    className="nodrag nopan absolute inset-0 z-20 flex items-center justify-center text-center text-sm font-medium px-3 leading-tight outline-none"
                    style={{ color: colorPair.text, caretColor: colorPair.text, cursor: 'text' }}
                />
            ) : (
                <span className="relative z-10 px-3 text-center leading-tight" style={{ color: colorPair.text }}>
                    {data.label || <span style={{ opacity: 0.35 }}>Label</span>}
                </span>
            )}
            {HANDLES.map(pos => (
                <Handle
                    key={pos}
                    id={pos}
                    type="source"
                    position={pos}
                    className="!opacity-0 group-hover:!opacity-100 !transition-opacity !duration-150 !w-2.5 !h-2.5 !bg-white !border-2 !border-black/70 !rounded-full"
                />
            ))}
        </div>
    )
}

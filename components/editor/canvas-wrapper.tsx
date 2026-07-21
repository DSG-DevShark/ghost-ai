"use client"

import { Component } from 'react'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react'
import { Canvas } from '@/components/editor/canvas'

class LiveblocksErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-copy-faint">No se pudo conectar al canvas.</p>
                </div>
            )
        }
        return this.props.children
    }
}

interface CanvasWrapperProps {
    roomId: string
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
    return (
        <LiveblocksErrorBoundary>
            <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
                <RoomProvider
                    id={roomId}
                    initialPresence={{ cursor: null, isThinking: false }}
                >
                    <ClientSideSuspense
                        fallback={
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-copy-faint">Cargando canvas…</p>
                            </div>
                        }
                    >
                        <Canvas />
                    </ClientSideSuspense>
                </RoomProvider>
            </LiveblocksProvider>
        </LiveblocksErrorBoundary>
    )
}

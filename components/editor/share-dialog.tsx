"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Copy, Check, UserMinus, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Collaborator {
    id: string
    email: string
    name: string | null
    imageUrl: string | null
    createdAt: string
    role: 'owner' | 'collaborator'
}

interface ShareDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    isOwner: boolean
}

export function ShareDialog({ open, onOpenChange, projectId, isOwner }: ShareDialogProps) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [isInviting, setIsInviting] = useState(false)
    const [inviteError, setInviteError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [removingId, setRemovingId] = useState<string | null>(null)
    const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
        }
    }, [])

    const fetchCollaborators = useCallback(async () => {
        setIsFetching(true)
        try {
            const res = await fetch(`/api/projects/${projectId}/collaborators`)
            if (res.ok) setCollaborators(await res.json())
        } catch {
            // Error de red — la lista queda como estaba
        } finally {
            setIsFetching(false)
        }
    }, [projectId])

    useEffect(() => {
        if (open) fetchCollaborators()
    }, [open, fetchCollaborators])

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/editor/${projectId}`)
            setCopied(true)
            if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
            copiedTimerRef.current = setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard API no disponible o denegada
        }
    }

    const invite = async () => {
        const email = inviteEmail.trim()
        if (!email) return
        setIsInviting(true)
        setInviteError(null)
        try {
            const res = await fetch(`/api/projects/${projectId}/collaborators`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.status === 409) {
                setInviteError("Este email ya es colaborador.")
                return
            }
            if (!res.ok) {
                setInviteError("No se pudo invitar. Comprueba el email e inténtalo de nuevo.")
                return
            }
            setInviteEmail("")
            await fetchCollaborators()
        } catch {
            setInviteError("Error de red. Inténtalo de nuevo.")
        } finally {
            setIsInviting(false)
        }
    }

    const remove = async (collaborator: Collaborator) => {
        setRemovingId(collaborator.id)
        try {
            const res = await fetch(`/api/projects/${projectId}/collaborators/${collaborator.id}`, {
                method: "DELETE",
            })
            if (res.ok || res.status === 404) {
                setCollaborators((prev) => prev.filter((c) => c.id !== collaborator.id))
            }
        } catch {
            // Error de red — la lista queda sin cambios
        } finally {
            setRemovingId(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Compartir proyecto</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    {/* Project link */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-copy-muted">Enlace del proyecto</span>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={`${typeof window !== "undefined" ? window.location.origin : ""}/editor/${projectId}`}
                                className="flex-1 text-xs text-copy-muted font-mono"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyLink}
                                className="shrink-0 gap-1.5"
                            >
                                {copied
                                    ? <><Check className="h-4 w-4 text-success" />Copiado</>
                                    : <><Copy className="h-4 w-4" />Copiar</>
                                }
                            </Button>
                        </div>
                    </div>

                    {/* Invite (owner only) */}
                    {isOwner && (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-copy-muted">Invitar por email</span>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="email@ejemplo.com"
                                    value={inviteEmail}
                                    onChange={(e) => {
                                        setInviteEmail(e.target.value)
                                        setInviteError(null)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isInviting) invite()
                                    }}
                                    className="flex-1"
                                    disabled={isInviting}
                                />
                                <Button
                                    size="sm"
                                    onClick={invite}
                                    disabled={!inviteEmail.trim() || isInviting}
                                    className="shrink-0"
                                >
                                    {isInviting
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : "Invitar"
                                    }
                                </Button>
                            </div>
                            {inviteError && (
                                <p className="text-xs text-error">{inviteError}</p>
                            )}
                        </div>
                    )}

                    {/* People with access */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-copy-muted">
                            Con acceso
                            {collaborators.length > 0 && (
                                <span className="ml-1 text-copy-faint">({collaborators.length})</span>
                            )}
                        </span>

                        {isFetching ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-copy-faint" />
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {collaborators.map((c) => (
                                    <CollaboratorRow
                                        key={c.id}
                                        collaborator={c}
                                        canRemove={isOwner && c.role === 'collaborator'}
                                        isRemoving={removingId === c.id}
                                        onRemove={() => remove(c)}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface CollaboratorRowProps {
    collaborator: Collaborator
    canRemove: boolean
    isRemoving: boolean
    onRemove: () => void
}

function CollaboratorRow({ collaborator, canRemove, isRemoving, onRemove }: CollaboratorRowProps) {
    const initials = collaborator.name
        ? collaborator.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : collaborator.email[0].toUpperCase()

    return (
        <li className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
                {collaborator.imageUrl && (
                    <AvatarImage src={collaborator.imageUrl} alt={collaborator.name ?? collaborator.email} />
                )}
                <AvatarFallback className="text-xs bg-elevated text-copy-secondary">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1">
                {collaborator.name && (
                    <span className="text-sm text-copy-primary truncate leading-tight">
                        {collaborator.name}
                    </span>
                )}
                <span className={`text-xs truncate ${collaborator.name ? "text-copy-muted" : "text-copy-primary"}`}>
                    {collaborator.email}
                </span>
            </div>

            {collaborator.role === 'owner' ? (
                <span className="shrink-0 text-xs text-copy-faint border border-surface-border rounded-lg px-2 py-0.5">
                    Propietario
                </span>
            ) : canRemove ? (
                <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    className="shrink-0 p-1.5 rounded-xl text-copy-muted hover:text-error hover:bg-elevated transition-colors disabled:opacity-50"
                    aria-label={`Eliminar a ${collaborator.name ?? collaborator.email}`}
                >
                    {isRemoving
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <UserMinus className="h-4 w-4" />
                    }
                </button>
            ) : null}
        </li>
    )
}

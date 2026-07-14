"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DialogState } from "@/hooks/use-project-actions"

interface ProjectDialogsProps {
    dialogState: DialogState
    name: string
    roomIdPreview: string
    isLoading: boolean
    onClose: () => void
    onNameChange: (name: string) => void
    onCreate: () => void
    onRename: () => void
    onDelete: () => void
}

export function ProjectDialogs({
    dialogState,
    name,
    roomIdPreview,
    isLoading,
    onClose,
    onNameChange,
    onCreate,
    onRename,
    onDelete,
}: ProjectDialogsProps) {
    return (
        <>
            <Dialog
                open={dialogState.type === "create"}
                onOpenChange={(open) => !open && onClose()}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nuevo proyecto</DialogTitle>
                        <DialogDescription>
                            Elige un nombre para tu proyecto. Podrás cambiarlo más adelante.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 py-1">
                        <Input
                            placeholder="Nombre del proyecto"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && roomIdPreview && !isLoading) onCreate()
                            }}
                            autoFocus
                        />
                        {roomIdPreview && (
                            <p className="text-xs text-copy-muted font-mono px-1">
                                {roomIdPreview}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={onCreate}
                            disabled={!roomIdPreview || isLoading}
                        >
                            {isLoading ? "Creando..." : "Crear proyecto"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={dialogState.type === "rename"}
                onOpenChange={(open) => !open && onClose()}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Renombrar proyecto</DialogTitle>
                        <DialogDescription>
                            Nombre actual:{" "}
                            <strong className="text-copy-secondary">
                                {dialogState.project?.name}
                            </strong>
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Nuevo nombre"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && name.trim() && !isLoading) onRename()
                        }}
                        autoFocus
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={onRename}
                            disabled={!name.trim() || isLoading}
                        >
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={dialogState.type === "delete"}
                onOpenChange={(open) => !open && onClose()}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar proyecto</DialogTitle>
                        <DialogDescription>
                            ¿Confirmas que quieres eliminar{" "}
                            <strong className="text-copy-secondary">
                                {dialogState.project?.name}
                            </strong>
                            ? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

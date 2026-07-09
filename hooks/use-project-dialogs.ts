"use client"

import { useState } from "react"
import type { Project } from "@/lib/mock-data"

type DialogType = "create" | "rename" | "delete" | null

export interface DialogState {
    type: DialogType
    project: Project | null
}

export function useProjectDialogs() {
    const [dialogState, setDialogState] = useState<DialogState>({ type: null, project: null })
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const openCreate = () => {
        setName("")
        setDialogState({ type: "create", project: null })
    }

    const openRename = (project: Project) => {
        setName(project.name)
        setDialogState({ type: "rename", project })
    }

    const openDelete = (project: Project) => {
        setDialogState({ type: "delete", project })
    }

    const closeDialog = () => {
        setDialogState({ type: null, project: null })
        setName("")
    }

    const withLoading = async (fn: () => void) => {
        setIsLoading(true)
        await new Promise<void>((resolve) => setTimeout(resolve, 400))
        fn()
        setIsLoading(false)
        closeDialog()
    }

    return {
        dialogState,
        name,
        isLoading,
        openCreate,
        openRename,
        openDelete,
        closeDialog,
        setName,
        withLoading,
    }
}

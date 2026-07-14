"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toSlug } from "@/lib/mock-data"
import type { Project } from "@/app/generated/prisma/client"

type DialogType = "create" | "rename" | "delete" | null

export interface DialogState {
    type: DialogType
    project: Project | null
}

function makeShortSuffix(): string {
    return Math.random().toString(36).slice(2, 7)
}

export function useProjectActions() {
    const router = useRouter()
    const params = useParams()
    const [dialogState, setDialogState] = useState<DialogState>({ type: null, project: null })
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [suffix, setSuffix] = useState(makeShortSuffix)

    const slug = toSlug(name)
    const roomIdPreview = slug ? `${slug}-${suffix}` : ""

    const openCreate = () => {
        setName("")
        setSuffix(makeShortSuffix())
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

    const create = async () => {
        if (!slug) return
        setIsLoading(true)
        try {
            const id = roomIdPreview
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, id }),
            })
            if (!res.ok) throw new Error("Failed to create project")
            const project: Project = await res.json()
            closeDialog()
            router.push(`/editor/${project.id}`)
        } finally {
            setIsLoading(false)
        }
    }

    const rename = async () => {
        if (!dialogState.project || !slug) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/projects/${dialogState.project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })
            if (!res.ok) throw new Error("Failed to rename project")
            closeDialog()
            router.refresh()
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProject = async () => {
        if (!dialogState.project) return
        const targetId = dialogState.project.id
        setIsLoading(true)
        try {
            const res = await fetch(`/api/projects/${targetId}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete project")
            closeDialog()
            const activeProjectId = params?.projectId as string | undefined
            if (activeProjectId === targetId) {
                router.push("/editor")
            } else {
                router.refresh()
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        dialogState,
        name,
        isLoading,
        roomIdPreview,
        openCreate,
        openRename,
        openDelete,
        closeDialog,
        setName,
        create,
        rename,
        deleteProject,
    }
}

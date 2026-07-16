import Link from "next/link"
import { Lock } from "lucide-react"

export function AccessDenied() {
    return (
        <div className="flex h-screen items-center justify-center bg-base">
            <div className="flex flex-col items-center gap-4 text-center px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated border border-surface-border">
                    <Lock className="h-8 w-8 text-copy-muted" />
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold text-copy-primary">
                        Acceso denegado
                    </h1>
                    <p className="text-sm text-copy-muted max-w-xs">
                        Este proyecto no existe o no tienes permiso para acceder a él.
                    </p>
                </div>
                <Link
                    href="/editor"
                    className="text-sm text-brand hover:underline underline-offset-4"
                >
                    Volver al editor
                </Link>
            </div>
        </div>
    )
}

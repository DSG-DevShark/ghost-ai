import { Ghost, BrainCircuit, Share2, FileText } from "lucide-react"

const features = [
    {
        icon: BrainCircuit,
        title: "Generación de arquitectura con IA",
        description: "Describe tu sistema y la IA lo mapea en nodos y aristas sobre un canvas en vivo.",
    },
    {
        icon: Share2,
        title: "Colaboración en tiempo real",
        description: "Cursores en vivo, indicadores de presencia y edición compartida de nodos con tu equipo.",
    },
    {
        icon: FileText,
        title: "Generación instantánea de specs",
        description: "Exporta una especificación técnica completa en Markdown directamente desde el grafo.",
    },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface relative overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(240,240,244,0.035) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="relative flex flex-col h-full px-12 py-10">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                            <Ghost className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-copy-primary font-semibold">Ghost AI</span>
                    </div>

                    <div className="flex flex-col justify-center flex-1 max-w-[440px]">
                        <h1 className="text-4xl font-bold text-copy-primary leading-tight mb-4">
                            Diseña sistemas a la velocidad del pensamiento.
                        </h1>
                        <p className="text-copy-secondary text-base leading-relaxed mb-10">
                            Describe tu arquitectura en lenguaje natural. Ghost AI la convierte en
                            un canvas compartido que todo tu equipo puede refinar en tiempo real.
                        </p>
                        <div className="space-y-7">
                            {features.map(({ icon: Icon, title, description }) => (
                                <div key={title} className="flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-xl bg-accent-dim flex items-center justify-center shrink-0">
                                        <Icon className="h-4 w-4 text-brand" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-copy-primary">
                                            {title}
                                        </p>
                                        <p className="text-sm text-copy-muted mt-0.5">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-copy-faint">© 2026 Ghost AI. Todos los derechos reservados.</p>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 py-12 bg-base">
                {children}
            </div>
        </div>
    )
}

export interface Project {
    id: string
    name: string
    slug: string
    isOwned: boolean
}

export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export const MOCK_PROJECTS: Project[] = [
    { id: '1', name: 'Plataforma E-commerce', slug: 'plataforma-e-commerce', isOwned: true },
    { id: '2', name: 'Servicio de Auth', slug: 'servicio-de-auth', isOwned: true },
    { id: '3', name: 'Sistema de Diseño', slug: 'sistema-de-diseno', isOwned: false },
]

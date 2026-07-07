# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation

## Current Goal

- Implementar el siguiente feature de la lista de feature-specs.

## Completed

- Feature 01: Design System — shadcn/ui instalado y configurado, lucide-react instalado, lib/utils.ts con cn(), globals.css con dark theme y tokens Tailwind v4.

## In Progress

- None.

## Next Up

- Feature 02 (por definir según feature-specs).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- globals.css usa `@theme inline` para mapear CSS variables del proyecto a tokens Tailwind v4. Shadcn tokens (--color-background, --color-primary, etc.) apuntan a las CSS vars del proyecto (--bg-base, --accent-primary, etc.).
- No hay tailwind.config.js — Tailwind v4 se configura solo por CSS.
- components.json configurado con `rsc: true`, alias `@/*` apuntando a raíz.

## Session Notes

- Stack: Next.js 16, Tailwind CSS 4, shadcn/ui 4.13.0, TypeScript strict.
- Path alias `@/*` apunta a la raíz del proyecto.
- El warning "Unknown at rule @theme" en VS Code es un falso positivo del validador CSS — no afecta el build.

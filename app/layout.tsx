import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/ui/themes"
import { ui } from "@clerk/ui"
import { esES } from "@clerk/localizations"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const localization = {
    ...esES,
    formFieldInputPlaceholder__emailAddress: "Ingresa tu correo",
    formFieldInputPlaceholder__password: "Tu contraseña",
    formFieldInputPlaceholder__signUpPassword: "Crea una contraseña",
}

export const metadata: Metadata = {
    title: "Ghost AI",
    description: "Real-time collaborative system design workspace",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            ui={ui}
            localization={localization}
            appearance={{
                theme: dark,
                variables: {
                    colorBackground: "#080809",
                    colorInput: "#18181c",
                    colorInputForeground: "#f0f0f4",
                    colorForeground: "#f0f0f4",
                    colorMutedForeground: "#808090",
                    colorPrimary: "#00c8d4",
                    colorDanger: "#ff4d4f",
                    borderRadius: "0.75rem",
                    fontFamily: "var(--font-sans)",
                },
                elements: {
                    headerTitle: { color: "var(--text-primary)" },
                    headerSubtitle: { color: "var(--text-secondary)" },
                    formFieldLabel: { color: "var(--text-secondary)" },
                    dividerText: { color: "var(--text-muted)" },
                    socialButtonsBlockButton: {
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        color: "var(--text-primary)",
                    },
                    socialButtonsBlockButtonText: { color: "var(--text-primary)" },
                    socialButtonsProviderIcon__github: { filter: "brightness(0) invert(1)" },
                    footerActionText: { color: "var(--text-muted)" },
                    footerActionLink: { color: "var(--accent-primary)" },
                    footer: { color: "var(--text-secondary)" },
                    footerItem: { color: "var(--text-secondary)" },
                    // UserProfile modal
                    profileSectionTitle: { borderColor: "var(--border-default)" },
                    profileSectionTitleText: { color: "var(--text-muted)" },
                    profileSectionItemText: { color: "var(--text-primary)" },
                    profileSectionPrimaryButton: { color: "var(--accent-primary)" },
                    navbarButton: "!text-copy-secondary hover:!text-copy-primary hover:!bg-subtle rounded-lg transition-colors",
                    navbarButtonText: "!text-copy-secondary hover:!text-copy-primary",
                    navbarButtonIcon: { color: "var(--text-muted)" },
                    providerIcon__github: { filter: "brightness(0) invert(1)" },
                    badge: { color: "var(--text-secondary)", backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-subtle)" },
                    profileSectionItem__emailAddresses: { color: "var(--text-primary)" },
                    profileSectionItem__connectedAccounts: { color: "var(--text-primary)" },
                    activeDevice: { color: "var(--text-primary)" },
                    activeDeviceListItem: { color: "var(--text-primary)", borderColor: "var(--border-default)" },
                    activeDeviceIcon: { color: "var(--text-muted)" },
                    // UserButton popover
                    userButtonPopoverCard: { backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)" },
                    userButtonPopoverActionButton: "!text-copy-primary hover:!text-copy-primary hover:!bg-subtle transition-colors",
                    userButtonPopoverActionButtonText: "!text-copy-primary hover:!text-copy-primary",
                    userButtonPopoverActionButtonIcon: { color: "var(--text-muted)" },
                    userPreviewMainIdentifier: { color: "var(--text-primary)" },
                    userPreviewSecondaryIdentifier: { color: "var(--text-muted)" },
                    userButtonPopoverFooter: { display: "none" },
                },
            }}
        >
            <html
                lang="es"
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            >
                <body className="min-h-full flex flex-col">{children}</body>
            </html>
        </ClerkProvider>
    )
}

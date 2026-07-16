import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/ui/themes"
import { ui } from "@clerk/ui"
import { esMX } from "@clerk/localizations"
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
    ...esMX,
    formFieldInputPlaceholder__emailAddress: "Ingresa tu correo",
    formFieldInputPlaceholder__password: "Tu contraseña",
    formFieldInputPlaceholder__signUpPassword: "Crea una contraseña",
    formFieldLabel__confirmPassword: "Confirma la contraseña",
    unstable__errors: {
        ...esMX.unstable__errors,
        zxcvbn: {
            ...(esMX.unstable__errors as any)?.zxcvbn,
            couldBeStronger: "Tu contraseña funciona, pero podría ser más segura. Intenta añadir más caracteres.",
            goodPassword: "Tu contraseña cumple todos los requisitos necesarios.",
            notEnough: "Tu contraseña no es suficientemente segura.",
            suggestions: {
                ...(esMX.unstable__errors as any)?.zxcvbn?.suggestions,
                allUppercase: "Usa mayúsculas en algunas letras, no en todas.",
                anotherWord: "Añade más palabras que sean menos comunes.",
                associatedYears: "Evita años que estén asociados contigo.",
                capitalization: "Usa mayúsculas en más letras, no solo en la primera.",
                dates: "Evita fechas asociadas contigo.",
                l33t: "Evita sustituciones predecibles como '@' por 'a'.",
                longerKeyboardPattern: "Usa patrones de teclado más largos y cambia la dirección varias veces.",
                noNeed: "Puedes crear contraseñas seguras sin usar símbolos, números ni mayúsculas.",
                pwned: "Si usas esta contraseña en otros sitios, deberías cambiarla.",
                recentYears: "Evita años recientes.",
                repeated: "Evita palabras y caracteres repetidos.",
                reverseWords: "Evita palabras comunes escritas al revés.",
                sequences: "Evita secuencias de caracteres comunes.",
                useWords: "Usa varias palabras, pero evita frases comunes.",
            },
            warnings: {
                ...(esMX.unstable__errors as any)?.zxcvbn?.warnings,
                common: "Esta es una contraseña de uso muy común.",
                commonNames: "Los nombres y apellidos comunes son fáciles de adivinar.",
                dates: "Las fechas son fáciles de adivinar.",
                extendedRepeat: "Los patrones de caracteres repetidos son fáciles de adivinar.",
                keyPattern: "Los patrones de teclado cortos son fáciles de adivinar.",
                namesByThemselves: "Los nombres solos son fáciles de adivinar.",
                pwned: "Esta contraseña ha sido expuesta en filtraciones de datos.",
                recentYears: "Los años recientes son fáciles de adivinar.",
                sequences: "Las secuencias comunes son fáciles de adivinar.",
                similarToCommon: "Esta contraseña es muy similar a una contraseña común.",
                simpleRepeat: "Los caracteres repetidos como 'aaa' son fáciles de adivinar.",
                straightRow: "Las filas de teclado cortas son fáciles de adivinar.",
                topHundred: "Esta es una contraseña muy usada.",
                topTen: "Esta es una de las contraseñas más usadas.",
                userInputs: "No debe haber datos personales o relacionados con la página.",
                wordByItself: "Las palabras solas son fáciles de adivinar.",
            },
        },
    },
    signIn: {
        ...esMX.signIn,
        start: {
            ...(esMX.signIn as any)?.start,
            actionLink: "Crear una",
        },
    },
    userProfile: {
        ...esMX.userProfile,
        emailAddressPage: {
            ...(esMX.userProfile as any)?.emailAddressPage,
            formHint: "Necesitarás verificar esta dirección de correo antes de que pueda añadirse a tu cuenta.",
        },
        passwordPage: {
            ...(esMX.userProfile as any)?.passwordPage,
            checkboxInfoText__signOutOfOtherSessions: "Se recomienda cerrar sesión en todos los demás dispositivos que puedan haber usado la contraseña anterior.",
        },
    },
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

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Pomodoro Timer",
    description: "Temporizador Pomodoro minimalista y elegante",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
        <body className={`font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>

        </body>
        </html>
    )
}

import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
    title: "Pomodoro Focus - Timer & Tasks",
    description: "A minimalist Pomodoro timer with task management in a cozy library setting",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={`font-sans`}>
        <Suspense fallback={null}>{children}</Suspense>
        </body>
        </html>
    )
}

"use client"

import { PomodoroTimer } from "@/components/Pomodoro"
import { TaskManager } from "@/components/Task"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="min-h-screen relative">
            <div className="absolute top-6 right-6 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border"
                >
                    <Link href="/about">About</Link>
                </Button>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center max-w-6xl mx-auto">
                    {/* Main Pomodoro Timer */}
                    <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-foreground mb-2">Focus & Flow</h1>
                            <p className="text-lg text-muted-foreground">Find your rhythm in this cozy digital library</p>
                        </div>
                        <PomodoroTimer />

                        <div className="mt-8 w-full max-w-md">
                            <TaskManagerToggle />
                        </div>
                    </div>
                </div>


            </main>
        </div>
    )
}

function TaskManagerToggle() {
    const [showTasks, setShowTasks] = useState(false)

    return (
        <div className="space-y-4">
            <div className="text-center">
                <button
                    onClick={() => setShowTasks(!showTasks)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/50 rounded-lg hover:border-border bg-amber-950 backdrop-blur-sm"
                >

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />

                    {showTasks ? "Ocultar task" : "Añadir task"}
                </button>
            </div>

            {showTasks && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <TaskManager />
                </div>
            )}
        </div>
    )
}

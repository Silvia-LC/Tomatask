"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, Pause, RotateCcw, StickyNote, Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface ChecklistItem {
    id: string
    text: string
    completed: boolean
}

const DEFAULT_MINUTES = 25

export default function PomodoroTimer() {
    const [minutes, setMinutes] = useState<number>(DEFAULT_MINUTES)
    const [seconds, setSeconds] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<string>(String(DEFAULT_MINUTES))
    const [notes, setNotes] = useState<string>("")
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
    const [newItemText, setNewItemText] = useState<string>("")
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {

                    if (prevSeconds === 0) {
                        setMinutes((prevMinutes) => {

                            if (prevMinutes === 0) {
                                setIsRunning(false)

                                if (typeof window !== "undefined" && "Notification" in window) {
                                    if (Notification.permission === "granted") {
                                        new Notification("¡Pomodoro completado!", {
                                            body: "Es hora de tomar un descanso",
                                        })
                                    } else if (Notification.permission !== "denied") {

                                        Notification.requestPermission()
                                    }
                                }
                                return 0
                            }
                            return prevMinutes - 1
                        })
                        return 59
                    } else {
                        return prevSeconds - 1
                    }
                })
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning])


    const handleStart = (): void => {

        if (minutes === 0 && seconds === 0) {
            const mins = Number.parseInt(editValue) || DEFAULT_MINUTES
            setMinutes(mins)
            setSeconds(0)
        }
        setIsRunning(true)
    }

    const handlePause = (): void => {
        setIsRunning(false)
    }

    const handleReset = (): void => {
        setIsRunning(false)
        setMinutes(Number.parseInt(editValue) || DEFAULT_MINUTES)
        setSeconds(0)
    }

    const handleTimeClick = (): void => {
        if (!isRunning) {
            setIsEditing(true)
            setEditValue(String(minutes))
        }
    }

    const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value
        if (value === "" || /^\d+$/.test(value)) {
            setEditValue(value)
        }
    }

    const handleTimeInputBlur = (): void => {
        setIsEditing(false)
        const mins = Number.parseInt(editValue) || DEFAULT_MINUTES
        const validMins = Math.min(Math.max(mins, 1), 120)
        setMinutes(validMins)
        setSeconds(0)
        setEditValue(String(validMins))
    }

    const handleTimeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            handleTimeInputBlur()
        }
    }

    const addChecklistItem = (): void => {
        if (newItemText.trim()) {
            const newItem: ChecklistItem = {
                id: Date.now().toString(),
                text: newItemText.trim(),
                completed: false,
            }
            setChecklistItems([...checklistItems, newItem])
            setNewItemText("")
        }
    }

    const toggleChecklistItem = (id: string): void => {
        setChecklistItems(checklistItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
    }

    const deleteChecklistItem = (id: string): void => {
        setChecklistItems(checklistItems.filter((item) => item.id !== id))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            addChecklistItem()
        }
    }

    const formatTime = (mins: number, secs: number): string => {
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 items-start">

                <div className="flex-1 w-full">
                    <Card className="p-8 lg:p-12 bg-card border-border shadow-lg">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="relative">
                                <div className="w-80 h-80 rounded-full bg-white border-4 border-black shadow-2xl flex items-center justify-center relative">
                                    <div className="text-center z-10">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={editValue}
                                                onChange={handleTimeInputChange}
                                                onBlur={handleTimeInputBlur}
                                                onKeyDown={handleTimeInputKeyDown}
                                                autoFocus
                                                className="text-7xl font-mono font-bold text-black tracking-tight bg-transparent border-none outline-none text-center w-full"
                                                style={{ width: "280px" }}
                                            />
                                        ) : (
                                            <div
                                                onClick={handleTimeClick}
                                                className="text-7xl font-mono font-bold text-black tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                {formatTime(minutes, seconds)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleStart}
                                    disabled={isRunning && (minutes > 0 || seconds > 0)} // Solo deshabilitar si está corriendo
                                    size="sm"
                                    className="bg-black hover:bg-black/80 text-white px-4 py-4"
                                >
                                    <Play className="mr-2 h-3 w-3" />
                                    Iniciar
                                </Button>

                                <Button
                                    onClick={handlePause}
                                    disabled={!isRunning}
                                    size="sm"
                                    className="bg-black hover:bg-black/80 text-white px-4 py-4"
                                >
                                    <Pause className="mr-2 h-3 w-3" />
                                    Pausar
                                </Button>

                                <Button onClick={handleReset} size="sm" className="bg-black hover:bg-black/80 text-white px-4 py-4">
                                    <RotateCcw className="mr-2 h-3 w-3" />
                                    Reiniciar
                                </Button>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="bg-black text-white hover:bg-black/80 hover:text-white">
                                        Acerca de Tomatask
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border">
                                    <DialogHeader>
                                        <DialogTitle className="text-foreground">Acerca del Proyecto</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 text-card-foreground">
                                        <p className="leading-relaxed">
                                            Temporizador Pomodoro personalizable, minimalista diseñado para mantener el enfoque y la productividad.
                                            Tienes un espacio para tus notas y, también, para crearte una lista de tareas que te ayude
                                            en la productividad. No te olvides de hacer descansos de 15 minutos entre Pomodoros.
                                        </p>
                                        <div className="pt-4 border-t border-border">
                                            <h3 className="font-semibold mb-3 text-foreground">Enlaces</h3>
                                            <div className="flex flex-col gap-2">
                                                <a
                                                    href="https://github.com/Silvia-LC"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    GitHub
                                                </a>
                                                <a
                                                    href="https://www.linkedin.com/in/silvia-lc/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                    LinkedIn
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Card>
                </div>


                <div className="w-full lg:w-96">
                    <Card className="p-6 bg-card border-border shadow-lg h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <StickyNote className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold text-foreground">Notas</h2>
                        </div>
                        <Textarea
                            placeholder="Escribe tus tareas o notas aquí..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[200px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground mb-6"
                        />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground">Lista de tareas</h3>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Añadir nueva tarea..."
                                    value={newItemText}
                                    onChange={(e) => setNewItemText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-background border-border text-foreground"
                                />
                                <Button onClick={addChecklistItem} size="sm" className="bg-black hover:bg-black/80 text-white">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {checklistItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 p-2 rounded-md bg-background border border-border group"
                                    >
                                        <Checkbox
                                            checked={item.completed}
                                            onCheckedChange={() => toggleChecklistItem(item.id)}
                                            className="border-muted-foreground"
                                        />
                                        <span
                                            className={`flex-1 text-sm ${
                                                item.completed ? "line-through text-muted-foreground" : "text-foreground"
                                            }`}
                                        >
                                            {item.text}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteChecklistItem(item.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
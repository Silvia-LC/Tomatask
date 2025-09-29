"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Coffee, BookOpen } from "lucide-react"

type TimerMode = "work" | "break"
type TimerStatus = "idle" | "running" | "paused"

export function PomodoroTimer() {
    // Timer settings
    const [workDuration, setWorkDuration] = useState(25) // Default 25 minutes, adjustable 30-50
    const [breakDuration] = useState(10) // Fixed 10 minutes break

    // Timer state
    const [mode, setMode] = useState<TimerMode>("work")
    const [status, setStatus] = useState<TimerStatus>("idle")
    const [timeLeft, setTimeLeft] = useState(workDuration * 60) // in seconds
    const [completedPomodoros, setCompletedPomodoros] = useState(0)
    const maxPomodoros = 10

    // Update timeLeft when workDuration changes and timer is idle
    useEffect(() => {
        if (status === "idle" && mode === "work") {
            setTimeLeft(workDuration * 60)
        }
    }, [workDuration, status, mode])

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (status === "running" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            // Timer finished
            if (mode === "work") {
                // Work session completed, start break
                setCompletedPomodoros((prev) => Math.min(prev + 1, maxPomodoros))
                setMode("break")
                setTimeLeft(breakDuration * 60)
                setStatus("running") // Auto-start break

                // Play notification sound (browser notification)
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Pomodoro Complete! 🍅", {
                        body: "Time for a 10-minute break in the library!",
                        icon: "/images/library-background.png",
                    })
                }
            } else {
                // Break completed, return to work mode
                setMode("work")
                setTimeLeft(workDuration * 60)
                setStatus("idle") // Don't auto-start work session

                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Break Complete! ☕", {
                        body: "Ready for another focused session?",
                        icon: "/images/library-background.jpg",
                    })
                }
            }
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [status, timeLeft, mode, workDuration, breakDuration])

    // Request notification permission on component mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission()
        }
    }, [])

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const getProgress = (): number => {
        const totalTime = mode === "work" ? workDuration * 60 : breakDuration * 60
        return ((totalTime - timeLeft) / totalTime) * 100
    }

    const handleStart = () => {
        setStatus("running")
    }

    const handlePause = () => {
        setStatus("paused")
    }

    const handleReset = () => {
        setStatus("idle")
        if (mode === "work") {
            setTimeLeft(workDuration * 60)
        } else {
            setTimeLeft(breakDuration * 60)
        }
    }

    const handleWorkDurationChange = (value: number[]) => {
        if (status === "idle" && mode === "work") {
            const newDuration = Math.max(30, Math.min(50, value[0])) // Clamp between 30-50
            setWorkDuration(newDuration)
        }
    }

    const canStartNewPomodoro = completedPomodoros < maxPomodoros

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {/* Pomodoro Counter */}
            <div className="text-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    {completedPomodoros}/{maxPomodoros} Pomodoros Complete
                </Badge>
            </div>

            {/* Timer Display */}
            <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
                <CardContent className="p-8">
                    <div className="text-center space-y-6">
                        {/* Mode Indicator */}
                        <div className="flex items-center justify-center gap-2">
                            {mode === "work" ? (
                                <BookOpen className="w-5 h-5 text-primary" />
                            ) : (
                                <Coffee className="w-5 h-5 text-secondary" />
                            )}
                            <span className="text-lg font-semibold capitalize">{mode === "work" ? "Focus Time" : "Break Time"}</span>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-48 h-48 mx-auto">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-border"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                                    className={mode === "work" ? "text-primary" : "text-secondary"}
                                    style={{
                                        transition: "stroke-dashoffset 1s ease-in-out",
                                    }}
                                />
                            </svg>

                            {/* Time display */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex justify-center gap-3">
                            {status === "idle" || status === "paused" ? (
                                <Button
                                    onClick={handleStart}
                                    size="lg"
                                    className="px-8 shadow-lg"
                                    disabled={mode === "work" && !canStartNewPomodoro}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {status === "idle" ? "Start" : "Resume"}
                                </Button>
                            ) : (
                                <Button onClick={handlePause} size="lg" variant="secondary" className="px-8 shadow-lg">
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause
                                </Button>
                            )}

                            <Button onClick={handleReset} size="lg" variant="outline" className="shadow-lg bg-transparent">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>

                        {/* Duration Slider (only for work mode when idle) */}
                        {mode === "work" && status === "idle" && (
                            <div className="space-y-3 pt-4 border-t border-border/50">
                                <label className="text-sm font-medium">Focus Duration: {workDuration} minutes</label>
                                <Slider
                                    value={[workDuration]}
                                    onValueChange={handleWorkDurationChange}
                                    min={30}
                                    max={50}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>30 min</span>
                                    <span>50 min</span>
                                </div>
                            </div>
                        )}

                        {/* Status Messages */}
                        {!canStartNewPomodoro && mode === "work" && (
                            <div className="text-center p-4 bg-accent/20 rounded-lg border border-accent/30">
                                <p className="text-sm text-accent-foreground font-medium">🎉 Maximum Pomodoros reached for today!</p>
                                <p className="text-xs text-muted-foreground mt-1">Great work! Time to rest and recharge.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

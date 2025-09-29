"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, Trash2, Check, X, ListTodo, Target } from "lucide-react"

interface Task {
    id: string
    title: string
    description: string
    completed: boolean
    createdAt: Date
}

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [newTaskDescription, setNewTaskDescription] = useState("")
    const [editingTask, setEditingTask] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [isAddingTask, setIsAddingTask] = useState(false)

    const maxTasks = 10

    const addTask = () => {
        if (newTaskTitle.trim() && tasks.length < maxTasks) {
            const newTask: Task = {
                id: Date.now().toString(),
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim(),
                completed: false,
                createdAt: new Date(),
            }
            setTasks([...tasks, newTask])
            setNewTaskTitle("")
            setNewTaskDescription("")
            setIsAddingTask(false)
        }
    }

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const toggleTask = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    }

    const startEditing = (task: Task) => {
        setEditingTask(task.id)
        setEditTitle(task.title)
        setEditDescription(task.description)
    }

    const saveEdit = () => {
        if (editTitle.trim() && editingTask) {
            setTasks(
                tasks.map((task) =>
                    task.id === editingTask ? { ...task, title: editTitle.trim(), description: editDescription.trim() } : task,
                ),
            )
            setEditingTask(null)
            setEditTitle("")
            setEditDescription("")
        }
    }

    const cancelEdit = () => {
        setEditingTask(null)
        setEditTitle("")
        setEditDescription("")
    }

    const completedTasks = tasks.filter((task) => task.completed).length
    const canAddTask = tasks.length < maxTasks

    return (
        <Card className="h-fit bg-card/90 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-primary" />
                        Study Tasks
                    </CardTitle>
                    <Badge variant="secondary">
                        {completedTasks}/{tasks.length}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Optional tasks to complement your focus sessions</p>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Add New Task */}
                {!isAddingTask ? (
                    <Button onClick={() => setIsAddingTask(true)} variant="outline" className="w-full" disabled={!canAddTask}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task {!canAddTask && `(${tasks.length}/${maxTasks})`}
                    </Button>
                ) : (
                    <div className="space-y-3 p-3 border rounded-lg bg-background/50">
                        <Input
                            placeholder="What would you like to accomplish?"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    addTask()
                                }
                                if (e.key === "Escape") {
                                    setIsAddingTask(false)
                                    setNewTaskTitle("")
                                    setNewTaskDescription("")
                                }
                            }}
                            autoFocus
                        />
                        <Textarea
                            placeholder="Add details or notes (optional)..."
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button onClick={addTask} size="sm" disabled={!newTaskTitle.trim()}>
                                <Check className="w-4 h-4 mr-1" />
                                Add Task
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsAddingTask(false)
                                    setNewTaskTitle("")
                                    setNewTaskDescription("")
                                }}
                                size="sm"
                                variant="outline"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Task List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No tasks yet</p>
                            <p className="text-xs">Add tasks to stay organized during your focus sessions</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-3 border rounded-lg transition-all ${
                                    task.completed
                                        ? "bg-accent/20 border-accent/30 shadow-sm"
                                        : "bg-background/50 border-border hover:border-primary/30"
                                }`}
                            >
                                {editingTask === task.id ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    saveEdit()
                                                }
                                                if (e.key === "Escape") {
                                                    cancelEdit()
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <Textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            rows={2}
                                            placeholder="Add details or notes (optional)..."
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={saveEdit} size="sm" disabled={!editTitle.trim()}>
                                                <Check className="w-4 h-4 mr-1" />
                                                Save
                                            </Button>
                                            <Button onClick={cancelEdit} size="sm" variant="outline">
                                                <X className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={() => toggleTask(task.id)}
                                                className="mt-0.5"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className={`font-medium text-sm ${
                                                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                                    }`}
                                                >
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p
                                                        className={`text-xs mt-1 ${
                                                            task.completed ? "line-through text-muted-foreground/70" : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button onClick={() => startEditing(task)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Edit2 className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    onClick={() => deleteTask(task.id)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Task Limit Warning */}
                {tasks.length >= maxTasks && (
                    <div className="text-center p-2 bg-muted/20 rounded-lg border border-muted/30">
                        <p className="text-xs text-muted-foreground">
                            Task limit reached ({maxTasks}/{maxTasks})
                        </p>
                    </div>
                )}

                {/* Progress Summary */}
                {tasks.length > 0 && (
                    <div className="pt-3 border-t border-border/50">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                {completedTasks} of {tasks.length} completed
              </span>
                        </div>
                        <div className="w-full bg-secondary/20 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: tasks.length > 0 ? `${(completedTasks / tasks.length) * 100}%` : "0%",
                                }}
                            />
                        </div>
                        {completedTasks === tasks.length && tasks.length > 0 && (
                            <p className="text-xs text-center text-accent-foreground mt-2 font-medium">🎉 All tasks completed!</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

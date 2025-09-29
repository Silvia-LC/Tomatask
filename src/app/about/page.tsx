import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Coffee, Clock, BookOpen, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                            <Clock className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">About Pomodoro Focus</h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            A minimalist productivity app inspired by cozy library atmospheres
                        </p>
                    </div>

                    {/* Main Content */}
                    <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20">
                        <CardContent className="p-8 space-y-6">
                            {/* Description */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold">The Story</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pomodoro Focus was created to combine the proven Pomodoro Technique with the peaceful ambiance of a
                                    cozy library. The warm, golden lighting and book-filled environment create the perfect atmosphere for
                                    focused work sessions.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Whether you're studying, coding, writing, or working on any focused task, this app provides a serene
                                    digital space that encourages productivity while maintaining a sense of calm and comfort.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Coffee className="w-5 h-5 text-secondary" />
                                    <h2 className="text-xl font-semibold">Features</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Badge variant="outline" className="justify-start p-3 h-auto">
                                        <div className="text-left">
                                            <div className="font-medium">Customizable Timer</div>
                                            <div className="text-xs text-muted-foreground">30-50 minute focus sessions</div>
                                        </div>
                                    </Badge>
                                    <Badge variant="outline" className="justify-start p-3 h-auto">
                                        <div className="text-left">
                                            <div className="font-medium">Auto Break</div>
                                            <div className="text-xs text-muted-foreground">10-minute automatic breaks</div>
                                        </div>
                                    </Badge>
                                    <Badge variant="outline" className="justify-start p-3 h-auto">
                                        <div className="text-left">
                                            <div className="font-medium">Task Management</div>
                                            <div className="text-xs text-muted-foreground">Optional task tracking</div>
                                        </div>
                                    </Badge>
                                    <Badge variant="outline" className="justify-start p-3 h-auto">
                                        <div className="text-left">
                                            <div className="font-medium">Progress Tracking</div>
                                            <div className="text-xs text-muted-foreground">Up to 10 daily Pomodoros</div>
                                        </div>
                                    </Badge>
                                </div>
                            </div>

                            {/* Philosophy */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Heart className="w-5 h-5 text-accent" />
                                    <h2 className="text-xl font-semibold">Philosophy</h2>
                                </div>
                                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                    "Productivity shouldn't feel sterile or stressful. The best work happens in environments that feel
                                    welcoming, warm, and inspiring."
                                </blockquote>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Connect Section */}
                    <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20">
                        <CardContent className="p-6">
                            <div className="text-center space-y-4">
                                <h2 className="text-xl font-semibold">Connect</h2>
                                <p className="text-sm text-muted-foreground">Built with care for the productivity community</p>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                                            <Github className="w-5 h-5 mr-2" />
                                            GitHub
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="w-5 h-5 mr-2" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Back to App */}
                    <div className="text-center">
                        <Button asChild size="lg">
                            <Link href="/">
                                <Clock className="w-4 h-4 mr-2" />
                                Back to Timer
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}

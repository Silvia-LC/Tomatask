import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">P</span>
                        </div>
                        <span className="font-bold text-xl text-foreground">Pomodoro Focus</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/about">About</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

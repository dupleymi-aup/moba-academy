import Link from 'next/link'
import { GraduationCap, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
        <GraduationCap className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-6xl font-bold tracking-tight text-foreground">
        404
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Страница не найдена
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Возможно, страница была перемещена или удалена
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Home className="h-4 w-4" />
        На главную
      </Link>
    </div>
  )
}

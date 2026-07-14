import { GraduationCap } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg animate-pulse">
          <GraduationCap className="h-8 w-8" />
        </div>
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </div>
    </div>
  )
}

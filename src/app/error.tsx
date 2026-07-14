'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30">
        <AlertTriangle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight">
        Что-то пошло не так
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Произошла непредвиденная ошибка. Попробуйте обновить страницу.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/70">
          Error digest: {error.digest}
        </p>
      )}
      <Button onClick={reset} className="mt-6 gap-2">
        <RefreshCcw className="h-4 w-4" />
        Попробовать снова
      </Button>
    </div>
  )
}

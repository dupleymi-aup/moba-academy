'use client'

import * as React from 'react'
import { Moon, Sun, GraduationCap, Menu, X, ChevronUp } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { courses } from '@/lib/courses-data'
import { useLearningStore } from '@/lib/learning-store'

type NavItem = {
  id: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Главная' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'dashboard', label: 'Мой прогресс' },
  { id: 'achievements', label: 'Достижения' },
  { id: 'notes', label: 'Заметки' },
  { id: 'author', label: 'Автор' },
]

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState('hero')
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const completedLessons = useLearningStore((s) => s.completedLessons)

  const overallProgress = React.useMemo(() => {
    if (!mounted) return 0
    const total = courses.reduce((sum, c) => sum + c.lessons.length, 0)
    if (total === 0) return 0
    const completed = Object.values(completedLessons).filter(Boolean).length
    return Math.round((completed / total) * 100)
  }, [completedLessons, mounted])

  React.useEffect(() => setMounted(true), [])

  // Отслеживание активной секции
  React.useEffect(() => {
    if (!mounted) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [mounted])

  // Показ кнопки «Наверх»
  React.useEffect(() => {
    if (!mounted) return
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted])

  const handleNav = (id: string) => {
    setActive(id)
    setOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Progress bar */}
        {mounted && overallProgress > 0 && (
          <div className="h-0.5 w-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        )}
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-base font-semibold tracking-tight">
                MOBA академия
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Самообучение
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  active === item.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Сменить тему"
              className="h-9 w-9"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <div className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  aria-label="Меню"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetTitle className="sr-only">Навигация</SheetTitle>
                <div className="flex flex-col gap-1 pt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={cn(
                        'flex items-center justify-between px-3 py-3 text-left text-sm font-medium rounded-md transition-colors',
                        active === item.id
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                      )}
                    >
                      {item.label}
                      {active === item.id && <X className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Scroll to top */}
      {mounted && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90',
            showScrollTop
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none',
          )}
          aria-label="Наверх"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

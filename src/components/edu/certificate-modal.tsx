'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Award,
  GraduationCap,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { type Course, author } from '@/lib/courses-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type CertificateModalProps = {
  course: Course | null
  open: boolean
  onClose: () => void
}

export function CertificateModal({ course, open, onClose }: CertificateModalProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Закрытие по Escape
  React.useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // Конфетти при открытии
  React.useEffect(() => {
    if (!open) return
    const colors = ['#f97316', '#fbbf24', '#ea580c', '#f59e0b', '#fb923c']
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
    document.body.appendChild(container)

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const delay = Math.random() * 0.5
      const size = 6 + Math.random() * 6
      confetti.style.cssText = `
        position:absolute;top:-20px;left:${left}%;
        width:${size}px;height:${size}px;
        background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation:confetti-fall ${1.5 + Math.random() * 1.5}s ease-out ${delay}s forwards;
      `
      container.appendChild(confetti)
    }

    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const timeout = setTimeout(() => {
      container.remove()
      style.remove()
    }, 3500)

    return () => {
      clearTimeout(timeout)
      container.remove()
      style.remove()
    }
  }, [open])

  if (!course) return null

  const certId = `MOBA-${course.id.toUpperCase()}-${new Date().getFullYear()}`
  const completionDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handlePrint = () => {
    window.print()
    toast.success('Откройте диалог печати для сохранения в PDF')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Сертификат об окончании курса"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-background shadow-2xl print:max-w-none print:overflow-visible print:rounded-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (hidden on print) */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 p-4 print:hidden">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-semibold">Сертификат об окончании</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handlePrint}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Сохранить PDF
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Certificate */}
            <div className="p-4 md:p-8 print:p-0">
              <div
                className={cn(
                  'relative overflow-hidden rounded-xl border-4 border-double border-orange-500/40 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 md:p-10 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-orange-950/40',
                )}
              >
                {/* Decorative corners */}
                <div className="absolute left-2 top-2 h-12 w-12 border-l-2 border-t-2 border-orange-500/40 print:border-orange-400" />
                <div className="absolute right-2 top-2 h-12 w-12 border-r-2 border-t-2 border-orange-500/40 print:border-orange-400" />
                <div className="absolute bottom-2 left-2 h-12 w-12 border-b-2 border-l-2 border-orange-500/40 print:border-orange-400" />
                <div className="absolute bottom-2 right-2 h-12 w-12 border-b-2 border-r-2 border-orange-500/40 print:border-orange-400" />

                {/* Background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, oklch(0.65 0.18 45) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="relative text-center">
                  {/* Top badge */}
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 backdrop-blur">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium uppercase tracking-wider text-orange-700 dark:text-orange-300">
                        MOBA академия
                      </span>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="mt-5 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Сертификат об окончании
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Настоящим сертификатом подтверждается, что
                  </p>

                  {/* Student name */}
                  <div className="mt-5">
                    <p className="text-xl font-semibold text-orange-600 sm:text-2xl">
                      Слушатель Академии Дуплей
                    </p>
                    <div className="mx-auto mt-2 h-px w-48 bg-orange-500/30" />
                  </div>

                  <p className="mt-5 text-sm text-muted-foreground">
                    успешно завершил(а) курс
                  </p>

                  {/* Course title */}
                  <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    «{course.title}»
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {course.subtitle}
                  </p>

                  {/* Course meta */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
                      {course.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
                      {course.lessons.length} уроков
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
                      {course.durationHours} часов
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
                      Уровень: {course.level}
                    </Badge>
                  </div>

                  {/* Footer with date and signature */}
                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Дата выдачи
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {completionDate}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Номер сертификата
                      </div>
                      <div className="mt-1 font-mono text-xs font-medium">
                        {certId}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Автор курса
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {author.name}
                      </div>
                    </div>
                  </div>

                  {/* Signature line */}
                  <div className="mt-6 flex justify-center">
                    <div className="text-center">
                      <div className="font-script text-2xl text-orange-600 italic" style={{ fontFamily: 'cursive, serif' }}>
                        {author.name.split(' ')[0]}
                      </div>
                      <div className="mx-auto mt-1 h-px w-40 bg-orange-500/40" />
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        Подпись автора
                      </div>
                    </div>
                  </div>

                  {/* Bottom note */}
                  <p className="mt-6 text-[10px] text-muted-foreground/70">
                    Сертификат подтверждает самостоятельное прохождение курса на платформе
                    «MOBA академия». Не является государственным документом об образовании.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Inline component for certificate completion check
type CertButtonProps = {
  course: Course
  isCompleted: boolean
  onOpen: () => void
}

export function CertificateButton({ course, isCompleted, onOpen }: CertButtonProps) {
  if (!isCompleted) return null
  return (
    <Button
      onClick={onOpen}
      variant="outline"
      size="sm"
      className="gap-1.5 border-orange-500/40 text-orange-600 hover:bg-orange-500/10"
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      Получить сертификат
    </Button>
  )
}

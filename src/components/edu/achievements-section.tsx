'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Footprints,
  Brain,
  PenLine,
  Zap,
  Flame,
  GraduationCap,
  Award,
  Calendar,
  Crown,
  NotebookPen,
  ClipboardCheck,
  Bookmark,
  Clock,
  Hourglass,
  Trophy,
  Lock,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { courses } from '@/lib/courses-data'
import { achievements } from '@/lib/quizzes-data'
import { useLearningStore } from '@/lib/learning-store'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Brain,
  PenLine,
  Zap,
  Flame,
  GraduationCap,
  Award,
  Calendar,
  Crown,
  NotebookPen,
  ClipboardCheck,
  Bookmark,
  Clock,
  Hourglass,
  Trophy,
}

export function AchievementsSection() {
  const completedLessons = useLearningStore((s) => s.completedLessons)
  const bookmarkedCourses = useLearningStore((s) => s.bookmarkedCourses)
  const notes = useLearningStore((s) => s.notes)
  const quizResults = useLearningStore((s) => s.quizResults)
  const activityLog = useLearningStore((s) => s.activityLog)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  // Вычисляем метрики для достижений
  const metrics = React.useMemo(() => {
    const completedCount = Object.values(completedLessons).filter(Boolean).length
    const bookmarkedCount = Object.values(bookmarkedCourses).filter(Boolean).length
    const notesCount = notes.length
    const quizzesPassed = Object.keys(quizResults).length

    // Сколько курсов полностью завершено
    const coursesCompleted = courses.filter((c) => {
      const total = c.lessons.length
      const done = c.lessons.filter(
        (l) => completedLessons[`${c.id}:${l.id}`],
      ).length
      return total > 0 && done === total
    }).length

    // Стрик
    let streak = 0
    if (mounted) {
      const today = new Date()
      const todayKey = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
      const todayActivity = activityLog[todayKey(today)]
      const hasToday =
        todayActivity &&
        todayActivity.lessonsCompleted +
          todayActivity.quizzesPassed +
          todayActivity.notesCreated >
          0
      const cursor = new Date(today)
      if (!hasToday) cursor.setDate(cursor.getDate() - 1)
      while (true) {
        const key = todayKey(cursor)
        const day = activityLog[key]
        const hasActivity =
          day &&
          day.lessonsCompleted + day.quizzesPassed + day.notesCreated > 0
        if (hasActivity) {
          streak += 1
          cursor.setDate(cursor.getDate() - 1)
        } else break
      }
    }

    // Всего минут обучения
    const totalMinutesLearned = Object.values(activityLog).reduce(
      (sum, day) => sum + (day.minutesLearned || 0),
      0,
    )

    return {
      completedCount,
      bookmarkedCourses: bookmarkedCount,
      notesCount,
      quizzesPassed,
      coursesCompleted,
      streak,
      totalMinutesLearned,
    }
  }, [
    completedLessons,
    bookmarkedCourses,
    notes,
    quizResults,
    activityLog,
    mounted,
  ])

  // Разблокированные ачивки
  const unlocked = React.useMemo(() => {
    return achievements.filter((a) => a.condition(metrics))
  }, [metrics])

  const locked = React.useMemo(() => {
    return achievements.filter((a) => !a.condition(metrics))
  }, [metrics])

  const unlockPercentage = Math.round(
    (unlocked.length / achievements.length) * 100,
  )

  if (!mounted) {
    return (
      <section id="achievements" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="h-32 animate-pulse rounded bg-muted" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="achievements"
      className="border-b border-border/60 py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-3 gap-1.5">
            <Sparkles className="h-3 w-3" />
            Геймификация
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Достижения
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Получайте награды за регулярность, глубину и ширину обучения. Каждое
            достижение — доказательство вашего прогресса.
          </p>
        </div>

        {/* Progress summary */}
        <Card className="mx-auto mt-8 max-w-5xl border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
                  <Trophy className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">
                    {unlocked.length}
                    <span className="text-lg text-muted-foreground">
                      {' '}
                      / {achievements.length}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    достижений разблокировано
                  </div>
                </div>
              </div>
              <div className="flex-1 sm:max-w-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Прогресс</span>
                  <span className="font-medium text-orange-600">
                    {unlockPercentage}%
                  </span>
                </div>
                <Progress
                  value={unlockPercentage}
                  className="mt-1.5 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unlocked achievements */}
        {unlocked.length > 0 && (
          <div className="mx-auto mt-10 max-w-5xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Разблокировано
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {unlocked.map((a, idx) => {
                const Icon = iconMap[a.icon] ?? Award
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5 transition-transform hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                            a.color,
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="mt-3 text-sm font-semibold">{a.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {a.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked achievements */}
        {locked.length > 0 && (
          <div className="mx-auto mt-8 max-w-5xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Заблокировано ({locked.length})
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {locked.map((a) => {
                const Icon = iconMap[a.icon] ?? Award
                return (
                  <Card
                    key={a.id}
                    className="border-border/60 opacity-60 transition-opacity hover:opacity-100"
                  >
                    <CardContent className="p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="mt-3 text-sm font-semibold">{a.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

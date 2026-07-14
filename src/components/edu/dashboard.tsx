'use client'

import * as React from 'react'
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Target,
  RotateCcw,
  Clock,
  Trophy,
  Brain,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { courses, type Course } from '@/lib/courses-data'
import { achievements } from '@/lib/quizzes-data'
import { useLearningStore } from '@/lib/learning-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ActivityHeatmap } from './activity-heatmap'
import { ProgressCharts } from './progress-charts'
import { toast } from 'sonner'

type DashboardProps = {
  onOpenCourse: (course: Course) => void
  onOpenCertificate: (course: Course) => void
}

export function Dashboard({ onOpenCourse, onOpenCertificate }: DashboardProps) {
  const completedLessons = useLearningStore((s) => s.completedLessons)
  const bookmarkedCourses = useLearningStore((s) => s.bookmarkedCourses)
  const lessonBookmarks = useLearningStore((s) => s.lessonBookmarks)
  const notes = useLearningStore((s) => s.notes)
  const quizResults = useLearningStore((s) => s.quizResults)
  const activityLog = useLearningStore((s) => s.activityLog)
  const resetAll = useLearningStore((s) => s.resetAll)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <section id="dashboard" className="border-b border-border/60 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Мой прогресс
            </h2>
          </div>
        </div>
      </section>
    )
  }

  // Compute stats
  const totalLessonsAvailable = courses.reduce(
    (s, c) => s + c.lessons.length,
    0,
  )
  const completedCount = Object.values(completedLessons).filter(Boolean).length
  const overallProgress =
    totalLessonsAvailable === 0
      ? 0
      : Math.round((completedCount / totalLessonsAvailable) * 100)
  const bookmarkedCount = Object.values(bookmarkedCourses).filter(Boolean).length

  const quizzesPassedCount = Object.keys(quizResults).length
  const totalMinutesLearned = Object.values(activityLog).reduce(
    (sum, day) => sum + (day.minutesLearned || 0),
    0,
  )

  // Полностью завершённые курсы
  const completedCoursesList = courses.filter((c) => {
    const done = c.lessons.filter(
      (l) => completedLessons[`${c.id}:${l.id}`],
    ).length
    return done === c.lessons.length
  })
  const coursesCompletedCount = completedCoursesList.length

  // Стрик
  const todayKey = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  let streak = 0
  const today = new Date()
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
      day && day.lessonsCompleted + day.quizzesPassed + day.notesCreated > 0
    if (hasActivity) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else break
  }

  // Метрики для ачивок
  const metrics = {
    completedCount,
    bookmarkedCourses: bookmarkedCount,
    notesCount: notes.length,
    quizzesPassed: quizzesPassedCount,
    coursesCompleted: coursesCompletedCount,
    streak,
    totalMinutesLearned,
  }
  const unlockedAchievements = achievements.filter((a) => a.condition(metrics))
  const recentAchievements = unlockedAchievements.slice(-3).reverse()

  // Курсы в процессе (не завершённые, но с прогрессом > 0)
  const coursesInProgress = courses
    .map((c) => {
      const completed = c.lessons.filter(
        (l) => completedLessons[`${c.id}:${l.id}`],
      ).length
      const progress = Math.round((completed / c.lessons.length) * 100)
      return { course: c, completed, total: c.lessons.length, progress }
    })
    .filter((c) => c.completed > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress)

  // Bookmarked courses
  const bookmarked = courses.filter((c) => bookmarkedCourses[c.id])

  return (
    <section id="dashboard" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-3 gap-1.5">
            <Sparkles className="h-3 w-3" />
            Личный кабинет
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Мой прогресс
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Отслеживайте обучение, регулярность и достижения. Все данные
            хранятся локально в вашем браузере.
          </p>
        </div>

        {/* Hero stats */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-orange-500" />}
            label="Уроков пройдено"
            value={completedCount}
            sub={`из ${totalLessonsAvailable}`}
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Серия дней"
            value={streak}
            sub="подряд"
            highlight={streak >= 3}
          />
          <StatCard
            icon={<Brain className="h-5 w-5 text-orange-500" />}
            label="Квизов сдано"
            value={quizzesPassedCount}
            sub="тестов"
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            label="Часов обучения"
            value={Math.floor(totalMinutesLearned / 60)}
            suffix={totalMinutesLearned % 60 > 0 ? `ч ${totalMinutesLearned % 60}м` : 'ч'}
            sub="всего"
          />
        </div>

        {/* Overall progress + achievements */}
        <div className="mx-auto mt-6 grid max-w-5xl gap-4 lg:grid-cols-3">
          <Card className="border-border/60 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    Общий прогресс обучения
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Завершено {completedCount} из {totalLessonsAvailable} уроков
                    · {coursesCompletedCount} курсов полностью
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold tracking-tight text-orange-600">
                    {overallProgress}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    всего курса
                  </div>
                </div>
              </div>
              <Progress value={overallProgress} className="mt-4 h-3" />

              {/* Completed courses with certificate button */}
              {completedCoursesList.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5 text-orange-500" />
                    Завершённые курсы
                  </div>
                  {completedCoursesList.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-orange-500/30 bg-orange-500/5 p-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="truncate text-sm font-medium">
                          {course.title}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 shrink-0 gap-1.5 border-orange-500/40 text-xs text-orange-600 hover:bg-orange-500/10"
                        onClick={() => onOpenCertificate(course)}
                      >
                        <Award className="h-3 w-3" />
                        Сертификат
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent achievements */}
          <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-semibold">Достижения</h3>
                </div>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-300">
                  {unlockedAchievements.length}/{achievements.length}
                </Badge>
              </div>

              {recentAchievements.length === 0 ? (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <Trophy className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  Завершите первый урок, чтобы получить достижение
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {recentAchievements.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-background/60 p-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {a.title}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {a.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full text-xs text-orange-600 hover:text-orange-700"
                onClick={() =>
                  document
                    .getElementById('achievements')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Все достижения →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity heatmap */}
        <div className="mx-auto mt-6 max-w-5xl">
          <ActivityHeatmap />
        </div>

        {/* Charts */}
        <div className="mx-auto mt-6 max-w-5xl">
          <ProgressCharts />
        </div>

        {/* Courses in progress */}
        {coursesInProgress.length > 0 && (
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Курсы в процессе</h3>
            </div>
            <div className="grid gap-3">
              {coursesInProgress.map(({ course, completed, total, progress }) => (
                <Card
                  key={course.id}
                  className="cursor-pointer border-border/60 transition-colors hover:border-border hover:bg-muted/30"
                  onClick={() => onOpenCourse(course)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{course.title}</h4>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {completed} из {total} уроков · {course.category}
                      </p>
                      <Progress value={progress} className="mt-2 h-1.5" />
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      Продолжить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked */}
        {bookmarked.length > 0 && (
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Избранные курсы</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {bookmarked.map((course) => {
                const completed = course.lessons.filter(
                  (l) => completedLessons[`${course.id}:${l.id}`],
                ).length
                const progress = Math.round(
                  (completed / course.lessons.length) * 100,
                )
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer border-border/60 transition-colors hover:border-border hover:bg-muted/30"
                    onClick={() => onOpenCourse(course)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant="secondary" className="shrink-0">
                          {course.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {progress > 0
                          ? `${progress}% пройдено`
                          : 'Ещё не начали'}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {coursesInProgress.length === 0 &&
          bookmarked.length === 0 &&
          completedCount === 0 && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-dashed border-border p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium">Начните своё обучение</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Откройте любой курс из каталога, чтобы увидеть прогресс здесь
              </p>
            </div>
          )}

        {/* Reset */}
        {(completedCount > 0 ||
          bookmarkedCount > 0 ||
          notes.length > 0 ||
          quizzesPassedCount > 0) && (
          <div className="mx-auto mt-10 max-w-5xl text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Сбросить весь прогресс
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Сбросить весь прогресс обучения?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Это удалит все завершённые уроки, закладки, заметки, результаты
                    квизов и историю активности. Действие необратимо.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetAll()
                      toast.success('Прогресс сброшен')
                    }}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    Сбросить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
  suffix,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: number
  sub?: string
  suffix?: string
  highlight?: boolean
}) {
  return (
    <Card
      className={
        highlight
          ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/5 to-amber-500/5'
          : 'border-border/60'
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {icon}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-orange-600">
            {value}
          </span>
          {suffix && (
            <span className="text-sm font-medium text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        {sub && (
          <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
        )}
      </CardContent>
    </Card>
  )
}

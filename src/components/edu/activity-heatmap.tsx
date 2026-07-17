'use client'

import * as React from 'react'
import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, dateKey, calculateStreak } from '@/lib/utils'
import { useLearningStore, type ActivityDay } from '@/lib/learning-store'

// Получить уровень активности для цвета
function getLevel(day: ActivityDay | undefined): number {
  if (!day) return 0
  const total =
    day.lessonsCompleted + day.quizzesPassed + day.notesCreated
  if (total === 0) return 0
  if (total === 1) return 1
  if (total <= 3) return 2
  if (total <= 5) return 3
  return 4
}

const levelColors = [
  'bg-muted/50',
  'bg-orange-200 dark:bg-orange-900/40',
  'bg-orange-400 dark:bg-orange-700/70',
  'bg-orange-500 dark:bg-orange-600',
  'bg-orange-600 dark:bg-orange-500',
]

const monthLabels = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]

const dayLabels = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс']

export function ActivityHeatmap() {
  const activityLog = useLearningStore((s) => s.activityLog)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  // Генерируем 26 недель (≈ полгода) включая текущую
  const weeks = React.useMemo(() => {
    if (!mounted) return []
    const today = new Date()
    // Находим понедельник текущей недели
    const dayOfWeek = today.getDay() // 0 = Sunday
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

    const result: Date[][] = []
    // 26 недель назад от текущего понедельника
    const start = new Date(monday)
    start.setDate(monday.getDate() - 25 * 7)

    for (let w = 0; w < 26; w++) {
      const week: Date[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start)
        date.setDate(start.getDate() + w * 7 + d)
        week.push(date)
      }
      result.push(week)
    }
    return result
  }, [mounted])

  // Месяцы для подписей
  const monthMarkers = React.useMemo(() => {
    if (weeks.length === 0) return []
    const markers: { weekIdx: number; label: string }[] = []
    let lastMonth = -1
    weeks.forEach((week, idx) => {
      const month = week[0].getMonth()
      if (month !== lastMonth) {
        markers.push({ weekIdx: idx, label: monthLabels[month] })
        lastMonth = month
      }
    })
    return markers
  }, [weeks])

  const streak = React.useMemo(
    () => (mounted ? calculateStreak(activityLog) : 0),
    [activityLog, mounted],
  )

  // Статистика за последние 30 дней
  const last30Stats = React.useMemo(() => {
    if (!mounted) return { lessons: 0, quizzes: 0, notes: 0, minutes: 0, activeDays: 0 }
    const today = new Date()
    let lessons = 0,
      quizzes = 0,
      notes = 0,
      minutes = 0,
      activeDays = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const day = activityLog[dateKey(d)]
      if (day) {
        lessons += day.lessonsCompleted
        quizzes += day.quizzesPassed
        notes += day.notesCreated
        minutes += day.minutesLearned
        if (
          day.lessonsCompleted + day.quizzesPassed + day.notesCreated >
          0
        ) {
          activeDays += 1
        }
      }
    }
    return { lessons, quizzes, notes, minutes, activeDays }
  }, [activityLog, mounted])

  if (!mounted) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="h-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame
                className={cn(
                  'h-5 w-5',
                  streak > 0 ? 'text-orange-500' : 'text-muted-foreground',
                )}
              />
              <h3 className="text-lg font-semibold">Активность обучения</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Тепловая карта ваших занятий за последние 26 недель
            </p>
          </div>

          {/* Streak badge */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2',
                streak > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{streak}</span>
              <span className="text-xs">дн. подряд</span>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mt-5 overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="ml-7 flex">
              {weeks.map((_, weekIdx) => {
                const marker = monthMarkers.find((m) => m.weekIdx === weekIdx)
                return (
                  <div
                    key={weekIdx}
                    className="w-3 text-[10px] text-muted-foreground sm:w-4"
                  >
                    {marker && (
                      <span className="whitespace-nowrap">{marker.label}</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-2">
                {dayLabels.map((label, i) => (
                  <div
                    key={i}
                    className="h-3 text-[10px] leading-3 text-muted-foreground sm:h-4 sm:leading-4"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((date, dayIdx) => {
                      const key = dateKey(date)
                      const day = activityLog[key]
                      const level = getLevel(day)
                      const isFuture = date > new Date()
                      const isToday = dateKey(new Date()) === key

                      return (
                        <div
                          key={dayIdx}
                          title={
                            isFuture
                              ? ''
                              : day
                                ? `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}: ${day.lessonsCompleted} уроков, ${day.quizzesPassed} квизов, ${day.notesCreated} заметок, ${day.minutesLearned} мин`
                                : `${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}: нет активности`
                          }
                          className={cn(
                            'h-3 w-3 rounded-sm transition-colors sm:h-4 sm:w-4',
                            isFuture
                              ? 'bg-transparent'
                              : levelColors[level],
                            isToday && 'ring-2 ring-orange-500 ring-offset-1 ring-offset-background',
                          )}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>Меньше</span>
              {levelColors.map((color, i) => (
                <div
                  key={i}
                  className={cn('h-3 w-3 rounded-sm', color)}
                />
              ))}
              <span>Больше</span>
            </div>
          </div>
        </div>

        {/* Last 30 days stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
          <Stat label="Уроков" value={last30Stats.lessons} sub="за 30 дней" />
          <Stat label="Квизов" value={last30Stats.quizzes} sub="за 30 дней" />
          <Stat label="Заметок" value={last30Stats.notes} sub="за 30 дней" />
          <Stat
            label="Активных дней"
            value={last30Stats.activeDays}
            sub="из 30"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: number
  sub: string
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl font-bold text-orange-600">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-[10px] text-muted-foreground/70">{sub}</div>
    </div>
  )
}

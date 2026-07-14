'use client'

import * as React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { BarChart3, PieChart as PieIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { courses } from '@/lib/courses-data'
import { useLearningStore } from '@/lib/learning-store'

const categoryColors: Record<string, string> = {
  Бизнес: '#f97316',
  Маркетинг: '#fb923c',
  Финансы: '#ea580c',
  Менеджмент: '#fdba74',
  Технологии: '#fbbf24',
  'Личное развитие': '#f59e0b',
}

export function ProgressCharts() {
  const completedLessons = useLearningStore((s) => s.completedLessons)
  const quizResults = useLearningStore((s) => s.quizResults)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  // Данные по категориям (для pie chart)
  const categoryData = React.useMemo(() => {
    const map = new Map<string, { name: string; total: number; completed: number }>()
    for (const c of courses) {
      const cur = map.get(c.category) ?? {
        name: c.category,
        total: 0,
        completed: 0,
      }
      cur.total += c.lessons.length
      cur.completed += c.lessons.filter(
        (l) => completedLessons[`${c.id}:${l.id}`],
      ).length
      map.set(c.category, cur)
    }
    return Array.from(map.values()).map((c) => ({
      name: c.name,
      value: c.completed,
      total: c.total,
      fill: categoryColors[c.name] ?? '#f97316',
    }))
  }, [completedLessons])

  // Данные по курсам (для bar chart)
  const courseData = React.useMemo(() => {
    return courses.map((c) => {
      const completed = c.lessons.filter(
        (l) => completedLessons[`${c.id}:${l.id}`],
      ).length
      const quizzes = c.lessons.filter(
        (l) => quizResults[`${c.id}:${l.id}`],
      ).length
      return {
        name: c.title.length > 20 ? c.title.slice(0, 18) + '…' : c.title,
        fullName: c.title,
        Уроки: completed,
        Квизы: quizzes,
        Всего: c.lessons.length,
      }
    })
  }, [completedLessons, quizResults])

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  const totalCompleted = categoryData.reduce((s, c) => s + c.value, 0)

  if (totalCompleted === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Здесь будут графики вашего прогресса</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Завершите первый урок, чтобы увидеть аналитику
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Pie chart by category */}
      <Card className="border-border/60">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Прогресс по категориям</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Завершённые уроки в разрезе направлений
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { total?: number } }) => {
                    const total = props?.payload?.total ?? 0
                    return [`${value} из ${total} уроков`, '']
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar chart by course */}
      <Card className="border-border/60">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Прогресс по курсам</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Уроки и квизы по каждому курсу
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseData}
                layout="vertical"
                margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  width={110}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="Уроки"
                  fill="#f97316"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="Квизы"
                  fill="#fbbf24"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  Briefcase,
  Megaphone,
  TrendingUp,
  KanbanSquare,
  Brain,
  Compass,
  Rocket,
  Clock,
  BarChart3,
  Bookmark,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Highlight } from './highlight'
import { type Course } from '@/lib/courses-data'
import { useLearningStore } from '@/lib/learning-store'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Megaphone,
  TrendingUp,
  KanbanSquare,
  Brain,
  Compass,
  Rocket,
}

const levelColors: Record<string, string> = {
  Начальный: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Средний: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Продвинутый: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

type CourseCardProps = {
  course: Course
  onOpen: (course: Course) => void
  searchQuery?: string
}

export function CourseCard({ course, onOpen, searchQuery }: CourseCardProps) {
  const Icon = iconMap[course.icon] ?? Briefcase
  const isBookmarked = useLearningStore((s) => s.isCourseBookmarked(course.id))
  const toggleBookmark = useLearningStore((s) => s.toggleCourseBookmark)
  const progress = useLearningStore((s) =>
    s.getCourseProgress(course.id, course.lessons.length),
  )
  const completedCount = useLearningStore((s) => {
    const completed = s.completedLessons
    return Object.keys(completed).filter(
      (k) => k.startsWith(`${course.id}:`) && completed[k],
    ).length
  })

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/60 transition-all hover:shadow-lg hover:border-border">
      {/* Cover */}
      <div
        className={cn(
          'relative h-32 bg-gradient-to-br p-5',
          course.color,
        )}
      >
        <div className="absolute inset-0 bg-grid-dark opacity-30" />
        <div className="relative flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleBookmark(course.id)
            }}
            aria-label="В закладки"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <Bookmark
              className={cn(
                'h-4 w-4',
                isBookmarked && 'fill-white',
              )}
            />
          </button>
        </div>
        <div className="relative mt-3">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white backdrop-blur hover:bg-white/25"
          >
            {course.category}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
              levelColors[course.level],
            )}
          >
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {course.durationHours} ч
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            {course.lessons.length} уроков
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-tight tracking-tight">
          <Highlight text={course.title} query={searchQuery ?? ''} />
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          <Highlight text={course.subtitle} query={searchQuery ?? ''} />
        </p>
        <p className="text-sm text-muted-foreground line-clamp-3">
          <Highlight text={course.description} query={searchQuery ?? ''} />
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {course.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-orange-500" />
                Пройдено {completedCount} из {course.lessons.length}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-muted/30 p-3">
        <Button
          onClick={() => onOpen(course)}
          className="w-full"
          variant={progress > 0 ? 'default' : 'secondary'}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          {progress > 0 ? 'Продолжить обучение' : 'Начать курс'}
        </Button>
      </CardFooter>
    </Card>
  )
}

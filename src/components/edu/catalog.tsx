'use client'

import * as React from 'react'
import { Search, Filter, BookMarked } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { courses, categories, type Course } from '@/lib/courses-data'
import { CourseCard } from './course-card'
import { useLearningStore } from '@/lib/learning-store'

type CatalogProps = {
  onOpenCourse: (course: Course) => void
}

export function Catalog({ onOpenCourse }: CatalogProps) {
  const [search, setSearch] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('Все')
  const [onlyBookmarked, setOnlyBookmarked] = React.useState(false)
  const bookmarkedCourses = useLearningStore((s) => s.bookmarkedCourses)

  const filtered = React.useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory =
        activeCategory === 'Все' || c.category === activeCategory
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchesBookmark =
        !onlyBookmarked || bookmarkedCourses[c.id]
      return matchesCategory && matchesSearch && matchesBookmark
    })
  }, [search, activeCategory, onlyBookmarked, bookmarkedCourses])

  return (
    <section id="catalog" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Каталог курсов
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Авторские программы по ключевым дисциплинам современного бизнеса.
            Каждый курс — структурированный путь от основ к практике.
          </p>
        </div>

        {/* Search + filters */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, описанию или тегам…"
              className="h-11 pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Категория:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                )}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={cn(
                'ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors',
                onlyBookmarked
                  ? 'bg-amber-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              )}
            >
              <BookMarked className="mr-1 inline h-3 w-3" />
              В закладках
            </button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-dashed border-border p-10 text-center">
            <BookMarked className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуйте изменить запрос или категорию
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch('')
                setActiveCategory('Все')
                setOnlyBookmarked(false)
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpen={onOpenCourse}
                searchQuery={search}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

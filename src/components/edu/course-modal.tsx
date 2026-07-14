'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Clock,
  BarChart3,
  CheckCircle2,
  Circle,
  Bookmark,
  NotebookPen,
  ChevronRight,
  Lightbulb,
  Target,
  BookText,
  Wrench,
  ExternalLink,
  Award,
  Brain,
  Trophy,
} from 'lucide-react'
import { type Course, type Lesson } from '@/lib/courses-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useLearningStore } from '@/lib/learning-store'
import { getLessonQuiz } from '@/lib/quizzes-data'
import { Quiz } from './quiz'
import { CertificateButton } from './certificate-modal'
import { toast } from 'sonner'

type CourseModalProps = {
  course: Course | null
  open: boolean
  onClose: () => void
  onOpenCertificate?: (course: Course) => void
}

export function CourseModal({ course, open, onClose, onOpenCertificate }: CourseModalProps) {
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null)
  const [noteText, setNoteText] = React.useState('')
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null)

  const completedLessons = useLearningStore((s) => s.completedLessons)
  const toggleLessonComplete = useLearningStore((s) => s.toggleLessonComplete)
  const toggleLessonBookmark = useLearningStore((s) => s.toggleLessonBookmark)
  const lessonBookmarks = useLearningStore((s) => s.lessonBookmarks)
  const notes = useLearningStore((s) => s.notes)
  const addNote = useLearningStore((s) => s.addNote)
  const updateNote = useLearningStore((s) => s.updateNote)
  const deleteNote = useLearningStore((s) => s.deleteNote)

  React.useEffect(() => {
    if (open && course) {
      setActiveLesson(null)
      setNoteText('')
      setEditingNoteId(null)
      // Автоматически открываем первый незавершённый урок
      const firstIncomplete = course.lessons.find(
        (l) => !completedLessons[`${course.id}:${l.id}`],
      )
      if (firstIncomplete) {
        setActiveLesson(firstIncomplete)
      }
    }
  }, [open, course, completedLessons])

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

  // Навигация по урокам стрелками
  React.useEffect(() => {
    if (!open || !activeLesson || !course) return
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const idx = course.lessons.findIndex((l) => l.id === activeLesson.id)
        if (idx < course.lessons.length - 1) {
          setActiveLesson(course.lessons[idx + 1])
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const idx = course.lessons.findIndex((l) => l.id === activeLesson.id)
        if (idx > 0) {
          setActiveLesson(course.lessons[idx - 1])
        }
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [open, activeLesson, course])

  if (!course) return null

  const totalLessons = course.lessons.length
  const completedCount = course.lessons.filter(
    (l) => completedLessons[`${course.id}:${l.id}`],
  ).length
  const progress = Math.round((completedCount / totalLessons) * 100)

  const courseNotes = notes.filter((n) => n.courseId === course.id)

  const handleSaveNote = () => {
    if (!activeLesson || !noteText.trim()) {
      toast.error('Введите текст заметки')
      return
    }
    if (editingNoteId) {
      updateNote(editingNoteId, noteText.trim())
      toast.success('Заметка обновлена')
      setEditingNoteId(null)
    } else {
      addNote({
        courseId: course.id,
        lessonId: activeLesson.id,
        lessonTitle: activeLesson.title,
        courseTitle: course.title,
        content: noteText.trim(),
      })
      toast.success('Заметка сохранена')
    }
    setNoteText('')
  }

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNoteId(noteId)
    setNoteText(content)
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setNoteText('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Курс: ${course.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn('relative h-auto bg-gradient-to-br p-5 text-white', course.color)}>
              <div className="absolute inset-0 bg-grid-dark opacity-30" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/25">
                      {course.category}
                    </Badge>
                    <Badge className="bg-white/20 text-white hover:bg-white/25">
                      {course.level}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-white/80">
                      <Clock className="h-3 w-3" />
                      {course.durationHours} ч
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-white/80">
                      <BarChart3 className="h-3 w-3" />
                      {course.lessons.length} уроков
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/80">{course.subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur transition-colors hover:bg-white/25"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="relative mt-4 flex items-center gap-3">
                <Progress
                  value={progress}
                  className="h-2 bg-white/20"
                />
                <span className="shrink-0 text-xs font-medium text-white">
                  {completedCount}/{totalLessons} · {progress}%
                </span>
                {progress === 100 && onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate(course)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/30"
                  >
                    <Trophy className="h-3.5 w-3.5" />
                    Сертификат
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
              {/* Sidebar — lessons list */}
              <div className="flex w-full shrink-0 flex-col border-b border-border md:w-80 md:border-b-0 md:border-r">
                <div className="border-b border-border bg-muted/30 px-4 py-3">
                  <h3 className="text-sm font-semibold">Уроки курса</h3>
                  <p className="text-xs text-muted-foreground">
                    Пройдено: {completedCount} из {totalLessons}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-1 p-2">
                    {course.lessons.map((lesson, idx) => {
                      const isCompleted =
                        completedLessons[`${course.id}:${lesson.id}`]
                      const isActive =
                        activeLesson?.id === lesson.id
                      const isBookmarked = lessonBookmarks.some(
                        (b) =>
                          b.courseId === course.id &&
                          b.lessonId === lesson.id,
                      )
                      return (
                        <button
                          key={lesson.id}
                          ref={isActive ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                          onClick={() => setActiveLesson(lesson)}
                          className={cn(
                            'group flex items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-colors',
                            isActive
                              ? 'border-border bg-secondary'
                              : 'hover:bg-secondary/50',
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-orange-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              {isBookmarked && (
                                <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500" />
                              )}
                            </div>
                            <p
                              className={cn(
                                'mt-0.5 text-sm font-medium leading-tight',
                                isCompleted && 'text-muted-foreground line-through',
                              )}
                            >
                              {lesson.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {lesson.duration} мин
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {!activeLesson ? (
                  <ScrollArea className="h-full">
                    <div className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold tracking-tight">
                        О курсе
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {course.description}
                      </p>

                      <h4 className="mt-8 text-lg font-semibold">
                        Чему вы научитесь
                      </h4>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {course.lessons.map((l) => (
                          <li
                            key={l.id}
                            className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3"
                          >
                            <Award className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                            <span className="text-sm">{l.title}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center">
                        <p className="text-sm text-muted-foreground">
                          Выберите урок слева, чтобы начать обучение
                        </p>
                        <Button
                          className="mt-3"
                          onClick={() => setActiveLesson(course.lessons[0])}
                        >
                          Начать с первого урока
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <LessonView
                    course={course}
                    lesson={activeLesson}
                    onToggleComplete={() =>
                      toggleLessonComplete(course.id, activeLesson.id, activeLesson.duration)
                    }
                    isCompleted={
                      !!completedLessons[`${course.id}:${activeLesson.id}`]
                    }
                    isBookmarked={lessonBookmarks.some(
                      (b) =>
                        b.courseId === course.id &&
                        b.lessonId === activeLesson.id,
                    )}
                    onToggleBookmark={() =>
                      toggleLessonBookmark(course.id, activeLesson.id)
                    }
                    noteText={noteText}
                    setNoteText={setNoteText}
                    onSaveNote={handleSaveNote}
                    onCancelEdit={handleCancelEdit}
                    editingNoteId={editingNoteId}
                    courseNotes={courseNotes.filter(
                      (n) => n.lessonId === activeLesson.id,
                    )}
                    onEditNote={handleEditNote}
                    onDeleteNote={deleteNote}
                    onSelectLesson={setActiveLesson}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type LessonViewProps = {
  course: Course
  lesson: Lesson
  onToggleComplete: () => void
  isCompleted: boolean
  isBookmarked: boolean
  onToggleBookmark: () => void
  noteText: string
  setNoteText: (v: string) => void
  onSaveNote: () => void
  onCancelEdit: () => void
  editingNoteId: string | null
  courseNotes: Array<{
    id: string
    content: string
    updatedAt: number
  }>
  onEditNote: (id: string, content: string) => void
  onDeleteNote: (id: string) => void
  onSelectLesson: (lesson: Lesson) => void
}

function LessonView({
  course,
  lesson,
  onToggleComplete,
  isCompleted,
  isBookmarked,
  onToggleBookmark,
  noteText,
  setNoteText,
  onSaveNote,
  onCancelEdit,
  editingNoteId,
  courseNotes,
  onEditNote,
  onDeleteNote,
  onSelectLesson,
}: LessonViewProps) {
  const quizQuestions = getLessonQuiz(course.id, lesson.id)
  const lessonIdx = course.lessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = lessonIdx > 0 ? course.lessons[lessonIdx - 1] : null
  const nextLesson = lessonIdx < course.lessons.length - 1 ? course.lessons[lessonIdx + 1] : null

  return (
    <Tabs defaultValue="content" className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-3">
          <TabsList className="bg-background">
            <TabsTrigger value="content" className="text-xs sm:text-sm">
              <BookText className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Урок</span>
            </TabsTrigger>
            {quizQuestions && quizQuestions.length > 0 && (
              <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                <Brain className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Квиз</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="notes" className="text-xs sm:text-sm">
              <NotebookPen className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Заметки</span>
              <span className="ml-1.5 rounded-md bg-secondary px-1.5 text-xs">
                {courseNotes.length}
              </span>
            </TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground">
            {lessonIdx + 1}/{course.lessons.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBookmark}
            className="h-8 gap-1.5"
          >
            <Bookmark
              className={cn(
                'h-4 w-4',
                isBookmarked && 'fill-amber-500 text-amber-500',
              )}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? 'В закладках' : 'В закладки'}
            </span>
          </Button>
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleComplete}
            className="h-8 gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isCompleted ? 'Завершено' : 'Завершить'}
            </span>
          </Button>
        </div>
      </div>

      <TabsContent value="content" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full scrollbar-thin">
          <article className="mx-auto max-w-3xl p-5 md:p-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">
                {course.title}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration} мин
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {lesson.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              {lesson.content.intro}
            </p>

            {/* Key points */}
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Ключевые тезисы
              </h2>
              <ul className="mt-3 space-y-2">
                {lesson.content.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Theory */}
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <BookText className="h-5 w-5 text-orange-500" />
                Теория и практика
              </h2>
              <div className="mt-3 space-y-3">
                {lesson.content.theory.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-foreground/90"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Practical task */}
            <section className="mt-8">
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-orange-500" />
                  Практическое задание
                </h2>
                <p className="mt-3 text-sm leading-relaxed">
                  {lesson.content.practicalTask}
                </p>
              </div>
            </section>

            {/* Resources */}
            {lesson.content.resources &&
              lesson.content.resources.length > 0 && (
                <section className="mt-8">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Wrench className="h-5 w-5 text-primary" />
                    Рекомендованные ресурсы
                  </h2>
                  <ul className="mt-3 space-y-1.5">
                    {lesson.content.resources.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Complete CTA */}
            <div className="mt-10 rounded-xl border border-border bg-muted/30 p-5 text-center">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="mx-auto h-8 w-8 text-orange-500" />
                  <p className="mt-2 font-medium">Урок завершён</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Хотите пересмотреть материал? Заметки сохранены.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleComplete}
                    className="mt-3"
                  >
                    Отметить как непройденный
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-medium">Завершили изучение урока?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Отметьте урок как пройденный, чтобы отслеживать прогресс.
                  </p>
                  <Button
                    size="sm"
                    onClick={onToggleComplete}
                    className="mt-3"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Отметить как пройденный
                  </Button>
                </>
              )}
            </div>

            {/* Prev / Next navigation */}
            <div className="mt-6 flex items-center justify-between gap-3">
              {prevLesson ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectLesson(prevLesson)}
                  className="gap-1.5"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span className="hidden sm:inline truncate max-w-[150px]">{prevLesson.title}</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button
                  size="sm"
                  onClick={() => onSelectLesson(nextLesson)}
                  className="gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <span className="hidden sm:inline truncate max-w-[150px]">{nextLesson.title}</span>
                  <span className="sm:hidden">Далее</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          </article>
        </ScrollArea>
      </TabsContent>

      {quizQuestions && quizQuestions.length > 0 && (
        <TabsContent value="quiz" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full scrollbar-thin">
            <div className="mx-auto max-w-3xl p-5 md:p-8">
              <Quiz
                courseId={course.id}
                lessonId={lesson.id}
                questions={quizQuestions}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      )}

      <TabsContent value="notes" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full scrollbar-thin">
          <div className="mx-auto max-w-3xl space-y-4 p-5 md:p-8">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold">
                {editingNoteId ? 'Редактировать заметку' : 'Новая заметка'}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Урок: <span className="font-medium">{lesson.title}</span>
              </p>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Запишите ключевые мысли, инсайты или вопросы по уроку…"
                className="mt-3 min-h-[120px] bg-background"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                {editingNoteId && (
                  <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                    Отмена
                  </Button>
                )}
                <Button size="sm" onClick={onSaveNote}>
                  {editingNoteId ? 'Сохранить' : 'Добавить заметку'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                Заметки по этому уроку ({courseNotes.length})
              </h3>
              {courseNotes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Пока нет заметок. Будьте первым!
                </div>
              ) : (
                courseNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleString('ru-RU')}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => onEditNote(note.id, note.content)}
                        >
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600"
                          onClick={() => {
                            onDeleteNote(note.id)
                            toast.success('Заметка удалена')
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

'use client'

import * as React from 'react'
import { NotebookPen, Trash2, Edit3, BookOpen, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { courses, type Course } from '@/lib/courses-data'
import { useLearningStore } from '@/lib/learning-store'
import { toast } from 'sonner'

type NotesPanelProps = {
  onOpenCourse: (course: Course) => void
}

export function NotesPanel({ onOpenCourse }: NotesPanelProps) {
  const notes = useLearningStore((s) => s.notes)
  const deleteNote = useLearningStore((s) => s.deleteNote)
  const updateNote = useLearningStore((s) => s.updateNote)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editText, setEditText] = React.useState('')
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) {
      toast.error('Текст не может быть пустым')
      return
    }
    updateNote(id, editText.trim())
    toast.success('Заметка обновлена')
    setEditingId(null)
    setEditText('')
  }

  const handleExportMarkdown = () => {
    if (notes.length === 0) {
      toast.error('Нет заметок для экспорта')
      return
    }
    const grouped = new Map<string, typeof notes>()
    for (const n of notes) {
      const existing = grouped.get(n.courseId) ?? []
      existing.push(n)
      grouped.set(n.courseId, existing)
    }

    let md = '# Заметки — MOBA академия\n\n'
    md += `> Экспортировано ${new Date().toLocaleDateString('ru-RU')}\n\n---\n\n`

    for (const [courseId, courseNotes] of grouped) {
      const course = courses.find((c) => c.id === courseId)
      md += `## ${course?.title ?? courseId}\n\n`
      for (const n of courseNotes) {
        md += `### ${n.lessonTitle}\n`
        md += `_Обновлено: ${new Date(n.updatedAt).toLocaleString('ru-RU')}_\n\n`
        md += `${n.content}\n\n---\n\n`
      }
    }

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zametki-academy-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Заметки экспортированы в Markdown')
  }

  // Group notes by course
  const groupedNotes = React.useMemo(() => {
    const map = new Map<string, { course: Course; notes: typeof notes }>()
    for (const c of courses) {
      const cn = notes.filter((n) => n.courseId === c.id)
      if (cn.length > 0) map.set(c.id, { course: c, notes: cn })
    }
    return Array.from(map.values())
  }, [notes])

  if (!mounted) return null

  return (
    <section id="notes" className="border-b border-border/60 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Мои заметки
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Все заметки, сделанные во время прохождения уроков, собраны здесь.
            Можно редактировать, удалять и быстро переходить к курсу.
          </p>
        </div>

        {notes.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl border border-dashed border-border p-10 text-center">
            <NotebookPen className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">Пока нет заметок</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Откройте любой урок в курсе и создайте первую заметку во вкладке
              «Заметки»
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-4xl space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Card className="border-border/60">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{notes.length}</div>
                  <div className="text-xs text-muted-foreground">всего</div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{groupedNotes.length}</div>
                  <div className="text-xs text-muted-foreground">курсов</div>
                </CardContent>
              </Card>
              <Card className="col-span-2 border-border/60 sm:col-span-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {new Set(notes.map((n) => n.lessonId)).size}
                  </div>
                  <div className="text-xs text-muted-foreground">уроков</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMarkdown}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Экспорт в Markdown
              </Button>
            </div>

            {/* Grouped notes */}
            {groupedNotes.map(({ course, notes: courseNotes }) => (
              <div key={course.id} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {courseNotes.length}{' '}
                      {courseNotes.length === 1 ? 'заметка' : 'заметок'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenCourse(course)}
                  >
                    <BookOpen className="mr-2 h-3.5 w-3.5" />
                    Открыть курс
                  </Button>
                </div>

                <div className="grid gap-3">
                  {courseNotes.map((note) => (
                    <Card key={note.id} className="border-border/60">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {note.lessonTitle}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(note.updatedAt).toLocaleString(
                                  'ru-RU',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )}
                              </span>
                            </div>

                            {editingId === note.id ? (
                              <div className="mt-2 space-y-2">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingId(null)
                                      setEditText('')
                                    }}
                                  >
                                    Отмена
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(note.id)}
                                  >
                                    Сохранить
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                                {note.content}
                              </p>
                            )}
                          </div>

                          {editingId !== note.id && (
                            <div className="flex shrink-0 gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingId(note.id)
                                  setEditText(note.content)
                                }}
                                aria-label="Редактировать"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-rose-500 hover:text-rose-600"
                                onClick={() => {
                                  deleteNote(note.id)
                                  toast.success('Заметка удалена')
                                }}
                                aria-label="Удалить"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

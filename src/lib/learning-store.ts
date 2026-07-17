'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dateKey } from './utils'

export type Note = {
  id: string
  courseId: string
  lessonId: string
  lessonTitle: string
  courseTitle: string
  content: string
  createdAt: number
  updatedAt: number
}

export type Bookmark = {
  courseId: string
  lessonId: string
  addedAt: number
}

export type QuizResult = {
  // key: `${courseId}:${lessonId}`
  score: number // правильные ответы
  total: number // всего вопросов
  passedAt: number
  attempts: number
}

export type ActivityDay = {
  // key: YYYY-MM-DD
  lessonsCompleted: number
  quizzesPassed: number
  notesCreated: number
  minutesLearned: number
}

type LearningState = {
  // Прогресс по урокам
  completedLessons: Record<string, boolean> // key: `${courseId}:${lessonId}`
  // Закладки на курсы
  bookmarkedCourses: Record<string, boolean>
  // Закладки на уроки
  lessonBookmarks: Bookmark[]
  // Заметки
  notes: Note[]
  // Результаты квизов
  quizResults: Record<string, QuizResult>
  // Активность по дням (YYYY-MM-DD → статистика)
  activityLog: Record<string, ActivityDay>

  // Actions
  toggleLessonComplete: (courseId: string, lessonId: string, durationMinutes?: number) => void
  toggleCourseBookmark: (courseId: string) => void
  isCourseBookmarked: (courseId: string) => boolean
  toggleLessonBookmark: (courseId: string, lessonId: string) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void
  getCourseProgress: (courseId: string, totalLessons: number) => number
  saveQuizResult: (courseId: string, lessonId: string, score: number, total: number) => void
  resetAll: () => void
}

// Helper: получить текущую дату в формате YYYY-MM-DD
function todayKey(): string {
  return dateKey(new Date())
}

function ensureActivityDay(log: Record<string, ActivityDay>, dateKey: string): ActivityDay {
  if (!log[dateKey]) {
    log[dateKey] = {
      lessonsCompleted: 0,
      quizzesPassed: 0,
      notesCreated: 0,
      minutesLearned: 0,
    }
  }
  return log[dateKey]
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      bookmarkedCourses: {},
      lessonBookmarks: [],
      notes: [],
      quizResults: {},
      activityLog: {},

      toggleLessonComplete: (courseId, lessonId, durationMinutes = 0) => {
        const key = `${courseId}:${lessonId}`
        const wasComplete = get().completedLessons[key] === true
        set((state) => {
          const newCompleted = {
            ...state.completedLessons,
            [key]: !wasComplete,
          }
          // Обновляем активность только при завершении (не при отмене)
          const newLog = { ...state.activityLog }
          if (!wasComplete) {
            const dayKey = todayKey()
            const day = { ...ensureActivityDay(newLog, dayKey) }
            day.lessonsCompleted += 1
            day.minutesLearned += durationMinutes
            newLog[dayKey] = day
          }
          return { completedLessons: newCompleted, activityLog: newLog }
        })
      },

      toggleCourseBookmark: (courseId) => {
        set((state) => ({
          bookmarkedCourses: {
            ...state.bookmarkedCourses,
            [courseId]: !state.bookmarkedCourses[courseId],
          },
        }))
      },

      isCourseBookmarked: (courseId) => {
        return get().bookmarkedCourses[courseId] === true
      },

      toggleLessonBookmark: (courseId, lessonId) => {
        const exists = get().lessonBookmarks.find(
          (b) => b.courseId === courseId && b.lessonId === lessonId,
        )
        if (exists) {
          set((state) => ({
            lessonBookmarks: state.lessonBookmarks.filter(
              (b) => !(b.courseId === courseId && b.lessonId === lessonId),
            ),
          }))
        } else {
          set((state) => ({
            lessonBookmarks: [
              ...state.lessonBookmarks,
              { courseId, lessonId, addedAt: Date.now() },
            ],
          }))
        }
      },

      addNote: (note) => {
        const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const now = Date.now()
        set((state) => {
          const newLog = { ...state.activityLog }
          const dayKey = todayKey()
          const day = { ...ensureActivityDay(newLog, dayKey) }
          day.notesCreated += 1
          newLog[dayKey] = day
          return {
            notes: [{ ...note, id, createdAt: now, updatedAt: now }, ...state.notes],
            activityLog: newLog,
          }
        })
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, content, updatedAt: Date.now() } : n,
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }))
      },

      getCourseProgress: (courseId, totalLessons) => {
        if (totalLessons === 0) return 0
        const state = get()
        const completed = Object.keys(state.completedLessons).filter(
          (k) => k.startsWith(`${courseId}:`) && state.completedLessons[k],
        ).length
        return Math.round((completed / totalLessons) * 100)
      },

      saveQuizResult: (courseId, lessonId, score, total) => {
        const key = `${courseId}:${lessonId}`
        set((state) => {
          const prev = state.quizResults[key]
          const newLog = { ...state.activityLog }
          // Засчитываем квиз только если это первое прохождение или улучшен результат
          if (!prev || score > prev.score) {
            const dayKey = todayKey()
            const day = { ...ensureActivityDay(newLog, dayKey) }
            if (!prev) day.quizzesPassed += 1
            newLog[dayKey] = day
          }
          return {
            quizResults: {
              ...state.quizResults,
              [key]: {
                score,
                total,
                passedAt: Date.now(),
                attempts: (prev?.attempts ?? 0) + 1,
              },
            },
            activityLog: newLog,
          }
        })
      },

      resetAll: () => {
        set({
          completedLessons: {},
          bookmarkedCourses: {},
          lessonBookmarks: [],
          notes: [],
          quizResults: {},
          activityLog: {},
        })
      },
    }),
    {
      name: 'dupley-academy-storage-v2',
    },
  ),
)

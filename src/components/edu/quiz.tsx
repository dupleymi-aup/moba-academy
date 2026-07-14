'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Award,
  Brain,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type QuizQuestion } from '@/lib/quizzes-data'
import { useLearningStore } from '@/lib/learning-store'
import { toast } from 'sonner'

type QuizProps = {
  courseId: string
  lessonId: string
  questions: QuizQuestion[]
}

export function Quiz({ courseId, lessonId, questions }: QuizProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null)
  const [showExplanation, setShowExplanation] = React.useState(false)
  const [answers, setAnswers] = React.useState<number[]>([])
  const [completed, setCompleted] = React.useState(false)

  const saveQuizResult = useLearningStore((s) => s.saveQuizResult)
  const prevResult = useLearningStore((s) => s.quizResults[`${courseId}:${lessonId}`])

  const total = questions.length
  const current = questions[currentIdx]
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length

  const handleSelect = (idx: number) => {
    if (showExplanation) return
    setSelectedIdx(idx)
  }

  const handleSubmit = () => {
    if (selectedIdx === null) return
    setShowExplanation(true)
    setAnswers((prev) => [...prev, selectedIdx])
  }

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      // Завершаем квиз
      const finalScore = [...answers, selectedIdx].filter(
        (a, i) => a === questions[i].correctIndex,
      ).length
      saveQuizResult(courseId, lessonId, finalScore, total)
      setCompleted(true)
      if (finalScore === total) {
        toast.success('Идеальный результат! Все ответы верны 🎉')
      } else if (finalScore >= total * 0.7) {
        toast.success(`Квиз пройден! ${finalScore} из ${total}`)
      } else {
        toast.info(`Квиз завершён. Результат: ${finalScore} из ${total}`)
      }
    } else {
      setCurrentIdx((i) => i + 1)
      setSelectedIdx(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSelectedIdx(null)
    setShowExplanation(false)
    setAnswers([])
    setCompleted(false)
  }

  // Горячие клавиши
  React.useEffect(() => {
    if (completed) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1
        if (idx < current.options.length) handleSelect(idx)
      } else if (e.key === 'Enter') {
        if (!showExplanation && selectedIdx !== null) handleSubmit()
        else if (showExplanation) handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [completed, showExplanation, selectedIdx, current.options.length])

  // ===== Финальный экран =====
  if (completed) {
    const percentage = Math.round((score / total) * 100)
    const isPerfect = score === total
    const isPass = score >= total * 0.7

    return (
      <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
        <CardContent className="p-6 md:p-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={cn(
              'mx-auto flex h-20 w-20 items-center justify-center rounded-full',
              isPerfect
                ? 'bg-gradient-to-br from-amber-400 to-orange-600'
                : isPass
                  ? 'bg-gradient-to-br from-orange-400 to-amber-500'
                  : 'bg-gradient-to-br from-rose-400 to-orange-500',
            )}
          >
            {isPerfect ? (
              <Trophy className="h-10 w-10 text-white" />
            ) : isPass ? (
              <Award className="h-10 w-10 text-white" />
            ) : (
              <Brain className="h-10 w-10 text-white" />
            )}
          </motion.div>

          <h3 className="mt-4 text-2xl font-bold tracking-tight">
            {isPerfect
              ? 'Идеально!'
              : isPass
                ? 'Отличный результат!'
                : 'Стоит повторить'}
          </h3>
          <p className="mt-1 text-muted-foreground">
            {isPerfect
              ? 'Вы ответили верно на все вопросы'
              : isPass
                ? 'Вы хорошо усвоили материал'
                : 'Перечитайте теорию и попробуйте снова'}
          </p>

          <div className="mt-6 flex items-center justify-center gap-6">
            <div>
              <div className="text-4xl font-bold text-orange-600">{score}</div>
              <div className="text-xs text-muted-foreground">верных</div>
            </div>
            <div className="text-2xl text-muted-foreground">/</div>
            <div>
              <div className="text-4xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">всего</div>
            </div>
            <div className="text-2xl text-muted-foreground">·</div>
            <div>
              <div className="text-4xl font-bold text-orange-600">{percentage}%</div>
              <div className="text-xs text-muted-foreground">результат</div>
            </div>
          </div>

          {prevResult && prevResult.attempts > 1 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Попыток: {prevResult.attempts}
              {score > prevResult.score && (
                <span className="ml-2 inline-flex items-center gap-1 text-orange-600">
                  <Sparkles className="h-3 w-3" />
                  Новый рекорд!
                </span>
              )}
            </p>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Пройти снова
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ===== Вопрос =====
  return (
    <Card className="border-orange-500/20 bg-card">
      <CardContent className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Проверка знаний</h3>
              <p className="text-xs text-muted-foreground">
                Вопрос {currentIdx + 1} из {total}
              </p>
            </div>
          </div>
          {prevResult && (
            <Badge variant="secondary" className="text-xs">
              Лучший: {prevResult.score}/{prevResult.total}
            </Badge>
          )}
        </div>

        <Progress
          value={((currentIdx + (showExplanation ? 1 : 0)) / total) * 100}
          className="mt-3 h-1.5"
        />

        {/* Question */}
        <div className="mt-5">
          <h4 className="text-base font-semibold leading-relaxed">
            {current.question}
          </h4>
        </div>

        {/* Options */}
        <div className="mt-4 space-y-2">
          {current.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx
            const isCorrect = idx === current.correctIndex
            const showResult = showExplanation

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                  !showResult && 'hover:border-orange-500/50 hover:bg-orange-500/5',
                  !showResult && isSelected && 'border-orange-500 bg-orange-500/10',
                  !showResult && !isSelected && 'border-border bg-background',
                  showResult && isCorrect && 'border-emerald-500 bg-emerald-500/10',
                  showResult &&
                    isSelected &&
                    !isCorrect &&
                    'border-rose-500 bg-rose-500/10',
                  showResult &&
                    !isSelected &&
                    !isCorrect &&
                    'border-border bg-background opacity-60',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                    !showResult && isSelected && 'border-orange-500 bg-orange-500 text-white',
                    !showResult && !isSelected && 'border-border text-muted-foreground',
                    showResult && isCorrect && 'border-emerald-500 bg-emerald-500 text-white',
                    showResult &&
                      isSelected &&
                      !isCorrect &&
                      'border-rose-500 bg-rose-500 text-white',
                    showResult && !isSelected && !isCorrect && 'border-border text-muted-foreground',
                  )}
                >
                  {showResult && isCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <div>
                    <p className="text-xs font-semibold text-orange-600">
                      {selectedIdx === current.correctIndex
                        ? 'Верно!'
                        : 'Не совсем так'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {current.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Клавиши: <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">1</kbd>–<kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">4</kbd> выбор · <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> далее
          </p>
          {!showExplanation ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              Проверить ответ
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentIdx + 1 >= total ? 'Завершить квиз' : 'Следующий вопрос'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Brain,
  Trophy,
  Flame,
  Award,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { stats } from '@/lib/courses-data'

export function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border/60"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid dark:bg-grid-dark opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              Авторская платформа · {new Date().getFullYear()}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Обучайтесь бизнесу{' '}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
              самостоятельно
            </span>
            , без переплаты за бренд
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Платформа Дуплей Максима Игоревича — структурированные курсы по MBA,
            маркетингу, финансам, менеджменту и ИИ. Учитесь в своём темпе,
            отслеживайте прогресс, ведите заметки — всё в одном месте.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Button
              size="lg"
              onClick={scrollToCatalog}
              className="h-12 rounded-full px-6 text-base"
            >
              Открыть каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById('author')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="h-12 rounded-full px-6 text-base"
            >
              Об авторе
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Pill icon={BookOpen} text="6 курсов · 30 уроков" />
            <Pill icon={Brain} text="Квизы после уроков" />
            <Pill icon={Trophy} text="16 достижений" />
            <Pill icon={Flame} text="Серия дней" />
            <Pill icon={Award} text="Сертификаты" />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card/60 p-4 text-center backdrop-blur"
            >
              <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
                <span className="text-lg text-muted-foreground">
                  {stat.suffix}
                </span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Pill({ icon, text }: { icon: LucideIcon; text: string }) {
  const Icon = icon
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
      {Icon && <Icon className="h-3.5 w-3.5 text-orange-500" />}
      {text}
    </span>
  )
}

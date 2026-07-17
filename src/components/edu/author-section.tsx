'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  GraduationCap,
  Target,
  Heart,
  Sparkles,
  Quote,
  Github,
  Play,
  MessageCircle,
  Fingerprint,
  School,
  Crown,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { author, testimonials } from '@/lib/courses-data'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Github,
  Play,
  MessageCircle,
  Fingerprint,
  GraduationCap,
  School,
  Crown,
}

export function AuthorSection() {
  return (
    <section
      id="author"
      className="relative overflow-hidden border-b border-border/60 py-16 md:py-24"
    >
      <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Author header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left"
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg sm:h-32 sm:w-32">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-2xl font-bold text-white sm:text-3xl">
                  ДМИ
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-md">
                <GraduationCap className="h-5 w-5 text-orange-600" />
              </div>
            </div>

            <div className="flex-1">
              <Badge className="mb-2 gap-1.5">
                <Sparkles className="h-3 w-3" />
                Автор платформы
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {author.name}
              </h2>
              <p className="mt-1 text-base text-muted-foreground">
                {author.role}
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                {author.bio}
              </p>

              {/* Contacts */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {author.contacts.map((c) => {
                  const Icon = iconMap[c.icon] ?? Mail
                  return (
                    <a
                      key={c.label}
                      href={c.href ?? `https://${c.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                    >
                      <Icon className="h-3.5 w-3.5 text-orange-500" />
                      {c.value}
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12"
          >
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Миссия проекта</h3>
                    <p className="mt-2 text-base leading-relaxed text-foreground/90">
                      {author.mission}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <h3 className="mb-5 text-center text-2xl font-bold tracking-tight">
              Принципы платформы
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {author.principles.map((p, i) => (
                <Card
                  key={p.title}
                  className="border-border/60 transition-colors hover:border-border"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{p.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14"
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <h3 className="text-2xl font-bold tracking-tight">
                Отзывы обучающихся
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((t) => (
                <Card key={t.name} className="border-border/60">
                  <CardContent className="p-5">
                    <Quote className="h-6 w-6 text-orange-500/40" />
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {t.text}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-xs font-medium">
                          {t.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                      <div className="ml-auto flex">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="text-amber-500">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

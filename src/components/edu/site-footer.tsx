'use client'

import * as React from 'react'
import {
  Heart,
  Github,
  Play,
  MessageCircle,
  Fingerprint,
  GraduationCap,
  School,
  Crown,
} from 'lucide-react'
import { author } from '@/lib/courses-data'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">
                  MOBA академия
                </div>
                <div className="text-xs text-muted-foreground">
                  Платформа самостоятельного обучения
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Образовательные материалы для предпринимателей и руководителей.
              Учитесь в своём темпе, без отрыва от дела.
            </p>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Автор</h4>
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-sm text-muted-foreground">{author.role}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {author.bio.slice(0, 150)}…
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Контакты</h4>
            <ul className="space-y-1.5">
              {author.contacts.map((c) => {
                const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                  Github, Play, MessageCircle, Fingerprint, GraduationCap, School, Crown,
                }
                const Icon = iconMap[c.icon] ?? GraduationCap
                return (
                  <li key={c.label}>
                    <a
                      href={c.href ?? `https://${c.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.label}: ${c.value}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {c.value}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} MOBA академия · {author.name}
          </p>
          <p className="flex items-center gap-1.5">
            Сделано с <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> для
            самостоятельного обучения
          </p>
        </div>
      </div>
    </footer>
  )
}

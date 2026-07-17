import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ActivityDay } from "./learning-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function calculateStreak(activityLog: Record<string, ActivityDay>): number {
  const today = new Date()
  let streak = 0
  const cursor = new Date(today)

  const hasActivity = (key: string) => {
    const day = activityLog[key]
    return day && day.lessonsCompleted + day.quizzesPassed + day.notesCreated > 0
  }

  if (!hasActivity(dateKey(today))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (hasActivity(dateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}


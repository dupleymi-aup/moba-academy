'use client'

import * as React from 'react'
import { type Course } from '@/lib/courses-data'
import { SiteHeader } from '@/components/edu/site-header'
import { Hero } from '@/components/edu/hero'
import { Catalog } from '@/components/edu/catalog'
import { Dashboard } from '@/components/edu/dashboard'
import { AchievementsSection } from '@/components/edu/achievements-section'
import { NotesPanel } from '@/components/edu/notes-panel'
import { AuthorSection } from '@/components/edu/author-section'
import { SiteFooter } from '@/components/edu/site-footer'
import { CourseModal } from '@/components/edu/course-modal'
import { CertificateModal } from '@/components/edu/certificate-modal'

export default function Home() {
  const [openCourse, setOpenCourse] = React.useState<Course | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [certCourse, setCertCourse] = React.useState<Course | null>(null)
  const [certOpen, setCertOpen] = React.useState(false)

  const handleOpenCourse = (course: Course) => {
    setOpenCourse(course)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const handleOpenCertificate = (course: Course) => {
    setCertCourse(course)
    setCertOpen(true)
  }

  const handleCloseCertificate = () => {
    setCertOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Catalog onOpenCourse={handleOpenCourse} />
        <Dashboard
          onOpenCourse={handleOpenCourse}
          onOpenCertificate={handleOpenCertificate}
        />
        <AchievementsSection />
        <NotesPanel onOpenCourse={handleOpenCourse} />
        <AuthorSection />
      </main>
      <SiteFooter />

      <CourseModal
        course={openCourse}
        open={modalOpen}
        onClose={handleClose}
        onOpenCertificate={handleOpenCertificate}
      />

      <CertificateModal
        course={certCourse}
        open={certOpen}
        onClose={handleCloseCertificate}
      />
    </div>
  )
}

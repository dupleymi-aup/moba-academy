import { NextResponse } from "next/server";
import { courses } from "@/lib/courses-data";

export const dynamic = "force-static";

export async function GET() {
  try {
    const summary = courses.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      category: c.category,
      level: c.level,
      durationHours: c.durationHours,
      lessonsCount: c.lessons.length,
      totalMinutes: c.lessons.reduce((sum, l) => sum + l.duration, 0),
      tags: c.tags,
    }));

    return NextResponse.json({ courses: summary, count: summary.length });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

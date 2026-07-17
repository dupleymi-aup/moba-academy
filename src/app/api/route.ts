import { NextResponse } from "next/server";
import { courses } from "@/lib/courses-data";

export const dynamic = "force-static";

export async function GET() {
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalMinutes = courses.reduce(
    (sum, c) => sum + c.lessons.reduce((s, l) => s + l.duration, 0),
    0
  );

  return NextResponse.json({
    name: "MOBA академия API",
    version: "1.0.0",
    stats: {
      courses: courses.length,
      totalLessons,
      totalHours: Math.round(totalMinutes / 60),
    },
    endpoints: {
      courses: "/api/courses",
      courseDetail: "/api/courses/{id}",
      health: "/api/health",
    },
  });
}

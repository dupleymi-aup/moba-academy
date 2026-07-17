import { NextResponse, type NextRequest } from "next/server";
import { courses } from "@/lib/courses-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = courses.find((c) => c.id === id);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      category: course.category,
      level: course.level,
      durationHours: course.durationHours,
      tags: course.tags,
      lessons: course.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/routine?day=1  (1=Mon..7=Sun, isoWeekday)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day");

  const activities = await prisma.routineActivity.findMany({
    where: day ? { dayOfWeek: parseInt(day) } : undefined,
    include: { completions: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(activities);
}

// POST /api/routine  — add activity to a day
export async function POST(req: NextRequest) {
  const body = await req.json();

  const count = await prisma.routineActivity.count({
    where: { dayOfWeek: body.dayOfWeek },
  });

  const activity = await prisma.routineActivity.create({
    data: {
      title: body.title,
      dayOfWeek: body.dayOfWeek,
      order: count,
    },
    include: { completions: true },
  });

  return NextResponse.json(activity, { status: 201 });
}

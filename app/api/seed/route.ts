import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ROUTINE: { dayOfWeek: number; activities: string[] }[] = [
  {
    dayOfWeek: 1,
    activities: ["Wake up at 6:45", "Gym", "Work", "Go out / Activity", "Read"],
  },
  {
    dayOfWeek: 2,
    activities: ["Wake up at 6:45", "Study / Plan / Think", "Work", "Discuss with Esmeralda — go out, dinner, movie?", "Read"],
  },
  {
    dayOfWeek: 3,
    activities: ["Wake up at 6:45", "Gym", "Work", "Go out? / Upscale myself", "Read"],
  },
  {
    dayOfWeek: 4,
    activities: ["Wake up at 6:45", "Study / Plan / Think", "Work", "Family time / Discuss relationship with Esmeralda", "Read"],
  },
  {
    dayOfWeek: 5,
    activities: ["Wake up at 6:45", "Gym", "Work", "Plan with Esmeralda / Find time for friends", "Read"],
  },
  {
    dayOfWeek: 6,
    activities: ["Wake up at 6:45", "Free morning", "Outdoor / Social", "Read"],
  },
  {
    dayOfWeek: 0,
    activities: ["Wake up relaxed", "Family / Rest", "Prep for the week", "Read"],
  },
];

export async function POST() {
  const existing = await prisma.routineActivity.count();
  if (existing > 0) {
    return NextResponse.json({ message: "Already seeded" }, { status: 200 });
  }

  for (const day of DEFAULT_ROUTINE) {
    for (let i = 0; i < day.activities.length; i++) {
      await prisma.routineActivity.create({
        data: {
          dayOfWeek: day.dayOfWeek,
          title: day.activities[i],
          order: i,
        },
      });
    }
  }

  return NextResponse.json({ message: "Seeded successfully" });
}

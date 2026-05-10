import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const tasks = await prisma.task.findMany({
    where: date ? { date: new Date(date) } : undefined,
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      priority: body.priority ?? "MEDIUM",
      category: body.category,
    },
  });
  return NextResponse.json(task, { status: 201 });
}

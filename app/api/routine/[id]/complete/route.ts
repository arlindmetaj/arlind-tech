import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const completion = await prisma.activityCompletion.upsert({
    where: { activityId_date: { activityId: id, date: new Date(body.date) } },
    update: { done: body.done },
    create: { activityId: id, date: new Date(body.date), done: body.done },
  });

  return NextResponse.json(completion);
}

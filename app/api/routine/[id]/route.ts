import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const activity = await prisma.routineActivity.update({
    where: { id },
    data: { title: body.title },
    include: { completions: true },
  });
  return NextResponse.json(activity);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.routineActivity.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
